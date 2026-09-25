package io.digiservices.ecreditservice.drh.repository.impl;

import io.digiservices.ecreditservice.drh.dto.CongeDtos.*;
import io.digiservices.ecreditservice.drh.query.CongeQuery;
import io.digiservices.ecreditservice.drh.repository.CongeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
@Slf4j
public class CongeRepositoryImpl implements CongeRepository {

    private final JdbcClient jdbcClient;

    private static final RowMapper<DemandeCongeDto> DEMANDE_MAPPER = (rs, i) -> DemandeCongeDto.builder()
            .demandeId(rs.getLong("demande_id"))
            .userId(rs.getLong("user_id"))
            .nomComplet(rs.getString("nom_complet"))
            .matricule(rs.getString("matricule"))
            .fonction(rs.getString("fonction"))
            .departementId(rs.getLong("departement_id"))
            .departementCode(rs.getString("departement_code"))
            .departementLibelle(rs.getString("departement_libelle"))
            .exercice(rs.getInt("exercice"))
            .periodeId(rs.getObject("periode_id") == null ? null : rs.getLong("periode_id"))
            .dateDebut(rs.getObject("date_debut", LocalDate.class))
            .dateFin(rs.getObject("date_fin", LocalDate.class))
            .nbJours(rs.getInt("nb_jours"))
            .dejaPris(rs.getInt("deja_pris"))
            .soldeApres(rs.getInt("solde_apres"))
            .statut(rs.getString("statut"))
            .commentaire(rs.getString("commentaire"))
            .motifRejet(rs.getString("motif_rejet"))
            .soumiseLe(rs.getObject("soumise_le", OffsetDateTime.class))
            .traiteeRespNom(rs.getString("traitee_resp_nom"))
            .traiteeRespLe(rs.getObject("traitee_resp_le", OffsetDateTime.class))
            .valideeDrhNom(rs.getString("validee_drh_nom"))
            .valideeDrhLe(rs.getObject("validee_drh_le", OffsetDateTime.class))
            .interrompueParNom(rs.getString("interrompue_par_nom"))
            .interrompueLe(rs.getObject("interrompue_le", OffsetDateTime.class))
            .dateReprise(rs.getObject("date_reprise", LocalDate.class))
            .joursRecredites(rs.getObject("jours_recredites") == null ? null : rs.getInt("jours_recredites"))
            .motifInterruption(rs.getString("motif_interruption"))
            .joursSurReport(rs.getInt("jours_sur_report"))
            .build();

    @Override
    public Optional<DemandeCongeDto> demandeById(Long demandeId) {
        return jdbcClient.sql(CongeQuery.DEMANDE_BY_ID)
                .param("demande_id", demandeId)
                .query(DEMANDE_MAPPER).optional();
    }

    @Override
    public List<DemandeCongeDto> demandesDeUser(Long userId, int exercice) {
        return jdbcClient.sql(CongeQuery.DEMANDES_DE_USER)
                .param("user_id", userId).param("exercice", exercice)
                .query(DEMANDE_MAPPER).list();
    }

    @Override
    public List<DemandeCongeDto> demandesDuDepartement(Long departementId, int exercice) {
        return jdbcClient.sql(CongeQuery.DEMANDES_DU_DEPARTEMENT)
                .param("departement_id", departementId).param("exercice", exercice)
                .query(DEMANDE_MAPPER).list();
    }

    @Override
    public List<DemandeCongeDto> demandesAValiderDrh(int exercice) {
        return jdbcClient.sql(CongeQuery.DEMANDES_A_VALIDER_DRH)
                .param("exercice", exercice)
                .query(DEMANDE_MAPPER).list();
    }

    @Override
    public Long creerDemande(Long userId, Long departementId, int exercice, Long periodeId,
                             LocalDate dateDebut, LocalDate dateFin, int nbJours,
                             int dejaPris, int soldeApres, String commentaire) {
        return jdbcClient.sql(CongeQuery.INSERT_DEMANDE)
                .param("user_id", userId)
                .param("departement_id", departementId)
                .param("exercice", exercice)
                .param("periode_id", periodeId)
                .param("date_debut", dateDebut)
                .param("date_fin", dateFin)
                .param("nb_jours", nbJours)
                .param("deja_pris", dejaPris)
                .param("solde_apres", soldeApres)
                .param("commentaire", commentaire)
                .query(Long.class).single();
    }

