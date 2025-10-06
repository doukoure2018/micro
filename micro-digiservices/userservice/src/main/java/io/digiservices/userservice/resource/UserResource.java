package io.digiservices.userservice.resource;
import io.digiservices.clients.EbankingClient;
import io.digiservices.userservice.domain.Response;
import io.digiservices.userservice.dto.*;
import io.digiservices.userservice.exception.ApiException;
import io.digiservices.userservice.model.User;
import io.digiservices.userservice.service.AgenceService;
import io.digiservices.userservice.service.DelegationService;
import io.digiservices.userservice.service.PointVenteService;
import io.digiservices.userservice.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpResponse;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;

import static io.digiservices.userservice.constant.Constants.PHOTO_DIRECTORY;
import static io.digiservices.userservice.utils.RequestUtils.getResponse;

import static java.util.Collections.emptyMap;
import static org.springframework.http.HttpStatus.*;
import static org.springframework.http.ResponseEntity.*;


@RestController
@AllArgsConstructor
@RequestMapping("/user")
@Slf4j
public class UserResource {
    private final UserService userService;

    private final DelegationService delegationService;

    private final AgenceService agenceService;
    private final PointVenteService pointVenteService;

    private final EbankingClient ebankingClient;


    // When user is not logged in
    @PostMapping("/register")
    public ResponseEntity<Response> register(@RequestBody UserRequest user, HttpServletRequest request) {
        userService.createUser(user.getFirstName(), user.getLastName(), user.getEmail(), user.getUsername(), user.getPassword());
        return created(getUri()).body(getResponse(request, emptyMap(), "Account created. Check your email to enable your account", CREATED));
    }

    // Create User when logging
    @PostMapping("/createAccount")
    public ResponseEntity<Response> createAccount(@NotNull Authentication authentication, @RequestBody UserAccount user, HttpServletRequest request) {

        log.info("Creating account for role: {}", user.getRoleName());
        log.info("User data: {}", user);

        try {
            // Create account based on role type
            createAccountByRole(user);

            return created(getUri()).body(getResponse(request, emptyMap(),
                    "Compte crée. Vous pouvez maintenant verifier votre compte email pour activer", CREATED));

        } catch (IllegalArgumentException | ApiException e) {
            log.error("Validation/API error: {}", e.getMessage());
            return badRequest().body(getResponse(request, emptyMap(), e.getMessage(), BAD_REQUEST));

        } catch (Exception e) {
            log.error("Error creating account: ", e);
            return status(INTERNAL_SERVER_ERROR).body(getResponse(request, emptyMap(),
                    "An error occurred while creating the account", INTERNAL_SERVER_ERROR));
        }
    }

    private void createAccountByRole(UserAccount user) {
        if (isLocationBasedRole(user.getRoleName())) {
            log.info("Creating location-based account using createAccountAgentCreditAndDa");
            log.info("Location data - delegationId: {}, agenceId: {}, pointventeId: {}",
                    user.getDelegationId(), user.getAgenceId(), user.getPointventeId());

            userService.createAccountAgentCreditAndDa(
                    user.getFirstName(), user.getLastName(), user.getEmail(),
                    user.getUsername(), user.getPassword(), user.getRoleName(),
                    user.getPhone(), user.getBio(), user.getDelegationId(),
                    user.getAgenceId(), user.getPointventeId()
            );
        } else {
            log.info("Creating standard account using createAccountUser");
            userService.createAccountUser(
                    user.getFirstName(), user.getLastName(), user.getEmail(),
                    user.getUsername(), user.getPassword(), user.getRoleName()
            );
        }
    }

    private boolean isLocationBasedRole(String roleName) {
        return "AGENT_CREDIT".equalsIgnoreCase(roleName) || "DA".equalsIgnoreCase(roleName);
    }
    // When user is not logged in
    @GetMapping("/verify/account")
    public ResponseEntity<Response> verifyAccount(@RequestParam("token") String token, HttpServletRequest request) {
        userService.verifyAccount(token);
        return ok(getResponse(request, emptyMap(), "Account verified. You may login now", OK));
    }

