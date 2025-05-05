package io.digiservices.ecreditservice.repository.impl;

import io.digiservices.ecreditservice.dto.BilanEntreprise;
import io.digiservices.ecreditservice.dto.Entreprise;
import io.digiservices.ecreditservice.exception.ApiException;
import io.digiservices.ecreditservice.repository.BilanEntrepriseRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

import static io.digiservices.ecreditservice.query.EntrepriseQuery.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class BilanEntrepriseRepositoryImpl implements BilanEntrepriseRepository {
    private final JdbcClient jdbcClient;
    @Override
    public BilanEntreprise addBilanEntreprise(Long entrepriseId, BilanEntreprise bilanEntreprise) {
        try {
            if (countEntrepriseById(entrepriseId) > 0) {
                bilanEntreprise.setEntrepriseId(entrepriseId);
                Long bilanEntrepriseId = jdbcClient.sql(CREATE_BILAN_ENTREPRISE_QUERY)
                        .paramSource(getParamSource(entrepriseId, bilanEntreprise))
                        .query(Long.class)
                        .single();
                bilanEntreprise.setBilanEntrepriseId(bilanEntrepriseId);
                return jdbcClient.sql(SELECT_BILAN_ENTREPRISE_BY_ID_QUERY)
                        .param("bilanEntrepriseId", bilanEntrepriseId)
                        .query(BilanEntreprise.class)
                        .single();
            } else {
                throw new ApiException("No entreprise found with ID: " + entrepriseId);
            }
        } catch (EmptyResultDataAccessException exception) {
            log.error(exception.getMessage());
            throw new ApiException("Failed to retrieve the created bilan");
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new ApiException("An error occurred while creating the bilan: " + e.getMessage());
        }
    }

    private Integer countEntrepriseById(Long entreprieId) {

        return jdbcClient.sql(COUNT_BILAN_ENTREPRISE_BY_ID).param("entrepriseId",entreprieId).query(Integer.class).single();
    }

    private SqlParameterSource getParamSource(Long entrepriseId, BilanEntreprise bilanEntreprise) {
        MapSqlParameterSource params = new MapSqlParameterSource();
        // Setting the main fields
        params.addValue("entrepriseId", entrepriseId);
        params.addValue("dateBilan", bilanEntreprise.getDateBilan());
        params.addValue("liquidites", bilanEntreprise.getLiquidites());
        params.addValue("creancesClients", bilanEntreprise.getCreancesClients());
        params.addValue("valeurStocks", bilanEntreprise.getValeurStocks());
        params.addValue("valeurEquipements", bilanEntreprise.getValeurEquipements());
        params.addValue("dettesFournisseurs", bilanEntreprise.getDettesFournisseurs());
        params.addValue("emprunts", bilanEntreprise.getEmprunts());
        params.addValue("capitalPropre", bilanEntreprise.getCapitalPropre());
        params.addValue("estPrevisionnel", bilanEntreprise.getEstPrevisionnel());
        // If we're updating an existing bilan, include the ID
        if (bilanEntreprise.getBilanEntrepriseId() != null) {
            params.addValue("bilanEntrepriseId", bilanEntreprise.getBilanEntrepriseId());
        }
        // Add timestamp for modification date
        params.addValue("dateModification", LocalDateTime.now());
        return params;
    }

}
