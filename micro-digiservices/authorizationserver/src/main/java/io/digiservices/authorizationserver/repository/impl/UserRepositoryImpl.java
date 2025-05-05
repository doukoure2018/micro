package io.digiservices.authorizationserver.repository.impl;


import io.digiservices.authorizationserver.exception.ApiException;
import io.digiservices.authorizationserver.model.User;
import io.digiservices.authorizationserver.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

import java.util.Map;

import static io.digiservices.authorizationserver.query.UserQuery.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserRepositoryImpl implements UserRepository {

    private final JdbcClient jdbcClient;

    @Override
    public User getUserByUuid(String userUuid) {
        try {
            return jdbcClient.sql(SELECT_USER_BY_UUID_QUERY).param("userUuid",userUuid).query(User.class).single();
        }catch (EmptyResultDataAccessException exception){
            log.error(exception.getMessage());
            throw  new ApiException("No user found by userUuid");
        }catch (Exception e){
            log.error(e.getMessage());
            throw  new ApiException("An error Occured please try again");
        }
    }

    @Override
    public User getUserByEmail(String email) {
        try {
            return jdbcClient.sql(SELECT_USER_BY_EMAIL_QUERY).param("email",email).query(User.class).single();
        }catch (EmptyResultDataAccessException exception){
            log.error(exception.getMessage());
            throw  new ApiException("No user found by email");
        }catch (Exception e){
            log.error(e.getMessage());
            throw  new ApiException("An error Occured please try again");
        }
    }

    @Override
    public void resetLoginAttempts(String userUuid) {
        try {
            jdbcClient.sql(RESET_LOGIN_ATTEMPTS_QUERY).param("userUuid",userUuid).update();
        }catch (EmptyResultDataAccessException exception){
            log.error(exception.getMessage());
            throw  new ApiException("No user found by userUuid");
        }catch (Exception e){
            log.error(e.getMessage());
            throw  new ApiException("An error Occured please try again");
        }
    }

    @Override
    public void updateLoginAttempts(String email) {
        try {
            jdbcClient.sql(UPDATE_LOGIN_ATTEMPTS_QUERY).param("email",email).update();
        }catch (EmptyResultDataAccessException exception){
            log.error(exception.getMessage());
            throw  new ApiException("No user found by email");
        }catch (Exception e){
            log.error(e.getMessage());
            throw  new ApiException("An error Occured please try again");
        }
    }

    @Override
    public void setLastLogin(Long userId) {
        try {
            jdbcClient.sql(SET_LAST_LOGIN_QUERY).param("userId",userId).update();
        }catch (EmptyResultDataAccessException exception){
            log.error(exception.getMessage());
            throw  new ApiException("No user found by userId");
        }catch (Exception e){
            log.error(e.getMessage());
            throw  new ApiException("An error Occured please try again");
        }
    }

    @Override
    public void addLoginDevice(Long userId, String device, String client, String ipAddress) {
        try {
            jdbcClient.sql(ADD_LOGIN_DEVICE_QUERY).params(Map.of("userId",userId,"device",device,"client",client,"ipAddress",ipAddress)).update();
        }catch (EmptyResultDataAccessException exception){
            log.error(exception.getMessage());
            throw  new ApiException("No user found by userId");
        }catch (Exception e){
            log.error(e.getMessage());
            throw  new ApiException("An error Occured please try again");
        }
    }
}
