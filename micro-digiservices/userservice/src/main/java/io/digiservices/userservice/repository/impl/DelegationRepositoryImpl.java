package io.digiservices.userservice.repository.impl;

import io.digiservices.userservice.dto.DelegationDto;
import io.digiservices.userservice.exception.ApiException;
import io.digiservices.userservice.model.User;
import io.digiservices.userservice.repository.DelegationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;

import java.util.List;

import static io.digiservices.userservice.query.DeletationQuery.*;
import static io.digiservices.userservice.query.UserQuery.UPDATE_USER_FUNCTION;

@Service
@RequiredArgsConstructor
@Slf4j
public class DelegationRepositoryImpl implements DelegationRepository {
    private final JdbcClient jdbcClient;

    @Override
    public void insertDeletation(DelegationDto delegationDto) {
        try {
             jdbcClient.sql(INSERT_DELEGATION_QUERY).param("libele",delegationDto.getLibele()).update();
        }catch (EmptyResultDataAccessException exception){
            log.error(exception.getMessage());
            throw  new ApiException("No user found by userUuid");
        }catch (Exception e){
            log.error(e.getMessage());
            throw  new ApiException("An error occurred please try again");
        }
    }

    @Override
    public List<DelegationDto> getAllDelegation() {
        try {
            return jdbcClient.sql(GET_ALL_DELEGATION_QUERY).query(DelegationDto.class).list();
        }catch (EmptyResultDataAccessException exception){
            log.error(exception.getMessage());
            throw  new ApiException("No delegation found");
        }catch (Exception e){
            log.error(e.getMessage());
            throw  new ApiException("An error occurred please try again");
        }
    }

    @Override
    public DelegationDto getDelegationById(Long delegationId) {
        try {
            return jdbcClient.sql(GET_DELEGATION_BY_ID).param("delegationId",delegationId).query(DelegationDto.class).single();
        }catch (EmptyResultDataAccessException exception){
            log.error(exception.getMessage());
            throw  new ApiException("No delegation found by id");
        }catch (Exception e){
            log.error(e.getMessage());
            throw  new ApiException("An error occurred please try again");
        }
    }
}
