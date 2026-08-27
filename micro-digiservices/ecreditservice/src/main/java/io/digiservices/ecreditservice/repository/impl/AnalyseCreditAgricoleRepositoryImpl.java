package io.digiservices.ecreditservice.repository.impl;

import io.digiservices.ecreditservice.dto.AnalyseCreditAgricoleDto;
import io.digiservices.ecreditservice.exception.ApiException;
import io.digiservices.ecreditservice.query.AnalyseCreditAgricoleQuery;
import io.digiservices.ecreditservice.repository.AnalyseCreditAgricoleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
@Slf4j
public class AnalyseCreditAgricoleRepositoryImpl implements AnalyseCreditAgricoleRepository {

    private final JdbcClient jdbcClient;

    @Override
    public Optional<AnalyseCreditAgricoleDto> findByDemandeId(Long demandeId) {
        return jdbcClient.sql(AnalyseCreditAgricoleQuery.SELECT_ANALYSE_AGRICOLE_BY_DEMANDE)
                .param("demandeId", demandeId)
                .query((rs, rowNum) -> mapRow(rs))
                .optional();
    }

    @Override
    public AnalyseCreditAgricoleDto upsert(Long demandeId, AnalyseCreditAgricoleDto dto, String analysePar) {
        try {
            Map<String, Object> params = new HashMap<>();
            params.put("demandeId", demandeId);
            params.put("fraisLabour", nvl(dto.getFraisLabour()));
            params.put("fraisCloture", nvl(dto.getFraisCloture()));
            params.put("achatIntrant", nvl(dto.getAchatIntrant()));
            params.put("achatPhytosanitaire", nvl(dto.getAchatPhytosanitaire()));
            params.put("achatOutillage", nvl(dto.getAchatOutillage()));
            params.put("fraisEntretien", nvl(dto.getFraisEntretien()));
            params.put("fraisSemis", nvl(dto.getFraisSemis()));
            params.put("fraisRecolte", nvl(dto.getFraisRecolte()));
            params.put("transport", nvl(dto.getTransport()));
            params.put("stockage", nvl(dto.getStockage()));
            params.put("fraisConservation", nvl(dto.getFraisConservation()));
            params.put("chargesFamiliales", nvl(dto.getChargesFamiliales()));
            params.put("quantiteRecolte", nvl(dto.getQuantiteRecolte()));
            params.put("prixVenteUnitaire", nvl(dto.getPrixVenteUnitaire()));
            params.put("autresProduits", nvl(dto.getAutresProduits()));
            params.put("totalCharges", dto.getTotalCharges());
            params.put("totalProduits", dto.getTotalProduits());
            params.put("totalEcheances", dto.getTotalEcheances());
            params.put("margeNette", dto.getMargeNette());
            params.put("verdict", dto.getVerdict());
            params.put("analysePar", analysePar);

            return jdbcClient.sql(AnalyseCreditAgricoleQuery.UPSERT_ANALYSE_AGRICOLE)
                    .params(params)
                    .query((rs, rowNum) -> mapRow(rs))
                    .single();
        } catch (Exception e) {
            log.error("Erreur lors de l'enregistrement de l'analyse agricole (demande {}): {}",
                    demandeId, e.getMessage(), e);
            throw new ApiException("Erreur lors de l'enregistrement de l'analyse agricole");
        }
    }

    @Override
    public ContexteAgricole getContexte(Long demandeId) {
        try {
            return jdbcClient.sql(AnalyseCreditAgricoleQuery.SELECT_CONTEXTE_AGRICOLE)
                    .param("demandeId", demandeId)
                    .query((rs, rowNum) -> new ContexteAgricole(
                            rs.getLong("demandeindividuel_id"),
                            rs.getString("nature_client"),
                            rs.getString("validation_state"),
                            rs.getString("type_groupe"),
                            rs.getBigDecimal("montant_demande"),
                            (Integer) rs.getObject("nombre_echeance"),
                            rs.getBigDecimal("taux_interet")))
                    .single();
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    private static AnalyseCreditAgricoleDto mapRow(ResultSet rs) throws SQLException {
        return AnalyseCreditAgricoleDto.builder()
                .analyseAgricoleId(rs.getLong("analyse_agricole_id"))
                .demandeindividuelId(rs.getLong("demandeindividuel_id"))
                .fraisLabour(rs.getBigDecimal("frais_labour"))
                .fraisCloture(rs.getBigDecimal("frais_cloture"))
                .achatIntrant(rs.getBigDecimal("achat_intrant"))
                .achatPhytosanitaire(rs.getBigDecimal("achat_phytosanitaire"))
                .achatOutillage(rs.getBigDecimal("achat_outillage"))
                .fraisEntretien(rs.getBigDecimal("frais_entretien"))
                .fraisSemis(rs.getBigDecimal("frais_semis"))
                .fraisRecolte(rs.getBigDecimal("frais_recolte"))
                .transport(rs.getBigDecimal("transport"))
                .stockage(rs.getBigDecimal("stockage"))
                .fraisConservation(rs.getBigDecimal("frais_conservation"))
                .chargesFamiliales(rs.getBigDecimal("charges_familiales"))
                .quantiteRecolte(rs.getBigDecimal("quantite_recolte"))
                .prixVenteUnitaire(rs.getBigDecimal("prix_vente_unitaire"))
                .autresProduits(rs.getBigDecimal("autres_produits"))
                .totalCharges(rs.getBigDecimal("total_charges"))
                .totalProduits(rs.getBigDecimal("total_produits"))
                .totalEcheances(rs.getBigDecimal("total_echeances"))
                .margeNette(rs.getBigDecimal("marge_nette"))
                .verdict(rs.getString("verdict"))
                .analysePar(rs.getString("analyse_par"))
                .createdAt(rs.getTimestamp("created_at") != null ? rs.getTimestamp("created_at").toLocalDateTime() : null)
                .updatedAt(rs.getTimestamp("updated_at") != null ? rs.getTimestamp("updated_at").toLocalDateTime() : null)
                .build();
    }

    private static BigDecimal nvl(BigDecimal value) {
        return value != null ? value : BigDecimal.ZERO;
    }
}
