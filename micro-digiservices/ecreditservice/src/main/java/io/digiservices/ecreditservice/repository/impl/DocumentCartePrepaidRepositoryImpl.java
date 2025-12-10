package io.digiservices.ecreditservice.repository.impl;

import io.digiservices.ecreditservice.dto.DocumentCartePrepaidDto;
import io.digiservices.ecreditservice.dto.EtatDocumentDto;
import io.digiservices.ecreditservice.enumeration.StatutDocument;
import io.digiservices.ecreditservice.exception.ApiException;
import io.digiservices.ecreditservice.repository.DocumentCartePrepaidRepository;
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
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static io.digiservices.ecreditservice.query.DocumentCartePrepaidQuery.*;

@Repository
@RequiredArgsConstructor
@Slf4j
public class DocumentCartePrepaidRepositoryImpl implements DocumentCartePrepaidRepository {

    private final NamedParameterJdbcTemplate jdbc;

    @Override
    public Long save(DocumentCartePrepaidDto dto) {
        try {
            KeyHolder keyHolder = new GeneratedKeyHolder();
            MapSqlParameterSource params = new MapSqlParameterSource()
                    .addValue("idEtatDoc", dto.getIdEtatDoc())
                    .addValue("doc", dto.getDoc())
                    .addValue("userId", dto.getUserId());

            jdbc.update(INSERT_DOCUMENT, params, keyHolder, new String[]{"id"});

            Number key = keyHolder.getKey();
            if (key == null) {
                throw new ApiException("Erreur lors de la création du document");
            }
            return key.longValue();
        } catch (Exception e) {
            log.error("Erreur lors de la sauvegarde du document: {}", e.getMessage());
            throw new ApiException("Erreur lors de la sauvegarde du document: " + e.getMessage());
        }
    }

    @Override
    public Optional<DocumentCartePrepaidDto> findById(Long id) {
        try {
            MapSqlParameterSource params = new MapSqlParameterSource().addValue("id", id);
            DocumentCartePrepaidDto result = jdbc.queryForObject(SELECT_BY_ID, params, this::mapRowToDto);
            return Optional.ofNullable(result);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        } catch (Exception e) {
            log.error("Erreur lors de la récupération du document par ID: {}", e.getMessage());
            throw new ApiException("Erreur lors de la récupération du document");
        }
    }

    @Override
    public List<Long> saveAll(List<DocumentCartePrepaidDto> documents) {
        List<Long> ids = new ArrayList<>();
        for (DocumentCartePrepaidDto doc : documents) {
            ids.add(save(doc));
        }
        return ids;
    }

    @Override
    public void deleteById(Long id) {
        try {
            MapSqlParameterSource params = new MapSqlParameterSource().addValue("id", id);
            int deleted = jdbc.update(DELETE_BY_ID, params);
            if (deleted == 0) {
                throw new ApiException("Document non trouvé avec l'ID: " + id);
            }
            log.info("Document supprimé avec succès: {}", id);
        } catch (ApiException e) {
            throw e;
        } catch (Exception e) {
            log.error("Erreur lors de la suppression du document: {}", e.getMessage(), e);
            throw new ApiException("Erreur lors de la suppression du document");
        }
    }

    @Override
    public Page<DocumentCartePrepaidDto> findAll(Pageable pageable) {
        try {
            int limit = pageable.isPaged() ? pageable.getPageSize() : Integer.MAX_VALUE;
            long offset = pageable.isPaged() ? pageable.getOffset() : 0;

            MapSqlParameterSource params = new MapSqlParameterSource()
                    .addValue("limit", limit)
                    .addValue("offset", offset);

            List<DocumentCartePrepaidDto> results = jdbc.query(SELECT_ALL, params, this::mapRowToDto);

            Long total = jdbc.queryForObject(COUNT_ALL, Map.of(), Long.class);

            return new PageImpl<>(results, pageable, total != null ? total : 0);
        } catch (Exception e) {
            log.error("Erreur lors de la récupération de tous les documents: {}", e.getMessage(), e);
            throw new ApiException("Erreur lors de la récupération des documents");
        }
    }


