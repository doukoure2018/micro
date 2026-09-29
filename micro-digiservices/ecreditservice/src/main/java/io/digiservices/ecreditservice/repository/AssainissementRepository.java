package io.digiservices.ecreditservice.repository;

import io.digiservices.ecreditservice.dto.AssainissementDtos.PointEvolutionDto;
import io.digiservices.ecreditservice.dto.AssainissementDtos.PointServiceRetardDto;
import io.digiservices.ecreditservice.dto.AssainissementDtos.StockDelegationDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.time.LocalDate;

import static io.digiservices.ecreditservice.query.CorrectionQuery.CORRECTION_EVOLUTION_TRAITEMENT;
import static io.digiservices.ecreditservice.query.CorrectionQuery.CORRECTION_POINTS_SERVICE_EN_RETARD;
import static io.digiservices.ecreditservice.query.CorrectionQuery.CORRECTION_STOCK_PAR_DELEGATION;
import static io.digiservices.ecreditservice.query.CorrectionQuery.CORRECTION_TRAITEES_PAR_DELEGATION_PERIODE;

/**
 * Pilotage de l'assainissement : evolution sur la date de traitement, encours par delegation
 * et points de service en retard. Le rattachement passe par
 * {@code pointvente.code = personne_physique.code_agence}, puis agence et delegation.
 */
@Repository
@RequiredArgsConstructor
@Slf4j
public class AssainissementRepository {

    private final JdbcClient jdbcClient;

    /** Courbe : traitees (date de traitement) et nouvelles (date de creation), meme periode. */
    public List<PointEvolutionDto> evolution(String granularite, int nbPeriodes, Long delegationId,
                                             LocalDate du, LocalDate au) {
        return jdbcClient.sql(CORRECTION_EVOLUTION_TRAITEMENT)
                .param("granularite", granularite)
                .param("nbPeriodes", nbPeriodes)
                .param("delegationId", delegationId)
                .param("du", du == null ? null : Date.valueOf(du))
                .param("au", au == null ? null : Date.valueOf(au))
                .query((ResultSet rs, int n) -> PointEvolutionDto.builder()
                        .date(rs.getDate("date_jour") == null ? null : rs.getDate("date_jour").toLocalDate())
                        .periode(rs.getString("periode"))
                        .valide(rs.getLong("valide"))
                        .rejete(rs.getLong("rejete"))
                        .traitees(rs.getLong("traitees"))
                        .nouvelles(rs.getLong("nouvelles"))
                        .enAttente(rs.getLong("en_attente"))
                        .build())
                .list();
    }

    /** Encours par delegation, avec anciennete et taux de rejet. */
    public List<StockDelegationDto> stockParDelegation(int seuilJours) {
        return jdbcClient.sql(CORRECTION_STOCK_PAR_DELEGATION)
                .param("seuilJours", seuilJours)
                .query((ResultSet rs, int n) -> StockDelegationDto.builder()
                        .delegationId(lng(rs, "delegation_id"))
                        .delegation(rs.getString("delegation"))
                        .enAttente(rs.getLong("en_attente"))
                        .ageMoyenJours(rs.getLong("age_moyen_jours"))
                        .ageMaxJours(rs.getLong("age_max_jours"))
                        .auDelaSeuil(rs.getLong("au_dela_seuil"))
                        .totalFiches(rs.getLong("total_fiches"))
                        .tauxRejet(rs.getDouble("taux_rejet"))
                        .nbPointsService(rs.getLong("nb_points_service"))
                        .traiteesParPeriode(new ArrayList<>())
                        .build())
                .list();
    }

    /** Traitees par (delegation, periode) : l'ecran pivote ces lignes en colonnes. */
    public List<Map<String, Object>> traiteesParDelegationEtPeriode(String granularite, int nbPeriodes,
                                                                    LocalDate du, LocalDate au) {
        return jdbcClient.sql(CORRECTION_TRAITEES_PAR_DELEGATION_PERIODE)
                .param("granularite", granularite)
                .param("nbPeriodes", nbPeriodes)
                .param("du", du == null ? null : Date.valueOf(du))
                .param("au", au == null ? null : Date.valueOf(au))
                .query()
                .listOfRows();
    }

    /** Points de service dont l'encours est le plus lourd. */
    public List<PointServiceRetardDto> pointsServiceEnRetard(Long delegationId, int limite) {
        return jdbcClient.sql(CORRECTION_POINTS_SERVICE_EN_RETARD)
                .param("delegationId", delegationId)
                .param("limite", limite)
                .query((ResultSet rs, int n) -> PointServiceRetardDto.builder()
                        .pointService(rs.getString("point_service"))
                        .code(rs.getString("code"))
                        .agence(rs.getString("agence"))
                        .delegation(rs.getString("delegation"))
                        .delegationId(lng(rs, "delegation_id"))
                        .enAttente(rs.getLong("en_attente"))
                        .plusAncienneJours(rs.getLong("plus_ancienne_jours"))
                        .build())
                .list();
    }

    private static Long lng(ResultSet rs, String col) throws SQLException {
        long v = rs.getLong(col);
        return rs.wasNull() ? null : v;
    }
}
