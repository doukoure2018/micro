package io.digiservices.userservice.repository.impl;


import io.digiservices.userservice.dto.RotationDto;
import io.digiservices.userservice.exception.ApiException;
import io.digiservices.userservice.model.*;
import io.digiservices.userservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

import static io.digiservices.userservice.query.UserQuery.*;
import static io.digiservices.userservice.utils.UserUtils.*;
import static java.sql.Types.BIGINT;
import static java.sql.Types.VARCHAR;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserRepositoryImpl implements UserRepository {

    private final JdbcClient jdbcClient;

    @Override
    public User getUserByEmail(String email) {
        try {
            return jdbcClient.sql(SELECT_USER_BY_EMAIL_QUERY).param("email",email).query(User.class).single();
        }catch (EmptyResultDataAccessException exception){
            log.error(exception.getMessage());
            throw  new ApiException("No user found by email");
        }catch (Exception e){
            log.error(e.getMessage());
            throw  new ApiException("An error occurred please try again");
        }
    }

    @Override
    public User getUserByUuid(String userUuid) {
        try {
            return jdbcClient.sql(SELECT_USER_BY_UUID_QUERY).param("userUuid",userUuid).query(User.class).single();
        }catch (EmptyResultDataAccessException exception){
            log.error(exception.getMessage());
            throw  new ApiException("No user found by userUuid");
        }catch (Exception e){
            log.error(e.getMessage());
            throw  new ApiException("An error occurred please try again");
        }
    }

    @Override
    public User getUserById(Long userId) {
        try {
            return jdbcClient.sql(SELECT_USER_BY_ID_QUERY).param("userId",userId).query(User.class).single();
        }catch (EmptyResultDataAccessException exception){
            log.error(exception.getMessage());
            throw  new ApiException("No user found by userId");
        }catch (Exception e){
            log.error(e.getMessage());
            throw  new ApiException("An error occurred please try again");
        }
    }

    @Override
    public User updateUser(String userUuid, String firstName, String lastName, String email, String phone, String bio, String address) {
        try {
            return jdbcClient.sql(UPDATE_USER_FUNCTION).paramSource(getParamSource( userUuid,  firstName,  lastName,  email,  phone,  bio,  address)).query(User.class).single();
        }catch (EmptyResultDataAccessException exception){
            log.error(exception.getMessage());
            throw  new ApiException("No user found by userUuid");
        }catch (Exception e){
            log.error(e.getMessage());
            throw  new ApiException("An error occurred please try again");
        }
    }

    @Override
    public String createUser(String firstName, String lastName, String email, String username, String password) {
        try {
            var token = randomUUUID.get();
            jdbcClient.sql(CREATE_USER_STORED_PROCEDURE).paramSource(getParamSource(firstName, lastName, email, username, password, token)).update();
            return token;
        }catch (DuplicateKeyException exception){
            log.error(exception.getMessage());
            throw  new ApiException("Email is already in Use. Please try again");
        }catch (Exception e){
            log.error(e.getMessage());
            throw  new ApiException("An error occurred please try again");
        }
    }

    @Override
    public String createAccountUser(String firstName, String lastName, String email, String username, String password, String roleName) {
        try {
            var token = randomUUUID.get();

            log.info("Creating standard user account for role: {}", roleName);

            jdbcClient.sql(CREATE_ACCOUNT_STORED_PROCEDURE)
                    .paramSource(getParamSourceAccount(firstName, lastName, email, username, password, token, roleName))
                    .update();

            log.info("Standard user account created successfully with token: {}", token);
            return token;

        } catch (DuplicateKeyException exception) {
            log.error("Duplicate key error: {}", exception.getMessage());
            throw new ApiException("Email is already in use. Please try again");

        } catch (Exception e) {
            log.error("Error creating standard user account: {}", e.getMessage());
            throw new ApiException("An error occurred please try again");
        }
    }

    @Override
    public String createAccountAgentCreditAndDa(String firstName, String lastName, String email, String username,
                                                String password, String roleName, String phone, String bio,
                                                Long delegationId, Long agenceId, Long pointventeId) {
        try {
            var token = randomUUUID.get();

            log.info("Creating location-based account for role: {}", roleName);
            log.info("Location parameters: delegationId={}, agenceId={}, pointventeId={}",
                    delegationId, agenceId, pointventeId);

            if(roleName.equalsIgnoreCase("AGENT_CREDIT")){
                // Validate required parameters for AGENT_CREDIT
                if(delegationId == null || agenceId == null || pointventeId == null) {
                    throw new ApiException("AGENT_CREDIT role requires delegation, agence, and point vente selection");
                }

                log.info("Creating AGENT_CREDIT account");
                jdbcClient.sql(CREATE_ACCOUNT_AGENT_CREDIT_STORED_PROCEDURE)
                        .paramSource(getParamSourceAccountAgentCredit(firstName, lastName, email, username,
                                password, token, phone, bio, delegationId, agenceId, pointventeId))
                        .update();

            } else if (roleName.equalsIgnoreCase("DA")){
                // Validate required parameters for DA
                if(delegationId == null || agenceId == null) {
                    throw new ApiException("DA role requires delegation and agence selection");
                }

                log.info("Creating DA account");
                jdbcClient.sql(CREATE_ACCOUNT_DA_STORED_PROCEDURE)
                        .paramSource(getParamSourceAccountDA(firstName, lastName, email, username,
                                password, token, phone, bio, delegationId, agenceId))
                        .update();

            } else {
                throw new ApiException("Invalid role for location-based account creation: " + roleName);
            }

            log.info("Location-based account created successfully with token: {}", token);
            return token;

        } catch (ApiException apiException) {
            // Re-throw ApiException as-is to preserve the specific message
            throw apiException;

        } catch (DuplicateKeyException exception) {
            log.error("Duplicate key error: {}", exception.getMessage());
            throw new ApiException("Email is already in use. Please try again");

        } catch (Exception e) {
            log.error("Error creating location-based account: {}", e.getMessage());
            throw new ApiException("An error occurred please try again");
        }
    }

    @Override
    public AccountToken getAccountToken(String token) {
        try {
            return jdbcClient.sql(SELECT_ACCOUNT_TOKEN_QUERY).param("token",token).query(AccountToken.class).single();
        }catch (EmptyResultDataAccessException exception){
            log.error(exception.getMessage());
            throw  new ApiException("Invalid Link. Please try again");
        }catch (Exception e){
            log.error(e.getMessage());
            throw  new ApiException("An error occurred please try again");
        }
    }

    @Override
    public User verifyPasswordToken(String token) {
        return null;
    }

    @Override
    public User enableMfa(String userUuid) {
        try {
            return jdbcClient.sql(ENABLE_USER_MFA_FUNCTION).paramSource(getParamSource(userUuid,qrCodeSecret.get())).query(User.class).single();
        }catch (EmptyResultDataAccessException exception){
            log.error(exception.getMessage());
            throw  new ApiException("User not found, Please try again");
        }catch (Exception e){
            log.error(e.getMessage());
            throw  new ApiException("An error occurred please try again");
        }
    }

    @Override
    public User disableMfa(String userUuid) {
        try {
            return jdbcClient.sql(DISABLE_USER_MFA_FUNCTION).param("userUuid",userUuid).query(User.class).single();
        }catch (EmptyResultDataAccessException exception){
            log.error(exception.getMessage());
            throw  new ApiException("User not found, Please try again");
        }catch (Exception e){
            log.error(e.getMessage());
            throw  new ApiException("An error occurred please try again");
        }
    }



    @Override
    public User toggleAccountExpired(String userUuid) {
        try {
            return jdbcClient.sql(TOGGLE_ACCOUNT_EXPIRED_FUNCTION).param("userUuid",userUuid).query(User.class).single();
        }catch (EmptyResultDataAccessException exception){
            log.error(exception.getMessage());
            throw  new ApiException("User not found, Please try again");
        }catch (Exception e){
            log.error(e.getMessage());
            throw  new ApiException("An error occurred please try again");
        }
    }

    @Override
    public User toggleAccountLocked(String userUuid) {
        try {
            return jdbcClient.sql(TOGGLE_ACCOUNT_LOCKED_FUNCTION).param("userUuid",userUuid).query(User.class).single();
        }catch (EmptyResultDataAccessException exception){
            log.error(exception.getMessage());
            throw  new ApiException("User not found, Please try again");
        }catch (Exception e){
            log.error(e.getMessage());
            throw  new ApiException("An error occurred please try again");
        }
    }

    @Override
    public User toggleAccountEnabled(String userUuid) {
        try {
            return jdbcClient.sql(TOGGLE_ACCOUNT_ENABLED_FUNCTION).param("userUuid",userUuid).query(User.class).single();
        }catch (EmptyResultDataAccessException exception){
            log.error(exception.getMessage());
            throw  new ApiException("User not found, Please try again");
        }catch (Exception e){
            log.error(e.getMessage());
            throw  new ApiException("An error occurred please try again");
        }
    }

    @Override
    public User toggleCredentialsExpired(String userUuid) {
        return null;
    }

    @Override
    public void updatePassword(String userUuid, String encodedPassword) {
        try {
            jdbcClient.sql(UPDATE_USER_PASSWORD_QUERY).params(Map.of("userUuid",userUuid,"password",encodedPassword)).update();
        }catch (EmptyResultDataAccessException exception){
            log.error(exception.getMessage());
            throw  new ApiException("User not found, Please try again");
        }catch (Exception e){
            log.error(e.getMessage());
            throw  new ApiException("An error occurred please try again");
        }

    }



    @Override
    public User updateRole(String userUuid, String role) {
        try {
            return jdbcClient.sql(UPDATE_USER_ROLE_FUNCTION).params(Map.of("userUuid",userUuid,"role",role)).query(User.class).single();
        }catch (EmptyResultDataAccessException exception){
            log.error(exception.getMessage());
            throw  new ApiException("User not found, Please try again");
        }catch (Exception e){
            log.error(e.getMessage());
            throw  new ApiException("An error occurred please try again");
        }
    }

    @Override
    public void resetPassword(String email) {

    }

    @Override
    public void doResetPassword(String userUuid, String token, String password, String confirmPassword) {

    }

    @Override
    public List<User> getUsers() {
        try {
           return jdbcClient.sql(SELECT_USER_QUERY).query(User.class).list();
        }catch (EmptyResultDataAccessException exception){
            log.error(exception.getMessage());
            throw  new ApiException("Users Not Found. Please try again");
        }catch (Exception e){
            log.error(e.getMessage());
            throw  new ApiException("An error occurred please try again");
        }
    }


    @Override
    public List<Role> getRoles() {
        try {
            return jdbcClient.sql(SELECT_ROLES_USER_QUERY).query(Role.class).list();
        }catch (EmptyResultDataAccessException exception){
            log.error(exception.getMessage());
            throw  new ApiException("Roles Not Found. Please try again");
        }catch (Exception e){
            log.error(e.getMessage());
            throw  new ApiException("An error occurred please try again");
        }
    }
    @Override
    public User getAssignee(String ticketUuid) {
        try {
            return jdbcClient.sql(SELECT_TICKET_ASSIGNEE_QUERY).param("ticketUuid", ticketUuid).query(User.class).single();
        }catch (EmptyResultDataAccessException exception){
            log.error(exception.getMessage());
            log.error("Ticket is not assigned.");
            return User.builder().build();
        }catch (Exception e){
            log.error(e.getMessage());
            throw  new ApiException("An error occurred please try again");
        }
    }

    @Override
    public Credential getCredential(String userUuid) {
        try {
            return jdbcClient.sql(SELECT_USER_CREDENTIAL_QUERY).param("userUuid",userUuid).query(Credential.class).single();
        }catch (EmptyResultDataAccessException exception){
            log.error(exception.getMessage());
            throw  new ApiException("Credential not Found. Please try again");
        }catch (Exception e){
            log.error(e.getMessage());
            throw  new ApiException("An error occurred please try again");
        }
    }

    @Override
    public List<Device> getDevices(String userUuid) {
        try {
            return jdbcClient.sql(SELECT_USER_DEVICES_QUERY).param("userUuid",userUuid).query(Device.class).list();
        }catch (EmptyResultDataAccessException exception){
            log.error(exception.getMessage());
            throw  new ApiException("Not Devices Found. Please try again");
        }catch (Exception e){
            log.error(e.getMessage());
            throw  new ApiException("An error occurred please try again");
        }
    }

    @Override
    public void deleteAccountToken(String token) {
        try {
            jdbcClient.sql(DELETE_ACCOUNT_TOKEN_QUERY).param("token",token).update();
        }catch (EmptyResultDataAccessException exception){
            log.error(exception.getMessage());
            throw  new ApiException("Token not Found. Please try again");
        }catch (Exception e){
            log.error(e.getMessage());
            throw  new ApiException("An error occurred please try again");
        }
    }

    @Override
    public void updateAccountSettings(Long userId) {
        try {
            jdbcClient.sql(UPDATE_ACCOUNT_SETTINGS_QUERY).param("userId",userId).update();
        }catch (EmptyResultDataAccessException exception){
            log.error(exception.getMessage());
            throw  new ApiException("User not Found. Please try again");
        }catch (Exception e){
            log.error(e.getMessage());
            throw  new ApiException("An error occurred please try again");
        }
    }

    @Override
    public PasswordToken getPasswordToken(String token) {
        try {
            return jdbcClient.sql(SELECT_PASSWORD_TOKEN_QUERY).param("token",token).query(PasswordToken.class).single();
        }catch (EmptyResultDataAccessException exception){
            log.error(exception.getMessage());
            throw  new ApiException("Invalid Link. Please try again");
        }catch (Exception e){
            log.error(e.getMessage());
            throw  new ApiException("An error occurred please try again");
        }
    }

    @Override
    public PasswordToken getPasswordToken(Long userId) {
        try {
            return jdbcClient.sql(SELECT_PASSWORD_TOKEN_BY_USER_ID_QUERY).param("userId",userId).query(PasswordToken.class).single();
        }catch (EmptyResultDataAccessException exception){
            log.error(exception.getMessage());
            //throw  new ApiException("Invalid Link. Please try again");
            return null;
        }catch (Exception e){
            log.error(e.getMessage());
            throw  new ApiException("An error occurred please try again");
        }
    }

    @Override
    public void deletePasswordToken(Long userId) {
        try {
            jdbcClient.sql(DELETE_PASSWORD_TOKEN_QUERY).param("userId",userId).update();
        }catch (EmptyResultDataAccessException exception){
            log.error(exception.getMessage());
            throw  new ApiException("Token not Found. Please try again");
        }catch (Exception e){
            log.error(e.getMessage());
            throw  new ApiException("An error occurred please try again");
        }
    }

    @Override
    public void deletePasswordToken(String token) {
        try {
            jdbcClient.sql(DELETE_PASSWORD_TOKEN_QUERY).param("token",token).update();
        }catch (EmptyResultDataAccessException exception){
            log.error(exception.getMessage());
            throw  new ApiException("Token not Found. Please try again");
        }catch (Exception e){
            log.error(e.getMessage());
            throw  new ApiException("An error occurred please try again");
        }
    }

    @Override
    public void updateImageUrl(String userUuid, String imageUrl) {
        try {
            jdbcClient.sql(UPDATE_USER_IMAGE_URI_QUERY).params(Map.of("userUuid",userUuid,"imageUrl",imageUrl)).update();
        }catch (EmptyResultDataAccessException exception){
            log.error(exception.getMessage());
            throw  new ApiException("User not Found. Please try again");
        }catch (Exception e){
            log.error(e.getMessage());
            throw  new ApiException("An error occurred please try again");
        }
    }

    @Override
    public String getPassword(String userUuid) {
        try {
            return jdbcClient.sql(SELECT_PASSWORD_USER_QUERY).param("userUuid",userUuid).query(String.class).single();
        }catch (EmptyResultDataAccessException exception){
            log.error(exception.getMessage());
            throw  new ApiException("Password Not Found. Please try again");
        }catch (Exception e){
            log.error(e.getMessage());
            throw  new ApiException("An error occurred please try again");
        }
    }

    @Override
    public String createPasswordToken(Long userId) {
        try {
            var token = randomUUUID.get();
            jdbcClient.sql(CREATE_PASSWORD_TOKEN_QUERY).params(Map.of("userId",userId,"token", token)).update();
            return token;
        }catch (EmptyResultDataAccessException exception){
            log.error(exception.getMessage());
            throw  new ApiException("Password Not Found. Please try again");
        }catch (Exception e){
            log.error(e.getMessage());
            throw  new ApiException("An error occurred please try again");
        }
    }

    @Override
    public RotationDto activateRotation(Long userId, Long pointVenteId) {
        try {
            // Solution corrigée avec la bonne syntaxe JdbcClient
            // 1. D'abord activer la rotation
            Map<String, Object> activationResult = jdbcClient
                    .sql("SELECT * FROM activer_rotation(:userId, :pointVenteId)")
                    .params(Map.of("userId", userId, "pointVenteId", pointVenteId))
                    .query()
                    .singleRow();  // ou .listOfRows().get(0) si singleRow() ne fonctionne pas

            // Vérifier le résultat
            if (activationResult.get("id_rotation") == null) {
                String message = (String) activationResult.get("message");
                throw new ApiException(message != null ? message : "Échec de l'activation de la rotation");
            }

            // 2. Puis récupérer les détails de la rotation active
            return jdbcClient
                    .sql(GET_ACTIVE_ROTATION_QUERY)
                    .param("userId", userId)
                    .query(RotationDto.class)
                    .single();

        } catch (EmptyResultDataAccessException exception) {
            log.error("Empty result: {}", exception.getMessage());
            throw new ApiException("Impossible d'activer la rotation. Vérifiez l'utilisateur et le point de vente");
        } catch (ApiException apiEx) {
            throw apiEx; // Re-lancer les ApiException
        } catch (Exception e) {
            log.error("Error: {}", e.getMessage());
            throw new ApiException("Une erreur est survenue lors de l'activation de la rotation");
        }
    }

    @Override
    public Integer deactivateRotation(Long userId) {
        try {
            return jdbcClient.sql(DEACTIVATE_ROTATION_QUERY)
                    .param("userId", userId)
                    .query(Integer.class)
                    .single();
        } catch (EmptyResultDataAccessException exception) {
            log.error(exception.getMessage());
            return 0; // Aucune rotation active trouvée
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new ApiException("Une erreur est survenue lors de la désactivation de la rotation");
        }
    }

    @Override
    public List<RotationDto> getRotationHistory(Long userId, Long pointVenteId, boolean activeOnly) {
        try {
            String query;
            MapSqlParameterSource params = new MapSqlParameterSource();

            if (activeOnly) {
                // Pour les rotations actives seulement
                if (userId != null && pointVenteId != null) {
                    query = SELECT_ACTIVE_ROTATIONS_WITH_FILTERS_QUERY;
                    params.addValue("userId", userId, BIGINT);
                    params.addValue("pointVenteId", pointVenteId, BIGINT);
                } else if (userId != null) {
                    query = SELECT_ACTIVE_ROTATIONS_BY_USER_QUERY;
                    params.addValue("userId", userId, BIGINT);
                } else if (pointVenteId != null) {
                    query = SELECT_ACTIVE_ROTATIONS_BY_PS_QUERY;
                    params.addValue("pointVenteId", pointVenteId, BIGINT);
                } else {
                    query = SELECT_ALL_ACTIVE_ROTATIONS_QUERY;
                }
            } else {
                // Pour tout l'historique
                if (userId != null && pointVenteId != null) {
                    query = SELECT_ROTATIONS_WITH_FILTERS_QUERY;
                    params.addValue("userId", userId, BIGINT);
                    params.addValue("pointVenteId", pointVenteId, BIGINT);
                } else if (userId != null) {
                    query = SELECT_ROTATIONS_BY_USER_QUERY;
                    params.addValue("userId", userId, BIGINT);
                } else if (pointVenteId != null) {
                    query = SELECT_ROTATIONS_BY_PS_QUERY;
                    params.addValue("pointVenteId", pointVenteId, BIGINT);
                } else {
                    query = SELECT_ALL_ROTATIONS_HISTORY_QUERY;
                }
            }

            return jdbcClient.sql(query)
                    .paramSource(params)
                    .query(RotationDto.class)
                    .list();

        } catch (Exception e) {
            log.error("Error fetching rotation history: {}", e.getMessage());
            throw new ApiException("Une erreur est survenue lors de la récupération de l'historique");
        }
    }

    private SqlParameterSource getParamSource(String userUuid, String qrCodeSecret)
    {
        return new MapSqlParameterSource()
                .addValue("userUuid",userUuid, VARCHAR)
                .addValue("qrCodeSecret",qrCodeSecret, VARCHAR)
                .addValue("qrCodeImageUri",qrCodeImageUri.apply(qrCodeSecret), VARCHAR);
    }

    // For AGENT_CREDIT role
    // Parameter source for AGENT_CREDIT
    private SqlParameterSource getParamSourceAccountAgentCredit(String firstName, String lastName,
                                                                String email, String username, String password,
                                                                String token, String phone, String bio,
                                                                Long delegationId, Long agenceId, Long pointventeId) {
        return new MapSqlParameterSource()
                .addValue("userUuid", randomUUUID.get(), VARCHAR)
                .addValue("firstName", firstName, VARCHAR)
                .addValue("lastName", lastName, VARCHAR)
                .addValue("email", email.trim().toLowerCase(), VARCHAR)
                .addValue("username", username.trim().toLowerCase(), VARCHAR)
                .addValue("memberId", memberId.get(), VARCHAR)
                .addValue("credentialUuid", randomUUUID.get(), VARCHAR)
                .addValue("password", password, VARCHAR)
                .addValue("token", token, VARCHAR)
                .addValue("delegationId", delegationId, BIGINT)
                .addValue("agenceId", agenceId, BIGINT)
                .addValue("pointventeId", pointventeId, BIGINT)
                .addValue("phone", phone, VARCHAR)
                .addValue("bio", bio, VARCHAR);
    }

    // Parameter source for DA
    private SqlParameterSource getParamSourceAccountDA(String firstName, String lastName,
                                                       String email, String username, String password,
                                                       String token, String phone, String bio,
                                                       Long delegationId, Long agenceId) {
        return new MapSqlParameterSource()
                .addValue("userUuid", randomUUUID.get(), VARCHAR)
                .addValue("firstName", firstName, VARCHAR)
                .addValue("lastName", lastName, VARCHAR)
                .addValue("email", email.trim().toLowerCase(), VARCHAR)
                .addValue("username", username.trim().toLowerCase(), VARCHAR)
                .addValue("memberId", memberId.get(), VARCHAR)
                .addValue("credentialUuid", randomUUUID.get(), VARCHAR)
                .addValue("password", password, VARCHAR)
                .addValue("token", token, VARCHAR)
                .addValue("delegationId", delegationId, BIGINT)
                .addValue("agenceId", agenceId, BIGINT)
                .addValue("phone", phone, VARCHAR)
                .addValue("bio", bio, VARCHAR);
    }


    // Keep the original method for other roles
    private SqlParameterSource getParamSourceAccount(String firstName, String lastName, String email,
                                                     String username, String password, String token, String roleName) {
        return new MapSqlParameterSource()
                .addValue("userUuid", randomUUUID.get(), VARCHAR)
                .addValue("firstName", firstName, VARCHAR)
                .addValue("lastName", lastName, VARCHAR)
                .addValue("email", email.trim().toLowerCase(), VARCHAR)
                .addValue("username", username.trim().toLowerCase(), VARCHAR)
                .addValue("memberId", memberId.get(), VARCHAR)
                .addValue("credentialUuid", randomUUUID.get(), VARCHAR)
                .addValue("password", password, VARCHAR)
                .addValue("token", token, VARCHAR)
                .addValue("roleName", roleName, VARCHAR);
    }

    private SqlParameterSource getParamSource(String firstName, String lastName, String email, String username, String password, String token)
    {
        return new MapSqlParameterSource()
                .addValue("userUuid",randomUUUID.get(), VARCHAR)
                .addValue("firstName",firstName, VARCHAR)
                .addValue("lastName",lastName, VARCHAR)
                .addValue("email",email.trim().toLowerCase(), VARCHAR)
                .addValue("username",username.trim().toLowerCase(), VARCHAR)
                .addValue("memberId", memberId.get(), VARCHAR)
                .addValue("credentialUuid", randomUUUID.get(), VARCHAR)
                .addValue("password",password, VARCHAR)
                .addValue("token",token, VARCHAR);
    }

    private SqlParameterSource getParamSource(String userUuid, String firstName, String lastName, String email, String phone, String bio, String address)
    {
        return new MapSqlParameterSource()
                .addValue("userUuid",userUuid, VARCHAR)
                .addValue("firstName",firstName, VARCHAR)
                .addValue("lastName",lastName, VARCHAR)
                .addValue("email",email.trim().toLowerCase(), VARCHAR)
                .addValue("phone",phone, VARCHAR)
                .addValue("bio",bio, VARCHAR)
                .addValue("address",address, VARCHAR);
    }


}
