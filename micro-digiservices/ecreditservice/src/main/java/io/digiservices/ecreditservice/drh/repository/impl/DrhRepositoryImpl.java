package io.digiservices.ecreditservice.drh.repository.impl;

import io.digiservices.ecreditservice.drh.dto.DrhDtos.*;
import io.digiservices.ecreditservice.drh.query.DrhQuery;
import io.digiservices.ecreditservice.drh.repository.DrhRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
@Slf4j
public class DrhRepositoryImpl implements DrhRepository {

    private final JdbcClient jdbcClient;

    private static final RowMapper<DepartementDto> DEPARTEMENT_MAPPER = (rs, i) -> DepartementDto.builder()
            .departementId(rs.getLong("departement_id"))
            .code(rs.getString("code"))
            .libelle(rs.getString("libelle"))
            .type(rs.getString("type"))
            .delegationId(rs.getObject("delegation_id") == null ? null : rs.getLong("delegation_id"))
            .actif(rs.getBoolean("actif"))
            .nbMembres(rs.getLong("nb_membres"))
            .responsables(rs.getString("responsables"))
            .build();

    private static final RowMapper<MembreDto> MEMBRE_MAPPER = (rs, i) -> MembreDto.builder()
            .membreId(rs.getLong("membre_id"))
            .departementId(rs.getLong("departement_id"))
            .departementCode(rs.getString("departement_code"))
            .userId(rs.getLong("user_id"))
            .nomComplet(rs.getString("nom_complet"))
            .username(rs.getString("username"))
            .matricule(rs.getString("matricule"))
            .fonction(rs.getString("fonction"))
            .estResponsable(rs.getBoolean("est_responsable"))
            .actif(rs.getBoolean("actif"))
            .dateAffectation(rs.getObject("date_affectation", LocalDate.class))
            .build();

    private static final RowMapper<PrevisionDto> PREVISION_MAPPER = (rs, i) -> PrevisionDto.builder()
            .previsionId(rs.getLong("prevision_id"))
            .userId(rs.getLong("user_id"))
            .nomComplet(rs.getString("nom_complet"))
            .matricule(rs.getString("matricule"))
            .fonction(rs.getString("fonction"))
            .departementId(rs.getLong("departement_id"))
            .departementCode(rs.getString("departement_code"))
            .exercice(rs.getInt("exercice"))
            .statut(rs.getString("statut"))
            .commentaire(rs.getString("commentaire"))
            .motifRejet(rs.getString("motif_rejet"))
            .soumiseLe(rs.getObject("soumise_le", OffsetDateTime.class))
            .traiteeRespNom(rs.getString("traitee_resp_nom"))
            .traiteeRespLe(rs.getObject("traitee_resp_le", OffsetDateTime.class))
            .valideeDrhNom(rs.getString("validee_drh_nom"))
            .valideeDrhLe(rs.getObject("validee_drh_le", OffsetDateTime.class))
            .totalJours(rs.getInt("total_jours"))
            .build();

    private static final RowMapper<PeriodeDto> PERIODE_MAPPER = (rs, i) -> PeriodeDto.builder()
            .periodeId(rs.getLong("periode_id"))
            .dateDebut(rs.getObject("date_debut", LocalDate.class))
            .dateFin(rs.getObject("date_fin", LocalDate.class))
            .nbJours(rs.getInt("nb_jours"))
            .build();

    @Override
    public List<DepartementDto> listeDepartements() {
        return jdbcClient.sql(DrhQuery.LISTE_DEPARTEMENTS).query(DEPARTEMENT_MAPPER).list();
    }

    @Override
    public Long creerDepartement(DepartementRequest r) {
        return jdbcClient.sql(DrhQuery.INSERT_DEPARTEMENT)
                .param("code", r.getCode())
                .param("libelle", r.getLibelle())
                .param("type", r.getType() == null ? "SIEGE" : r.getType())
                .param("delegation_id", r.getDelegationId())
                .query(Long.class).single();
    }

