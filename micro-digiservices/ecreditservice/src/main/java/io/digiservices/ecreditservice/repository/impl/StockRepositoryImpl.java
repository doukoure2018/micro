package io.digiservices.ecreditservice.repository.impl;

import io.digiservices.ecreditservice.dto.*;
import io.digiservices.ecreditservice.query.StockQuery;
import io.digiservices.ecreditservice.repository.StockRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.common.errors.ResourceNotFoundException;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.*;

import static io.digiservices.ecreditservice.query.StockQuery.*;

@Repository
@RequiredArgsConstructor
@Slf4j
public class StockRepositoryImpl  implements StockRepository {

    private final NamedParameterJdbcTemplate jdbcTemplate;
    private final JdbcClient jdbcClient;

    @Override
    public Long addStock(CreateStockDto stockDto, String numeroCommande) {
        try {
            MapSqlParameterSource params = new MapSqlParameterSource()
                    .addValue("idUser", stockDto.getIdUser())
                    .addValue("service", stockDto.getService())
                    .addValue("detailBonCommande", stockDto.getDetailBonCommande())
                    .addValue("pointventeId", stockDto.getPointventeId())
                    .addValue("agenceId", stockDto.getAgenceId())
                    .addValue("delegationId", stockDto.getDelegationId())
                    .addValue("categorieId", stockDto.getCategorieId())
                    .addValue("observations", stockDto.getObservations())
                    .addValue("numeroCommande", numeroCommande)
                    .addValue("qte", stockDto.getQte());

            KeyHolder keyHolder = new GeneratedKeyHolder();
            jdbcTemplate.update(StockQuery.ADD_STOCK_QUERY, params, keyHolder, new String[]{"id_cmd"});

            Long idCmd = keyHolder.getKey() != null ? keyHolder.getKey().longValue() : null;
            log.info("Bon de commande créé avec succès. ID: {}", idCmd);
            return idCmd;
        } catch (Exception e) {
            log.error("Erreur lors de la création du bon de commande: {}", e.getMessage());
            throw new RuntimeException("Erreur lors de la création du bon de commande", e);
        }
    }

    @Override
    public boolean updateStock(Long idCmd, UpdateStockDto stockDto) {
        try {
            MapSqlParameterSource params = new MapSqlParameterSource()
                    .addValue("idCmd", idCmd)
                    .addValue("service", stockDto.getService())
                    .addValue("detailBonCommande", stockDto.getDetailBonCommande())
                    .addValue("pointventeId", stockDto.getPointventeId())
                    .addValue("agenceId", stockDto.getAgenceId())
                    .addValue("delegationId", stockDto.getDelegationId())
                    .addValue("categorieId", stockDto.getCategorieId())
                    .addValue("observations", stockDto.getObservations());

            int updated = jdbcTemplate.update(StockQuery.UPDATE_STOCK_QUERY, params);
            log.info("Bon de commande {} mis à jour: {}", idCmd, updated > 0);
            return updated > 0;
        } catch (Exception e) {
            log.error("Erreur lors de la mise à jour du bon de commande {}: {}", idCmd, e.getMessage());
            return false;
        }
    }

    @Override
    public boolean updateStatus(Long idCmd, UpdateStatusDto statusDto) {
        try {
            MapSqlParameterSource params = new MapSqlParameterSource()
                    .addValue("idCmd", idCmd)
                    .addValue("status", statusDto.getStatus())
                    .addValue("motif", statusDto.getMotif())
                    .addValue("observations", statusDto.getObservations())
                    .addValue("traitePar", statusDto.getTraitePar());

            int updated = jdbcTemplate.update(StockQuery.UPDATE_STATUS_QUERY, params);
            log.info("Statut du bon de commande {} mis à jour: {}", idCmd, updated > 0);
            return updated > 0;
        } catch (Exception e) {
            log.error("Erreur lors de la mise à jour du statut {}: {}", idCmd, e.getMessage());
            return false;
        }
    }