    // When user is logged in
    @PatchMapping("/mfa/enable")
    public ResponseEntity<Response> enableMfa(@NotNull Authentication authentication, HttpServletRequest request) {
          var user= userService.enableMfa(authentication.getName());
        return ok(getResponse(request, Map.of("user",user), "2FA enabled Successfully", OK));
    }

    // When user is logged in
    @PatchMapping("/mfa/disabled")
    public ResponseEntity<Response> disableMfa(@NotNull Authentication authentication, HttpServletRequest request) {
          var user= userService.disableMfa(authentication.getName());
        return ok(getResponse(request, Map.of("user",user), "2FA disabled Successfully", OK));
    }

    // When user is logged in
    @GetMapping("/profile")
    public ResponseEntity<Response> profile(@NotNull Authentication authentication, HttpServletRequest request) {
        System.out.println(authentication.getName());
        var user= userService.getUserByUuid(authentication.getName());
        var devices = userService.getDevices(authentication.getName());
        return ok(getResponse(request, Map.of("user",user,"devices",devices), "Profile retrieved", OK));
    }

    @GetMapping("/instanceUser")
    public ResponseEntity<Response> getUserInfo(@NotNull Authentication authentication, HttpServletRequest request) {
        System.out.println(authentication.getName());
        var user= userService.getUserByUuid(authentication.getName());
        return ok(getResponse(request, Map.of("user",user), "user retrieved Successfully", OK));
    }

    // When user is  logged in
    @GetMapping("/userUuid")
    public ResponseEntity<Response> getUserUuid(@NotNull Authentication authentication,@PathVariable("userUuid") String userUuid, HttpServletRequest request) {
        var user= userService.getUserByUuid(userUuid);
        return ok(getResponse(request, Map.of("user", user), "Profile retrieved", OK));
    }


    // When user is logged in
    @GetMapping("/assignee/{ticketUuid}")
    public ResponseEntity<Response> getAssigneeByUuid(@NotNull Authentication authentication,@PathVariable("ticketUuid") String ticketUuid, HttpServletRequest request) {
        var user= userService.getAssignee(ticketUuid);
        return ok(getResponse(request, Map.of("user",user), "Profile retrieved", OK));
    }


    // When user is  logged in
    @GetMapping("/user/{email}")
    public ResponseEntity<Response> getUserEmail(@NotNull Authentication authentication, @PathVariable("email") String email, HttpServletRequest request) {
        var user= userService.getUserByEmail(email);
        return ok(getResponse(request, Map.of("user",user), "Profile retrieved", OK));
    }

    // When user is  logged in
    @GetMapping("/credential/{userUuid}")
    public ResponseEntity<Response> getCredential(@NotNull Authentication authentication, @PathVariable("userUuid") String userUuid, HttpServletRequest request) {
        var credential = userService.getCredential(userUuid);
        return ok(getResponse(request, Map.of("credential",credential), "Profile retrieved", OK));
    }


    // When user is  logged in
    @PatchMapping("/{update}")
    public ResponseEntity<Response> updateUser(@NotNull Authentication authentication, @RequestBody UserRequest user, HttpServletRequest request) {
        var updatedUser = userService.updateUser(authentication.getName(),user.getFirstName(),user.getLastName(),user.getEmail(),user.getPhone(),user.getBio(),user.getAddress());
        return ok(getResponse(request, Map.of("user",updatedUser), "User Updated Successfully", OK));
    }

    // When user is  logged in
    @PatchMapping("/{updateRole}")
    public ResponseEntity<Response> updateRole(@NotNull Authentication authentication, @RequestBody RoleRequest role, HttpServletRequest request) {
        var updatedRole = userService.updateRole(authentication.getName(), role.getRole());
        return ok(getResponse(request, Map.of("user",updatedRole), "Role Updated Successfully", OK));
    }

