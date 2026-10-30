package io.digiservices.ecreditservice.repository;

import io.digiservices.ecreditservice.dto.AuditDtos.CompteAuditDto;
import io.digiservices.ecreditservice.dto.AuditDtos.CompteurDto;
import io.digiservices.ecreditservice.dto.AuditDtos.CorrectionNumeroDto;
import io.digiservices.ecreditservice.dto.AuditDtos.DecisionDto;
import io.digiservices.ecreditservice.dto.AuditDtos.MatriceLectureDto;
import io.digiservices.ecreditservice.dto.AuditDtos.SortieDossierDto;
import io.digiservices.ecreditservice.dto.AuditDtos.TraceCompteDto;
import io.digiservices.ecreditservice.dto.AuditDtos.TraceHabilitationDto;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.List;

/**
 * Lectures des journaux pour le service Audit (lot 2). Rien d'autre que des SELECT.
 *
 * <p>Le delai entre deux evenements d'un dossier est calcule par une fenetre sur TOUT le
 * journal avant tout filtre : filtrer d'abord donnerait le delai depuis l'evenement precedent
 * <i>retenu</i>, pas depuis l'evenement precedent reel, et le chiffre serait faux des qu'on
 * filtre par acteur ou par type.</p>
 */
@Repository
@RequiredArgsConstructor
public class AuditJournauxRepository {

    private final JdbcClient jdbcClient;

    // ==================== Journal des decisions ====================

    /** Le journal avec le delai depuis l'evenement precedent du meme dossier, avant filtrage. */
    private static final String DECISIONS_BASE = """
            WITH h AS (
                SELECT historique_id, demandeindividuel_id, evenement, ancien_etat, nouvel_etat,
                       ancien_statut, nouveau_statut, acteur, motif, date_evenement,
                       LAG(date_evenement) OVER (PARTITION BY demandeindividuel_id
                                                 ORDER BY date_evenement, historique_id) AS precedent
                  FROM demande_etat_historique
            )
            SELECT h.historique_id, h.demandeindividuel_id, h.evenement, h.ancien_etat, h.nouvel_etat,
                   h.ancien_statut, h.nouveau_statut, h.acteur, h.motif, h.date_evenement,
                   CASE WHEN h.precedent IS NULL THEN NULL
                        ELSE FLOOR(EXTRACT(EPOCH FROM (h.date_evenement - h.precedent)) / 3600)::BIGINT END AS delai_heures,
                   TRIM(COALESCE(d.nom,'') || ' ' || COALESCE(d.prenom,'')) AS client,
                   d.numero_membre, d.montant_demande,
                   pv.libele AS point_vente, a.libele AS agence, dl.libele AS delegation
              FROM h
              LEFT JOIN demandeindividuel d ON d.demandeindividuel_id = h.demandeindividuel_id
              LEFT JOIN pointvente pv ON pv.id = d.pos   -- `pos` = identifiant du point de vente sur demandeindividuel
              LEFT JOIN agence a      ON a.id  = d.agence
              LEFT JOIN delegation dl ON dl.id = d.delegation
             WHERE (:dossier IS NULL OR h.demandeindividuel_id = :dossier)
               AND (:acteur IS NULL OR LOWER(COALESCE(h.acteur,'')) LIKE LOWER('%' || :acteur || '%'))
               AND (:evenement IS NULL OR h.evenement = :evenement)
               AND (:etat IS NULL OR h.nouvel_etat = :etat)
               AND (:du IS NULL OR h.date_evenement >= :du)
               AND (:au IS NULL OR h.date_evenement < :au)
            """;

    public List<DecisionDto> decisions(Long dossier, String acteur, String evenement, String etat,
                                       LocalDateTime du, LocalDateTime au, int page, int taille) {
        return parametres(jdbcClient.sql(DECISIONS_BASE
                        + " ORDER BY h.date_evenement DESC, h.historique_id DESC OFFSET :offset LIMIT :limite"),
                dossier, acteur, evenement, etat, du, au)
                .param("offset", (long) page * taille).param("limite", taille)
                .query(AuditJournauxRepository::versDecision).list();
    }

    public long compterDecisions(Long dossier, String acteur, String evenement, String etat,
                                 LocalDateTime du, LocalDateTime au) {
        return parametres(jdbcClient.sql("SELECT COUNT(*) FROM (" + DECISIONS_BASE + ") t"),
                dossier, acteur, evenement, etat, du, au)
                .query(Long.class).single();
    }

