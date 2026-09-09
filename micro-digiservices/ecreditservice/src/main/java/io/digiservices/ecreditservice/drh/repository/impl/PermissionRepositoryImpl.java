package io.digiservices.ecreditservice.drh.repository.impl;

import io.digiservices.ecreditservice.drh.dto.PermissionDtos.PermissionDto;
import io.digiservices.ecreditservice.drh.dto.PermissionDtos.PermissionRequest;
import io.digiservices.ecreditservice.drh.query.PermissionQuery;
import io.digiservices.ecreditservice.drh.repository.PermissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class PermissionRepositoryImpl implements PermissionRepository {

    private final JdbcClient jdbcClient;

    private static final RowMapper<PermissionDto> PERMISSION_MAPPER = (rs, i) -> PermissionDto.builder()
            .permissionId(rs.getLong("permission_id"))
            .userId(rs.getLong("user_id"))
            .nomComplet(rs.getString("nom_complet"))
            .matricule(rs.getString("matricule"))
            .fonction(rs.getString("fonction"))
            .departementId(rs.getLong("departement_id"))
            .departementCode(rs.getString("departement_code"))
            .departementLibelle(rs.getString("departement_libelle"))
            .exercice(rs.getInt("exercice"))
            .motif(rs.getString("motif"))
            .lienParente(rs.getString("lien_parente"))
            .precisionMotif(rs.getString("precision_motif"))
            .dateDebut(rs.getObject("date_debut", LocalDate.class))
            .dateFin(rs.getObject("date_fin", LocalDate.class))
            .nbJours(rs.getInt("nb_jours"))
            .statut(rs.getString("statut"))
            .motifRejet(rs.getString("motif_rejet"))
            .soumiseLe(rs.getObject("soumise_le", OffsetDateTime.class))
            .traiteeRespNom(rs.getString("traitee_resp_nom"))
            .traiteeRespLe(rs.getObject("traitee_resp_le", OffsetDateTime.class))
            .valideeDrhNom(rs.getString("validee_drh_nom"))
            .valideeDrhLe(rs.getObject("validee_drh_le", OffsetDateTime.class))
            .build();

    @Override
    public Optional<PermissionDto> permissionById(Long permissionId) {
        return jdbcClient.sql(PermissionQuery.PERMISSION_BY_ID)
                .param("permission_id", permissionId)
                .query(PERMISSION_MAPPER).optional();
    }

    @Override
    public List<PermissionDto> permissionsDeUser(Long userId, int exercice) {
        return jdbcClient.sql(PermissionQuery.PERMISSIONS_DE_USER)
                .param("user_id", userId).param("exercice", exercice)
                .query(PERMISSION_MAPPER).list();
    }

    @Override
    public List<PermissionDto> permissionsDuDepartement(Long departementId, int exercice) {
        return jdbcClient.sql(PermissionQuery.PERMISSIONS_DU_DEPARTEMENT)
                .param("departement_id", departementId).param("exercice", exercice)
                .query(PERMISSION_MAPPER).list();
    }

    @Override
    public List<PermissionDto> permissionsAValiderDrh(int exercice) {
        return jdbcClient.sql(PermissionQuery.PERMISSIONS_A_VALIDER_DRH)
                .param("exercice", exercice)
                .query(PERMISSION_MAPPER).list();
    }

    @Override
    public Long creerPermission(Long userId, Long departementId, int exercice,
                                PermissionRequest r, int nbJours) {
        return jdbcClient.sql(PermissionQuery.INSERT_PERMISSION)
                .param("user_id", userId)
                .param("departement_id", departementId)
                .param("exercice", exercice)
                .param("motif", r.getMotif())
                .param("lien_parente", vide(r.getLienParente()))
                .param("precision_motif", vide(r.getPrecisionMotif()))
                .param("date_debut", r.getDateDebut())
                .param("date_fin", r.getDateFin())
                .param("nb_jours", nbJours)
                .query(Long.class).single();
    }

    @Override
    public void majStatut(Long permissionId, String statut, String motifRejet,
                          Long traiteeRespPar, Long valideeDrhPar, Long annuleePar) {
        OffsetDateTime now = OffsetDateTime.now();
        jdbcClient.sql(PermissionQuery.UPDATE_PERMISSION_STATUT)
                .param("permission_id", permissionId)
                .param("statut", statut)
                .param("motif_rejet", vide(motifRejet))
                .param("traitee_resp_par", traiteeRespPar)
                .param("traitee_resp_le", traiteeRespPar != null ? now : null)
                .param("validee_drh_par", valideeDrhPar)
                .param("validee_drh_le", valideeDrhPar != null ? now : null)
                .param("annulee_par", annuleePar)
                .param("annulee_le", annuleePar != null ? now : null)
                .update();
    }

    @Override
    public Optional<PermissionDto> permissionEnCours(Long userId) {
        return jdbcClient.sql(PermissionQuery.PERMISSION_EN_COURS)
                .param("user_id", userId)
                .query(PERMISSION_MAPPER).optional();
    }

    @Override
    public int joursConsommes(Long userId, int exercice) {
        return jdbcClient.sql(PermissionQuery.JOURS_PERMISSION_CONSOMMES)
                .param("user_id", userId).param("exercice", exercice)
                .query(Integer.class).single();
    }

    @Override
    public boolean chevauchePermissionActive(Long userId, LocalDate dateDebut, LocalDate dateFin) {
        Integer n = jdbcClient.sql(PermissionQuery.PERMISSIONS_ACTIVES_CHEVAUCHANTES)
                .param("user_id", userId)
                .param("date_debut", dateDebut)
                .param("date_fin", dateFin)
                .query(Integer.class).single();
        return n != null && n > 0;
    }

    private static String vide(String s) {
        return (s == null || s.isBlank()) ? null : s.trim();
    }
}
