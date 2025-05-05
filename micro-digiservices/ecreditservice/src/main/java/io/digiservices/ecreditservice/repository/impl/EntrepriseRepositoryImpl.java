package io.digiservices.ecreditservice.repository.impl;

import io.digiservices.ecreditservice.dto.Entreprise;
import io.digiservices.ecreditservice.dto.Promoteur;
import io.digiservices.ecreditservice.exception.ApiException;
import io.digiservices.ecreditservice.repository.EntrepriseRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;

import java.sql.Types;
import java.util.List;

import static io.digiservices.ecreditservice.query.EntrepriseQuery.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class EntrepriseRepositoryImpl implements EntrepriseRepository {

    private final JdbcClient jdbcClient;
    @Override
    public List<Entreprise> saveEntreprise(Entreprise entreprise,Long promoteurId) {
        try {
            if(countPromoteurById(promoteurId)>0){
                jdbcClient.sql(CREATE_ENTREPRISE_QUERY).paramSource(getParamSource(entreprise,promoteurId)).update();
                return  jdbcClient.sql(SELECT_ALL_ENTREPRISE_BY_PROMOTEUR_ID).param("promoteurId",promoteurId).query(Entreprise.class).list();
            }else{
                throw  new ApiException("No promoteur Found by Id");
            }
        }catch (EmptyResultDataAccessException exception){
            log.error(exception.getMessage());
            throw  new ApiException("No promoteur Found by Id");
        }catch (Exception e){
            log.error(e.getMessage());
            throw  new ApiException("An error occurred please try again");
        }
    }

    @Override
    public boolean existsById(Long entrepriseId) {
        try {
            Integer count = jdbcClient.sql(SELECT_ENTREPRISE_BY_ID_QUERY)
                    .param("entrepriseId", entrepriseId)
                    .query(Integer.class)
                    .single();
            return count > 0;
        } catch (EmptyResultDataAccessException e) {
            return false;
        }
    }

    private Integer countPromoteurById(Long promoteurId){
        return jdbcClient.sql(COUNT_PROMOTEUR_BY_ID).param("promoteurId",promoteurId).query(Integer.class).single();
    }


    private SqlParameterSource getParamSource(Entreprise entreprise,Long promoteurId)
    {
        return new MapSqlParameterSource()
                .addValue("promoteurId", promoteurId, Types.INTEGER)
                .addValue("nom", entreprise.getNom(), Types.VARCHAR)
                .addValue("formeJuridique", entreprise.getFormeJuridique(), Types.VARCHAR)
                .addValue("secteurActivite", entreprise.getSecteurActivite(), Types.VARCHAR)
                .addValue("dateCreation", entreprise.getDateCreation(), Types.DATE)
                .addValue("numeroRegistre", entreprise.getNumeroRegistre(), Types.VARCHAR)
                .addValue("adresse", entreprise.getAdresse(), Types.VARCHAR)
                .addValue("telephone", entreprise.getTelephone(), Types.VARCHAR)
                .addValue("email", entreprise.getEmail().trim().toLowerCase(), Types.VARCHAR);
    }

}
