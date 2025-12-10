package io.digiservices.ecreditservice.repository.impl;

import io.digiservices.clients.domain.AgenceDto;
import io.digiservices.clients.domain.DelegationDto;
import io.digiservices.clients.domain.PointVenteDto;
import io.digiservices.ecreditservice.dto.*;
import io.digiservices.ecreditservice.enumeration.StatutDocument;
import io.digiservices.ecreditservice.exception.ApiException;
import io.digiservices.ecreditservice.repository.DocumentCartePrepaidRepository;
import io.digiservices.ecreditservice.repository.EtatDocumentBackofficeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.*;

import static io.digiservices.ecreditservice.query.EtatDocumentBackofficeQuery.*;

@Repository
@RequiredArgsConstructor
@Slf4j
public class EtatDocumentBackofficeRepositoryImpl implements EtatDocumentBackofficeRepository {

    private final NamedParameterJdbcTemplate jdbc;
    private final DocumentCartePrepaidRepository documentRepository;

    @Override
    public Page<EtatDocumentByDelegationDto> findAllByDelegation(Long delegationId, Pageable pageable) {
        try {
            int limit = pageable.isPaged() ? pageable.getPageSize() : Integer.MAX_VALUE;
            long offset = pageable.isPaged() ? pageable.getOffset() : 0;

            MapSqlParameterSource params = new MapSqlParameterSource()
                    .addValue("delegationId", delegationId)
                    .addValue("limit", limit)
                    .addValue("offset", offset);

            List<EtatDocumentByDelegationDto> results = jdbc.query(
                    SELECT_ETATS_BY_DELEGATION,
                    params,
                    this::mapRowToEtatByDelegation
            );

            long total = countByDelegation(delegationId);
            return new PageImpl<>(results, pageable, total);
        } catch (Exception e) {
            log.error("Erreur lors de la récupération des états par délégation: {}", e.getMessage(), e);
            throw new ApiException("Erreur lors de la récupération des états par délégation");
        }
    }

    @Override
    public Page<EtatDocumentByDelegationDto> findAllByDelegationAndStatut(Long delegationId, StatutDocument statut, Pageable pageable) {
        try {
            int limit = pageable.isPaged() ? pageable.getPageSize() : Integer.MAX_VALUE;
            long offset = pageable.isPaged() ? pageable.getOffset() : 0;

            MapSqlParameterSource params = new MapSqlParameterSource()
                    .addValue("delegationId", delegationId)
                    .addValue("statut", statut.name())
                    .addValue("limit", limit)
                    .addValue("offset", offset);

            List<EtatDocumentByDelegationDto> results = jdbc.query(
                    SELECT_ETATS_BY_DELEGATION_AND_STATUT,
                    params,
                    this::mapRowToEtatByDelegation
            );

            long total = countByDelegationAndStatut(delegationId, statut);
            return new PageImpl<>(results, pageable, total);
        } catch (Exception e) {
            log.error("Erreur lors de la récupération des états par délégation et statut: {}", e.getMessage(), e);
            throw new ApiException("Erreur lors de la récupération des états");
        }
    }

    @Override
    public Page<EtatDocumentByDelegationDto> findAllWithDetails(Pageable pageable) {
        try {
            int limit = pageable.isPaged() ? pageable.getPageSize() : Integer.MAX_VALUE;
            long offset = pageable.isPaged() ? pageable.getOffset() : 0;

            MapSqlParameterSource params = new MapSqlParameterSource()
                    .addValue("limit", limit)
                    .addValue("offset", offset);

            List<EtatDocumentByDelegationDto> results = jdbc.query(
                    SELECT_ALL_ETATS_WITH_DETAILS,
                    params,
                    this::mapRowToEtatByDelegation
            );

            Long total = jdbc.queryForObject(COUNT_ALL_ETATS, Map.of(), Long.class);
            return new PageImpl<>(results, pageable, total != null ? total : 0);
        } catch (Exception e) {
            log.error("Erreur lors de la récupération de tous les états: {}", e.getMessage(), e);
            throw new ApiException("Erreur lors de la récupération des états");
        }
    }

