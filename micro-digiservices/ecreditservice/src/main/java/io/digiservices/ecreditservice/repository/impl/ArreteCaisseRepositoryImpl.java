package io.digiservices.ecreditservice.repository.impl;


import io.digiservices.ecreditservice.dto.ArreteCaisseDto;
import io.digiservices.ecreditservice.query.ArreteCaisseQuery;
import io.digiservices.ecreditservice.repository.ArreteCaisseRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Repository
@RequiredArgsConstructor
@Slf4j
public class ArreteCaisseRepositoryImpl implements ArreteCaisseRepository {

    private final JdbcClient jdbcClient;

    private static final RowMapper<ArreteCaisseDto> ROW_MAPPER = (rs, rowNum) ->
            ArreteCaisseDto.builder()
                    .id(rs.getLong("id"))
                    .idUser(rs.getLong("id_user"))
                    .montant(rs.getBigDecimal("montant"))
                    .statut(rs.getString("statut"))
                    .dateArreteCaisse(rs.getDate("date_arrete_caisse") != null ? rs.getDate("date_arrete_caisse").toLocalDate() : null)
                    .dateRemonte(rs.getTimestamp("date_remonte") != null ? rs.getTimestamp("date_remonte").toLocalDateTime() : null)
                    .document(rs.getString("document"))
                    .delegationId(rs.getObject("delegation_id") != null ? rs.getLong("delegation_id") : null)
                    .agenceId(rs.getObject("agence_id") != null ? rs.getLong("agence_id") : null)
                    .pointventeId(rs.getObject("pointvente_id") != null ? rs.getLong("pointvente_id") : null)
                    .createdAt(rs.getTimestamp("created_at") != null ? rs.getTimestamp("created_at").toLocalDateTime() : null)
                    .updatedAt(rs.getTimestamp("updated_at") != null ? rs.getTimestamp("updated_at").toLocalDateTime() : null)
                    .nomUser(rs.getString("nom_user"))
                    .prenomUser(rs.getString("prenom_user"))
                    .delegationNom(rs.getString("delegation_nom"))
                    .agenceNom(rs.getString("agence_nom"))
                    .pointventeNom(rs.getString("pointvente_nom"))
                    .build();

    @Override
    public List<ArreteCaisseDto> findAll() {
        return jdbcClient.sql(ArreteCaisseQuery.SELECT_ALL_ARRETE_CAISSE)
                .query(ROW_MAPPER).list();
    }

    @Override
    public Optional<ArreteCaisseDto> findById(Long id) {
        return jdbcClient.sql(ArreteCaisseQuery.SELECT_ARRETE_CAISSE_BY_ID)
                .param("id", id)
                .query(ROW_MAPPER).optional();
    }

    @Override
    public List<ArreteCaisseDto> findByUserId(Long idUser) {
        return jdbcClient.sql(ArreteCaisseQuery.SELECT_ARRETE_CAISSE_BY_USER)
                .param("idUser", idUser)
                .query(ROW_MAPPER).list();
    }

    @Override
    public List<ArreteCaisseDto> findByStatut(String statut) {
        return jdbcClient.sql(ArreteCaisseQuery.SELECT_ARRETE_CAISSE_BY_STATUT)
                .param("statut", statut)
                .query(ROW_MAPPER).list();
    }

    @Override
    public List<ArreteCaisseDto> findByDelegationId(Long delegationId) {
        return jdbcClient.sql(ArreteCaisseQuery.SELECT_ARRETE_CAISSE_BY_DELEGATION)
                .param("delegationId", delegationId)
                .query(ROW_MAPPER).list();
    }

    @Override
    public List<ArreteCaisseDto> findByAgenceId(Long agenceId) {
        return jdbcClient.sql(ArreteCaisseQuery.SELECT_ARRETE_CAISSE_BY_AGENCE)
                .param("agenceId", agenceId)
                .query(ROW_MAPPER).list();
    }

    @Override
    public List<ArreteCaisseDto> findByPeriod(LocalDate dateDebut, LocalDate dateFin) {
        return jdbcClient.sql(ArreteCaisseQuery.SELECT_ARRETE_CAISSE_BY_PERIOD)
                .param("dateDebut", dateDebut)
                .param("dateFin", dateFin)
                .query(ROW_MAPPER).list();
    }

