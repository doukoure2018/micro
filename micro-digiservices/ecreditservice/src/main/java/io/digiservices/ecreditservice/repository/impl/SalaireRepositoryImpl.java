package io.digiservices.ecreditservice.repository.impl;

import io.digiservices.ecreditservice.dto.AuthorizeSalaireDto;
import io.digiservices.ecreditservice.dto.AvanceSalaireDto;
import io.digiservices.ecreditservice.dto.DemandeSalaryDto;
import io.digiservices.ecreditservice.dto.InfoPersonnelDto;
import io.digiservices.ecreditservice.query.SalaireQuery;
import io.digiservices.ecreditservice.repository.SalaireRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Repository
@RequiredArgsConstructor
@Slf4j
public class SalaireRepositoryImpl implements SalaireRepository {

    private final JdbcClient jdbcClient;

    // ==================== ROW MAPPERS ====================

    private static final RowMapper<InfoPersonnelDto> INFO_PERSONNEL_ROW_MAPPER = (rs, rowNum) ->
            InfoPersonnelDto.builder()
                    .id(rs.getLong("id"))
                    .matricule(rs.getString("matricule"))
                    .nom(rs.getString("nom"))
                    .prenom(rs.getString("prenom"))
                    .numeroCompte(rs.getString("numero_compte"))
                    .statut(rs.getString("statut"))
                    .createdAt(toLocalDateTime(rs.getTimestamp("created_at")))
                    .updatedAt(toLocalDateTime(rs.getTimestamp("updated_at")))
                    .build();

    // Nouveau RowMapper sans id_personnel ni statut
    private static final RowMapper<AvanceSalaireDto> AVANCE_SALAIRE_ROW_MAPPER = (rs, rowNum) ->
            AvanceSalaireDto.builder()
                    .id(rs.getLong("id"))
                    .matricule(rs.getString("matricule"))
                    .netAmount(rs.getBigDecimal("net_amount"))
                    .netAmountLimit(rs.getBigDecimal("net_amount_limit"))
                    .createdAt(toLocalDateTime(rs.getTimestamp("created_at")))
                    .updatedAt(toLocalDateTime(rs.getTimestamp("updated_at")))
                    .nomPersonnel(rs.getString("nom_personnel"))
                    .prenomPersonnel(rs.getString("prenom_personnel"))
                    .numeroCompte(rs.getString("numero_compte"))
                    .build();

    private static LocalDateTime toLocalDateTime(Timestamp timestamp) {
        return timestamp != null ? timestamp.toLocalDateTime() : null;
    }

    // ==================== INFO PERSONNEL ====================

    @Override
    @Transactional
    public Long saveInfoPersonnel(InfoPersonnelDto personnel) {
        log.debug("Saving info personnel: {}", personnel.getMatricule());
        return jdbcClient.sql(SalaireQuery.INSERT_INFO_PERSONNEL)
                .param("matricule", personnel.getMatricule())
                .param("nom", personnel.getNom())
                .param("prenom", personnel.getPrenom())
                .param("numeroCompte", personnel.getNumeroCompte())
                .query(Long.class)
                .single();
    }

    @Override
    @Transactional
    public int saveAllInfoPersonnel(List<InfoPersonnelDto> personnels) {
        log.info("Saving {} info personnel records", personnels.size());
        int count = 0;
        for (InfoPersonnelDto personnel : personnels) {
            try {
                saveInfoPersonnel(personnel);
                count++;
            } catch (Exception e) {
                log.warn("Erreur lors de l'insertion du personnel {}: {}", personnel.getMatricule(), e.getMessage());
            }
        }
        return count;
    }


    @Override
    public List<InfoPersonnelDto> findAllInfoPersonnel() {
        return jdbcClient.sql(SalaireQuery.SELECT_ALL_INFO_PERSONNEL)
                .query(INFO_PERSONNEL_ROW_MAPPER)
                .list();
    }

    @Override
    public List<InfoPersonnelDto> findActiveInfoPersonnel() {
        return jdbcClient.sql(SalaireQuery.SELECT_ACTIVE_INFO_PERSONNEL)
                .query(INFO_PERSONNEL_ROW_MAPPER)
                .list();
    }

    @Override
    public Map<String, Long> countInfoPersonnelByStatut() {
        return jdbcClient.sql(SalaireQuery.COUNT_INFO_PERSONNEL_BY_STATUT)
                .query((rs, rowNum) -> Map.entry(rs.getString("statut"), rs.getLong("count")))
                .list()
                .stream()
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
    }