    @Override
    public void majStatut(Long demandeId, String statut, String motifRejet,
                          Long traiteeRespPar, Long valideeDrhPar) {
        OffsetDateTime now = OffsetDateTime.now();
        jdbcClient.sql(CongeQuery.UPDATE_DEMANDE_STATUT)
                .param("demande_id", demandeId)
                .param("statut", statut)
                .param("motif_rejet", motifRejet)
                .param("traitee_resp_par", traiteeRespPar)
                .param("traitee_resp_le", traiteeRespPar != null ? now : null)
                .param("validee_drh_par", valideeDrhPar)
                .param("validee_drh_le", valideeDrhPar != null ? now : null)
                .update();
    }

    @Override
    public void interrompre(Long demandeId, String statut, Long interrompuePar,
                            LocalDate dateReprise, Integer joursRecredites, String motif) {
        jdbcClient.sql(CongeQuery.INTERROMPRE_DEMANDE)
                .param("demande_id", demandeId)
                .param("statut", statut)
                .param("interrompue_par", interrompuePar)
                .param("date_reprise", dateReprise)
                .param("jours_recredites", joursRecredites)
                .param("motif_interruption", motif)
                .update();
    }

    @Override
    public int joursConsommes(Long userId, int exercice) {
        return jdbcClient.sql(CongeQuery.JOURS_CONSOMMES)
                .param("user_id", userId).param("exercice", exercice)
                .query(Integer.class).single();
    }

    @Override
    public boolean chevaucheDemandeActive(Long userId, LocalDate dateDebut, LocalDate dateFin) {
        Integer n = jdbcClient.sql(CongeQuery.DEMANDES_ACTIVES_CHEVAUCHANTES)
                .param("user_id", userId)
                .param("date_debut", dateDebut)
                .param("date_fin", dateFin)
                .query(Integer.class).single();
        return n != null && n > 0;
    }

    @Override
    public List<DemandeCongeDto> demandesDesResponsables(int exercice) {
        return jdbcClient.sql(CongeQuery.DEMANDES_DES_RESPONSABLES)
                .param("exercice", exercice)
                .query(DEMANDE_MAPPER).list();
    }

    @Override
    public List<DemandeCongeDto> demandesValideesDrh(int exercice, Long departementId, Integer mois) {
        return jdbcClient.sql(CongeQuery.DEMANDES_VALIDEES_DRH)
                .param("exercice", exercice)
                .param("departement_id", departementId)
                .param("mois", mois)
                .query(DEMANDE_MAPPER).list();
    }

    @Override
    public List<Map<String, Object>> congesFinARappeler(LocalDate dateCible, String type) {
        return jdbcClient.sql(CongeQuery.CONGES_FIN_A_RAPPELER)
                .param("date_cible", dateCible)
                .param("type", type)
                .query().listOfRows();
    }

    @Override
    public List<Map<String, Object>> tranchesARappeler(LocalDate dateCible, String type) {
        return jdbcClient.sql(CongeQuery.TRANCHES_A_RAPPELER)
                .param("date_cible", dateCible)
                .param("type", type)
                .query().listOfRows();
    }

    private static final RowMapper<InterruptionDto> INTERRUPTION_MAPPER = (rs, i) -> InterruptionDto.builder()
            .interruptionId(rs.getLong("interruption_id"))
            .demandeId(rs.getLong("demande_id"))
            .declareePar(rs.getLong("declaree_par"))
            .declareeParNom(rs.getString("declaree_par_nom"))
            .declareeLe(rs.getObject("declaree_le", OffsetDateTime.class))
            .dateRepriseSouhaitee(rs.getObject("date_reprise_souhaitee", LocalDate.class))
            .motif(rs.getString("motif"))
            .statut(rs.getString("statut"))
            .traiteeParNom(rs.getString("traitee_par_nom"))
            .traiteeLe(rs.getObject("traitee_le", OffsetDateTime.class))
            .dateRepriseRetenue(rs.getObject("date_reprise_retenue", LocalDate.class))
            .motifRefus(rs.getString("motif_refus"))
            .userId(rs.getLong("user_id"))
            .nomComplet(rs.getString("nom_complet"))
            .matricule(rs.getString("matricule"))
            .departementId(rs.getLong("departement_id"))
            .departementCode(rs.getString("departement_code"))
            .exercice(rs.getInt("exercice"))
            .dateDebut(rs.getObject("date_debut", LocalDate.class))
            .dateFin(rs.getObject("date_fin", LocalDate.class))
            .nbJours(rs.getInt("nb_jours"))
            .statutDemande(rs.getString("statut_demande"))
            .build();

