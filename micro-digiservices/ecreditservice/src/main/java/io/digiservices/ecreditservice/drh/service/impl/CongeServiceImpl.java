package io.digiservices.ecreditservice.drh.service.impl;

import io.digiservices.clients.domain.User;
import io.digiservices.ecreditservice.drh.service.impl.DrhServiceImpl;
import io.digiservices.ecreditservice.drh.dto.DrhDtos;
import io.digiservices.ecreditservice.drh.dto.CongeDtos.*;
import io.digiservices.ecreditservice.drh.dto.DrhDtos.MembreDto;
import io.digiservices.ecreditservice.drh.dto.DrhDtos.PeriodeDto;
import io.digiservices.ecreditservice.drh.dto.DrhDtos.PrevisionDto;
import io.digiservices.ecreditservice.drh.repository.CongeRepository;
import io.digiservices.ecreditservice.drh.repository.DrhRepository;
import io.digiservices.ecreditservice.drh.service.CongeService;
import io.digiservices.ecreditservice.drh.service.DrhService;
import io.digiservices.ecreditservice.exception.ValidationException;
import io.digiservices.ecreditservice.service.SmsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;

/**
 * Phase 2 du chantier Congés & Présences DRH : demandes de congé.
 * Le congé s'adosse à une tranche de la prévision VALIDÉE ; circuit
 * agent -> responsable de département -> DRH ; interruption/annulation
 * par le responsable ou la DRH avec recrédit des jours non consommés.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class CongeServiceImpl implements CongeService {

    private static final String PARAM_DROIT_ANNUEL = "DROIT_CONGE_ANNUEL_JOURS";

    private final CongeRepository congeRepository;
    private final io.digiservices.ecreditservice.drh.repository.PermissionRepository permissionRepository;
    private final DrhRepository drhRepository;
    private final DrhService drhService;
    private final SmsService smsService;

    // ==================== Agent ====================

    @Override
    public SoldeCongeDto monSolde(User user, int exercice) {
        int droit = drhRepository.parametreInt(PARAM_DROIT_ANNUEL, 30);
        int pris = congeRepository.joursConsommes(user.getUserId(), exercice);
        var prevision = drhRepository.previsionDeUser(user.getUserId(), exercice)
                .filter(p -> "VALIDEE_DRH".equals(p.getStatut()));

        // Tranches prévues encore libres (sans demande active adossée)
        Set<Long> periodesUtilisees = new HashSet<>();
        congeRepository.demandesDeUser(user.getUserId(), exercice).stream()
                .filter(d -> Set.of("SOUMISE", "ACCEPTEE_RESP", "VALIDEE_DRH").contains(d.getStatut()))
                .map(DemandeCongeDto::getPeriodeId)
                .filter(Objects::nonNull)
                .forEach(periodesUtilisees::add);
        List<PeriodeDto> disponibles = prevision
                .map(PrevisionDto::getPeriodes)
                .orElse(List.of())
                .stream()
                .filter(p -> !periodesUtilisees.contains(p.getPeriodeId()))
                .toList();

        // V155 : report de l'exercice précédent, utilisable jusqu'à sa date limite
        var report = congeRepository.reportActifDeUser(user.getUserId(), exercice);
        int reportRestant = report.map(r -> Math.max(0, r.getJoursReportes() - r.getJoursConsommes())).orElse(0);
        return SoldeCongeDto.builder()
                .exercice(exercice)
                .droit(droit)
                .pris(pris)
                .restant(Math.max(0, droit - pris))
                .previsionValidee(prevision.isPresent())
                .tranchesDisponibles(disponibles)
                .reportExercice(report.map(ReportCongeDto::getExerciceOrigine).orElse(null))
                .reportJours(report.map(ReportCongeDto::getJoursReportes).orElse(0))
                .reportConsommes(report.map(ReportCongeDto::getJoursConsommes).orElse(0))
                .reportRestant(reportRestant)
                .reportDateLimite(report.map(ReportCongeDto::getDateLimite).orElse(null))
                .restantTotal(Math.max(0, droit - pris) + reportRestant)
                .build();
    }

    @Override
    public List<DemandeCongeDto> mesDemandes(User user, int exercice) {
        return congeRepository.demandesDeUser(user.getUserId(), exercice);
    }

    @Override
    @Transactional
    public DemandeCongeDto creerDemande(User user, DemandeCongeRequest request) {
        if (request.getDateDebut() == null || request.getDateFin() == null) {
            throw new ValidationException("Les dates de début et de fin sont obligatoires");
        }
        if (request.getDateFin().isBefore(request.getDateDebut())) {
            throw new ValidationException("La date de fin doit être après la date de début");
        }
        int exercice = request.getDateDebut().getYear();

        MembreDto membre = drhRepository.membreActifDeUser(user.getUserId())
                .orElseThrow(() -> new ValidationException(
                        "Vous n'êtes affecté à aucun département — contactez la DRH"));

        // Le congé dépend de la prévision : prévision validée + tranche choisie obligatoires
        PrevisionDto prevision = drhRepository.previsionDeUser(user.getUserId(), exercice)
                .filter(p -> "VALIDEE_DRH".equals(p.getStatut()))
                .orElseThrow(() -> new ValidationException(
                        "Aucune prévision de congés validée par la DRH pour " + exercice
                                + " — la demande de congé s'appuie sur la prévision"));
        if (request.getPeriodeId() == null) {
            throw new ValidationException("Choisissez la tranche prévue à laquelle ce congé correspond");
        }
        boolean periodeValide = prevision.getPeriodes().stream()
                .anyMatch(p -> p.getPeriodeId().equals(request.getPeriodeId()));
        if (!periodeValide) {
            throw new ValidationException("La tranche choisie n'appartient pas à votre prévision validée");
        }

        Set<LocalDate> feries = new HashSet<>(drhRepository.joursFeries(
                LocalDate.of(exercice, 1, 1), LocalDate.of(exercice, 12, 31)));
        int nbJours = DrhServiceImpl.joursOuvrables(request.getDateDebut(), request.getDateFin(), feries);
        if (nbJours == 0) {
            throw new ValidationException("La période choisie ne contient aucun jour ouvrable");
        }
        if (congeRepository.chevaucheDemandeActive(user.getUserId(),
                request.getDateDebut(), request.getDateFin())) {
            throw new ValidationException("Vous avez déjà une demande de congé active sur cette période");
        }

        int droit = drhRepository.parametreInt(PARAM_DROIT_ANNUEL, 30);
        int pris = congeRepository.joursConsommes(user.getUserId(), exercice);
        int reportRestant = reportRestant(user.getUserId(), exercice); // V155
        int restant = droit - pris + reportRestant;
        if (nbJours > restant) {
            throw new ValidationException("Ce congé de " + nbJours
                    + " jours dépasse votre solde restant (" + restant + " j : " + Math.max(0, droit - pris) + " j sur " + droit
                    + (reportRestant > 0 ? " + " + reportRestant + " j de report" : "") + ")");
        }

        Long demandeId = congeRepository.creerDemande(user.getUserId(), membre.getDepartementId(),
                exercice, request.getPeriodeId(), request.getDateDebut(), request.getDateFin(),
                nbJours, pris, restant - nbJours, vide(request.getCommentaire()));

        notifier(drhRepository.telephonesResponsables(membre.getDepartementId()),
                "CRG Congés : " + prenomNom(user) + " a déposé une demande de congé du "
                        + request.getDateDebut() + " au " + request.getDateFin()
                        + " (" + nbJours + " j). Merci de la traiter.");
        return congeRepository.demandeById(demandeId).orElseThrow();
    }

    // ==================== Responsable ====================

    @Override
    public List<DemandeCongeDto> demandesDeMonDepartement(User responsable, int exercice) {
        if (drhService.estDga(responsable) && !drhRepository.estResponsableActif(responsable.getUserId())) {
            return congeRepository.demandesDesResponsables(exercice); // V154 : file du DGA
        }
        MembreDto membre = exigerResponsable(responsable);
        return congeRepository.demandesDuDepartement(membre.getDepartementId(), exercice);
    }

    @Override
    @Transactional
    public DemandeCongeDto accepter(User responsable, Long demandeId) {
        DemandeCongeDto d = exigerDemandeDeSonDepartement(responsable, demandeId, Set.of("SOUMISE"));
        congeRepository.majStatut(demandeId, "ACCEPTEE_RESP", null, responsable.getUserId(), null);
        notifier(drhRepository.telephonesDrh(),
                "CRG Congés : demande de congé de " + d.getNomComplet() + " ("
                        + d.getNbJours() + " j) acceptée par le responsable — en attente de validation DRH.");
        notifierUser(d.getUserId(), "CRG Congés : votre demande de congé du " + d.getDateDebut()
                + " a été acceptée par votre responsable. Elle attend la validation DRH.");
        return congeRepository.demandeById(demandeId).orElseThrow();
    }

    @Override
    @Transactional
    public DemandeCongeDto rejeter(User responsable, Long demandeId, String motif) {
        exigerMotif(motif);
        DemandeCongeDto d = exigerDemandeDeSonDepartement(responsable, demandeId, Set.of("SOUMISE"));
        congeRepository.majStatut(demandeId, "REJETEE_RESP", motif, responsable.getUserId(), null);
        notifierUser(d.getUserId(), "CRG Congés : votre demande de congé du " + d.getDateDebut()
                + " a été rejetée — " + motif);
        return congeRepository.demandeById(demandeId).orElseThrow();
    }

    @Override
    @Transactional
    public DemandeCongeDto interrompre(User acteur, Long demandeId, InterruptionRequest request) {
        // V155 : plus d'interruption directe par le responsable — tout passe par la déclaration ;
        // l'interruption directe reste possible pour l'administration DRH (cas d'urgence).
        exigerDrh(acteur);
        exigerMotif(request.getMotif());
        DemandeCongeDto d = exigerStatut(demandeId, Set.of("VALIDEE_DRH"));
        executerInterruption(acteur, d, request.getDateReprise(), request.getMotif());
        return congeRepository.demandeById(demandeId).orElseThrow();
    }

    /** Interruption effective d'un congé accordé : recrédit des jours non consommés (+ report), notifications. */
    private int executerInterruption(User acteur, DemandeCongeDto d, LocalDate dateReprise, String motif) {
        if (dateReprise == null) {
            throw new ValidationException("La date de reprise est obligatoire pour interrompre un congé");
        }
        if (dateReprise.isBefore(d.getDateDebut()) || dateReprise.isAfter(d.getDateFin().plusDays(1))) {
            throw new ValidationException("La date de reprise doit être comprise entre le début du congé et le lendemain de sa fin");
        }
        Set<LocalDate> feries = new HashSet<>(drhRepository.joursFeries(
                LocalDate.of(d.getExercice(), 1, 1), LocalDate.of(d.getExercice(), 12, 31)));
        int consommes = dateReprise.isAfter(d.getDateDebut())
                ? DrhServiceImpl.joursOuvrables(d.getDateDebut(), dateReprise.minusDays(1), feries)
                : 0;
        int recredites = Math.max(0, d.getNbJours() - consommes);
        congeRepository.interrompre(d.getDemandeId(), "INTERROMPUE", acteur.getUserId(),
                dateReprise, recredites, motif.trim());
        restituerReport(d, recredites);
        notifierUser(d.getUserId(), "CRG Congés : votre congé est interrompu à compter du "
                + dateReprise + " — " + motif.trim()
                + ". " + recredites + " jour(s) non consommé(s) recrédité(s).");
        notifier(drhRepository.telephonesDrh(),
                "CRG Congés : congé de " + d.getNomComplet() + " interrompu (reprise "
                        + dateReprise + ", " + recredites + " j recrédités).");
        return recredites;
    }

    // ===== V155 : report d'exercice (helpers) =====

    private int reportRestant(Long userId, int exercice) {
        return congeRepository.reportActifDeUser(userId, exercice)
                .map(r -> Math.max(0, r.getJoursReportes() - r.getJoursConsommes())).orElse(0);
    }

    /** À la validation : impute d'abord le report de l'exercice précédent. */
    private void imputerSurReport(DemandeCongeDto d) {
        int restant = reportRestant(d.getUserId(), d.getExercice());
        int jours = Math.min(restant, d.getNbJours() == null ? 0 : d.getNbJours());
        if (jours > 0) {
            congeRepository.majConsommationReport(d.getUserId(), d.getExercice(), jours);
            congeRepository.majJoursSurReport(d.getDemandeId(), jours);
        }
    }

    /** À l'annulation / interruption : rend au report la part recréditée qui en provenait. */
    private void restituerReport(DemandeCongeDto d, int recredites) {
        int surReport = d.getJoursSurReport() == null ? 0 : d.getJoursSurReport();
        int rendu = Math.min(surReport, Math.max(0, recredites));
        if (rendu > 0) {
            congeRepository.majConsommationReport(d.getUserId(), d.getExercice(), -rendu);
            congeRepository.majJoursSurReport(d.getDemandeId(), surReport - rendu);
        }
    }

    // ===== V155 : interruption déclarée par le responsable, exécutée par la DRH =====

    @Override
    @Transactional
    public InterruptionDto declarerInterruption(User responsable, Long demandeId, DeclarationInterruptionRequest r) {
        exigerMotif(r.getMotif());
        DemandeCongeDto d = exigerDemandeDeSonDepartement(responsable, demandeId, Set.of("VALIDEE_DRH"));
        if (r.getDateRepriseSouhaitee() == null) {
            throw new ValidationException("La date de reprise souhaitée est obligatoire");
        }
        if (r.getDateRepriseSouhaitee().isBefore(d.getDateDebut()) || r.getDateRepriseSouhaitee().isAfter(d.getDateFin().plusDays(1))) {
            throw new ValidationException("La date de reprise doit être comprise entre le début du congé et le lendemain de sa fin");
        }
        if (congeRepository.interruptionDemandeeExiste(demandeId)) {
            throw new ValidationException("Une déclaration d'interruption est déjà en attente de la DRH pour ce congé");
        }
        Long id = congeRepository.declarerInterruption(demandeId, responsable.getUserId(), r.getDateRepriseSouhaitee(), r.getMotif().trim());
        notifier(drhRepository.telephonesDrh(), "CRG Congés : " + prenomNom(responsable) + " déclare l'interruption du congé de "
                + d.getNomComplet() + " (reprise souhaitée le " + r.getDateRepriseSouhaitee() + ") — à valider dans Validation des congés.");
        return congeRepository.interruptionById(id).orElseThrow();
    }

    @Override
    public List<InterruptionDto> interruptionsDeMonDepartement(User responsable, int exercice) {
        MembreDto membre = exigerResponsable(responsable);
        return congeRepository.interruptionsDuDepartement(membre.getDepartementId(), exercice);
    }

    @Override
    public List<InterruptionDto> interruptionsATraiter(User drh, int exercice) {
        exigerDrh(drh);
        return congeRepository.interruptionsATraiter(exercice);
    }

    @Override
    @Transactional
    public InterruptionDto validerInterruption(User drh, Long interruptionId, TraitementInterruptionRequest r) {
        exigerDrh(drh);
        InterruptionDto i = congeRepository.interruptionById(interruptionId)
                .orElseThrow(() -> new ValidationException("Déclaration introuvable"));
        if (!"DEMANDEE".equals(i.getStatut())) {
            throw new ValidationException("Cette déclaration a déjà été traitée");
        }
        DemandeCongeDto d = exigerStatut(i.getDemandeId(), Set.of("VALIDEE_DRH"));
        LocalDate dateRetenue = r != null && r.getDateReprise() != null ? r.getDateReprise() : i.getDateRepriseSouhaitee();
        int recredites = executerInterruption(drh, d, dateRetenue, i.getMotif());
        congeRepository.traiterInterruption(interruptionId, "VALIDEE", drh.getUserId(), dateRetenue, null);
        notifierUser(i.getDeclareePar(), "CRG Congés : l'interruption du congé de " + d.getNomComplet()
                + " est validée par la DRH (reprise le " + dateRetenue + ", " + recredites + " j recrédités).");
        return congeRepository.interruptionById(interruptionId).orElseThrow();
    }

    @Override
    @Transactional
    public InterruptionDto refuserInterruption(User drh, Long interruptionId, String motif) {
        exigerDrh(drh);
        exigerMotif(motif);
        InterruptionDto i = congeRepository.interruptionById(interruptionId)
                .orElseThrow(() -> new ValidationException("Déclaration introuvable"));
        if (congeRepository.traiterInterruption(interruptionId, "REFUSEE", drh.getUserId(), null, motif.trim()) == 0) {
            throw new ValidationException("Cette déclaration a déjà été traitée");
        }
        notifierUser(i.getDeclareePar(), "CRG Congés : la DRH n'a pas retenu l'interruption du congé de "
                + i.getNomComplet() + " — " + motif.trim() + ". Le congé se poursuit jusqu'au " + i.getDateFin() + ".");
        return congeRepository.interruptionById(interruptionId).orElseThrow();
    }

    // ===== V155 : clôture d'exercice et reports =====

    @Override
    public List<ReportCongeDto> reportsExercice(User drh, int exerciceCible) {
        exigerDrh(drh);
        return congeRepository.reportsExerciceCible(exerciceCible);
    }

    @Override
    @Transactional
    public ClotureExerciceDto cloturerExercice(User drh, int exercice) {
        exigerDrh(drh);
        return executerCloture(exercice, drh.getUserId());
    }

    @Override
    @Transactional
    public ClotureExerciceDto cloturerExerciceSysteme(int exercice) {
        return executerCloture(exercice, null);
    }

    private ClotureExerciceDto executerCloture(int exercice, Long creePar) {
        if (!Boolean.parseBoolean(drhRepository.parametreTexte("CONGE_REPORT_AUTORISE", "true"))) {
            throw new ValidationException("Le report des congés est désactivé (paramètre CONGE_REPORT_AUTORISE)");
        }
        if (exercice >= LocalDate.now().getYear()) {
            throw new ValidationException("L'exercice " + exercice + " n'est pas terminé : la clôture n'est possible qu'à partir du 1er janvier " + (exercice + 1));
        }
        String limite = drhRepository.parametreTexte("CONGE_REPORT_DATE_LIMITE", "06-30");
        LocalDate dateLimite;
        try {
            String[] mmjj = limite.split("-");
            dateLimite = LocalDate.of(exercice + 1, Integer.parseInt(mmjj[0]), Integer.parseInt(mmjj[1]));
        } catch (Exception e) {
            dateLimite = LocalDate.of(exercice + 1, 6, 30);
        }
        int plafond = drhRepository.parametreInt("CONGE_REPORT_PLAFOND_JOURS", 0);
        int droit = drhRepository.parametreInt(PARAM_DROIT_ANNUEL, 30);
        int examines = 0, crees = 0, jours = 0;
        for (Long userId : congeRepository.usersMembresActifs()) {
            examines++;
            int reliquat = droit - congeRepository.joursConsommes(userId, exercice);
            if (plafond > 0) {
                reliquat = Math.min(reliquat, plafond);
            }
            if (reliquat > 0 && congeRepository.creerReport(userId, exercice, exercice + 1, reliquat, dateLimite, creePar) > 0) {
                crees++;
                jours += reliquat;
            }
        }
        log.info("Clôture congés {} : {} salarié(s) examiné(s), {} report(s) créé(s) ({} j), limite {}", exercice, examines, crees, jours, dateLimite);
        return ClotureExerciceDto.builder().exercice(exercice).exerciceCible(exercice + 1)
                .salariesExamines(examines).reportsCrees(crees).joursReportes(jours).dateLimite(dateLimite).build();
    }

    // ===== V155 : synthèse mensuelle / trimestrielle =====

    @Override
    public SyntheseCongesDto syntheseConges(User drh, int exercice, String periode, int valeur, Long departementId) {
        exigerDrh(drh);
        boolean trimestre = "T".equalsIgnoreCase(periode);
        if (trimestre ? (valeur < 1 || valeur > 4) : (valeur < 1 || valeur > 12)) {
            throw new ValidationException(trimestre ? "Le trimestre doit être compris entre 1 et 4" : "Le mois doit être compris entre 1 et 12");
        }
        LocalDate debut = trimestre ? LocalDate.of(exercice, (valeur - 1) * 3 + 1, 1) : LocalDate.of(exercice, valeur, 1);
        LocalDate fin = (trimestre ? debut.plusMonths(3) : debut.plusMonths(1)).minusDays(1);
        Set<LocalDate> feries = new HashSet<>(drhRepository.joursFeries(debut, fin));
        int joursOuvrables = DrhServiceImpl.joursOuvrables(debut, fin, feries);

        List<DemandeCongeDto> conges = congeRepository.demandesValideesDrh(exercice, departementId, null).stream()
                .filter(d -> !finEffective(d).isBefore(debut) && !d.getDateDebut().isAfter(fin))
                .toList();
        List<io.digiservices.ecreditservice.drh.dto.PermissionDtos.PermissionDto> permissions =
                permissionRepository.permissionsValideesDrh(exercice, departementId, null).stream()
                .filter(p -> !p.getDateFin().isBefore(debut) && !p.getDateDebut().isAfter(fin))
                .toList();

        // Effectifs par direction
        java.util.Map<String, LigneDirectionDto> lignes = new java.util.LinkedHashMap<>();
        for (var dep : drhRepository.listeDepartements()) {
            if (departementId != null && !departementId.equals(dep.getDepartementId())) continue;
            int effectif = (int) drhRepository.listeMembres(dep.getDepartementId()).stream()
                    .filter(m -> Boolean.TRUE.equals(m.getActif())).count();
            lignes.put(dep.getCode(), LigneDirectionDto.builder().code(dep.getCode()).libelle(dep.getLibelle()).effectif(effectif).build());
        }
        int joursConges = 0, joursPermissions = 0, interruptions = 0;
        Set<Long> salaries = new HashSet<>();
        for (DemandeCongeDto d : conges) {
            int j = DrhServiceImpl.joursOuvrables(max(d.getDateDebut(), debut), min(finEffective(d), fin), feries);
            joursConges += j;
            salaries.add(d.getUserId());
            if ("INTERROMPUE".equals(d.getStatut())) interruptions++;
            LigneDirectionDto l = lignes.computeIfAbsent(d.getDepartementCode(), c -> LigneDirectionDto.builder().code(c).libelle(d.getDepartementLibelle()).build());
            l.setConges(l.getConges() + 1);
            l.setJoursConges(l.getJoursConges() + j);
        }
        java.util.Map<String, LigneMotifDto> motifs = new java.util.LinkedHashMap<>();
        for (var p : permissions) {
            int j = DrhServiceImpl.joursOuvrables(max(p.getDateDebut(), debut), min(p.getDateFin(), fin), feries);
            joursPermissions += j;
            LigneDirectionDto l = lignes.computeIfAbsent(p.getDepartementCode(), c -> LigneDirectionDto.builder().code(c).libelle(p.getDepartementLibelle()).build());
            l.setPermissions(l.getPermissions() + 1);
            l.setJoursPermissions(l.getJoursPermissions() + j);
            LigneMotifDto lm = motifs.computeIfAbsent(p.getMotif() == null ? "AUTRE" : p.getMotif(), mo -> LigneMotifDto.builder().motif(mo).build());
            lm.setNombre(lm.getNombre() + 1);
            lm.setJours(lm.getJours() + j);
        }
        int effectif = 0;
        for (LigneDirectionDto l : lignes.values()) {
            effectif += l.getEffectif();
            int capacite = l.getEffectif() * joursOuvrables;
            l.setTauxAbsence(capacite > 0 ? Math.round((l.getJoursConges() + l.getJoursPermissions()) * 10000.0 / capacite) / 100.0 : 0);
        }
        List<AbsenceJourDto> parJour = new java.util.ArrayList<>();
        for (LocalDate j = debut; !j.isAfter(fin); j = j.plusDays(1)) {
            final LocalDate jour = j;
            List<String> noms = new java.util.ArrayList<>();
            int c = 0, pm = 0;
            for (DemandeCongeDto d : conges) {
                if (!jour.isBefore(d.getDateDebut()) && !jour.isAfter(finEffective(d))) { c++; noms.add(d.getNomComplet()); }
            }
            for (var p : permissions) {
                if (!jour.isBefore(p.getDateDebut()) && !jour.isAfter(p.getDateFin())) { pm++; noms.add(p.getNomComplet() + " (perm.)"); }
            }
            boolean ouvrable = jour.getDayOfWeek() != java.time.DayOfWeek.SUNDAY && !feries.contains(jour);
            parJour.add(AbsenceJourDto.builder().jour(jour).ouvrable(ouvrable).conges(c).permissions(pm).noms(noms).build());
        }
        int capaciteTotale = effectif * joursOuvrables;
        return SyntheseCongesDto.builder()
                .exercice(exercice).periode(trimestre ? "T" : "M").valeur(valeur).debut(debut).fin(fin)
                .joursOuvrables(joursOuvrables).effectif(effectif)
                .congesAccordes(conges.size()).joursConges(joursConges).salariesEnConge(salaries.size())
                .permissionsAccordees(permissions.size()).joursPermissions(joursPermissions).interruptions(interruptions)
                .tauxAbsence(capaciteTotale > 0 ? Math.round((joursConges + joursPermissions) * 10000.0 / capaciteTotale) / 100.0 : 0)
                .parDirection(new java.util.ArrayList<>(lignes.values()))
                .parMotif(new java.util.ArrayList<>(motifs.values()))
                .parJour(parJour)
                .conges(conges).permissions(permissions)
                .build();
    }

    private static LocalDate finEffective(DemandeCongeDto d) {
        return "INTERROMPUE".equals(d.getStatut()) && d.getDateReprise() != null ? d.getDateReprise().minusDays(1) : d.getDateFin();
    }

    private static LocalDate max(LocalDate a, LocalDate b) { return a.isAfter(b) ? a : b; }
    private static LocalDate min(LocalDate a, LocalDate b) { return a.isBefore(b) ? a : b; }

    @Override
    @Transactional
    public DemandeCongeDto annuler(User acteur, Long demandeId, String motif) {
        exigerMotif(motif);
        DemandeCongeDto d = congeRepository.demandeById(demandeId)
                .orElseThrow(() -> new ValidationException("Demande introuvable"));
        boolean proprietaire = d.getUserId().equals(acteur.getUserId());
        Set<String> statutsAutorises = proprietaire
                ? Set.of("SOUMISE")                                    // l'agent annule sa demande non traitée
                : Set.of("SOUMISE", "ACCEPTEE_RESP", "VALIDEE_DRH");   // responsable / DRH à tout moment
        if (!statutsAutorises.contains(d.getStatut())) {
            throw new ValidationException("La demande est au statut " + d.getStatut() + " — annulation impossible");
        }
        if (!proprietaire) {
            exigerDemandeDeSonDepartement(acteur, demandeId, statutsAutorises);
        }
        congeRepository.interrompre(demandeId, "ANNULEE", acteur.getUserId(),
                null, d.getNbJours(), motif.trim());
        restituerReport(d, d.getNbJours()); // V155
        if (!proprietaire) {
            notifierUser(d.getUserId(), "CRG Congés : votre congé du " + d.getDateDebut()
                    + " a été annulé — " + motif.trim() + ". Vos jours sont recrédités.");
        }
        return congeRepository.demandeById(demandeId).orElseThrow();
    }

    // ==================== DRH ====================

    @Override
    public List<DemandeCongeDto> demandesAValider(User drh, int exercice) {
        exigerDrh(drh);
        return congeRepository.demandesAValiderDrh(exercice);
    }

    @Override
    public List<DemandeCongeDto> demandesValidees(User drh, int exercice, Long departementId, Integer mois) {
        exigerDrh(drh);
        return congeRepository.demandesValideesDrh(exercice, departementId, mois);
    }

    @Override
    @Transactional
    public DemandeCongeDto validerDrh(User drh, Long demandeId) {
        exigerDrh(drh);
        DemandeCongeDto d = exigerStatut(demandeId, Set.of("ACCEPTEE_RESP"));
        congeRepository.majStatut(demandeId, "VALIDEE_DRH", null, null, drh.getUserId());
        imputerSurReport(d); // V155 : le report de l'exercice précédent est consommé en priorité
        notifierUser(d.getUserId(), "CRG Congés : votre congé du " + d.getDateDebut() + " au "
                + d.getDateFin() + " (" + d.getNbJours() + " j) est validé par la DRH. Bon congé !");
        return congeRepository.demandeById(demandeId).orElseThrow();
    }

    @Override
    @Transactional
    public DemandeCongeDto renvoyerDrh(User drh, Long demandeId, String motif) {
        exigerDrh(drh);
        exigerMotif(motif);
        DemandeCongeDto d = exigerStatut(demandeId, Set.of("ACCEPTEE_RESP"));
        congeRepository.majStatut(demandeId, "REJETEE_DRH", motif, null, drh.getUserId());
        notifierUser(d.getUserId(), "CRG Congés : votre demande de congé du " + d.getDateDebut()
                + " a été renvoyée par la DRH — " + motif);
        return congeRepository.demandeById(demandeId).orElseThrow();
    }

    // ==================== Garde-fous ====================

    private void exigerDrh(User user) {
        if (!drhService.aHabilitation(user, DrhServiceImpl.F_VALIDATION_CONGES)) {
            throw new ValidationException("Action réservée à la DRH");
        }
    }

    // ===== V154 : lots =====

    @Override
    public List<DrhDtos.ResultatLotDto> validerLot(User drh, List<Long> ids) {
        return DrhServiceImpl.traiterLot(ids, id -> validerDrh(drh, id).getNomComplet() + " : congé validé");
    }

    @Override
    public List<DrhDtos.ResultatLotDto> accepterLot(User responsable, List<Long> ids) {
        return DrhServiceImpl.traiterLot(ids, id -> accepter(responsable, id).getNomComplet() + " : demande acceptée");
    }

    private static void exigerMotif(String motif) {
        if (motif == null || motif.isBlank()) {
            throw new ValidationException("Le motif est obligatoire");
        }
    }

    private MembreDto exigerResponsable(User user) {
        MembreDto membre = drhRepository.membreActifDeUser(user.getUserId())
                .orElseThrow(() -> new ValidationException("Vous n'êtes affecté à aucun département"));
        if (!Boolean.TRUE.equals(membre.getEstResponsable())) {
            throw new ValidationException("Action réservée au responsable du département");
        }
        return membre;
    }

    private DemandeCongeDto exigerDemandeDeSonDepartement(User acteur, Long demandeId, Set<String> statuts) {
        DemandeCongeDto d = exigerStatut(demandeId, statuts);
        if (drhService.estHabiliteDrh(acteur)) {
            return d;
        }
        if (drhService.estDga(acteur) && drhRepository.estResponsableActif(d.getUserId())) {
            return d; // V154 : le DGA traite l'étape responsable des demandes des responsables
        }
        MembreDto membre = exigerResponsable(acteur);
        if (!membre.getDepartementId().equals(d.getDepartementId())) {
            throw new ValidationException("Cette demande n'appartient pas à votre département");
        }
        return d;
    }

    private DemandeCongeDto exigerStatut(Long demandeId, Set<String> statutsAttendus) {
        DemandeCongeDto d = congeRepository.demandeById(demandeId)
                .orElseThrow(() -> new ValidationException("Demande introuvable"));
        if (!statutsAttendus.contains(d.getStatut())) {
            throw new ValidationException("La demande est au statut " + d.getStatut() + " — action impossible");
        }
        return d;
    }

    private static String prenomNom(User user) {
        return user.getFirstName() + " " + user.getLastName();
    }

    private static String vide(String s) {
        return (s == null || s.isBlank()) ? null : s.trim();
    }

    /** Notification SMS best-effort : un échec d'envoi ne bloque jamais le workflow. */
    private void notifier(List<String> telephones, String message) {
        for (String phone : telephones) {
            try {
                smsService.send(phone, message);
            } catch (Exception e) {
                log.warn("Notification congés non envoyée à {} : {}", phone, e.getMessage());
            }
        }
    }

    private void notifierUser(Long userId, String message) {
        drhRepository.telephoneUser(userId).ifPresent(phone -> notifier(List.of(phone), message));
    }
}