    // When user is logged in
    @PatchMapping("/toggleaccountexpired")
    public ResponseEntity<Response> toggleaccountexpired(@NotNull Authentication authentication, HttpServletRequest request) {
        var user = userService.toggleAccountExpired(authentication.getName());
        return ok(getResponse(request, Map.of("user",user), "User Updated Successfully", OK));
    }

    // When user is logged in
    @PatchMapping("/toggleaccountlocked")
    public ResponseEntity<Response> toggleaccountlocked(@NotNull Authentication authentication, HttpServletRequest request) {
        var user = userService.toggleAccountLocked(authentication.getName());
        return ok(getResponse(request, Map.of("user",user), "User Updated Successfully", OK));
    }

    // When user is logged in
    @PatchMapping("/toggleaccountenabled")
    public ResponseEntity<Response> toggleaccountenabled(@NotNull Authentication authentication, HttpServletRequest request) {
        var user = userService.toggleAccountEnabled(authentication.getName());
        return ok(getResponse(request, Map.of("user",user), "User Updated Successfully", OK));
    }

    // When user is logged in
    @PostMapping("/updatepassword")
    public ResponseEntity<Response> updatePassword(@NotNull Authentication authentication, @RequestBody PasswordRequest passwordRequest, HttpServletRequest request) {
        userService.updatePassword(authentication.getName(), passwordRequest.getCurrentPassword(), passwordRequest.getNewPassword(), passwordRequest.getConfirmedPassword());
        return ok(getResponse(request, emptyMap(), "User Updated Successfully", OK));
    }

    // When user is not logged in
    @PostMapping("/resetpassword")
    public ResponseEntity<Response> resetPassword(@RequestParam("email") String email, HttpServletRequest request) {
         userService.resetPassword(email);
        return ok(getResponse(request, emptyMap(), "We sent you an email for you to reset your password", OK));
    }

    // When user is not logged in
    @GetMapping("/verify/password")
    public ResponseEntity<Response> verifyPassword(@RequestParam("token") String token, HttpServletRequest request) {
        var user = userService.verifyPasswordToken(token);
        return ok(getResponse(request, Map.of("user",user), "Enter your new password", OK));
    }

    // When user is not logged in
    @PostMapping("/resetpassword/reset")
    public ResponseEntity<Response> doResetPassword(@RequestBody ResetPasswordRequest passwordRequest, HttpServletRequest request) {
        userService.doResetPassword(passwordRequest.getUserUuid(),passwordRequest.getToken(),passwordRequest.getPassword(),passwordRequest.getConfirmPassword());
        return ok(getResponse(request, emptyMap(), "Password reset Successfully. You may login now", OK));
    }


    // When user is logged in
    @GetMapping("/list")
    public ResponseEntity<Response> getUsers(@NotNull Authentication authentication, HttpServletRequest request) {
        return ok(getResponse(request, Map.of("users",userService.getUsers()), "List of Users Retreived Successfully", OK));
    }

    @GetMapping("/roles")
    public ResponseEntity<Response> getRoles(@NotNull Authentication authentication, HttpServletRequest request) {
        return ok(getResponse(request, Map.of(
                                   "roles",userService.getRoles(),
                                   "delegations", delegationService.getAllDelegation(),
                                    "agences", agenceService.getListAgence(),
                                    "pointVentes", pointVenteService.getAllPointVente()),
                              "List of Roles Retreived Successfully", OK));
    }

    // When user is logged in
    @GetMapping("/photo")
    public ResponseEntity<Response> uploadPhoto(@NotNull Authentication authentication, @RequestParam("file") MultipartFile file, HttpServletRequest request) {
        var user = userService.uploadPhoto(authentication.getName(),file);
        return ok(getResponse(request, Map.of("user",user), "User Updated Successfully", OK));
    }