    @Override
    public Page<DocumentCartePrepaidDto> findByUserId(Long userId, Pageable pageable) {
        try {
            int limit = pageable.isPaged() ? pageable.getPageSize() : Integer.MAX_VALUE;
            long offset = pageable.isPaged() ? pageable.getOffset() : 0;

            MapSqlParameterSource params = new MapSqlParameterSource()
                    .addValue("userId", userId)
                    .addValue("limit", limit)
                    .addValue("offset", offset);

            List<DocumentCartePrepaidDto> results = jdbc.query(SELECT_BY_USER_ID, params, this::mapRowToDto);

            Long total = jdbc.queryForObject(COUNT_BY_USER_ID,
                    new MapSqlParameterSource().addValue("userId", userId),
                    Long.class);

            return new PageImpl<>(results, pageable, total != null ? total : 0);
        } catch (Exception e) {
            log.error("Erreur lors de la récupération des documents par utilisateur: {}", e.getMessage(), e);
            throw new ApiException("Erreur lors de la récupération des documents");
        }
    }

    @Override
    public Page<DocumentCartePrepaidDto> findByEtatId(Long idEtatDoc, Pageable pageable) {
        try {
            log.debug("Recherche des documents pour l'état: {}", idEtatDoc);

            // Gérer le cas de Pageable.unpaged()
            int limit = pageable.isPaged() ? pageable.getPageSize() : Integer.MAX_VALUE;
            long offset = pageable.isPaged() ? pageable.getOffset() : 0;

            MapSqlParameterSource params = new MapSqlParameterSource()
                    .addValue("idEtatDoc", idEtatDoc)
                    .addValue("limit", limit)
                    .addValue("offset", offset);

            List<DocumentCartePrepaidDto> results = jdbc.query(SELECT_BY_ETAT_ID, params, this::mapRowToDto);

            // Compter le total
            Long total = jdbc.queryForObject(COUNT_BY_ETAT_ID,
                    new MapSqlParameterSource().addValue("idEtatDoc", idEtatDoc),
                    Long.class);

            log.debug("Trouvé {} documents pour l'état {}", results.size(), idEtatDoc);
            return new PageImpl<>(results, pageable, total != null ? total : 0);
        } catch (Exception e) {
            log.error("Erreur lors de la récupération des documents par état: {}", e.getMessage(), e);
            throw new ApiException("Erreur lors de la récupération des documents");
        }
    }

    @Override
    public long count() {
        return jdbc.queryForObject(COUNT_ALL_DOCUMENTS, Map.of(), Long.class);
    }

    @Override
    public long countByUserId(Long userId) {
        MapSqlParameterSource params = new MapSqlParameterSource().addValue("userId", userId);
        return jdbc.queryForObject(COUNT_DOCUMENTS_BY_USER, params, Long.class);
    }

    @Override
    public long countByEtatId(Long idEtatDoc) {
        MapSqlParameterSource params = new MapSqlParameterSource().addValue("idEtatDoc", idEtatDoc);
        return jdbc.queryForObject(COUNT_DOCUMENTS_BY_ETAT, params, Long.class);
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

    private DocumentCartePrepaidDto mapRowToDto(ResultSet rs, int rowNum) throws SQLException {
        return DocumentCartePrepaidDto.builder()
                .id(rs.getLong("id"))
                .idEtatDoc(rs.getLong("id_etat_doc"))
                .doc(rs.getString("doc"))
                .userId(rs.getLong("user_id"))
                .createdAt(toZonedDateTime(rs.getTimestamp("created_at")))
                .updatedAt(toZonedDateTime(rs.getTimestamp("updated_at")))
                .build();
    }

    private ZonedDateTime toZonedDateTime(Timestamp timestamp) {
        if (timestamp == null) return null;
        return timestamp.toInstant().atZone(ZoneId.systemDefault());
    }
}