    @Override
    public List<StockResponseDto> getAllStockEncours() {
        try {
            return jdbcTemplate.query(
                    StockQuery.GET_ALL_STOCK_ENCOURS_QUERY,
                    new MapSqlParameterSource(),
                    (rs, rowNum) -> mapRowToStockResponse(rs)
            );
        } catch (Exception e) {
            log.error("Erreur lors de la récupération des bons en cours: {}", e.getMessage());
            return new ArrayList<>();
        }
    }

    @Override
    public List<StockResponseDto> getAllStock(int page, int size) {
        try {
            MapSqlParameterSource params = new MapSqlParameterSource()
                    .addValue("limit", size)
                    .addValue("offset", page * size);

            return jdbcTemplate.query(
                    StockQuery.GET_ALL_STOCK_QUERY,
                    params,
                    (rs, rowNum) -> mapRowToStockResponse(rs)
            );
        } catch (Exception e) {
            log.error("Erreur lors de la récupération des bons: {}", e.getMessage());
            return new ArrayList<>();
        }
    }

    @Override
    public Optional<StockResponseDto> getStockById(Long idCmd) {
        try {
            MapSqlParameterSource params = new MapSqlParameterSource()
                    .addValue("idCmd", idCmd);

            List<StockResponseDto> results = jdbcTemplate.query(
                    StockQuery.GET_STOCK_BY_ID_QUERY,
                    params,
                    (rs, rowNum) -> mapRowToStockResponse(rs)
            );

            return results.isEmpty() ? Optional.empty() : Optional.of(results.get(0));
        } catch (Exception e) {
            log.error("Erreur lors de la récupération du bon {}: {}", idCmd, e.getMessage());
            return Optional.empty();
        }
    }

    @Override
    public List<StockResponseDto> getStockByUser(Long userId) {
        try {
            MapSqlParameterSource params = new MapSqlParameterSource()
                    .addValue("userId", userId);

            return jdbcTemplate.query(
                    StockQuery.GET_STOCK_BY_USER_QUERY,
                    params,
                    (rs, rowNum) -> mapRowToStockResponse(rs)
            );
        } catch (Exception e) {
            log.error("Erreur lors de la récupération des bons de l'utilisateur {}: {}", userId, e.getMessage());
            return new ArrayList<>();
        }
    }

    @Override
    public String generateNumeroCommande() {
        try {
            // Récupérer le dernier numéro utilisé aujourd'hui
            String query = """
            SELECT 'CMD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || 
                   LPAD((
                       SELECT COALESCE(MAX(CAST(
                           SUBSTRING(numero_commande FROM '[0-9]+$') AS INTEGER
                       )), 0) + 1
                       FROM bon_commande
                       WHERE numero_commande LIKE 'CMD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-%'
                   )::TEXT, 6, '0') as numero
        """;

            return jdbcTemplate.queryForObject(query, new MapSqlParameterSource(), String.class);

        } catch (Exception e) {
            log.error("Erreur génération numéro: {}", e.getMessage());
            // Fallback avec UUID pour garantir l'unicité
            return "CMD-" + System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        }
    }

    @Override
    public Map<String, Long> countByStatus() {
        return null;
    }

    @Override
    public List<StockResponseDto> getAllStockEncoursByDelegation(Long delegationId) {
        try {
            MapSqlParameterSource params = new MapSqlParameterSource()
                    .addValue("delegationId", delegationId);

            return jdbcTemplate.query(
                    StockQuery.GET_STOCK_ENCOURS_BY_DELEGATION_QUERY,
                    params, // Passer les paramètres
                    (rs, rowNum) -> mapRowToStockResponse(rs)
            );
        } catch (Exception e) {
            log.error("Erreur lors de la récupération des bons par délégation {}: {}", delegationId, e.getMessage());
            return new ArrayList<>();
        }
    }

    @Override
    public List<CategorieStockDto> listCategorieStock() {
        try {
            return jdbcClient.sql(GET_ALL_CATEGORIE_STOCK).query(CategorieStockDto.class).list();
        } catch (Exception e) {
            log.error("Erreur lors de la récupération des bons en cours: {}", e.getMessage());
            return new ArrayList<>();
        }
    }