    private static final RowMapper<ReportCongeDto> REPORT_MAPPER = (rs, i) -> ReportCongeDto.builder()
            .reportId(rs.getLong("report_id"))
            .userId(rs.getLong("user_id"))
            .nomComplet(rs.getString("nom_complet"))
            .matricule(rs.getString("matricule"))
            .departementCode(rs.getString("departement_code"))
            .exerciceOrigine(rs.getInt("exercice_origine"))
            .exerciceCible(rs.getInt("exercice_cible"))
            .joursReportes(rs.getInt("jours_reportes"))
            .joursConsommes(rs.getInt("jours_consommes"))
            .dateLimite(rs.getObject("date_limite", LocalDate.class))
            .createdAt(rs.getObject("created_at", OffsetDateTime.class))
            .build();

    @Override
    public Long declarerInterruption(Long demandeId, Long declareePar, LocalDate dateRepriseSouhaitee, String motif) {
        return jdbcClient.sql(CongeQuery.INSERT_INTERRUPTION)
                .param("demande_id", demandeId).param("declaree_par", declareePar)
                .param("date_reprise_souhaitee", dateRepriseSouhaitee).param("motif", motif)
                .query(Long.class).single();
    }

    @Override
    public boolean interruptionDemandeeExiste(Long demandeId) {
        return Boolean.TRUE.equals(jdbcClient.sql(CongeQuery.INTERRUPTION_DEMANDEE_EXISTE)
                .param("demande_id", demandeId).query(Boolean.class).single());
    }

    @Override
    public Optional<InterruptionDto> interruptionById(Long interruptionId) {
        return jdbcClient.sql(CongeQuery.INTERRUPTION_BY_ID)
                .param("interruption_id", interruptionId).query(INTERRUPTION_MAPPER).optional();
    }

    @Override
    public List<InterruptionDto> interruptionsATraiter(int exercice) {
        return jdbcClient.sql(CongeQuery.INTERRUPTIONS_A_TRAITER)
                .param("exercice", exercice).query(INTERRUPTION_MAPPER).list();
    }

    @Override
    public List<InterruptionDto> interruptionsDuDepartement(Long departementId, int exercice) {
        return jdbcClient.sql(CongeQuery.INTERRUPTIONS_DU_DEPARTEMENT)
                .param("departement_id", departementId).param("exercice", exercice)
                .query(INTERRUPTION_MAPPER).list();
    }

    @Override
    public int traiterInterruption(Long interruptionId, String statut, Long traiteePar, LocalDate dateRepriseRetenue, String motifRefus) {
        return jdbcClient.sql(CongeQuery.TRAITER_INTERRUPTION)
                .param("interruption_id", interruptionId).param("statut", statut)
                .param("traitee_par", traiteePar).param("date_reprise_retenue", dateRepriseRetenue)
                .param("motif_refus", motifRefus).update();
    }

    @Override
    public Optional<ReportCongeDto> reportActifDeUser(Long userId, int exerciceCible) {
        return jdbcClient.sql(CongeQuery.REPORT_ACTIF_DE_USER)
                .param("user_id", userId).param("exercice", exerciceCible)
                .query(REPORT_MAPPER).optional();
    }

    @Override
    public List<ReportCongeDto> reportsExerciceCible(int exerciceCible) {
        return jdbcClient.sql(CongeQuery.REPORTS_EXERCICE_CIBLE)
                .param("exercice", exerciceCible).query(REPORT_MAPPER).list();
    }

    @Override
    public int creerReport(Long userId, int exerciceOrigine, int exerciceCible, int jours, LocalDate dateLimite, Long creePar) {
        return jdbcClient.sql(CongeQuery.INSERT_REPORT)
                .param("user_id", userId).param("exercice_origine", exerciceOrigine)
                .param("exercice_cible", exerciceCible).param("jours_reportes", jours)
                .param("date_limite", dateLimite).param("cree_par", creePar).update();
    }

    @Override
    public void majConsommationReport(Long userId, int exerciceCible, int delta) {
        jdbcClient.sql(CongeQuery.MAJ_CONSOMMATION_REPORT)
                .param("user_id", userId).param("exercice", exerciceCible).param("delta", delta).update();
    }

    @Override
    public void majJoursSurReport(Long demandeId, int jours) {
        jdbcClient.sql(CongeQuery.MAJ_JOURS_SUR_REPORT)
                .param("demande_id", demandeId).param("jours", jours).update();
    }

    @Override
    public List<Long> usersMembresActifs() {
        return jdbcClient.sql(CongeQuery.USERS_MEMBRES_ACTIFS).query(Long.class).list();
    }

    @Override
    public void enregistrerAlerte(String type, Long userId, Long referenceId) {
        jdbcClient.sql(CongeQuery.INSERT_ALERTE)
                .param("type", type)
                .param("user_id", userId)
                .param("reference_id", referenceId)
                .update();
    }
}
