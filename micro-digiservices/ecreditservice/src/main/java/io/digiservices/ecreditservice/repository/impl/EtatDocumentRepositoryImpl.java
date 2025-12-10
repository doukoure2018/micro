package io.digiservices.ecreditservice.repository.impl;

import io.digiservices.ecreditservice.dto.EtatDocumentDto;
import io.digiservices.ecreditservice.enumeration.StatutDocument;
import io.digiservices.ecreditservice.exception.ApiException;
import io.digiservices.ecreditservice.repository.EtatDocumentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static io.digiservices.ecreditservice.query.DocumentCartePrepaidQuery.COUNT_ALL;
import static io.digiservices.ecreditservice.query.EtatDocumentQuery.*;

@Repository
@RequiredArgsConstructor
@Slf4j
public class EtatDocumentRepositoryImpl implements EtatDocumentRepository {

    private final NamedParameterJdbcTemplate jdbc;

    @Override
    public Long save(EtatDocumentDto dto) {
        try {
            KeyHolder keyHolder = new GeneratedKeyHolder();
            MapSqlParameterSource params = new MapSqlParameterSource()
                    .addValue("statut", dto.getStatut().name())
                    .addValue("userId", dto.getUserId())
                    .addValue("motif", dto.getMotif());

            jdbc.update(INSERT_ETAT, params, keyHolder, new String[]{"id"});

            Number key = keyHolder.getKey();
            if (key == null) {
                throw new ApiException("Erreur lors de la création de l'état");
            }
            return key.longValue();
        } catch (Exception e) {
            log.error("Erreur lors de la sauvegarde de l'état: {}", e.getMessage());
            throw new ApiException("Erreur lors de la sauvegarde de l'état: " + e.getMessage());
        }
    }

    @Override
    public Optional<EtatDocumentDto> findById(Long id) {
        try {
            MapSqlParameterSource params = new MapSqlParameterSource().addValue("id", id);
            EtatDocumentDto result = jdbc.queryForObject(SELECT_BY_ID, params, this::mapRowToDto);
            return Optional.ofNullable(result);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        } catch (Exception e) {
            log.error("Erreur lors de la récupération de l'état: {}", e.getMessage());
            throw new ApiException("Erreur lors de la récupération de l'état");
        }
    }

    @Override
    public Page<EtatDocumentDto> findAllByDate(Pageable pageable) {
        try {
            int limit = pageable.isPaged() ? pageable.getPageSize() : Integer.MAX_VALUE;
            long offset = pageable.isPaged() ? pageable.getOffset() : 0;

            MapSqlParameterSource params = new MapSqlParameterSource()
                    .addValue("limit", limit)
                    .addValue("offset", offset);

            List<EtatDocumentDto> results = jdbc.query(SELECT_ALL_BY_DATE, params, this::mapRowToDto);
            Long total = jdbc.queryForObject(COUNT_ALL, Map.of(), Long.class);

            return new PageImpl<>(results, pageable, total != null ? total : 0);
        } catch (Exception e) {
            log.error("Erreur lors de la récupération des états: {}", e.getMessage());
            throw new ApiException("Erreur lors de la récupération des états");
        }
    }

    @Override
    public Page<EtatDocumentDto> findByUserId(Long userId, Pageable pageable) {
        try {
            int limit = pageable.isPaged() ? pageable.getPageSize() : Integer.MAX_VALUE;
            long offset = pageable.isPaged() ? pageable.getOffset() : 0;

            MapSqlParameterSource params = new MapSqlParameterSource()
                    .addValue("userId", userId)
                    .addValue("limit", limit)
                    .addValue("offset", offset);

            List<EtatDocumentDto> results = jdbc.query(SELECT_BY_USER_ID, params, this::mapRowToDto);
            Long total = jdbc.queryForObject(COUNT_BY_USER_ID,
                    new MapSqlParameterSource().addValue("userId", userId),
                    Long.class);

            return new PageImpl<>(results, pageable, total != null ? total : 0);
        } catch (Exception e) {
            log.error("Erreur lors de la récupération des états par utilisateur: {}", e.getMessage());
            throw new ApiException("Erreur lors de la récupération des états");
        }
    }

    @Override
    public long count() {
        return 0;
    }

    @Override
    public long countByUserId(Long userId) {
        return 0;
    }

    @Override
    public void updateStatut(Long id, StatutDocument statut) {
        try {
            MapSqlParameterSource params = new MapSqlParameterSource()
                    .addValue("id", id)
                    .addValue("statut", statut.name());

            int updated = jdbc.update(UPDATE_STATUT, params);
            if (updated == 0) {
                throw new ApiException("État non trouvé avec l'ID: " + id);
            }
            log.info("Statut mis à jour pour l'état {}: {}", id, statut);
        } catch (ApiException e) {
            throw e;
        } catch (Exception e) {
            log.error("Erreur lors de la mise à jour du statut: {}", e.getMessage());
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
                throw new ApiException("État non trouvé avec l'ID: " + id);
            }
            log.info("Statut mis à jour avec motif pour l'état {}: {} - {}", id, statut, motif);
        } catch (ApiException e) {
            throw e;
        } catch (Exception e) {
            log.error("Erreur lors de la mise à jour du statut avec motif: {}", e.getMessage());
            throw new ApiException("Erreur lors de la mise à jour du statut");
        }
    }

    @Override
    public void resetToEncours(Long id) {
        try {
            MapSqlParameterSource params = new MapSqlParameterSource().addValue("id", id);

            int updated = jdbc.update(RESET_TO_ENCOURS, params);
            if (updated == 0) {
                throw new ApiException("État non trouvé avec l'ID: " + id);
            }
            log.info("État {} remis en cours", id);
        } catch (ApiException e) {
            throw e;
        } catch (Exception e) {
            log.error("Erreur lors de la remise en cours: {}", e.getMessage());
            throw new ApiException("Erreur lors de la remise en cours");
        }
    }

    @Override
    public boolean existsById(Long id) {
        try {
            MapSqlParameterSource params = new MapSqlParameterSource().addValue("id", id);
            Boolean exists = jdbc.queryForObject(EXISTS_BY_ID, params, Boolean.class);
            return exists != null && exists;
        } catch (Exception e) {
            log.error("Erreur lors de la vérification d'existence: {}", e.getMessage());
            return false;
        }
    }

    // ==================== MAPPER ====================

    private EtatDocumentDto mapRowToDto(ResultSet rs, int rowNum) throws SQLException {
        return EtatDocumentDto.builder()
                .id(rs.getLong("id"))
                .statut(StatutDocument.valueOf(rs.getString("statut")))
                .userId(rs.getLong("user_id"))
                .motif(rs.getString("motif"))
                .createdAt(toZonedDateTime(rs.getTimestamp("created_at")))
                .updatedAt(toZonedDateTime(rs.getTimestamp("updated_at")))
                .build();
    }

    private ZonedDateTime toZonedDateTime(Timestamp timestamp) {
        if (timestamp == null) return null;
        return timestamp.toInstant().atZone(ZoneId.systemDefault());
    }
}