    @Override
    public Optional<EtatDocumentDetailDto> findDetailById(Long id) {
        try {
            MapSqlParameterSource params = new MapSqlParameterSource().addValue("id", id);

            EtatDocumentDetailDto result = jdbc.queryForObject(
                    SELECT_ETAT_DETAIL,
                    params,
                    this::mapRowToEtatDetail
            );

            if (result != null) {
                try {
                    Page<DocumentCartePrepaidDto> documents = documentRepository.findByEtatId(id, Pageable.unpaged());
                    result.setDocuments(documents.getContent());
                    result.setDocumentCount(documents.getContent().size());
                } catch (Exception e) {
                    log.warn("Impossible de charger les documents pour l'état {}: {}", id, e.getMessage());
                    result.setDocuments(List.of());
                    result.setDocumentCount(0);
                }
            }

            return Optional.ofNullable(result);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        } catch (Exception e) {
            log.error("Erreur lors de la récupération du détail de l'état: {}", e.getMessage(), e);
            throw new ApiException("Erreur lors de la récupération du détail");
        }
    }

    @Override
    public void updateStatut(Long id, StatutDocument statut) {
        try {
            MapSqlParameterSource params = new MapSqlParameterSource()
                    .addValue("id", id)
                    .addValue("statut", statut.name());

            int updated = jdbc.update(UPDATE_STATUT, params);
            if (updated == 0) {
                throw new ApiException("État du document non trouvé avec l'ID: " + id);
            }
            log.info("Statut mis à jour pour l'état {}: {}", id, statut);
        } catch (ApiException e) {
            throw e;
        } catch (Exception e) {
            log.error("Erreur lors de la mise à jour du statut: {}", e.getMessage(), e);
            throw new ApiException("Erreur lors de la mise à jour du statut");
        }
    }

    @Override
    public void updateStatutWithMotif(Long id, StatutDocument statut, String motif) {
        try {
            MapSqlParameterSource params = new MapSqlParameterSource()
                    .addValue("id", id)
                    .addValue("statut", statut.name())
                    .addValue("motif", motif);

            int updated = jdbc.update(UPDATE_STATUT_WITH_MOTIF, params);
            if (updated == 0) {
                throw new ApiException("État du document non trouvé avec l'ID: " + id);
            }
            log.info("Statut mis à jour avec motif pour l'état {}: {} - {}", id, statut, motif);
        } catch (ApiException e) {
            throw e;
        } catch (Exception e) {
            log.error("Erreur lors de la mise à jour du statut avec motif: {}", e.getMessage(), e);
            throw new ApiException("Erreur lors de la mise à jour du statut");
        }
    }

    @Override
    public void resetToEncours(Long id) {
        try {
            MapSqlParameterSource params = new MapSqlParameterSource().addValue("id", id);

            int updated = jdbc.update(RESET_TO_ENCOURS, params);
            if (updated == 0) {
                throw new ApiException("État du document non trouvé avec l'ID: " + id);
            }
            log.info("État {} remis en cours", id);
        } catch (ApiException e) {
            throw e;
        } catch (Exception e) {
            log.error("Erreur lors de la remise en cours: {}", e.getMessage(), e);
            throw new ApiException("Erreur lors de la remise en cours");
        }
    }

    @Override
    public List<Map<String, Object>> getStatsByDelegation() {
        try {
            return jdbc.query(SELECT_STATS_BY_DELEGATION, (rs, rowNum) -> {
                Map<String, Object> stats = new HashMap<>();
                stats.put("delegationId", rs.getLong("delegation_id"));
                stats.put("delegationLibele", rs.getString("delegation_libele"));
                stats.put("totalEtats", rs.getInt("total_etats"));
                stats.put("encoursCount", rs.getInt("encours_count"));
                stats.put("valideCount", rs.getInt("valide_count"));
                stats.put("accepteCount", rs.getInt("accepte_count"));
                stats.put("rejetCount", rs.getInt("rejet_count"));
                return stats;
            });
        } catch (Exception e) {
            log.error("Erreur lors de la récupération des statistiques: {}", e.getMessage(), e);
            throw new ApiException("Erreur lors de la récupération des statistiques");
        }
    }

    @Override
    public List<DelegationDto> findAllDelegations() {
        try {
            return jdbc.query(SELECT_ALL_DELEGATIONS, (rs, rowNum) ->
                    DelegationDto.builder()
                            .id(rs.getLong("id"))
                            .libele(rs.getString("libele"))
                            .build()
            );
        } catch (Exception e) {
            log.error("Erreur lors de la récupération des délégations: {}", e.getMessage(), e);
            throw new ApiException("Erreur lors de la récupération des délégations");
        }
    }

