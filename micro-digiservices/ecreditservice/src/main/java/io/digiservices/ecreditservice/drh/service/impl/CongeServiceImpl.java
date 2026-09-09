package io.digiservices.ecreditservice.drh.service.impl;

import io.digiservices.clients.domain.User;
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

        return SoldeCongeDto.builder()
                .exercice(exercice)
                .droit(droit)
                .pris(pris)
                .restant(Math.max(0, droit - pris))
                .previsionValidee(prevision.isPresent())
                .tranchesDisponibles(disponibles)
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
        int restant = droit - pris;
        if (nbJours > restant) {
            throw new ValidationException("Ce congé de " + nbJours
                    + " jours dépasse votre solde restant (" + restant + " j sur " + droit + ")");
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
        exigerMotif(request.getMotif());
        DemandeCongeDto d = exigerDemandeDeSonDepartement(acteur, demandeId, Set.of("VALIDEE_DRH"));
        if (request.getDateReprise() == null) {
            throw new ValidationException("La date de reprise est obligatoire pour interrompre un congé");
        }
        if (request.getDateReprise().isBefore(d.getDateDebut())
                || request.getDateReprise().isAfter(d.getDateFin().plusDays(1))) {
            throw new ValidationException("La date de reprise doit être comprise entre le début du congé et le lendemain de sa fin");
        }
        Set<LocalDate> feries = new HashSet<>(drhRepository.joursFeries(
                LocalDate.of(d.getExercice(), 1, 1), LocalDate.of(d.getExercice(), 12, 31)));
        int consommes = request.getDateReprise().isAfter(d.getDateDebut())
                ? DrhServiceImpl.joursOuvrables(d.getDateDebut(), request.getDateReprise().minusDays(1), feries)
                : 0;
        int recredites = Math.max(0, d.getNbJours() - consommes);
        congeRepository.interrompre(demandeId, "INTERROMPUE", acteur.getUserId(),
                request.getDateReprise(), recredites, request.getMotif().trim());
        notifierUser(d.getUserId(), "CRG Congés : votre congé est interrompu à compter du "
                + request.getDateReprise() + " — " + request.getMotif().trim()
                + ". " + recredites + " jour(s) non consommé(s) recrédité(s).");
        notifier(drhRepository.telephonesDrh(),
                "CRG Congés : congé de " + d.getNomComplet() + " interrompu (reprise "
                        + request.getDateReprise() + ", " + recredites + " j recrédités).");
        return congeRepository.demandeById(demandeId).orElseThrow();
    }

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
    @Transactional
    public DemandeCongeDto validerDrh(User drh, Long demandeId) {
        exigerDrh(drh);
        DemandeCongeDto d = exigerStatut(demandeId, Set.of("ACCEPTEE_RESP"));
        congeRepository.majStatut(demandeId, "VALIDEE_DRH", null, null, drh.getUserId());
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
        if (!drhService.estHabiliteDrh(user)) {
            throw new ValidationException("Action réservée à la DRH");
        }
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