    private JdbcClient.StatementSpec parametres(JdbcClient.StatementSpec spec, Long dossier, String acteur,
                                                String evenement, String etat, LocalDateTime du, LocalDateTime au) {
        return spec.param("dossier", dossier).param("acteur", vide(acteur))
                .param("evenement", vide(evenement)).param("etat", vide(etat))
                .param("du", du).param("au", au);
    }

    private static DecisionDto versDecision(ResultSet rs, int n) throws SQLException {
        return DecisionDto.builder()
                .historiqueId(rs.getLong("historique_id"))
                .demandeId((Long) rs.getObject("demandeindividuel_id"))
                .client(texte(rs.getString("client")))
                .numeroMembre(rs.getString("numero_membre"))
                .montant(rs.getBigDecimal("montant_demande"))
                .pointVente(rs.getString("point_vente")).agence(rs.getString("agence"))
                .delegation(rs.getString("delegation"))
                .evenement(rs.getString("evenement"))
                .ancienEtat(rs.getString("ancien_etat")).nouvelEtat(rs.getString("nouvel_etat"))
                .ancienStatut(rs.getString("ancien_statut")).nouveauStatut(rs.getString("nouveau_statut"))
                .acteur(texte(rs.getString("acteur"))).motif(rs.getString("motif"))
                .dateEvenement(rs.getObject("date_evenement", LocalDateTime.class))
                .delaiHeures((Long) rs.getObject("delai_heures"))
                .build();
    }

    /** Volumes et delais du journal entier : ce que l'ecran montre au-dessus de la liste. */
    public List<CompteurDto> decisionsParEvenement() {
        return jdbcClient.sql("""
                        SELECT evenement AS cle, COUNT(*) AS nombre FROM demande_etat_historique
                         GROUP BY evenement ORDER BY COUNT(*) DESC
                        """).query(AuditJournauxRepository::versCompteur).list();
    }

    public List<CompteurDto> decisionsParEtatArrivee() {
        return jdbcClient.sql("""
                        SELECT COALESCE(nouvel_etat, '(aucun)') AS cle, COUNT(*) AS nombre
                          FROM demande_etat_historique GROUP BY 1 ORDER BY 2 DESC LIMIT 20
                        """).query(AuditJournauxRepository::versCompteur).list();
    }

    public List<CompteurDto> decisionsParActeur() {
        return jdbcClient.sql("""
                        SELECT acteur AS cle, COUNT(*) AS nombre FROM demande_etat_historique
                         WHERE COALESCE(TRIM(acteur), '') <> ''
                         GROUP BY acteur ORDER BY COUNT(*) DESC LIMIT 20
                        """).query(AuditJournauxRepository::versCompteur).list();
    }

    /** Les etapes ou les dossiers attendent le plus longtemps, en moyenne. */
    public List<CompteurDto> decisionsPlusLentes() {
        return jdbcClient.sql("""
                        WITH h AS (
                            SELECT nouvel_etat, date_evenement,
                                   LAG(date_evenement) OVER (PARTITION BY demandeindividuel_id
                                                             ORDER BY date_evenement, historique_id) AS precedent
                              FROM demande_etat_historique
                        )
                        SELECT COALESCE(nouvel_etat, '(aucun)') AS cle, COUNT(*) AS nombre,
                               ROUND(AVG(EXTRACT(EPOCH FROM (date_evenement - precedent)) / 3600))::BIGINT AS moyenne
                          FROM h WHERE precedent IS NOT NULL
                         GROUP BY 1 HAVING COUNT(*) >= 10
                         ORDER BY 3 DESC LIMIT 12
                        """)
                .query((rs, n) -> CompteurDto.builder().cle(rs.getString("cle"))
                        .nombre(rs.getLong("nombre")).moyenneHeures((Long) rs.getObject("moyenne")).build())
                .list();
    }

    public LocalDateTime premiereDecision() {
        return jdbcClient.sql("SELECT MIN(date_evenement) FROM demande_etat_historique")
                .query(LocalDateTime.class).optional().orElse(null);
    }

    public LocalDateTime derniereDecision() {
        return jdbcClient.sql("SELECT MAX(date_evenement) FROM demande_etat_historique")
                .query(LocalDateTime.class).optional().orElse(null);
    }

    // ==================== Sorties de dossiers ====================