    @Override
    public long countByDelegation(Long delegationId) {
        try {
            MapSqlParameterSource params = new MapSqlParameterSource().addValue("delegationId", delegationId);
            Long count = jdbc.queryForObject(COUNT_ETATS_BY_DELEGATION, params, Long.class);
            return count != null ? count : 0;
        } catch (Exception e) {
            log.error("Erreur lors du comptage: {}", e.getMessage());
            return 0;
        }
    }

    @Override
    public long countByDelegationAndStatut(Long delegationId, StatutDocument statut) {
        try {
            MapSqlParameterSource params = new MapSqlParameterSource()
                    .addValue("delegationId", delegationId)
                    .addValue("statut", statut.name());
            Long count = jdbc.queryForObject(COUNT_ETATS_BY_DELEGATION_AND_STATUT, params, Long.class);
            return count != null ? count : 0;
        } catch (Exception e) {
            log.error("Erreur lors du comptage: {}", e.getMessage());
            return 0;
        }
    }

    // ==================== MAPPERS ====================

    private EtatDocumentByDelegationDto mapRowToEtatByDelegation(ResultSet rs, int rowNum) throws SQLException {
        return EtatDocumentByDelegationDto.builder()
                .id(rs.getLong("id"))
                .statut(StatutDocument.valueOf(rs.getString("statut")))
                .motif(rs.getString("motif"))  // ← AJOUTÉ
                .createdAt(toZonedDateTime(rs.getTimestamp("created_at")))
                .updatedAt(toZonedDateTime(rs.getTimestamp("updated_at")))
                .userId(rs.getLong("user_id"))
                .userFullName(rs.getString("first_name") + " " + rs.getString("last_name"))
                .userPhone(rs.getString("phone"))
                .delegationId(getLongOrNull(rs, "delegation_id"))
                .delegationLibele(rs.getString("delegation_libele"))
                .agenceId(getLongOrNull(rs, "agence_id"))
                .agenceLibele(rs.getString("agence_libele"))
                .pointVenteId(getLongOrNull(rs, "pointvente_id"))
                .pointVenteLibele(rs.getString("pointvente_libele"))
                .documentCount(rs.getInt("document_count"))
                .build();
    }

    private EtatDocumentDetailDto mapRowToEtatDetail(ResultSet rs, int rowNum) throws SQLException {
        UserInfoDto user = UserInfoDto.builder()
                .userId(rs.getLong("user_id"))
                .firstName(rs.getString("first_name"))
                .lastName(rs.getString("last_name"))
                .phone(rs.getString("phone"))
                .email(rs.getString("email"))
                .imageUrl(rs.getString("image_url"))
                .build();

        DelegationDto delegation = null;
        Long delegationId = getLongOrNull(rs, "delegation_id");
        if (delegationId != null) {
            delegation = DelegationDto.builder()
                    .id(delegationId)
                    .libele(rs.getString("delegation_libele"))
                    .build();
        }

        AgenceDto agence = null;
        Long agenceId = getLongOrNull(rs, "agence_id");
        if (agenceId != null) {
            agence = AgenceDto.builder()
                    .id(agenceId)
                    .libele(rs.getString("agence_libele"))
                    .delegation_id(delegationId)
                    .build();
        }

        PointVenteDto pointVente = null;
        Long pointVenteId = getLongOrNull(rs, "pointvente_id");
        if (pointVenteId != null) {
            pointVente = PointVenteDto.builder()
                    .id(pointVenteId)
                    .libele(rs.getString("pointvente_libele"))
                    .code(rs.getString("pointvente_code"))
                    .delegation_id(delegationId)
                    .agence_id(agenceId)
                    .build();
        }

        return EtatDocumentDetailDto.builder()
                .id(rs.getLong("id"))
                .statut(StatutDocument.valueOf(rs.getString("statut")))
                .motif(rs.getString("motif"))  // ← AJOUTÉ
                .createdAt(toZonedDateTime(rs.getTimestamp("created_at")))
                .updatedAt(toZonedDateTime(rs.getTimestamp("updated_at")))
                .user(user)
                .delegation(delegation)
                .agence(agence)
                .pointVente(pointVente)
                .build();
    }

    private ZonedDateTime toZonedDateTime(Timestamp timestamp) {
        if (timestamp == null) return null;
        return timestamp.toInstant().atZone(ZoneId.systemDefault());
    }

    private Long getLongOrNull(ResultSet rs, String columnName) throws SQLException {
        long value = rs.getLong(columnName);
        return rs.wasNull() ? null : value;
    }
}