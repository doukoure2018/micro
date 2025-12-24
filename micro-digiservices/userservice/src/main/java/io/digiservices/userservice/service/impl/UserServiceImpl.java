package io.digiservices.userservice.service.impl;

import io.digiservices.userservice.dto.AgentCreditDTO;
import io.digiservices.userservice.dto.AgentDisponibilityDto;
import io.digiservices.userservice.dto.RotationDto;
import io.digiservices.userservice.event.Event;
import io.digiservices.userservice.exception.ApiException;
import io.digiservices.userservice.model.*;
import io.digiservices.userservice.repository.UserRepository;
import io.digiservices.userservice.service.OrangeSmsService;
import io.digiservices.userservice.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.function.BiFunction;
import java.util.function.Function;

import static io.digiservices.userservice.constant.Constants.PHOTO_DIRECTORY;
import static io.digiservices.userservice.enumeration.EventType.*;
import static java.nio.file.StandardCopyOption.REPLACE_EXISTING;
import static java.util.Objects.nonNull;
import static org.apache.commons.lang.WordUtils.capitalizeFully;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl  implements UserService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder encoder;
    private final ApplicationEventPublisher publisher;
    private final OrangeSmsService orangeSmsService;

    @Value("${ui.app.url}")
    private String uiAppUrl;

    @Value("${sms.sender.name}")
    private String senderName;

    @Override
    public User getUserByEmail(String email) {
        return userRepository.getUserByEmail(email);
    }

    @Override
    public User getUserByUuid(String userUuid) {
        return userRepository.getUserByUuid(userUuid);
    }

    @Override
    public User updateUser(String userUuid, String firstName, String lastName, String email, String phone, String bio, String address) {
        return userRepository.updateUser(userUuid,firstName,lastName,email,phone,bio,address);
    }

    @Override
    public void createUser(String firstName, String lastName, String email, String username, String password)
    {
        // firstly get the token
        var token = userRepository.createUser(firstName,lastName,email,username,encoder.encode(password));
        System.out.println(token);
        publisher.publishEvent(new Event(USER_CREATED, Map.of("token", token,"name",capitalizeFully(firstName),"email",email)));

    }

    // Original method for backward compatibility
    @Override
    public void createAccountUser(String firstName, String lastName, String email, String username, String password, String roleName,String service) {
        log.info("Service: Creating standard user account for role: {}", roleName);

        var token = userRepository.createAccountUser(firstName, lastName, email, username,
                encoder.encode(password), roleName,service);

        System.out.println(token);
        publisher.publishEvent(new Event(USER_CREATED, Map.of(
                "token", token,
                "name", capitalizeFully(firstName),
                "email", email,
                "roleName", roleName
        )));
    }

    @Override
    public void createAccountAgentCreditAndDa(String firstName, String lastName, String email, String username,
                                              String password, String roleName, String phone, String bio,String service,
                                              Long delegationId, Long agenceId, Long pointventeId)
    {

        log.info("Service: Creating location-based account for role: {}", roleName);

        var token = userRepository.createAccountAgentCreditAndDa(
                firstName, lastName, email, username,
                encoder.encode(password), roleName, phone, bio,service,
                delegationId, agenceId, pointventeId
        );

        //System.out.println(token);
        // here i would like either send email or sms
        /**
         *  if roleName == 'CAISSE' send sms
         *  or send email
         */
        publisher.publishEvent(new Event(USER_CREATED, Map.of(
                "token", token,
                "name", capitalizeFully(firstName),
                "email", email,
                "roleName", roleName,
                "delegationId", delegationId != null ? delegationId.toString() : "N/A",
                "agenceId", agenceId != null ? agenceId.toString() : "N/A",
                "pointventeId", pointventeId != null ? pointventeId.toString() : "N/A"
        )));
    }

    private void sendSMS(String recipient, String message) {
        try {
            TokenResponse tokenResponse = orangeSmsService.getOAuthToken();

            CompletableFuture.runAsync(() -> {
                // CORRECTION: Vérifier null avant de comparer
                if (tokenResponse == null || tokenResponse.getStatus() == null || tokenResponse.getStatus() != 200) {
                    log.error("Failed to get valid OAuth token - Status: {}",
                            tokenResponse != null ? tokenResponse.getStatus() : "null");
                    throw new ApiException("Failed to get OAuth token");
                }

                try {
                    orangeSmsService.sendSms(tokenResponse.getToken(), recipient, senderName, message);
                    log.info("SMS sent successfully to {}", recipient);
                } catch (Exception e) {
                    log.error("Failed to send SMS to {}: {}", recipient, e.getMessage(), e);
                }
            }).exceptionally(ex -> {
                log.error("Exception in sendSMS", ex);
                return null;
            });
        } catch (Exception e) {
            log.error("Error initiating SMS send: {}", e.getMessage(), e);
        }
    }

    // Validation helper method
    private void validateLocationRequirements(String roleName, Long delegationId, Long agenceId, Long pointventeId) {
        if ("AGENT_CREDIT".equalsIgnoreCase(roleName)) {
            if (delegationId == null || agenceId == null || pointventeId == null) {
                throw new IllegalArgumentException("AGENT_CREDIT role requires delegation, agence, and point vente selection");
            }
        } else if ("DA".equalsIgnoreCase(roleName)) {
            if (delegationId == null || agenceId == null) {
                throw new IllegalArgumentException("DA role requires delegation and agence selection");
            }
        }
    }

    @Override
    public void verifyAccount(String token) {
        var accountToken = userRepository.getAccountToken(token);
        if(!nonNull(accountToken)){
            throw new ApiException("Invalid Link. Please try again.");
        }
        if(accountToken.isExpired()){
            userRepository.deleteAccountToken(token);
            throw new ApiException("Link has expired. Please Create your account again");
        }
        userRepository.updateAccountSettings(accountToken.getUserId());
        userRepository.deleteAccountToken(token);

    }

    @Override
    public User verifyPasswordToken(String token) {
        var passwordToken = userRepository.getPasswordToken(token);
        if(!nonNull(passwordToken)){
            throw new ApiException("Invalid Link. Please try again.");
        }
        if(passwordToken.isExpired()){
            userRepository.deletePasswordToken(token);
            throw new ApiException("Link has expired. Please Reset your password again");
        }
        return userRepository.getUserById(passwordToken.getUserId());
    }

    @Override
    public User enableMfa(String userUuid) {
        return userRepository.enableMfa(userUuid);
    }

    @Override
    public User disableMfa(String userUuid) {
        return userRepository.disableMfa(userUuid);
    }

    @Override
    public User uploadPhoto(String userUuid, MultipartFile file) {
        var user = userRepository.getUserByUuid(userUuid);
        var imageUrl=photoFunction.apply(user.getImageUrl(), file);
        userRepository.updateImageUrl(userUuid,imageUrl);
        user.setImageUrl(imageUrl + "?timestamp=" + System.currentTimeMillis());
        return user;
    }

    @Override
    public User toggleAccountExpired(String userUuid) {
        return userRepository.toggleAccountExpired(userUuid);
    }

    @Override
    public User toggleAccountLocked(String userUuid) {
        return userRepository.toggleAccountLocked(userUuid);
    }

    @Override
    public User toggleAccountEnabled(String userUuid) {
        return userRepository.toggleAccountEnabled(userUuid);
    }

    @Override
    public User toggleCredentialsExpired(String userUuid) {
        return null;
    }

    @Override
    public void updatePassword(String userUuid, String currentPassword, String newPassword, String confirmNewPassword) {
        if(!Objects.equals(confirmNewPassword,newPassword)){
            throw new ApiException("Password don't match. Please try again");
        }
        if(!encoder.matches(currentPassword, userRepository.getPassword(userUuid))){
            throw new ApiException("Existing password is incorrect. Please try again");
        }
        userRepository.updatePassword(userUuid,encoder.encode(newPassword));
    }

    @Override
    public User updateRole(String userUuid, String role) {
        return null;
    }

    @Override
    public void resetPassword(String email) {
        var user = userRepository.getUserByEmail(email);
        var passwordToken = userRepository.getPasswordToken(user.getUserId());
        if(!nonNull(passwordToken)){
             var newToken = userRepository.createPasswordToken(user.getUserId());
             publisher.publishEvent(new Event(RESETPASSWORD, Map.of("token", newToken,"email",email, "name", Objects.requireNonNull(capitalizeFully(user.getFirstName())))));
        } else if (passwordToken.isExpired()) {
            userRepository.deletePasswordToken(user.getUserId());
            var newToken = userRepository.createPasswordToken(user.getUserId());
            publisher.publishEvent(new Event(RESETPASSWORD, Map.of("token", newToken,"email",email, "name", capitalizeFully(user.getFirstName()))));
        }else {
            publisher.publishEvent(new Event(RESETPASSWORD, Map.of("token", passwordToken.getToken(),"email",email, "name", capitalizeFully(user.getFirstName()))));
        }
    }

    @Override
    public void doResetPassword(String userUuid, String token, String password, String confirmPassword) {
        if(!Objects.equals(confirmPassword, password)) {
            throw new ApiException("Passwords don't match. Please try again.");
        }
        var user = userRepository.getUserByUuid(userUuid);
        var passwordToken = userRepository.getPasswordToken(token);
        if(!Objects.equals(user.getUserId(), passwordToken.getUserId())) {
            throw new ApiException("Invalid link. Please try again.");
        }
        userRepository.updatePassword(userUuid, encoder.encode(password));
        userRepository.deletePasswordToken(user.getUserId());
    }

    @Override
    public List<User> getUsers() {
        return userRepository.getUsers();
    }

    @Override
    public List<Role> getRoles() {
        return userRepository.getRoles();
    }

    @Override
    public User getAssignee(String ticketUuid) {
        return userRepository.getAssignee(ticketUuid);
    }

    @Override
    public Credential getCredential(String userUuid) {
        return userRepository.getCredential(userUuid);
    }

    @Override
    public List<Device> getDevices(String userUuid) {
        return userRepository.getDevices(userUuid);
    }

    @Override
    public User getUserId(Long userId) {
        return userRepository.getUserById(userId);
    }

    @Override
    public RotationDto activateRotation(Long userId, Long pointVenteId) {
        log.info("Activating rotation for user {} at point de vente {}", userId, pointVenteId);
        return userRepository.activateRotation(userId, pointVenteId);
    }

    @Override
    public Integer deactivateRotation(Long userId) {
        log.info("Deactivating all rotations for user {}", userId);
        return userRepository.deactivateRotation(userId);
    }

    @Override
    public List<RotationDto> getRotationHistory(Long userId, Long pointVenteId, boolean activeOnly) {
        log.info("Getting rotation history - userId: {}, pointVenteId: {}, activeOnly: {}",
                userId, pointVenteId, activeOnly);
        return userRepository.getRotationHistory(userId, pointVenteId, activeOnly);
    }

    @Override
    public List<AgentCreditDTO> getListAgentCredit(Long agenceId) {
        return userRepository.getListAgentCredit(agenceId);
    }

    @Override
    public AgentDisponibilityDto getDisponibilityAgent(Long userId, Long pointVenteId) {
        log.info("Checking disponibility for user {} on point vente {}", userId, pointVenteId);

        try {
            AgentDisponibilityDto disponibility = userRepository.checkAgentDisponibility(userId, pointVenteId);

            // Ajouter un message descriptif
            if (disponibility.getIsActive()) {
                disponibility.setMessage("Agent actif sur ce point de vente");
            } else {
                disponibility.setMessage("Agent non actif sur ce point de vente");
            }

            log.info("Disponibility result: {}", disponibility);
            return disponibility;

        } catch (Exception e) {
            log.error("Error checking agent disponibility: {}", e.getMessage());
            // Retourner un objet par défaut en cas d'erreur
            return AgentDisponibilityDto.builder()
                    .userId(userId)
                    .pointVenteId(pointVenteId)
                    .isActive(false)
                    .message("Erreur lors de la vérification")
                    .build();
        }

    }


    private final Function<String, String> fileExtension = filename -> Optional.of(filename).filter(name -> name.contains("."))
            .map(name -> "." + name.substring(filename.lastIndexOf(".") + 1)).orElse(".png");

    private final BiFunction<String, MultipartFile, String> photoFunction = (String imageUrl, MultipartFile image) -> {
        try {
            var filename = imageUrl.split("/")[imageUrl.split("/").length - 1].split("\\.")[0] + fileExtension.apply(image.getOriginalFilename());
            var existingImage = Paths.get(PHOTO_DIRECTORY + imageUrl.split("/")[imageUrl.split("/").length - 1]);
            var fileStorageLocation = Paths.get(PHOTO_DIRECTORY).toAbsolutePath().normalize();
            if(!Files.exists(fileStorageLocation)) { Files.createDirectories(fileStorageLocation); }
            if(Files.exists(existingImage)) { Files.deleteIfExists(existingImage); }
            Files.copy(image.getInputStream(), fileStorageLocation.resolve(filename), REPLACE_EXISTING);
            return ServletUriComponentsBuilder
                    .fromCurrentContextPath()
                    .path("/user/image/" + filename).toUriString();
        } catch (Exception exception) {
            log.error(exception.getMessage());
            throw new ApiException("Unable to save image");
        }
    };

    // ========================================
    // AUTORISATION UTILISATEUR
    // ========================================

    @Override
    public void updateUserAuthorization(Long userId, boolean isAuthorized) {
        log.info("Mise à jour de l'autorisation pour l'utilisateur {}: {}", userId, isAuthorized);
        userRepository.updateUserAuthorization(userId, isAuthorized);
    }

    @Override
    public Boolean getUserAuthorizationStatus(Long userId) {
        log.info("Récupération du statut d'autorisation pour l'utilisateur {}", userId);
        return userRepository.getUserAuthorizationStatus(userId);
    }

    @Override
    public List<User> getUsersByRole(String roleName) {
        log.info("Récupération des utilisateurs avec le rôle: {}", roleName);
        return userRepository.getUsersByRole(roleName);
    }

}