    @Override
    @Transactional
    public int updateInfoPersonnelStatutByMatricule(String matricule, String statut) {
        return jdbcClient.sql(SalaireQuery.UPDATE_INFO_PERSONNEL_STATUT_BY_MATRICULE)
                .param("matricule", matricule)
                .param("statut", statut)
                .update();
    }

    @Override
    @Transactional
    public int updateInfoPersonnelStatut(Long id, String statut) {
        return jdbcClient.sql(SalaireQuery.UPDATE_INFO_PERSONNEL_STATUT)
                .param("id", id)
                .param("statut", statut)
                .update();
    }

    @Override
    public List<InfoPersonnelDto> findInfoPersonnelByStatut(String statut) {
        return jdbcClient.sql(SalaireQuery.SELECT_INFO_PERSONNEL_BY_STATUT)
                .param("statut", statut)
                .query(INFO_PERSONNEL_ROW_MAPPER)
                .list();
    }

    @Override
    public Optional<InfoPersonnelDto> findInfoPersonnelByMatricule(String matricule) {
        return jdbcClient.sql(SalaireQuery.SELECT_INFO_PERSONNEL_BY_MATRICULE)
                .param("matricule", matricule)
                .query(INFO_PERSONNEL_ROW_MAPPER)
                .optional();
    }

    @Override
    public Optional<InfoPersonnelDto> findInfoPersonnelById(Long id) {
        return jdbcClient.sql(SalaireQuery.SELECT_INFO_PERSONNEL_BY_ID)
                .param("id", id)
                .query(INFO_PERSONNEL_ROW_MAPPER)
                .optional();
    }

    @Override
    public long countInfoPersonnel() {
        return jdbcClient.sql(SalaireQuery.COUNT_INFO_PERSONNEL)
                .query(Long.class)
                .single();
    }

    @Override
    public boolean existsMatricule(String matricule) {
        return Boolean.TRUE.equals(jdbcClient.sql(SalaireQuery.EXISTS_MATRICULE)
                .param("matricule", matricule)
                .query(Boolean.class)
                .single());
    }

    @Override
    @Transactional
    public int updateNumeroCompte(String matricule, String numeroCompte) {
        log.debug("Mise à jour du numéro de compte pour matricule: {}", matricule);
        return jdbcClient.sql(SalaireQuery.UPDATE_NUMERO_COMPTE)
                .param("matricule", matricule)
                .param("numeroCompte", numeroCompte)
                .update();
    }

    @Override
    public Optional<InfoPersonnelDto> checkNumeroCompte(String matricule) {
        return jdbcClient.sql(SalaireQuery.CHECK_NUMERO_COMPTE_EXISTS)
                .param("matricule", matricule)
                .query((rs, rowNum) -> InfoPersonnelDto.builder()
                        .matricule(rs.getString("matricule"))
                        .nom(rs.getString("nom"))
                        .prenom(rs.getString("prenom"))
                        .numeroCompte(rs.getString("numero_compte"))
                        .build())
                .optional();
    }

    // ==================== AVANCE SALAIRE ====================

    @Override
    @Transactional
    public Long saveAvanceSalaire(String matricule, BigDecimal netAmount) {
        log.debug("Saving avance salaire for matricule: {}", matricule);
        return jdbcClient.sql(SalaireQuery.INSERT_AVANCE_SALAIRE_WITH_PERSONNEL)
                .param("matricule", matricule)
                .param("netAmount", netAmount)
                .query(Long.class)
                .optional()
                .orElse(null);
    }

    @Override
    public boolean existsMatriculeInAvanceSalaire(String matricule) {
        return Boolean.TRUE.equals(jdbcClient.sql(SalaireQuery.EXISTS_MATRICULE_IN_AVANCE_SALAIRE)
                .param("matricule", matricule)
                .query(Boolean.class)
                .single());
    }

