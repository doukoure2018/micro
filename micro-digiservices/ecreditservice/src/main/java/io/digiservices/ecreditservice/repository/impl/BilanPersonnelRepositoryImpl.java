package io.digiservices.ecreditservice.repository.impl;

import io.digiservices.ecreditservice.dto.BilanPersonnel;
import io.digiservices.ecreditservice.dto.Entreprise;
import io.digiservices.ecreditservice.exception.ApiException;
import io.digiservices.ecreditservice.repository.BilanPersonnelRepository;
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
public class BilanPersonnelRepositoryImpl  implements BilanPersonnelRepository {
    private final JdbcClient jdbcClient;
    @Override
    public BilanPersonnel saveBilanPersonnel(Long promoteurId, BilanPersonnel bilanPersonnel) {
        try {
            if (countPromoteurById(promoteurId) > 0) {
                bilanPersonnel.setPromoteurId(promoteurId);

                Long bilanPersonnelId = jdbcClient.sql(CREATE_BILAN_PERSONNEL_QUERY)
                        .paramSource(getParamSource(promoteurId, bilanPersonnel))
                        .query(Long.class)
                        .single();

                bilanPersonnel.setBilanPersonnelId(bilanPersonnelId);
                return jdbcClient.sql(SELECT_BILAN_PERSONNEL_BY_ID_QUERY)
                        .param("bilanPersonnelId", bilanPersonnelId)
                        .query(BilanPersonnel.class)
                        .single();
            } else {
                throw new ApiException("No promoteur found with ID: " + promoteurId);
            }
        } catch (EmptyResultDataAccessException exception) {
            log.error(exception.getMessage());
            throw new ApiException("Failed to retrieve the created bilan personnel");
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new ApiException("An error occurred while creating the bilan personnel: " + e.getMessage());
        }
    }

    private Integer countPromoteurById(Long promoteurId){
        return jdbcClient.sql(COUNT_PROMOTEUR_BY_ID).param("promoteurId",promoteurId).query(Integer.class).single();
    }

    private SqlParameterSource getParamSource(Long promoteurId, BilanPersonnel bilanPersonnel) {
        MapSqlParameterSource params = new MapSqlParameterSource();
        // Setting the main fields
        params.addValue("promoteurId", promoteurId);
        params.addValue("dateBilan", bilanPersonnel.getDateBilan());
        params.addValue("epargnes", bilanPersonnel.getEpargnes());
        params.addValue("valeurBiensDurables", bilanPersonnel.getValeurBiensDurables());

        // If we're updating an existing bilan, include the ID
        if (bilanPersonnel.getBilanPersonnelId() != null) {
            params.addValue("bilanPersonnelId", bilanPersonnel.getBilanPersonnelId());
        }
        // Add timestamp for modification date
        params.addValue("dateModification", LocalDateTime.now());

        return params;
    }
}
