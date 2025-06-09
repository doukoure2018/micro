package io.digiservices.userservice.repository.impl;

import io.digiservices.userservice.dto.AgenceDto;
import io.digiservices.userservice.exception.ApiException;
import io.digiservices.userservice.repository.AgenceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

import static io.digiservices.userservice.query.AgenceQuery.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class AgenceRepositoryImpl implements AgenceRepository {

    private final JdbcClient jdbcClient;

    @Override
    public void addAgence(AgenceDto agenceDto) {
        try {
            jdbcClient.sql(INSERT_AGENCE_QUERY).params(Map.of("libele",agenceDto.getLibele(),"delegationId",agenceDto.getDelegation_id())).update();
        }catch (EmptyResultDataAccessException exception){
            log.error(exception.getMessage());
            throw  new ApiException("No user found by userUuid");
        }catch (Exception e){
            log.error(e.getMessage());
            throw  new ApiException("An error occurred please try again");
        }
    }

    @Override
    public List<AgenceDto> getListAgence() {
        try {
               return jdbcClient.sql(GET_ALL_AGENCE).query(AgenceDto.class).list();
        }catch (EmptyResultDataAccessException exception){
            log.error(exception.getMessage());
            throw  new ApiException("No user found by userUuid");
        }catch (Exception e){
            log.error(e.getMessage());
            throw  new ApiException("An error occurred please try again");
        }
    }

    @Override
    public List<AgenceDto> getListAgenceByDelegationId(Long delegationId) {
        try {
            return jdbcClient.sql(GET_ALL_AGENCE_DELEGATION_ID_QUERY).param("delegationId",delegationId).query(AgenceDto.class).list();
        }catch (EmptyResultDataAccessException exception){
            log.error(exception.getMessage());
            throw  new ApiException("No user found by userUuid");
        }catch (Exception e){
            log.error(e.getMessage());
            throw  new ApiException("An error occurred please try again");
        }
    }

    @Override
    public AgenceDto getAgence(Long agenceId) {
        try {
            return jdbcClient.sql(GET_ALL_AGENCE_QUERY).param("agenceId",agenceId).query(AgenceDto.class).single();
        }catch (EmptyResultDataAccessException exception){
            log.error(exception.getMessage());
            throw  new ApiException("No user found by userUuid");
        }catch (Exception e){
            log.error(e.getMessage());
            throw  new ApiException("An error occurred please try again");
        }
    }
}