    @Override
    public boolean saveOrUpdateAvanceSalaire(String matricule, BigDecimal netAmount) {
        try {
            // Vérifier si le matricule existe déjà dans avance_salaire
            boolean exists = existsMatriculeInAvanceSalaire(matricule);

            if (exists) {
                // UPDATE
                int updated = jdbcClient.sql(SalaireQuery.UPDATE_AVANCE_SALAIRE_BY_MATRICULE)
                        .param("matricule", matricule)
                        .param("netAmount", netAmount)
                        .update();
                log.debug("Updated avance salaire for matricule {}: {} rows", matricule, updated);
                return updated > 0;
            } else {
                // INSERT
                Long id = jdbcClient.sql(SalaireQuery.INSERT_AVANCE_SALAIRE)
                        .param("matricule", matricule)
                        .param("netAmount", netAmount)
                        .query(Long.class)
                        .optional()
                        .orElse(null);
                log.debug("Inserted avance salaire for matricule {}: id={}", matricule, id);
                return id != null;
            }
        } catch (Exception e) {
            log.error("Erreur saveOrUpdate pour matricule {}: {}", matricule, e.getMessage());
            return false;
        }
    }

    @Override
    public int saveAllAvanceSalaire(List<AvanceSalaireDto> avances) {
        log.info("Saving {} avance salaire records", avances.size());
        int count = 0;

        for (AvanceSalaireDto avance : avances) {
            try {
                boolean saved = saveOrUpdateAvanceSalaire(avance.getMatricule(), avance.getNetAmount());
                if (saved) {
                    count++;
                } else {
                    log.warn("Échec pour matricule: {}", avance.getMatricule());
                }
            } catch (Exception e) {
                log.warn("Erreur pour matricule {}: {}", avance.getMatricule(), e.getMessage());
            }
        }

        log.info("Saved {} / {} avance salaire records", count, avances.size());
        return count;
    }

    @Override
    public List<AvanceSalaireDto> findAllAvanceSalaire() {
        return jdbcClient.sql(SalaireQuery.SELECT_ALL_AVANCE_SALAIRE)
                .query(AVANCE_SALAIRE_ROW_MAPPER)
                .list();
    }

    @Override
    public List<AvanceSalaireDto> findAvanceSalaireByUser(Long idUser) {
        return jdbcClient.sql(SalaireQuery.SELECT_AVANCE_SALAIRE_BY_USER)
                .param("idUser", idUser)
                .query(AVANCE_SALAIRE_ROW_MAPPER)
                .list();
    }


    @Override
    public Optional<AvanceSalaireDto> findAvanceSalaireById(Long id) {
        return jdbcClient.sql(SalaireQuery.SELECT_AVANCE_SALAIRE_BY_ID)
                .param("id", id)
                .query(AVANCE_SALAIRE_ROW_MAPPER)
                .optional();
    }

    @Override
    public List<AvanceSalaireDto> findAvanceSalaireByStatut(String statut) {
        return jdbcClient.sql(SalaireQuery.SELECT_AVANCE_SALAIRE_BY_STATUT)
                .param("statut", statut)
                .query(AVANCE_SALAIRE_ROW_MAPPER)
                .list();
    }

    @Override
    public Optional<AvanceSalaireDto> findAvanceSalaireByMatricule(String matricule) {
        return jdbcClient.sql(SalaireQuery.SELECT_AVANCE_SALAIRE_BY_MATRICULE)
                .param("matricule", matricule)
                .query(AVANCE_SALAIRE_ROW_MAPPER)
                .optional();
    }

    @Override
    @Transactional
    public void updateAvanceSalaireStatut(Long id, String statut) {
        jdbcClient.sql(SalaireQuery.UPDATE_AVANCE_SALAIRE_STATUT)
                .param("id", id)
                .param("statut", statut)
                .update();
    }

    @Override
    @Transactional
    public int deleteAvanceSalaireByUser(Long idUser) {
        return jdbcClient.sql(SalaireQuery.DELETE_AVANCE_SALAIRE_BY_USER)
                .param("idUser", idUser)
                .update();
    }

    @Override
    @Transactional
    public int truncateAvanceSalaire() {
        log.info("Vidage de la table avance_salaire");
        return jdbcClient.sql(SalaireQuery.TRUNCATE_AVANCE_SALAIRE)
                .update();
    }

    // ==================== DEMANDE SALARY ====================

    private static final RowMapper<DemandeSalaryDto> DEMANDE_SALARY_ROW_MAPPER = (rs, rowNum) ->
            DemandeSalaryDto.builder()
                    .id(rs.getLong("id"))
                    .idUser(rs.getLong("id_user"))
                    .matricule(rs.getString("matricule"))
                    .amount(rs.getBigDecimal("amount"))
                    .numeroCompte(rs.getString("numero_compte"))
                    .statut(rs.getString("statut"))
                    .createdAt(toLocalDateTime(rs.getTimestamp("created_at")))
                    .updatedAt(toLocalDateTime(rs.getTimestamp("updated_at")))
                    .nomPersonnel(rs.getString("nom_personnel"))
                    .prenomPersonnel(rs.getString("prenom_personnel"))
                    .phone(getStringOrNull(rs, "phone"))  // ✅ AJOUTER
                    .netAmount(rs.getBigDecimal("net_amount"))
                    .netAmountLimit(rs.getBigDecimal("net_amount_limit"))
                    .build();

