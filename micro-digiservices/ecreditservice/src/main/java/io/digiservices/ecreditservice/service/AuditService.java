package io.digiservices.ecreditservice.service;

import io.digiservices.clients.domain.User;
import io.digiservices.ecreditservice.dto.AuditDtos.AnnulationsDto;
import io.digiservices.ecreditservice.dto.AuditDtos.ComptesAuditDto;
import io.digiservices.ecreditservice.dto.AuditDtos.CorrectionNumeroDto;
import io.digiservices.ecreditservice.dto.AuditDtos.DecisionDto;
import io.digiservices.ecreditservice.dto.AuditDtos.DecisionsSyntheseDto;
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
            return AuditExcelUtils.correctionsNumero(correctionsNumero(uuid));
        } catch (IOException e) {
            throw new ApiException("Export Excel impossible : " + e.getMessage());
        }
    }

    // ==================== Comptes, blocages, habilitations ====================

    public ComptesAuditDto comptes(String uuid, String recherche) {
        exigerAcces(uuid);
        var comptes = repository.comptes(recherche);
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
            return AuditExcelUtils.comptes(comptes(uuid, recherche));
        } catch (IOException e) {
            throw new ApiException("Export Excel impossible : " + e.getMessage());
        }
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
