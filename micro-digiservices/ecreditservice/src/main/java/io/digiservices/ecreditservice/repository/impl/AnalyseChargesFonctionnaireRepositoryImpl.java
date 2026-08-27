package io.digiservices.ecreditservice.repository.impl;

import io.digiservices.ecreditservice.dto.AnalyseChargesFonctionnaireDto;
import io.digiservices.ecreditservice.exception.ApiException;
import io.digiservices.ecreditservice.query.AnalyseChargesFonctionnaireQuery;
import io.digiservices.ecreditservice.repository.AnalyseChargesFonctionnaireRepository;
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
public class AnalyseChargesFonctionnaireRepositoryImpl implements AnalyseChargesFonctionnaireRepository {

    private final JdbcClient jdbcClient;

    @Override
    public Optional<AnalyseChargesFonctionnaireDto> findByDemandeId(Long demandeId) {
        return jdbcClient.sql(AnalyseChargesFonctionnaireQuery.SELECT_ANALYSE_CHARGES_BY_DEMANDE)
                .param("demandeId", demandeId)
                .query((rs, rowNum) -> mapRow(rs))
                .optional();
    }

    @Override
    public AnalyseChargesFonctionnaireDto upsert(Long demandeId, AnalyseChargesFonctionnaireDto dto, String analysePar) {
        try {
            Map<String, Object> params = new HashMap<>();
            params.put("demandeId", demandeId);
            params.put("chargeLoyer", nvl(dto.getChargeLoyer()));
            params.put("chargeTransport", nvl(dto.getChargeTransport()));
            params.put("chargeNourriture", nvl(dto.getChargeNourriture()));
            params.put("chargeVignette", nvl(dto.getChargeVignette()));
            params.put("chargeAssurance", nvl(dto.getChargeAssurance()));
            params.put("chargeElectricite", nvl(dto.getChargeElectricite()));
            params.put("chargeEau", nvl(dto.getChargeEau()));
            params.put("chargeAssuranceMaladie", nvl(dto.getChargeAssuranceMaladie()));
            params.put("chargeScolarite", nvl(dto.getChargeScolarite()));
            params.put("chargeCasSociaux", nvl(dto.getChargeCasSociaux()));
            params.put("chargeAbonnementImage", nvl(dto.getChargeAbonnementImage()));
            params.put("chargeServiceSalubrite", nvl(dto.getChargeServiceSalubrite()));
            params.put("salaireNetRetenu", dto.getSalaireNetRetenu());
            params.put("autresRevenusRetenus", nvl(dto.getAutresRevenusRetenus()));
            params.put("quotiteCessible", dto.getQuotiteCessible());
            params.put("capaciteResiduelle", dto.getCapaciteResiduelle());
            params.put("verdict", dto.getVerdict());
            params.put("avisAgent", dto.getAvisAgent());
            params.put("analysePar", analysePar);

            return jdbcClient.sql(AnalyseChargesFonctionnaireQuery.UPSERT_ANALYSE_CHARGES)
                    .params(params)
                    .query((rs, rowNum) -> mapRow(rs))
                    .single();
        } catch (Exception e) {
            log.error("Erreur lors de l'enregistrement de l'analyse charges fonctionnaire (demande {}): {}",
                    demandeId, e.getMessage(), e);
            throw new ApiException("Erreur lors de l'enregistrement de l'analyse des charges");
        }
    }

    @Override
    public ContexteFonctionnaire getContexte(Long demandeId) {
        try {
            return jdbcClient.sql(AnalyseChargesFonctionnaireQuery.SELECT_CONTEXTE_FONCTIONNAIRE)
                    .param("demandeId", demandeId)
                    .query((rs, rowNum) -> new ContexteFonctionnaire(
                            rs.getLong("demandeindividuel_id"),
                            rs.getString("nature_client"),
                            rs.getString("validation_state"),
                            rs.getBigDecimal("echeance"),
                            rs.getString("periodicite_remboursement"),
                            rs.getBigDecimal("salaire_net_mensuel"),
                            rs.getBigDecimal("autres_revenus"),
                            rs.getObject("domiciliation_salaire") == null ? null : rs.getBoolean("domiciliation_salaire"),
                            rs.getString("type_groupe"),
                            rs.getBigDecimal("salaires_groupe")))
                    .optional()
                    .orElse(null);
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    private static BigDecimal nvl(BigDecimal value) {
        return value != null ? value : BigDecimal.ZERO;
    }

    private AnalyseChargesFonctionnaireDto mapRow(ResultSet rs) throws SQLException {
        return AnalyseChargesFonctionnaireDto.builder()
                .analyseChargesId(rs.getLong("analyse_charges_id"))
                .demandeindividuelId(rs.getLong("demandeindividuel_id"))
                .chargeLoyer(rs.getBigDecimal("charge_loyer"))
                .chargeTransport(rs.getBigDecimal("charge_transport"))
                .chargeNourriture(rs.getBigDecimal("charge_nourriture"))
                .chargeVignette(rs.getBigDecimal("charge_vignette"))
                .chargeAssurance(rs.getBigDecimal("charge_assurance"))
                .chargeElectricite(rs.getBigDecimal("charge_electricite"))
                .chargeEau(rs.getBigDecimal("charge_eau"))
                .chargeAssuranceMaladie(rs.getBigDecimal("charge_assurance_maladie"))
                .chargeScolarite(rs.getBigDecimal("charge_scolarite"))
                .chargeCasSociaux(rs.getBigDecimal("charge_cas_sociaux"))
                .chargeAbonnementImage(rs.getBigDecimal("charge_abonnement_image"))
                .chargeServiceSalubrite(rs.getBigDecimal("charge_service_salubrite"))
                .totalCharges(rs.getBigDecimal("total_charges"))
                .salaireNetRetenu(rs.getBigDecimal("salaire_net_retenu"))
                .autresRevenusRetenus(rs.getBigDecimal("autres_revenus_retenus"))
                .quotiteCessible(rs.getBigDecimal("quotite_cessible"))
                .capaciteResiduelle(rs.getBigDecimal("capacite_residuelle"))
                .verdict(rs.getString("verdict"))
                .avisAgent(rs.getString("avis_agent"))
                .analysePar(rs.getString("analyse_par"))
                .createdAt(rs.getTimestamp("created_at") != null ? rs.getTimestamp("created_at").toLocalDateTime() : null)
                .updatedAt(rs.getTimestamp("updated_at") != null ? rs.getTimestamp("updated_at").toLocalDateTime() : null)
                .build();
    }
}
