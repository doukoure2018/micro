package io.digiservices.ecreditservice.service;

import io.digiservices.clients.domain.User;
import io.digiservices.ecreditservice.dto.AuditDtos.ActionSensibleDto;
import io.digiservices.ecreditservice.dto.AuditDtos.AnnulationsDto;
import io.digiservices.ecreditservice.dto.AuditDtos.ComptesAuditDto;
import io.digiservices.ecreditservice.dto.AuditDtos.CorrectionNumeroDto;
import io.digiservices.ecreditservice.dto.AuditDtos.DecisionDto;
import io.digiservices.ecreditservice.dto.AuditDtos.CompteurDto;
import io.digiservices.ecreditservice.dto.AuditDtos.DecisionsSyntheseDto;
import io.digiservices.ecreditservice.dto.AuditDtos.DelaisDerogationsDto;
import io.digiservices.ecreditservice.dto.AuditDtos.PageAuditDto;
import io.digiservices.ecreditservice.dto.AuditDtos.SortieDossierDto;
import io.digiservices.ecreditservice.exception.ApiException;
import io.digiservices.ecreditservice.repository.AuditJournauxRepository;
import io.digiservices.ecreditservice.utils.AuditExcelUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;

/**
 * Les quatre journaux du service Audit (lot 2 de la proposition du 30/10/2026).
 *
 * <p>Ces ecrans n'affichent que des traces que la base tenait deja, sans qu'aucun ecran ne les
 * lise : 21 775 evenements du circuit des dossiers, les sorties de dossiers, les corrections de
 * numero de membre, les blocages de comptes et les reglages d'habilitations.</p>
 *
 * <p>Lecture seule par construction : aucune methode d'ecriture ici. L'acces passe par les
 * rubriques du groupe Audit, et reste ouvert aux profils qui voyaient deja la matiere — la
 * direction generale et l'administrateur pour les comptes, par exemple.</p>
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AuditService {

    /** Au-dela, un export deviendrait illisible et lourd ; la page reste disponible. */
    private static final int EXPORT_MAX_LIGNES = 20000;
    private static final int JOURNAL_MAX_LIGNES = 500;

    /**
     * L'echelle de delegation, en GNF : les memes plafonds que ceux que le circuit applique
     * dans {@code WorkflowQuery} pour decider du niveau de validation finale. DA jusqu'a 25 M,
     * DR 50 M, DE 100 M, le DG au-dela. Un dossier valide par un niveau au-dessus de son
     * plafond est une derogation : elle peut etre justifiee, mais elle doit se voir.
     */
    private static final long PLAFOND_DA = 25_000_000L;
    private static final long PLAFOND_DR = 50_000_000L;
    private static final long PLAFOND_DE = 100_000_000L;

    /** Au-dela de ce silence, un dossier encore dans le circuit merite d'etre regarde. */
    private static final int SEUIL_DORMANT_JOURS = 30;

    private final AuditJournauxRepository repository;
    private final HabilitationService habilitations;
    private final io.digiservices.clients.UserClient userClient;

    // ==================== Journal des decisions ====================

    public PageAuditDto<DecisionDto> decisions(String uuid, Long dossier, String acteur, String evenement,
                                               String etat, LocalDate du, LocalDate au, int page, int taille) {
        exigerCredit(uuid);
        int t = Math.min(Math.max(taille, 1), 200);
        LocalDateTime debut = du == null ? null : du.atStartOfDay();
        LocalDateTime fin = au == null ? null : au.plusDays(1).atStartOfDay();
        long total = repository.compterDecisions(dossier, acteur, evenement, etat, debut, fin);
        List<DecisionDto> contenu = total == 0 ? List.of()
                : repository.decisions(dossier, acteur, evenement, etat, debut, fin, Math.max(page, 0), t);
        return PageAuditDto.<DecisionDto>builder()
                .contenu(contenu).page(Math.max(page, 0)).taille(t).total(total)
                .pages((int) Math.ceil((double) total / t))
                .build();
    }

    /** Les volumes et les delais du journal entier, independants des filtres de la liste. */
    public DecisionsSyntheseDto syntheseDecisions(String uuid) {
        exigerCredit(uuid);
        return DecisionsSyntheseDto.builder()
                .total(repository.compterDecisions(null, null, null, null, null, null))
                .premier(repository.premiereDecision()).dernier(repository.derniereDecision())
                .parEvenement(repository.decisionsParEvenement())
                .parEtatArrivee(repository.decisionsParEtatArrivee())
                .parActeur(repository.decisionsParActeur())
                .plusLents(repository.decisionsPlusLentes())
                .build();
    }

    public byte[] exporterDecisions(String uuid, Long dossier, String acteur, String evenement,
                                    String etat, LocalDate du, LocalDate au) {
        PageAuditDto<DecisionDto> page = decisions(uuid, dossier, acteur, evenement, etat, du, au, 0, 200);
        long total = page.getTotal();
        List<DecisionDto> lignes = total <= EXPORT_MAX_LIGNES
                ? repository.decisions(dossier, acteur, evenement, etat,
                        du == null ? null : du.atStartOfDay(),
                        au == null ? null : au.plusDays(1).atStartOfDay(), 0, (int) Math.max(total, 1))
                : page.getContenu();
        tracer(uuid, "EXPORT_DECISIONS", "Journal des décisions", lignes.size() + " ligne(s) sur " + total);
        try {
            byte[] c = AuditExcelUtils.decisions(lignes, total, total > EXPORT_MAX_LIGNES);
            log.info("[AUDIT] Export du journal des decisions par {} : {} ligne(s) sur {}", uuid, lignes.size(), total);
            return c;
        } catch (IOException e) {
            throw new ApiException("Export Excel impossible : " + e.getMessage());
        }
    }

    // ==================== Sorties de dossiers ====================

    public AnnulationsDto annulations(String uuid) {
        exigerCredit(uuid);
        List<SortieDossierDto> annulees = repository.annulees();
        List<SortieDossierDto> enAttente = repository.annulationsEnAttente();
        List<SortieDossierDto> sansMotif = repository.sortiesSansMotif();
        return AnnulationsDto.builder()
                .nbAnnulees(annulees.size()).nbEnAttente(enAttente.size()).nbSansMotif(sansMotif.size())
                .montantSansMotif(repository.montantSorties("REJET"))
                .annulees(annulees).enAttente(enAttente).sansMotif(sansMotif)
                .build();
    }

    public byte[] exporterAnnulations(String uuid) {
        AnnulationsDto d = annulations(uuid);
        tracer(uuid, "EXPORT_ANNULATIONS", "Annulations et sorties de dossiers",
                d.getNbSansMotif() + " sortie(s) sans motif sur " + (d.getNbAnnulees() + d.getNbSansMotif()));
        try {
            return AuditExcelUtils.annulations(d);
        } catch (IOException e) {
            throw new ApiException("Export Excel impossible : " + e.getMessage());
        }
    }

    // ==================== Corrections de numero de membre ====================

    public List<CorrectionNumeroDto> correctionsNumero(String uuid) {
        exigerCredit(uuid);
        return repository.correctionsNumero();
    }

    public byte[] exporterCorrectionsNumero(String uuid) {
        try {
            List<CorrectionNumeroDto> lignes = correctionsNumero(uuid);
            tracer(uuid, "EXPORT_NUMEROS_MEMBRE", "Corrections de numéro de membre",
                    lignes.size() + " correction(s)");
            return AuditExcelUtils.correctionsNumero(lignes);
        } catch (IOException e) {
            throw new ApiException("Export Excel impossible : " + e.getMessage());
        }
    }

    // ==================== Comptes, blocages, habilitations ====================

    public ComptesAuditDto comptes(String uuid, String recherche) {
        exigerAcces(uuid);
        var comptes = repository.comptes(recherche);
        tracer(uuid, "COMPTES", "Comptes et habilitations",
                comptes.size() + " compte(s)" + (recherche == null || recherche.isBlank()
                        ? "" : " · recherche « " + recherche.trim() + " »"));
        long actifs = comptes.stream().filter(c -> c.isActif()).count();
        return ComptesAuditDto.builder()
                .nbComptes(comptes.size()).nbActifs(actifs).nbBloques(comptes.size() - actifs)
                .nbJamaisConnectes(comptes.stream().filter(c -> c.getDerniereConnexion() == null).count())
                .nbSansConnexionDepuis90Jours(comptes.stream()
                        .filter(c -> c.getJoursSansConnexion() != null && c.getJoursSansConnexion() >= 90).count())
                .parDepartementActif(repository.parDepartementActif())
                .comptes(comptes)
                .journalComptes(repository.journalComptes(JOURNAL_MAX_LIGNES))
                .journalHabilitations(repository.journalHabilitations(JOURNAL_MAX_LIGNES))
                .matrice(repository.matrice())
                .build();
    }

    public byte[] exporterComptes(String uuid, String recherche) {
        try {
            ComptesAuditDto d = comptes(uuid, recherche);
            tracer(uuid, "EXPORT_COMPTES", "Comptes et habilitations", d.getNbComptes() + " compte(s)");
            return AuditExcelUtils.comptes(d);
        } catch (IOException e) {
            throw new ApiException("Export Excel impossible : " + e.getMessage());
        }
    }


    // ==================== Journal unifie des actions sensibles (lot 3) ====================

    /**
     * Les huit journaux en une seule liste, du plus recent au plus ancien. Un auditeur qui
     * cherche ce qui s'est passe sur un compte ou un jour donne n'a plus a ouvrir quatre
     * ecrans : il filtre ici, et la colonne d'origine le renvoie a la source.
     */
    public PageAuditDto<ActionSensibleDto> actions(String uuid, String type, String compte, String recherche,
                                                   LocalDate du, LocalDate au, int page, int taille) {
        exigerJournal(uuid);
        int t = Math.min(Math.max(taille, 1), 200);
        OffsetDateTime debut = debut(du);
        OffsetDateTime fin = debut(au == null ? null : au.plusDays(1));
        long total = repository.compterActionsSensibles(type, compte, recherche, debut, fin);
        List<ActionSensibleDto> contenu = total == 0 ? List.of()
                : repository.actionsSensibles(type, compte, recherche, debut, fin, Math.max(page, 0), t);
        return PageAuditDto.<ActionSensibleDto>builder()
                .contenu(contenu).page(Math.max(page, 0)).taille(t).total(total)
                .pages((int) Math.ceil((double) total / t))
                .build();
    }

    /** Les volumes par type, sur le journal entier : les chiffres en tete de l'ecran. */
    public List<CompteurDto> syntheseActions(String uuid) {
        exigerJournal(uuid);
        return repository.actionsParType();
    }

    public byte[] exporterActions(String uuid, String type, String compte, String recherche,
                                  LocalDate du, LocalDate au) {
        PageAuditDto<ActionSensibleDto> page = actions(uuid, type, compte, recherche, du, au, 0, 200);
        long total = page.getTotal();
        List<ActionSensibleDto> lignes = total <= EXPORT_MAX_LIGNES
                ? repository.actionsSensibles(type, compte, recherche, debut(du),
                        debut(au == null ? null : au.plusDays(1)), 0, (int) Math.max(total, 1))
                : page.getContenu();
        tracer(uuid, "EXPORT_ACTIONS", "Journal des actions sensibles",
                lignes.size() + " ligne(s) sur " + total);
        try {
            byte[] c = AuditExcelUtils.actions(lignes, total, total > EXPORT_MAX_LIGNES);
            log.info("[AUDIT] Export du journal des actions par {} : {} ligne(s) sur {}", uuid, lignes.size(), total);
            return c;
        } catch (IOException e) {
            throw new ApiException("Export Excel impossible : " + e.getMessage());
        }
    }

    // ==================== Delais et derogations (lot 3) ====================

    /**
     * Ou le circuit a derape : les dossiers valides au-dessus du plafond du niveau, l'attente
     * moyenne par etape et par agence, les dossiers que plus rien ne fait bouger, et ceux qui
     * ont fait plusieurs allers-retours.
     */
    public DelaisDerogationsDto delais(String uuid, Integer seuilJours) {
        exigerCredit(uuid);
        int seuil = seuilJours == null ? SEUIL_DORMANT_JOURS : Math.min(Math.max(seuilJours, 1), 365);
        var derogations = repository.derogations(PLAFOND_DA, PLAFOND_DR, PLAFOND_DE);
        var dormants = repository.dormants(seuil);
        var resoumissions = repository.resoumissions();
        return DelaisDerogationsDto.builder()
                .nbDerogations(derogations.size())
                .montantDerogations(derogations.stream().map(d -> d.getMontant())
                        .filter(m -> m != null).reduce(java.math.BigDecimal.ZERO, java.math.BigDecimal::add))
                .nbDormants(dormants.size()).nbResoumis(resoumissions.size())
                .derogations(derogations)
                .parEtape(repository.delaisParEtape()).parAgence(repository.delaisParAgence())
                .dormants(dormants).resoumissions(resoumissions)
                .seuilDormantJours(seuil)
                .build();
    }

    public byte[] exporterDelais(String uuid, Integer seuilJours) {
        DelaisDerogationsDto d = delais(uuid, seuilJours);
        tracer(uuid, "EXPORT_DELAIS", "Délais et dérogations",
                d.getNbDerogations() + " dérogation(s), " + d.getNbDormants() + " dormant(s)");
        try {
            return AuditExcelUtils.delais(d);
        } catch (IOException e) {
            throw new ApiException("Export Excel impossible : " + e.getMessage());
        }
    }

    // ==================== Trace des consultations ====================

    /**
     * Inscrit une consultation sensible. Appele pour l'ecran des comptes et pour chaque export,
     * et pour eux seuls : tracer chaque affichage noierait le journal et ne dirait plus rien.
     * Un echec d'ecriture ne doit jamais empecher la consultation — il est journalise et ignore.
     */
    private void tracer(String uuid, String ecran, String objet, String detail) {
        try {
            User user = utilisateur(uuid);
            repository.tracerConsultation(user.getUserId(), nom(user), user.getService(), ecran, objet, detail);
        } catch (Exception e) {
            log.warn("[AUDIT] Trace de consultation non enregistree ({} / {}) : {}", ecran, uuid, e.getMessage());
        }
    }

    private static String nom(User user) {
        String n = ((user.getFirstName() == null ? "" : user.getFirstName()) + " "
                + (user.getLastName() == null ? "" : user.getLastName())).trim();
        return n.isEmpty() ? user.getEmail() : n;
    }

    private static OffsetDateTime debut(LocalDate jour) {
        return jour == null ? null : jour.atStartOfDay().atOffset(ZoneOffset.UTC);
    }

    // ==================== Acces ====================

    /**
     * Les journaux du credit : la rubrique d'audit du credit, ou les profils qui suivaient deja
     * ces dossiers — la direction generale, la Direction de l'exploitation et l'administrateur.
     */
    private void exigerCredit(String uuid) {
        if (habilitations.peutUneDe(uuid, HabilitationService.AUDIT_CREDIT)) {
            return;
        }
        User user = utilisateur(uuid);
        String role = user.getRole() == null ? "" : user.getRole();
        boolean direction = "DG".equals(role) || "SUPER_ADMIN".equals(role)
                || ("MANAGER".equals(role) && "DE".equalsIgnoreCase(user.getService()));
        if (!direction) {
            throw new ApiException("Vous n'avez pas accès à cet écran");
        }
    }

    /**
     * Le journal unifie melange des decisions de credit et des actes d'administration : l'une
     * ou l'autre rubrique d'audit suffit, sinon les memes profils de direction que le credit.
     */
    private void exigerJournal(String uuid) {
        if (habilitations.peutUneDe(uuid, HabilitationService.AUDIT_CREDIT, HabilitationService.AUDIT_ACCES)) {
            return;
        }
        exigerCredit(uuid);
    }

    /** Les comptes et les habilitations : la rubrique d'audit des acces, ou l'administrateur. */
    private void exigerAcces(String uuid) {
        if (habilitations.peutUneDe(uuid, HabilitationService.AUDIT_ACCES)) {
            return;
        }
        User user = utilisateur(uuid);
        if (!"SUPER_ADMIN".equals(user.getRole())) {
            throw new ApiException("Vous n'avez pas accès à cet écran");
        }
    }

    private User utilisateur(String uuid) {
        User user = userClient.getUserByUuid(uuid);
        if (user == null) {
            throw new ApiException("Utilisateur non identifie");
        }
        return user;
    }
}