    @Override
    public void updateStockStateValidation(UpdateStatusDto stockStatut, Long idCmd) {
        Map<String, Object> params = new HashMap<>();
        params.put("idCmd", idCmd);
        params.put("stateValidation", stockStatut.getStateValidation());
        params.put("motif", stockStatut.getMotif());
        params.put("observations", stockStatut.getObservations());
        params.put("traitePar", stockStatut.getTraitePar());

        int rowsAffected = jdbcTemplate.update(
                StockQuery.UPDATE_STOCK_STATE_VALIDATION,
                params
        );

        if (rowsAffected == 0) {
            throw new ResourceNotFoundException(
                    "Aucun bon de commande trouvé avec l'ID " + idCmd + " et le statut ENCOURS"
            );
        }

        log.info("Mise à jour effectuée pour le bon de commande {}", idCmd);
    }

    @Override
    public List<SyntheseDelegationDto> listBonParDelegation() {
        try {
            return jdbcClient.sql(GET_SYNTHESE_BONS_COMMANDE_DELEGATIONS)
                    .query(SyntheseDelegationDto.class)
                    .list();
        } catch (Exception e) {
            log.error("Erreur lors de la récupération de la synthèse par délégation: {}", e.getMessage());
            return new ArrayList<>();
        }
    }

    @Override
    public List<BonCommandeDelegationDto> getBonsCommandeParDelegation(String delegation) {
        try {
            return jdbcClient.sql(GET_BONS_COMMANDE_PAR_DELEGATION)
                    .param("delegation", delegation)
                    .query(BonCommandeDelegationDto.class)
                    .list();
        } catch (Exception e) {
            log.error("Erreur lors de la récupération des bons de commande pour la délégation {}: {}",
                    delegation, e.getMessage());
            return new ArrayList<>();
        }
    }

    @Override
    public List<BonCommandeDelegationDto> getTousBonsCommandeValides() {
        try {
            return jdbcClient.sql(GET_TOUS_BONS_COMMANDE_VALIDES)
                    .query(BonCommandeDelegationDto.class)
                    .list();
        } catch (Exception e) {
            log.error("Erreur lors de la récupération de tous les bons de commande validés: {}", e.getMessage());
            return new ArrayList<>();
        }
    }

    // Méthode alternative si vous voulez utiliser UPDATE_STATUS_QUERY existant
    public void updateStockStatut(UpdateStatusDto stockStatut, Long idCmd) {
        Map<String, Object> params = new HashMap<>();
        params.put("idCmd", idCmd);
        params.put("status", stockStatut.getStatus());
        params.put("motif", stockStatut.getMotif());
        params.put("observations", stockStatut.getObservations());
        params.put("traitePar", stockStatut.getTraitePar());

        jdbcTemplate.update(StockQuery.UPDATE_STATUS_QUERY, params);
    }

    private StockResponseDto mapRowToStockResponse(ResultSet rs) throws SQLException {
        return StockResponseDto.builder()
                .idCmd(rs.getLong("id_cmd"))
                .numeroCommande(rs.getString("numero_commande"))
                .idUser(rs.getLong("id_user"))
                .service(rs.getString("service"))
                .detailBonCommande(rs.getString("detail_bon_commande"))
                .dateCreation(rs.getTimestamp("date_creation").toLocalDateTime())
                .status(rs.getString("status"))
                .motif(rs.getString("motif"))
                .traitePar(rs.getObject("traite_par", Long.class))
                .observations(rs.getString("observations"))
                .dateTraitement(rs.getTimestamp("date_traitement") != null ?
                        rs.getTimestamp("date_traitement").toLocalDateTime() : null)
                .pointventeId(rs.getObject("pointvente_id", Long.class))
                .pointventeLibele(rs.getString("pointvente_libele"))
                .agenceId(rs.getObject("agence_id", Long.class))
                .agenceLibele(rs.getString("agence_libele"))
                .delegationId(rs.getObject("delegation_id", Long.class))
                .delegationLibele(rs.getString("delegation_libele"))
                .categorieId(rs.getObject("categorie_id", Long.class))
                .categorieLibele(rs.getString("categorie_libele"))
                .username(rs.getString("username"))
                .userFullName(rs.getString("user_full_name"))
                .stateValidation(rs.getString("validation"))
                .qte(rs.getInt("qte"))
                .build();
    }

}