    @Override
    public void modifierDepartement(Long departementId, DepartementRequest r) {
        jdbcClient.sql(DrhQuery.UPDATE_DEPARTEMENT)
                .param("departement_id", departementId)
                .param("code", r.getCode())
                .param("libelle", r.getLibelle())
                .param("type", r.getType() == null ? "SIEGE" : r.getType())
                .param("delegation_id", r.getDelegationId())
                .param("actif", r.getActif() == null || r.getActif())
                .update();
    }

    @Override
    public String libelleDepartement(Long departementId) {
        return jdbcClient.sql(DrhQuery.LIBELLE_DEPARTEMENT)
                .param("departement_id", departementId)
                .query(String.class).optional().orElse("");
    }

    @Override
    public List<MembreDto> listeMembres(Long departementId) {
        return jdbcClient.sql(DrhQuery.LISTE_MEMBRES)
                .param("departement_id", departementId)
                .query(MEMBRE_MAPPER).list();
    }

    @Override
    public Long affecterMembre(AffectationRequest r) {
        jdbcClient.sql(DrhQuery.DESACTIVER_AFFECTATIONS_USER)
                .param("user_id", r.getUserId()).update();
        return jdbcClient.sql(DrhQuery.INSERT_MEMBRE)
                .param("departement_id", r.getDepartementId())
                .param("user_id", r.getUserId())
                .param("matricule", vide(r.getMatricule()))
                .param("fonction", vide(r.getFonction()))
                .param("est_responsable", Boolean.TRUE.equals(r.getEstResponsable()))
                .query(Long.class).single();
    }

    @Override
    public void retirerMembre(Long membreId) {
        jdbcClient.sql(DrhQuery.RETIRER_MEMBRE).param("membre_id", membreId).update();
    }

    @Override
    public Optional<MembreDto> membreActifDeUser(Long userId) {
        return jdbcClient.sql(DrhQuery.MEMBRE_ACTIF_DE_USER)
                .param("user_id", userId)
                .query(MEMBRE_MAPPER).optional();
    }

    @Override
    public List<Map<String, Object>> usersNonAffectes() {
        return jdbcClient.sql(DrhQuery.USERS_NON_AFFECTES).query().listOfRows();
    }

    @Override
    public boolean estMembreDepartementDrh(Long userId) {
        return Boolean.TRUE.equals(jdbcClient.sql(DrhQuery.EST_MEMBRE_DEPARTEMENT_DRH)
                .param("user_id", userId)
                .query(Boolean.class).single());
    }

    @Override
    public Optional<Map<String, Object>> personnelParMatricule(String matricule) {
        return jdbcClient.sql(DrhQuery.PERSONNEL_PAR_MATRICULE)
                .param("matricule", matricule)
                .query().listOfRows().stream().findFirst();
    }

    @Override
    public Optional<PrevisionDto> previsionDeUser(Long userId, int exercice) {
        return jdbcClient.sql(DrhQuery.PREVISION_BY_USER_EXERCICE)
                .param("user_id", userId).param("exercice", exercice)
                .query(PREVISION_MAPPER).optional()
                .map(this::avecPeriodes);
    }

    @Override
    public Optional<PrevisionDto> previsionById(Long previsionId) {
        return jdbcClient.sql(DrhQuery.PREVISION_BY_ID)
                .param("prevision_id", previsionId)
                .query(PREVISION_MAPPER).optional()
                .map(this::avecPeriodes);
    }

    @Override
    public List<PrevisionDto> previsionsDuDepartement(Long departementId, int exercice) {
        return jdbcClient.sql(DrhQuery.PREVISIONS_DU_DEPARTEMENT)
                .param("departement_id", departementId).param("exercice", exercice)
                .query(PREVISION_MAPPER).list()
                .stream().map(this::avecPeriodes).toList();
    }

    @Override
    public List<PrevisionDto> previsionsAValiderDrh(int exercice) {
        return jdbcClient.sql(DrhQuery.PREVISIONS_A_VALIDER_DRH)
                .param("exercice", exercice)
                .query(PREVISION_MAPPER).list()
                .stream().map(this::avecPeriodes).toList();
    }

    private PrevisionDto avecPeriodes(PrevisionDto p) {
        p.setPeriodes(periodesDePrevision(p.getPrevisionId()));
        return p;
    }