    // Helper method pour éviter les erreurs si la colonne n'existe pas
    private static String getStringOrNull(java.sql.ResultSet rs, String column) {
        try {
            return rs.getString(column);
        } catch (Exception e) {
            return null;
        }
    }


    // Ajouter cette méthode
    @Override
    public List<DemandeSalaryDto> findDemandesByIds(List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return List.of();
        }
        return jdbcClient.sql(SalaireQuery.SELECT_DEMANDES_BY_IDS_FOR_EXPORT)
                .param("ids", ids)
                .query(DEMANDE_SALARY_ROW_MAPPER)
                .list();
    }

    @Override
    public int confirmerMultipleDemandeSalary(List<Long> ids) {
        return 0;
    }


    @Override
    public Optional<AuthorizeSalaireDto> getAuthorizeSalaire() {
        return jdbcClient.sql(SalaireQuery.SELECT_AUTHORIZE_SALAIRE)
                .query(AUTHORIZE_SALAIRE_ROW_MAPPER)
                .optional();
    }

    @Override
    @Transactional
    public int updateAuthorizeSalaire(Boolean isAuthorized, String message, Long authorizedBy) {
        return jdbcClient.sql(SalaireQuery.UPDATE_AUTHORIZE_SALAIRE)
                .param("isAuthorized", isAuthorized)
                .param("message", message)
                .param("authorizedBy", authorizedBy)
                .update();
    }

    @Override
    @Transactional
    public int enableAuthorizeSalaire(Long authorizedBy) {
        return jdbcClient.sql(SalaireQuery.ENABLE_AUTHORIZE_SALAIRE)
                .param("authorizedBy", authorizedBy)
                .update();
    }

    @Override
    @Transactional
    public int disableAuthorizeSalaire(Long authorizedBy) {
        return jdbcClient.sql(SalaireQuery.DISABLE_AUTHORIZE_SALAIRE)
                .param("authorizedBy", authorizedBy)
                .update();
    }

    @Override
    @Transactional
    public Long saveDemandeSalary(Long idUser, String matricule, BigDecimal amount, String numeroCompte) {
        log.debug("Création d'une demande de salaire pour matricule: {}", matricule);
        return jdbcClient.sql(SalaireQuery.INSERT_DEMANDE_SALARY)
                .param("idUser", idUser)
                .param("matricule", matricule)
                .param("amount", amount)
                .param("numeroCompte", numeroCompte)
                .query(Long.class)
                .single();
    }

    @Override
    public List<DemandeSalaryDto> findAllDemandeSalary() {
        return jdbcClient.sql(SalaireQuery.SELECT_ALL_DEMANDE_SALARY)
                .query(DEMANDE_SALARY_ROW_MAPPER)
                .list();
    }

    @Override
    public List<DemandeSalaryDto> findDemandeSalaryByUser(Long idUser) {
        return jdbcClient.sql(SalaireQuery.SELECT_DEMANDE_SALARY_BY_USER)
                .param("idUser", idUser)
                .query(DEMANDE_SALARY_ROW_MAPPER)
                .list();
    }

    @Override
    public Optional<DemandeSalaryDto> findDemandeSalaryById(Long id) {
        return jdbcClient.sql(SalaireQuery.SELECT_DEMANDE_SALARY_BY_ID)
                .param("id", id)
                .query(DEMANDE_SALARY_ROW_MAPPER)
                .optional();
    }

    @Override
    public List<DemandeSalaryDto> findDemandeSalaryByStatut(String statut) {
        return jdbcClient.sql(SalaireQuery.SELECT_DEMANDE_SALARY_BY_STATUT)
                .param("statut", statut)
                .query(DEMANDE_SALARY_ROW_MAPPER)
                .list();
    }

    @Override
    @Transactional
    public int updateDemandeSalaryStatut(Long id, String statut) {
        log.debug("Mise à jour du statut de la demande {} vers {}", id, statut);
        return jdbcClient.sql(SalaireQuery.UPDATE_DEMANDE_SALARY_STATUT)
                .param("id", id)
                .param("statut", statut)
                .update();
    }

    @Override
    public BigDecimal getTotalDemandesActivesByMatricule(String matricule) {
        return jdbcClient.sql(SalaireQuery.GET_TOTAL_DEMANDES_ACTIVES_BY_MATRICULE)
                .param("matricule", matricule)
                .query(BigDecimal.class)
                .single();
    }

    @Override
    public BigDecimal getTotalDemandesActives(Long userId) {
        return jdbcClient.sql(SalaireQuery.GET_TOTAL_DEMANDES_ACTIVES)
                .param("userId", userId)
                .query(BigDecimal.class)
                .single();
    }

    @Override
    public Optional<BigDecimal> getNetAmountLimitByMatricule(String matricule) {
        return jdbcClient.sql(SalaireQuery.GET_NET_AMOUNT_LIMIT_BY_MATRICULE)
                .param("matricule", matricule)
                .query(BigDecimal.class)
                .optional();
    }


    @Override
    public boolean checkMatriculeBelongsToUser(Long userId, String matricule) {
        return Boolean.TRUE.equals(jdbcClient.sql(SalaireQuery.CHECK_MATRICULE_BELONGS_TO_USER)
                .param("userId", userId)
                .param("matricule", matricule)
                .query(Boolean.class)
                .single());
    }

    @Override
    public Optional<String> getUserMatricule(Long userId) {
        try {
            return jdbcClient.sql(SalaireQuery.SELECT_USER_MATRICULE)
                    .param("userId", userId)
                    .query(String.class)
                    .optional();
        } catch (Exception e) {
            log.warn("Erreur lors de la récupération du matricule pour userId: {}", userId);
            return Optional.empty();
        }
    }


    @Override
    public boolean hasRoleUser(Long userId) {
        try {
            return jdbcClient.sql(SalaireQuery.CHECK_USER_HAS_ROLE_USER)
                    .param("userId", userId)
                    .query(Boolean.class)
                    .single();
        } catch (Exception e) {
            log.warn("Erreur lors de la vérification du rôle USER pour userId: {}", userId);
            return false;
        }
    }

    @Override
    public List<String> getUserRoles(Long userId) {
        try {
            return jdbcClient.sql(SalaireQuery.SELECT_USER_ROLES)
                    .param("userId", userId)
                    .query(String.class)
                    .list();
        } catch (Exception e) {
            log.warn("Erreur lors de la récupération des rôles pour userId: {}", userId);
            return List.of();
        }
    }
    @Override
    @Transactional
    public int updateUserMatricule(Long userId, String matricule) {
        log.info("Mise à jour du matricule pour userId: {} avec matricule: {}", userId, matricule);
        return jdbcClient.sql(SalaireQuery.UPDATE_USER_MATRICULE)
                .param("userId", userId)
                .param("matricule", matricule)
                .update();
    }

    @Override
    public Optional<AvanceSalaireDto> findAvanceSalaireByMatriculeAndUser(String matricule, Long userId) {
        return jdbcClient.sql(SalaireQuery.SELECT_AVANCE_SALAIRE_BY_MATRICULE_AND_USER)
                .param("matricule", matricule)
                .param("userId", userId)
                .query(AVANCE_SALAIRE_ROW_MAPPER)
                .optional();
    }

    @Override
    public boolean isMatriculeAssignedToOtherUser(String matricule, Long currentUserId) {
        try {
            return jdbcClient.sql(SalaireQuery.CHECK_MATRICULE_ASSIGNED_TO_OTHER)
                    .param("matricule", matricule)
                    .param("userId", currentUserId)
                    .query(Boolean.class)
                    .single();
        } catch (Exception e) {
            log.warn("Erreur lors de la vérification du matricule: {}", e.getMessage());
            return false;
        }
    }

    private static final RowMapper<AuthorizeSalaireDto> AUTHORIZE_SALAIRE_ROW_MAPPER = (rs, rowNum) ->
            AuthorizeSalaireDto.builder()
                    .id(rs.getLong("id"))
                    .isAuthorized(rs.getBoolean("is_authorized"))
                    .message(rs.getString("message"))
                    .authorizedBy(rs.getObject("authorized_by") != null ? rs.getLong("authorized_by") : null)
                    .createdAt(toLocalDateTime(rs.getTimestamp("created_at")))
                    .updatedAt(toLocalDateTime(rs.getTimestamp("updated_at")))
                    .build();


}