    private static final String SORTIES_BASE = """
            SELECT d.demandeindividuel_id,
                   TRIM(COALESCE(d.nom,'') || ' ' || COALESCE(d.prenom,'')) AS client,
                   d.numero_membre, d.montant_demande, d.statut_demande, d.validation_state,
                   d.etat_avant_annulation, d.annulation_dossier_motif_code, d.annulation_dossier_motif,
                   d.annulation_dossier_demandee_par, d.date_demande_annulation_dossier,
                   d.annulation_dossier_decidee_par, d.date_decision_annulation_dossier,
                   d.annulation_dossier_motif_refus, d.createdat,
                   pv.libele AS point_vente, a.libele AS agence, dl.libele AS delegation
              FROM demandeindividuel d
              LEFT JOIN pointvente pv ON pv.id = d.pos   -- `pos` = identifiant du point de vente sur demandeindividuel
              LEFT JOIN agence a      ON a.id  = d.agence
              LEFT JOIN delegation dl ON dl.id = d.delegation
            """;

    /** Les annulations en regle : motif et auteur presents, decidees par un directeur d'agence. */
    public List<SortieDossierDto> annulees() {
        return jdbcClient.sql(SORTIES_BASE + " WHERE d.statut_demande = 'ANNULE'"
                        + " ORDER BY d.date_decision_annulation_dossier DESC NULLS LAST, d.demandeindividuel_id DESC")
                .query(AuditJournauxRepository::versSortie).list();
    }

    /** Les demandes d'annulation que le directeur d'agence n'a pas encore tranchees. */
    public List<SortieDossierDto> annulationsEnAttente() {
        return jdbcClient.sql(SORTIES_BASE + " WHERE d.validation_state = 'ANNULATION_DEMANDEE'"
                        + " ORDER BY d.date_demande_annulation_dossier DESC NULLS LAST")
                .query(AuditJournauxRepository::versSortie).list();
    }

    /**
     * Les dossiers sortis definitivement sans motif ni auteur. Ils viennent d'un point d'entree
     * technique non garde, et c'est le fait qu'un audit doit pouvoir relever seul.
     */
    public List<SortieDossierDto> sortiesSansMotif() {
        return jdbcClient.sql(SORTIES_BASE + " WHERE d.statut_demande = 'REJET'"
                        + " ORDER BY d.demandeindividuel_id DESC")
                .query(AuditJournauxRepository::versSortie).list();
    }

    private static SortieDossierDto versSortie(ResultSet rs, int n) throws SQLException {
        String motif = rs.getString("annulation_dossier_motif");
        String par = rs.getString("annulation_dossier_decidee_par");
        return SortieDossierDto.builder()
                .demandeId(rs.getLong("demandeindividuel_id"))
                .client(texte(rs.getString("client")))
                .numeroMembre(rs.getString("numero_membre"))
                .montant(rs.getBigDecimal("montant_demande"))
                .pointVente(rs.getString("point_vente")).agence(rs.getString("agence"))
                .delegation(rs.getString("delegation"))
                .statutDemande(rs.getString("statut_demande"))
                .validationState(rs.getString("validation_state"))
                .etatAvantAnnulation(rs.getString("etat_avant_annulation"))
                .motifCode(rs.getString("annulation_dossier_motif_code")).motif(motif)
                .demandeePar(rs.getString("annulation_dossier_demandee_par"))
                .dateDemande(rs.getObject("date_demande_annulation_dossier", LocalDateTime.class))
                .decideePar(par)
                .dateDecision(rs.getObject("date_decision_annulation_dossier", LocalDateTime.class))
                .motifRefus(rs.getString("annulation_dossier_motif_refus"))
                .dateCreation(rs.getObject("createdat", LocalDate.class))
                .tracee(motif != null && !motif.isBlank() && par != null && !par.isBlank())
                .build();
    }

    public long compterSorties(String statut) {
        return jdbcClient.sql("SELECT COUNT(*) FROM demandeindividuel WHERE statut_demande = :s")
                .param("s", statut).query(Long.class).single();
    }

    public java.math.BigDecimal montantSorties(String statut) {
        return jdbcClient.sql("SELECT COALESCE(SUM(montant_demande), 0) FROM demandeindividuel WHERE statut_demande = :s")
                .param("s", statut).query(java.math.BigDecimal.class).single();
    }

    // ==================== Corrections de numero de membre ====================

