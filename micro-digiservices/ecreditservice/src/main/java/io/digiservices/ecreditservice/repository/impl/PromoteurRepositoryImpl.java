package io.digiservices.ecreditservice.repository.impl;


import io.digiservices.ecreditservice.dto.Promoteur;
import io.digiservices.ecreditservice.exception.ApiException;
import io.digiservices.ecreditservice.repository.PromoteurRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;

import java.sql.Types;

import static io.digiservices.ecreditservice.query.PromoteurQuery.*;
import static io.digiservices.ecreditservice.utils.UserUtils.randomUUUID;
import static java.sql.Types.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class PromoteurRepositoryImpl implements PromoteurRepository {

    private final JdbcClient jdbcClient;

    @Override
    public Promoteur createPromoteur(Promoteur promoteur) {
        try {
              int result = jdbcClient.sql(CREATE_PROMOTEUR_QUERY).paramSource(getParamSource(promoteur)).update();
              if(result > 0){
                  // return fthe promoteur by contact
                  return jdbcClient.sql(SELECT_CONTACT_PROMOTEUR_QUERY).param("contact",promoteur.getTelephone()).query(Promoteur.class).single();
              }else{
                  throw new ApiException("Failed to create promoteur");
              }
        }catch (EmptyResultDataAccessException exception){
            log.error(exception.getMessage());
            throw  new ApiException("No user found by email");
        }catch (Exception e){
            log.error(e.getMessage());
            throw  new ApiException("An error occurred please try again");
        }
    }

    @Override
    public Promoteur getPromoteurById(Long promoteurId) {
        try {
            return jdbcClient.sql(SELECT_PROMOTEUR_BY_ID_QUERY).param("promoteurId",promoteurId).query(Promoteur.class).single();
        }catch (EmptyResultDataAccessException exception){
            log.error(exception.getMessage());
            throw  new ApiException("No promoteur Found by Id");
        }catch (Exception e){
            log.error(e.getMessage());
            throw  new ApiException("An error occurred please try again");
        }
    }

    private SqlParameterSource getParamSource(Promoteur promoteur)
    {
        return new MapSqlParameterSource()
                .addValue("nom",promoteur.getNom(), VARCHAR)
                .addValue("prenom",promoteur.getPrenom(), VARCHAR)
                .addValue("adresse", promoteur.getAdresse(), VARCHAR)
                .addValue("dateNaissance",promoteur.getDateNaissance(), DATE)
                .addValue("numeroIdentite",promoteur.getNumeroIdentite(), VARCHAR)
                .addValue("telephone",promoteur.getTelephone(), VARCHAR)
                .addValue("email", promoteur.getEmail().trim().toLowerCase(), Types.VARCHAR);
    }
}
