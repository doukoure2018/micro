package io.digiservices.userservice.repository.impl;


import io.digiservices.userservice.dto.AgentCreditDTO;
import io.digiservices.userservice.dto.AgentDisponibilityDto;
import io.digiservices.userservice.dto.RotationDto;
import io.digiservices.userservice.exception.ApiException;
import io.digiservices.userservice.model.*;
import io.digiservices.userservice.repository.UserRepository;
import io.digiservices.userservice.service.OrangeSmsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import static io.digiservices.userservice.query.UserQuery.*;
import static io.digiservices.userservice.utils.UserUtils.*;
import static java.sql.Types.BIGINT;
import static java.sql.Types.VARCHAR;
import static org.apache.commons.lang3.function.Failable.getAsLong;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserRepositoryImpl implements UserRepository {

    private final JdbcClient jdbcClient;
    private final OrangeSmsService orangeSmsService;

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
    public String createAccountUser(String firstName, String lastName, String email, String username, String password, String roleName,String service) {
        try {
            var token = randomUUUID.get();

            log.info("Creating standard user account for role: {}", roleName);

            jdbcClient.sql(CREATE_ACCOUNT_STORED_PROCEDURE)
                    .paramSource(getParamSourceAccount(firstName, lastName, email, username, password, token, roleName,service))
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
                                                String service, Long delegationId, Long agenceId, Long pointventeId)
    {
        try {
            var token = randomUUUID.get();

            log.info("Creating location-based account for role: {}", roleName);
            log.info("Location parameters: delegationId={}, agenceId={}, pointventeId={}",
                    delegationId, agenceId, pointventeId);

            if(roleName.equalsIgnoreCase("AGENT_CREDIT")) {
                // Validate required parameters for AGENT_CREDIT
                if(delegationId == null || agenceId == null || pointventeId == null) {
                    throw new ApiException("AGENT_CREDIT role requires delegation, agence, and point vente selection");
                }

                log.info("Creating AGENT_CREDIT account");
                jdbcClient.sql(CREATE_ACCOUNT_AGENT_CREDIT_STORED_PROCEDURE)
                        .paramSource(getParamSourceAccountAgentCredit(firstName, lastName, email, username,
                                password, token, phone, bio,service, delegationId, agenceId, pointventeId))
                        .update();

            } else if(roleName.equalsIgnoreCase("CAISSE")) {
                // Validate required parameters for CAISSE
                if(delegationId == null || agenceId == null || pointventeId == null) {
                    throw new ApiException("CAISSE role requires delegation, agence, and point vente selection");
                }

                log.info("Creating CAISSE account");
                jdbcClient.sql(CREATE_ACCOUNT_CAISSE_STORED_PROCEDURE)
                        .paramSource(getParamSourceAccountAgentCredit(firstName, lastName, email, username,
                                password, token, phone, bio, service ,delegationId, agenceId, pointventeId))
                        .update();

            } else if(roleName.equalsIgnoreCase("AGENT_CORRECTEUR")) {
                // Validate required parameters for AGENT_CORRECTEUR
                if(delegationId == null || agenceId == null || pointventeId == null) {
                    throw new ApiException("AGENT_CORRECTEUR role requires delegation, agence, and point vente selection");
                }

                log.info("Creating AGENT_CORRECTEUR account");
                jdbcClient.sql(CREATE_ACCOUNT_AGENT_CORRECTEUR_STORED_PROCEDURE)
                        .paramSource(getParamSourceAccountAgentCredit(firstName, lastName, email, username,
                                password, token, phone, bio,service, delegationId, agenceId, pointventeId))
                        .update();

            } else if (roleName.equalsIgnoreCase("DA")){
                // Validate required parameters for DA
                if(delegationId == null || agenceId == null) {
                    throw new ApiException("DA role requires delegation and agence selection");
                }

                log.info("Creating DA account");
                jdbcClient.sql(CREATE_ACCOUNT_DA_STORED_PROCEDURE)
                        .paramSource(getParamSourceAccountDA(firstName, lastName, email, username,
                                password, token, phone, bio,service,delegationId, agenceId))
                        .update();

            } else if (roleName.equalsIgnoreCase("RA")){
                // Validate required parameters for DA
                if(delegationId == null || agenceId == null) {
                    throw new ApiException("RA role requires delegation and agence selection");
                }

                log.info("Creating DA account");
                jdbcClient.sql(CREATE_ACCOUNT_DA_STORED_PROCEDURE)
                        .paramSource(getParamSourceAccountDA(firstName, lastName, email, username,
                                password, token, phone, bio,service,delegationId, agenceId))
                        .update();

            }else {
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

    @Override
    public List<AgentCreditDTO> getListAgentCredit(Long agenceId) {
        try {
            log.info("📥 Fetching agents credit for agence: {}", agenceId);

            // Récupérer les lignes brutes
            List<Map<String, Object>> rows = jdbcClient
                    .sql(GET_LIST_AGENT_CREDIT_BY_AGENCE)
                    .param("agenceId", agenceId)
                    .query()
                    .listOfRows();

            if (rows.isEmpty()) {
                log.warn("⚠️ No agents found for agence: {}", agenceId);
                return List.of();
            }

            log.info("📊 Found {} raw rows for agence {}", rows.size(), agenceId);

            // Mapper manuellement chaque ligne
            List<AgentCreditDTO> agents = rows.stream()
                    .map(this::mapToAgentCreditDTO)
                    .toList();

            log.info("✅ Successfully mapped {} agents for agence {}", agents.size(), agenceId);

            // Log un exemple pour vérification
            if (!agents.isEmpty()) {
                AgentCreditDTO firstAgent = agents.get(0);
                log.info("🔍 Premier agent mappé: username={}, userId={}, pointventeId={}",
                        firstAgent.getUsername(),
                        firstAgent.getUserId(),
                        firstAgent.getPointventeId());
            }

            return agents;

        } catch (EmptyResultDataAccessException exception) {
            log.warn("⚠️ No agents found (EmptyResult): {}", exception.getMessage());
            return List.of();
        } catch (Exception e) {
            log.error("❌ Error fetching agents credit: {}", e.getMessage(), e);
            throw new ApiException("Une erreur est survenue lors de la récupération des agents");
        }
    }

    /**
     * Mapper une ligne SQL vers AgentCreditDTO
     */
    private AgentCreditDTO mapToAgentCreditDTO(Map<String, Object> row) {
        try {
            // Log de la ligne brute pour debugging
            log.debug("🔍 Mapping row: {}", row);

            // Extraction sécurisée des valeurs
            Long userId = extractLong(row, "user_id");
            Long agenceId = extractLong(row, "agence_id");
            Long pointventeId = extractLong(row, "pointvente_id");

            String firstName = extractString(row, "first_name");
            String lastName = extractString(row, "last_name");
            String username = extractString(row, "username");
            String email = extractString(row, "email");
            String phone = extractString(row, "phone");

            String delegationLibele = extractString(row, "delegation_libele");
            String agenceLibele = extractString(row, "agence_libele");
            String pointventeLibele = extractString(row, "pointvente_libele");
            String pointventeCode = extractString(row, "pointvente_code");
            String roleName = extractString(row, "role_name");

            // Calculer fullName
            String fullName = buildFullName(firstName, lastName);

            // Calculer pointVenteDisplay
            String pointVenteDisplay = buildPointVenteDisplay(pointventeLibele, pointventeCode);

            // Construire le DTO
            AgentCreditDTO dto = AgentCreditDTO.builder()
                    .delegationLibele(delegationLibele)
                    .agenceId(agenceId)
                    .agenceLibele(agenceLibele)
                    .pointventeLibele(pointventeLibele)
                    .pointventeCode(pointventeCode)
                    .pointventeId(pointventeId)
                    .userId(userId)
                    .username(username)
                    .firstName(firstName)
                    .lastName(lastName)
                    .email(email)
                    .phone(phone)
                    .roleName(roleName)
                    .fullName(fullName)
                    .pointVenteDisplay(pointVenteDisplay)
                    .build();

            // Log le DTO mappé pour vérification
            log.debug("✅ Mapped DTO: userId={}, username={}, pointventeId={}",
                    dto.getUserId(), dto.getUsername(), dto.getPointventeId());

            return dto;

        } catch (Exception e) {
            log.error("❌ Error mapping row to AgentCreditDTO: {}", e.getMessage());
            log.error("Row content: {}", row);
            throw new RuntimeException("Erreur lors du mapping des données agent", e);
        }
    }

    /**
     * Extraire un Long de manière sûre
     */
    private Long extractLong(Map<String, Object> row, String key) {
        Object value = row.get(key);
        if (value == null) {
            return null;
        }
        if (value instanceof Number) {
            return ((Number) value).longValue();
        }
        log.warn("⚠️ Unexpected type for {}: {}", key, value.getClass());
        return null;
    }

    /**
     * Extraire un String de manière sûre
     */
    private String extractString(Map<String, Object> row, String key) {
        Object value = row.get(key);
        if (value == null) {
            return null;
        }
        return value.toString();
    }

    /**
     * Construire le nom complet
     */
    private String buildFullName(String firstName, String lastName) {
        if (firstName == null && lastName == null) {
            return "";
        }
        if (firstName == null) {
            return lastName;
        }
        if (lastName == null) {
            return firstName;
        }
        return (firstName + " " + lastName).trim();
    }

    /**
     * Construire l'affichage du point de vente
     */
    private String buildPointVenteDisplay(String libele, String code) {
        if (libele == null && code == null) {
            return "Non assigné";
        }
        if (libele != null && code != null) {
            return libele + " (" + code + ")";
        }
        if (libele != null) {
            return libele;
        }
        return "Code: " + code;
    }

    @Override
    public AgentDisponibilityDto checkAgentDisponibility(Long userId, Long pointVenteId) {
        String sql = "SELECT * FROM check_agent_disponibility(:userId, :pointVenteId)";

        try {
            Map<String, Object> result = jdbcClient.sql(sql)
                    .param("userId", userId)
                    .param("pointVenteId", pointVenteId)
                    .query()
                    .singleRow();

            Boolean isActive = (Boolean) result.get("is_active");
            Long currentPs = result.get("current_ps") != null ?
                    ((Number) result.get("current_ps")).longValue() : null;

            Timestamp timestamp = (Timestamp) result.get("rotation_date");
            LocalDateTime rotationDate = timestamp != null ? timestamp.toLocalDateTime() : null;

            return AgentDisponibilityDto.builder()
                    .userId(userId)
                    .pointVenteId(pointVenteId)
                    .isActive(isActive != null ? isActive : false)
                    .currentPs(currentPs)
                    .rotationDate(rotationDate)
                    .message(isActive != null && isActive ?
                            "Agent actif sur ce point de vente" :
                            "Agent non actif sur ce point de vente")
                    .build();

        } catch (Exception e) {
            log.error("Error checking disponibility: {}", e.getMessage(), e);
            return AgentDisponibilityDto.builder()
                    .userId(userId)
                    .pointVenteId(pointVenteId)
                    .isActive(false)
                    .message("Erreur lors de la vérification: " + e.getMessage())
                    .build();
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
                                                                String service,Long delegationId, Long agenceId, Long pointventeId) {
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
                .addValue("bio", bio, VARCHAR)
                .addValue("service", service, VARCHAR);
    }

    // Parameter source for DA
    private SqlParameterSource getParamSourceAccountDA(String firstName, String lastName,
                                                       String email, String username, String password,
                                                       String token, String phone, String bio,String service,
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
                .addValue("bio", bio, VARCHAR)
                .addValue("service", service, VARCHAR);
    }


    // Keep the original method for other roles
    private SqlParameterSource getParamSourceAccount(String firstName, String lastName, String email,
                                                     String username, String password, String token, String roleName,String service) {
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
                .addValue("roleName", roleName, VARCHAR)
                .addValue("service", service, VARCHAR);
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