    public List<CorrectionNumeroDto> correctionsNumero() {
        return jdbcClient.sql("""
                        SELECT c.id, c.demandeindividuel_id, c.ancien_numero, c.nouveau_numero, c.nom_saf,
                               c.cod_agencia_saf, c.motif, c.par_nom, c.par_role, c.date_correction,
                               TRIM(COALESCE(d.nom,'') || ' ' || COALESCE(d.prenom,'')) AS client,
                               pv.libele AS point_vente, a.libele AS agence
                          FROM demande_numero_membre_correction c
                          LEFT JOIN demandeindividuel d ON d.demandeindividuel_id = c.demandeindividuel_id
                          LEFT JOIN pointvente pv ON pv.id = d.pos   -- `pos` = identifiant du point de vente sur demandeindividuel
                          LEFT JOIN agence a      ON a.id  = d.agence
                         ORDER BY c.date_correction DESC
                        """)
                .query((rs, n) -> CorrectionNumeroDto.builder()
                        .id(rs.getLong("id")).demandeId((Long) rs.getObject("demandeindividuel_id"))
                        .client(texte(rs.getString("client")))
                        .pointVente(rs.getString("point_vente")).agence(rs.getString("agence"))
                        .ancienNumero(rs.getString("ancien_numero")).nouveauNumero(rs.getString("nouveau_numero"))
                        .nomSaf(rs.getString("nom_saf")).agenceSaf(rs.getString("cod_agencia_saf"))
                        .motif(rs.getString("motif")).parNom(rs.getString("par_nom")).parRole(rs.getString("par_role"))
                        .dateCorrection(rs.getObject("date_correction", OffsetDateTime.class))
                        .build())
                .list();
    }

    // ==================== Comptes, blocages, habilitations ====================

    public List<CompteAuditDto> comptes(String recherche) {
        return jdbcClient.sql("""
                        SELECT u.user_id, TRIM(COALESCE(u.first_name,'') || ' ' || COALESCE(u.last_name,'')) AS nom,
                               u.email, u.phone, r.name AS role, u.service, u.enabled,
                               u.last_login::date AS derniere_connexion, u.created_at::date AS cree_le,
                               (u.email_verifie_at IS NOT NULL) AS email_verifie,
                               (u.phone_verifie_at IS NOT NULL) AS phone_verifie,
                               COALESCE(u.contacts_a_corriger, FALSE) AS contacts_a_corriger,
                               hd.libelle AS departement,
                               pv.libele AS point_vente, COALESCE(a.libele, apv.libele) AS agence,
                               COALESCE(dl.libele, dlpv.libele) AS delegation
                          FROM users u
                          LEFT JOIN user_roles ur ON ur.user_id = u.user_id
                          LEFT JOIN roles r ON r.role_id = ur.role_id
                          LEFT JOIN habilitation_departement hd ON hd.id = u.habilitation_departement_id
                          LEFT JOIN pointvente pv ON pv.id = u.pointvente_id
                          LEFT JOIN agence a      ON a.id  = u.agence_id
                          LEFT JOIN agence apv    ON apv.id = pv.agence_id
                          LEFT JOIN delegation dl ON dl.id = u.delegation_id
                          LEFT JOIN delegation dlpv ON dlpv.id = COALESCE(pv.delegation_id, apv.delegation_id)
                         WHERE :recherche IS NULL
                            OR LOWER(COALESCE(u.first_name,'') || ' ' || COALESCE(u.last_name,'') || ' '
                                     || COALESCE(u.email,'') || ' ' || COALESCE(u.service,'')) LIKE LOWER('%' || :recherche || '%')
                         ORDER BY u.enabled DESC, u.last_login DESC NULLS LAST
                        """)
                .param("recherche", vide(recherche))
                .query((rs, n) -> {
                    LocalDate derniere = rs.getObject("derniere_connexion", LocalDate.class);
                    return CompteAuditDto.builder()
                            .userId(rs.getLong("user_id")).nom(texte(rs.getString("nom")))
                            .email(rs.getString("email")).telephone(rs.getString("phone"))
                            .role(rs.getString("role")).service(rs.getString("service"))
                            .departement(rs.getString("departement"))
                            .pointVente(rs.getString("point_vente")).agence(rs.getString("agence"))
                            .delegation(rs.getString("delegation"))
                            .actif(rs.getBoolean("enabled"))
                            .derniereConnexion(derniere)
                            .joursSansConnexion(derniere == null ? null
                                    : java.time.temporal.ChronoUnit.DAYS.between(derniere, LocalDate.now()))
                            .creeLe(rs.getObject("cree_le", LocalDate.class))
                            .emailVerifie(rs.getBoolean("email_verifie"))
                            .telephoneVerifie(rs.getBoolean("phone_verifie"))
                            .contactsACorriger(rs.getBoolean("contacts_a_corriger"))
                            .build();
                })
                .list();
    }