    @Override
    public Long creerPrevision(Long userId, Long departementId, int exercice, String commentaire) {
        return jdbcClient.sql(DrhQuery.INSERT_PREVISION)
                .param("user_id", userId)
                .param("departement_id", departementId)
                .param("exercice", exercice)
                .param("commentaire", vide(commentaire))
                .query(Long.class).single();
    }

    @Override
    public void majCommentaire(Long previsionId, String commentaire) {
        jdbcClient.sql(DrhQuery.UPDATE_PREVISION_CONTENU)
                .param("prevision_id", previsionId)
                .param("commentaire", vide(commentaire))
                .update();
    }

    @Override
    public void majStatut(Long previsionId, String statut, String motifRejet,
                          boolean marquerSoumise, Long traiteeRespPar, Long valideeDrhPar) {
        OffsetDateTime now = OffsetDateTime.now();
        jdbcClient.sql(DrhQuery.UPDATE_PREVISION_STATUT)
                .param("prevision_id", previsionId)
                .param("statut", statut)
                .param("motif_rejet", vide(motifRejet))
                .param("soumise_le", marquerSoumise ? now : null)
                .param("traitee_resp_par", traiteeRespPar)
                .param("traitee_resp_le", traiteeRespPar != null ? now : null)
                .param("validee_drh_par", valideeDrhPar)
                .param("validee_drh_le", valideeDrhPar != null ? now : null)
                .update();
    }

    @Override
    public void remplacerPeriodes(Long previsionId, List<PeriodeDto> periodes) {
        jdbcClient.sql(DrhQuery.LOCK_PREVISION).param("prevision_id", previsionId).query(Long.class).optional();
        jdbcClient.sql(DrhQuery.DELETE_PERIODES).param("prevision_id", previsionId).update();
        for (PeriodeDto p : periodes) {
            jdbcClient.sql(DrhQuery.INSERT_PERIODE)
                    .param("prevision_id", previsionId)
                    .param("date_debut", p.getDateDebut())
                    .param("date_fin", p.getDateFin())
                    .param("nb_jours", p.getNbJours())
                    .update();
        }
    }

    @Override
    public List<PeriodeDto> periodesDePrevision(Long previsionId) {
        return jdbcClient.sql(DrhQuery.PERIODES_DE_PREVISION)
                .param("prevision_id", previsionId)
                .query(PERIODE_MAPPER).list();
    }

    @Override
    public List<LocalDate> joursFeries(LocalDate debut, LocalDate fin) {
        return jdbcClient.sql(DrhQuery.JOURS_FERIES)
                .param("debut", debut).param("fin", fin)
                .query(LocalDate.class).list();
    }

    @Override
    public List<Map<String, Object>> joursFeriesExercice(int exercice) {
        return jdbcClient.sql(DrhQuery.JOURS_FERIES_EXERCICE)
                .param("exercice", exercice)
                .query().listOfRows();
    }

    @Override
    public int parametreInt(String cle, int defaut) {
        return jdbcClient.sql(DrhQuery.PARAMETRE).param("cle", cle)
                .query(String.class).optional()
                .map(Integer::parseInt).orElse(defaut);
    }

    @Override
    public List<String> telephonesResponsables(Long departementId) {
        return jdbcClient.sql(DrhQuery.TELEPHONES_RESPONSABLES)
                .param("departement_id", departementId)
                .query(String.class).list();
    }

    @Override
    public List<String> telephonesDrh() {
        return jdbcClient.sql(DrhQuery.TELEPHONES_DRH).query(String.class).list();
    }

    @Override
    public Optional<String> telephoneUser(Long userId) {
        return jdbcClient.sql(DrhQuery.TELEPHONE_USER)
                .param("user_id", userId)
                .query(String.class).optional();
    }

    private static String vide(String s) {
        return (s == null || s.isBlank()) ? null : s.trim();
    }

    @SuppressWarnings("unused")
    private static Long longOuNull(ResultSet rs, String col) throws SQLException {
        Object o = rs.getObject(col);
        return o == null ? null : ((Number) o).longValue();
    }
}