    @Override
    @Transactional
    public Long create(Long idUser, BigDecimal montant, LocalDate dateArreteCaisse,
                       Long delegationId, Long agenceId, Long pointventeId) {
        return jdbcClient.sql(ArreteCaisseQuery.INSERT_ARRETE_CAISSE)
                .param("idUser", idUser)
                .param("montant", montant)
                .param("dateArreteCaisse", dateArreteCaisse)
                .param("delegationId", delegationId)
                .param("agenceId", agenceId)
                .param("pointventeId", pointventeId)
                .query(Long.class).single();
    }

    @Override
    @Transactional
    public Long createWithDocument(Long idUser, BigDecimal montant, LocalDate dateArreteCaisse,
                                   String document, Long delegationId, Long agenceId, Long pointventeId) {
        return jdbcClient.sql(ArreteCaisseQuery.INSERT_ARRETE_CAISSE_WITH_DOCUMENT)
                .param("idUser", idUser)
                .param("montant", montant)
                .param("dateArreteCaisse", dateArreteCaisse)
                .param("document", document)
                .param("delegationId", delegationId)
                .param("agenceId", agenceId)
                .param("pointventeId", pointventeId)
                .query(Long.class).single();
    }

    @Override
    @Transactional
    public int updateDocument(Long id, Long idUser, String document) {
        return jdbcClient.sql(ArreteCaisseQuery.UPDATE_ARRETE_CAISSE_DOCUMENT)
                .param("id", id)
                .param("idUser", idUser)
                .param("document", document)
                .update();
    }

    @Override
    @Transactional
    public int update(Long id, Long idUser, BigDecimal montant, LocalDate dateArreteCaisse) {
        return jdbcClient.sql(ArreteCaisseQuery.UPDATE_ARRETE_CAISSE)
                .param("id", id)
                .param("idUser", idUser)
                .param("montant", montant)
                .param("dateArreteCaisse", dateArreteCaisse)
                .update();
    }

    @Override
    @Transactional
    public int delete(Long id, Long idUser) {
        return jdbcClient.sql(ArreteCaisseQuery.DELETE_ARRETE_CAISSE)
                .param("id", id)
                .param("idUser", idUser)
                .update();
    }

    @Override
    @Transactional
    public int deleteAdmin(Long id) {
        return jdbcClient.sql(ArreteCaisseQuery.DELETE_ARRETE_CAISSE_ADMIN)
                .param("id", id)
                .update();
    }

    @Override
    public Map<String, Map<String, Object>> countByStatut() {
        return jdbcClient.sql(ArreteCaisseQuery.COUNT_ARRETE_CAISSE_BY_STATUT)
                .query((rs, rowNum) -> {
                    Map<String, Object> stats = new HashMap<>();
                    stats.put("count", rs.getLong("count"));
                    stats.put("total", rs.getBigDecimal("total"));
                    return Map.entry(rs.getString("statut"), stats);
                })
                .list()
                .stream()
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
    }

    @Override
    public Map<String, Map<String, Object>> countByUser(Long idUser) {
        return jdbcClient.sql(ArreteCaisseQuery.COUNT_ARRETE_CAISSE_BY_USER)
                .param("idUser", idUser)
                .query((rs, rowNum) -> {
                    Map<String, Object> stats = new HashMap<>();
                    stats.put("count", rs.getLong("count"));
                    stats.put("total", rs.getBigDecimal("total"));
                    return Map.entry(rs.getString("statut"), stats);
                })
                .list()
                .stream()
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
    }

    @Override
    public List<ArreteCaisseDto> findLatestByPointvente() {
        return jdbcClient.sql(ArreteCaisseQuery.SELECT_LATEST_BY_POINTVENTE)
                .query(ArreteCaisseDto.class)
                .list();
    }

    @Override
    public List<ArreteCaisseDto> findAllForSuivi() {
        return jdbcClient.sql(ArreteCaisseQuery.SELECT_ALL_FOR_SUIVI)
                .query(ArreteCaisseDto.class)
                .list();
    }
}