    public List<TraceCompteDto> journalComptes(int limite) {
        return jdbcClient.sql("""
                        SELECT j.id, j.user_id, j.action, j.motif, j.par_nom, j.date_action,
                               TRIM(COALESCE(u.first_name,'') || ' ' || COALESCE(u.last_name,'')) AS compte
                          FROM compte_journal j
                          LEFT JOIN users u ON u.user_id = j.user_id
                         ORDER BY j.date_action DESC LIMIT :limite
                        """)
                .param("limite", limite)
                .query((rs, n) -> TraceCompteDto.builder()
                        .id(rs.getLong("id")).userId((Long) rs.getObject("user_id"))
                        .compte(texte(rs.getString("compte"))).action(rs.getString("action"))
                        .motif(rs.getString("motif")).parNom(rs.getString("par_nom"))
                        .dateAction(rs.getObject("date_action", OffsetDateTime.class))
                        .build())
                .list();
    }

    public List<TraceHabilitationDto> journalHabilitations(int limite) {
        return jdbcClient.sql("""
                        SELECT j.id, j.action, j.service, j.departement, j.rubrique_code,
                               r.libelle AS rubrique_libelle, j.valeur_avant, j.valeur_apres,
                               j.par_nom, j.date_action
                          FROM habilitation_journal j
                          LEFT JOIN habilitation_rubrique r ON r.code = j.rubrique_code
                         ORDER BY j.date_action DESC LIMIT :limite
                        """)
                .param("limite", limite)
                .query((rs, n) -> TraceHabilitationDto.builder()
                        .id(rs.getLong("id")).action(rs.getString("action"))
                        .service(rs.getString("service")).departement(rs.getString("departement"))
                        .rubriqueCode(rs.getString("rubrique_code")).rubriqueLibelle(rs.getString("rubrique_libelle"))
                        .valeurAvant(rs.getString("valeur_avant")).valeurApres(rs.getString("valeur_apres"))
                        .parNom(rs.getString("par_nom"))
                        .dateAction(rs.getObject("date_action", OffsetDateTime.class))
                        .build())
                .list();
    }

    public List<MatriceLectureDto> matrice() {
        return jdbcClient.sql("""
                        SELECT d.id, d.service, d.code, d.libelle, d.tout_voir,
                               (SELECT COUNT(*) FROM users u WHERE u.habilitation_departement_id = d.id) AS nb_comptes,
                               (SELECT STRING_AGG(x.rubrique_code, ', ' ORDER BY x.rubrique_code)
                                  FROM habilitation_departement_rubrique x WHERE x.departement_id = d.id) AS rubriques
                          FROM habilitation_departement d
                         ORDER BY d.service, d.ordre, d.code
                        """)
                .query((rs, n) -> {
                    String agg = rs.getString("rubriques");
                    return MatriceLectureDto.builder()
                            .departementId(rs.getLong("id")).service(rs.getString("service"))
                            .code(rs.getString("code")).libelle(rs.getString("libelle"))
                            .toutVoir(rs.getBoolean("tout_voir")).nbComptes(rs.getLong("nb_comptes"))
                            .rubriques(agg == null || agg.isBlank() ? List.of() : List.of(agg.split(", ")))
                            .build();
                })
                .list();
    }

    public boolean parDepartementActif() {
        return jdbcClient.sql("SELECT valeur FROM habilitation_parametre WHERE cle = 'PAR_DEPARTEMENT_ACTIF'")
                .query(String.class).optional().map("true"::equalsIgnoreCase).orElse(false);
    }

    // ------------------------------------------------------------------ interne

    private static String vide(String s) {
        return s == null || s.isBlank() ? null : s.trim();
    }

    private static String texte(String s) {
        return s == null ? null : s.trim();
    }

    private static CompteurDto versCompteur(ResultSet rs, int n) throws SQLException {
        return CompteurDto.builder().cle(rs.getString("cle")).nombre(rs.getLong("nombre")).build();
    }
}