    @GetMapping("/image/{filename}")
    public byte []  getPhoto(@PathVariable("filename") String filename) throws IOException {
        return Files.readAllBytes((Paths.get(PHOTO_DIRECTORY + filename)));
    }

    private URI getUri() {
        return URI.create("/user/profile/userId");
    }


    /**
     *   Get User information via Communication Open Feign
     */
    @GetMapping("/getUser/{userId}")
    public ResponseEntity<User> getUserById(@PathVariable(name = "userId") Long userId) {
        var user= userService.getUserId(userId);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/getUserSaf/{codUser}")
    public ResponseEntity<Response> getActiveUser(
            @NotNull Authentication authentication,
            @PathVariable(value = "codUser") String codUser,
            HttpServletRequest request
    ){
        String codPs = codUser.substring(codUser.length() - 3);
        return ok(getResponse(request, Map.of("usuario",ebankingClient.getUsuarios("00000",codPs,codUser)), "User Updated Successfully", OK));
    }

    /**
     *  Ajout Delegation
     */

    @PostMapping("/addDelegation")
    public ResponseEntity<Response> addDelegation(@NotNull Authentication authentication, @RequestBody DelegationDto delegationDto, HttpServletRequest request)
    {
        delegationService.saveDelegation(delegationDto);
        return ok(getResponse(request,emptyMap(), "Success", CREATED));
    }

    @GetMapping("/getAllDelegations")
    public ResponseEntity<Response> getAllDelegation(@NotNull Authentication authentication,HttpServletRequest request)
    {
        return ok(getResponse(request, Map.of("delegations",delegationService.getAllDelegation()), "Success", OK));

    }

    @GetMapping("/offLine/getAllDelegations")
    public ResponseEntity<List<DelegationDto>> getAllDelegationOffLine()
    {
        return ResponseEntity.ok(delegationService.getAllDelegation());
    }

    @GetMapping("/offLine/getAllDelegation/{delegationId}")
    public ResponseEntity<DelegationDto> getAllDelegationOffLineById(
                 @PathVariable(name = "delegationId") Long delegationId
    )
    {
        return ResponseEntity.ok(delegationService.getDelegationById(delegationId));
    }

    @GetMapping("/delegation/{id_delegation}")
    public ResponseEntity<Response> getDelegation(@NotNull Authentication authentication,HttpServletRequest request,
                                                       @PathVariable(name = "id_delegation") Long id_delegation)
    {
        return ok(getResponse(request, Map.of("delegation",delegationService.getDelegationById(id_delegation)), "Success", OK));

    }

    /**
     *  Ajout Agence
     */

    @PostMapping("/addAgence")
    public ResponseEntity<Response> addAgence(@NotNull Authentication authentication,@RequestBody AgenceDto agenceDto,HttpServletRequest request)
    {
        agenceService.addAgence(agenceDto);
        return ok(getResponse(request, emptyMap(), "Success", CREATED));

    }

    @GetMapping("/getAllAgences/{delegationId}")
    public ResponseEntity<Response> agences(@NotNull Authentication authentication,@PathVariable(name = "delegationId") Long delegationId, HttpServletRequest request)
    {
        return ok(getResponse(request, Map.of("agences",agenceService.getListAgenceByDelegationId(delegationId)), "Liste des Agences", OK));

    }

    @GetMapping("/agence/{agence_id}")
    public ResponseEntity<Response> agence(@NotNull Authentication authentication,@PathVariable(name = "agence_id") Long agence_id,HttpServletRequest request)
    {
        return ok(getResponse(request, Map.of("agence",agenceService.getAgence(agence_id)), "Liste des Agences", OK));
    }

    @GetMapping("/offLine/getAllAgences")
    public ResponseEntity<List<AgenceDto>> allAgenceOfLine()
    {
        return ResponseEntity.ok(agenceService.getListAgence());
    }

    /**
     *  Ajout Information Point de Service
     */

    @PostMapping("/addPointVente")
    public ResponseEntity<Response> addPointVente(@NotNull Authentication authentication,
                                                      @RequestBody PointVenteDto pointVenteDto,
                                                      HttpServletRequest request)
    {
        pointVenteService.addPointVente(pointVenteDto);
        return ok(getResponse(request,emptyMap(), "Success", CREATED));

    }

    @GetMapping("/getAllPointVentes/{agence_id}")
    public ResponseEntity<Response> pointventes(@NotNull Authentication authentication,
                                                @PathVariable(name = "agence_id") Long agence_id,
                                                HttpServletRequest request)
    {
        return ok(getResponse(request, Map.of("pointVentes",pointVenteService.getAllPointVenteByAgenceId(agence_id)), "Liste des Points de vente", OK));
    }

    @GetMapping("/pointvente/{idPs}")
    public ResponseEntity<Response> pointvente(@NotNull Authentication authentication,
                                                    @PathVariable(name = "idPs") Long idPs,
                                                    HttpServletRequest request)
    {
        return ok(getResponse(request, Map.of("pointVente",pointVenteService.getPointVenteById(idPs)), "Information Point de Vente", OK));
    }

    @GetMapping("/offLine/getAllPointVente")
    public ResponseEntity<List<PointVenteDto>> pointVenteOffline()
    {
        return ResponseEntity.ok(pointVenteService.getAllPointVente());
    }

    @GetMapping("/offLine/getAllPointVentes/{agence_id}")
    public ResponseEntity<List<PointVenteDto>> getAllPointVentes(@PathVariable(name = "agence_id") Long agence_id)
    {
        return ResponseEntity.ok(pointVenteService.getAllPointVenteByAgenceId(agence_id));
    }

    /**
     * Communication OpenFeign
     * @param idPs
     * @return
     */
    @GetMapping("/client/pointvente/{idPs}")
    public ResponseEntity<PointVenteDto> getPointVenteClient(@PathVariable(name = "idPs") Long idPs)
    {
        return ResponseEntity.ok(pointVenteService.getPointVenteById(idPs));
    }

    @GetMapping("/client/agence/{agence_id}")
    public ResponseEntity<AgenceDto> getAgenceById(@PathVariable(name = "agence_id") Long agence_id)
    {
        return ResponseEntity.ok(agenceService.getAgence(agence_id));
    }

    /**
     *  To get UserUuid through OpenFeign Communication
     * @param userUuid
     * @return
     */
    @GetMapping("/offLine/getUserByUuid/{userUuid}")
    public ResponseEntity<User> getUserByUuid(@PathVariable("userUuid") String userUuid) {
        var user= userService.getUserByUuid(userUuid);
        return ResponseEntity.ok(user);
    }



    /**
     * Endpoints pour la gestion des rotations
     */

// Activer une rotation pour un utilisateur
    @PostMapping("/rotation/activate")
    public ResponseEntity<Response> activateRotation(
            @NotNull Authentication authentication,
            @RequestBody RotationRequest rotationRequest,
            HttpServletRequest request) {
        try {
            // Log qui fait l'action et sur qui
            log.info("User {} is activating rotation for user {} at point de vente {}",
                    authentication.getName(),
                    rotationRequest.getUserId(),
                    rotationRequest.getPointVenteId());

            // Optionnel : Vérifier les permissions de l'utilisateur connecté
            if (!hasRotationManagementPermission(authentication)) {
                return status(FORBIDDEN).body(getResponse(request,
                        emptyMap(),
                        "Vous n'avez pas les permissions pour gérer les rotations",
                        FORBIDDEN));
            }

            var result = userService.activateRotation(
                    rotationRequest.getUserId(),
                    rotationRequest.getPointVenteId()
            );

            // Log de succès avec détails de qui a fait quoi
            log.info("Rotation successfully activated by {} for user {}",
                    authentication.getName(),
                    rotationRequest.getUserId());

            return ok(getResponse(request,
                    Map.of("rotation", result,
                            "activatedBy", authentication.getName()),
                    "Rotation activée avec succès",
                    OK));
        } catch (ApiException e) {
            log.error("Error activating rotation: {}", e.getMessage());
            return badRequest().body(getResponse(request,
                    emptyMap(),
                    e.getMessage(),
                    BAD_REQUEST));
        } catch (Exception e) {
            log.error("Unexpected error: ", e);
            return status(INTERNAL_SERVER_ERROR).body(getResponse(request,
                    emptyMap(),
                    "Une erreur est survenue lors de l'activation de la rotation",
                    INTERNAL_SERVER_ERROR));
        }
    }

    // Désactiver une rotation pour un utilisateur
    @PostMapping("/rotation/deactivate/{userId}")
    public ResponseEntity<Response> deactivateRotation(
            @NotNull Authentication authentication,
            @PathVariable("userId") Long userId,
            HttpServletRequest request) {
        try {
            // Log qui fait l'action et sur qui
            log.info("User {} is deactivating rotation for user {}",
                    authentication.getName(), userId);

            // Optionnel : Vérifier les permissions de l'utilisateur connecté
            if (!hasRotationManagementPermission(authentication)) {
                return status(FORBIDDEN).body(getResponse(request,
                        emptyMap(),
                        "Vous n'avez pas les permissions pour gérer les rotations",
                        FORBIDDEN));
            }

            var result = userService.deactivateRotation(userId);

            // Log de succès avec détails
            log.info("Rotation(s) successfully deactivated by {} for user {}: {} rotation(s) affected",
                    authentication.getName(), userId, result);

            return ok(getResponse(request,
                    Map.of("deactivated", result,
                            "deactivatedBy", authentication.getName()),
                    "Rotation(s) désactivée(s) avec succès",
                    OK));
        } catch (ApiException e) {
            log.error("Error deactivating rotation: {}", e.getMessage());
            return badRequest().body(getResponse(request,
                    emptyMap(),
                    e.getMessage(),
                    BAD_REQUEST));
        } catch (Exception e) {
            log.error("Unexpected error: ", e);
            return status(INTERNAL_SERVER_ERROR).body(getResponse(request,
                    emptyMap(),
                    "Une erreur est survenue lors de la désactivation de la rotation",
                    INTERNAL_SERVER_ERROR));
        }
    }

    // Méthode helper pour vérifier les permissions (à adapter selon votre système de rôles)
    private boolean hasRotationManagementPermission(Authentication authentication) {
        // Récupérer les rôles de l'utilisateur connecté
        return authentication.getAuthorities().stream()
                .anyMatch(authority ->
                        authority.getAuthority().equals("SUPER_ADMIN") ||
                                authority.getAuthority().equals("RA") ||
                                authority.getAuthority().equals("DR") ||
                                authority.getAuthority().equals("DA"));
    }

    // Obtenir l'historique des rotations
    @GetMapping("/rotation/history")
    public ResponseEntity<Response> getRotationHistory(
            @NotNull Authentication authentication,
            @RequestParam(value = "userId", required = false) Long userId,
            @RequestParam(value = "pointVenteId", required = false) Long pointVenteId,
            @RequestParam(value = "activeOnly", defaultValue = "false") boolean activeOnly,
            HttpServletRequest request) {
        try {
            var history = userService.getRotationHistory(userId, pointVenteId, activeOnly);
            return ok(getResponse(request,
                    Map.of("rotations", history),
                    "Historique des rotations récupéré avec succès",
                    OK));
        } catch (Exception e) {
            log.error("Error getting rotation history: ", e);
            return status(INTERNAL_SERVER_ERROR).body(getResponse(request,
                    emptyMap(),
                    "Une erreur est survenue lors de la récupération de l'historique",
                    INTERNAL_SERVER_ERROR));
        }
    }


}
