package io.digiservices.ecreditservice.resource;

import io.digiservices.clients.UserClient;
import io.digiservices.clients.domain.User;
import io.digiservices.ecreditservice.domain.Response;
import io.digiservices.ecreditservice.dto.*;
import io.digiservices.ecreditservice.exception.ApiException;
import io.digiservices.ecreditservice.service.SalaireService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import static io.digiservices.ecreditservice.utils.RequestUtils.getResponse;
import static org.springframework.http.HttpStatus.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/ecredit")
@Slf4j
public class SalaireResource {

    private final SalaireService salaireService;
    private final UserClient userClient;
    /**
     * Importer les informations du personnel depuis un fichier Excel
     * Format attendu: Matricule | Nom | Prénom
     */
    @PostMapping("/salaire/import/info-personnel")
    public ResponseEntity<Response> importInfoPersonnel(
            @RequestParam("file") MultipartFile file,
            HttpServletRequest request) {
        
        log.info("API: Import fichier info_personnel: {}", file.getOriginalFilename());
        
        if (file.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(getResponse(request, Map.of(), "Le fichier est vide", BAD_REQUEST));
        }

        try {
            ImportResultDto result = salaireService.importInfoPersonnelFromExcel(file);
            
            String message = String.format("Import terminé: %d/%d lignes importées", 
                    result.getLignesImportees(), result.getTotalLignes());
            
            return ResponseEntity.ok(getResponse(request, Map.of(
                    "importResult", result,
                    "success", result.getSuccess(),
                    "totalLignes", result.getTotalLignes(),
                    "lignesImportees", result.getLignesImportees(),
                    "lignesEnErreur", result.getLignesEnErreur()
            ), message, result.getSuccess() ? OK : BAD_REQUEST));
            
        } catch (Exception e) {
            log.error("Erreur lors de l'import info_personnel", e);
            return ResponseEntity.status(INTERNAL_SERVER_ERROR)
                    .body(getResponse(request, Map.of("error", e.getMessage()), 
                            "Erreur lors de l'import: " + e.getMessage(), INTERNAL_SERVER_ERROR));
        }
    }

    /**
     * Récupérer tous les personnels
     */
    @GetMapping("/salaire/info-personnel")
    public ResponseEntity<Response> getAllInfoPersonnel(HttpServletRequest request) {
        log.info("API: Récupération de tous les personnels");
        List<InfoPersonnelDto> personnels = salaireService.getAllInfoPersonnel();
        return ResponseEntity.ok(getResponse(request, Map.of(
                "personnels", personnels,
                "count", personnels.size()
        ), "Liste des personnels récupérée avec succès", OK));
    }

    /**
     * Récupérer un personnel par matricule
     */
    @GetMapping("/salaire/info-personnel/matricule/{matricule}")
    public ResponseEntity<Response> getInfoPersonnelByMatricule(
            @PathVariable(name = "matricule") String matricule,
            HttpServletRequest request) {
        
        log.info("API: Récupération du personnel par matricule: {}", matricule);
        return salaireService.getInfoPersonnelByMatricule(matricule)
                .map(p -> ResponseEntity.ok(getResponse(request, Map.of("personnel", p), 
                        "Personnel trouvé", OK)))
                .orElse(ResponseEntity.status(NOT_FOUND)
                        .body(getResponse(request, Map.of(), "Personnel non trouvé", NOT_FOUND)));
    }

    /**
     * Récupérer un personnel par ID
     */
    @GetMapping("/salaire/info-personnel/{id}")
    public ResponseEntity<Response> getInfoPersonnelById(
            @PathVariable(name = "id") Long id,
            HttpServletRequest request) {
        
        log.info("API: Récupération du personnel par ID: {}", id);
        return salaireService.getInfoPersonnelById(id)
                .map(p -> ResponseEntity.ok(getResponse(request, Map.of("personnel", p), 
                        "Personnel trouvé", OK)))
                .orElse(ResponseEntity.status(NOT_FOUND)
                        .body(getResponse(request, Map.of(), "Personnel non trouvé", NOT_FOUND)));
    }

    /**
     * Compter le nombre de personnels
     */
    @GetMapping("/salaire/info-personnel/count")
    public ResponseEntity<Response> countInfoPersonnel(HttpServletRequest request) {
        log.info("API: Comptage des personnels");
        long count = salaireService.countInfoPersonnel();
        return ResponseEntity.ok(getResponse(request, Map.of("count", count), 
                "Nombre de personnels: " + count, OK));
    }

    /**
     * Mettre à jour le numéro de compte d'un personnel
     */
    @PutMapping("/salaire/info-personnel/{matricule}/numero-compte")
    public ResponseEntity<Response> updateNumeroCompte(
            @PathVariable(name = "matricule") String matricule,
            @RequestParam(name = "numeroCompte") String numeroCompte,
            HttpServletRequest request) {
        
        log.info("API: Mise à jour du numéro de compte pour matricule: {}", matricule);
        
        if (numeroCompte == null || numeroCompte.trim().isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(getResponse(request, Map.of(), "Le numéro de compte est obligatoire", BAD_REQUEST));
        }
        
        try {
            int updated = salaireService.updateNumeroCompte(matricule, numeroCompte.trim());
            if (updated > 0) {
                return ResponseEntity.ok(getResponse(request, Map.of(
                        "matricule", matricule,
                        "numeroCompte", numeroCompte.trim(),
                        "updated", true
                ), "Numéro de compte mis à jour avec succès", OK));
            } else {
                return ResponseEntity.status(NOT_FOUND)
                        .body(getResponse(request, Map.of(), "Matricule non trouvé", NOT_FOUND));
            }
        } catch (Exception e) {
            log.error("Erreur lors de la mise à jour du numéro de compte", e);
            return ResponseEntity.status(INTERNAL_SERVER_ERROR)
                    .body(getResponse(request, Map.of("error", e.getMessage()), 
                            e.getMessage(), INTERNAL_SERVER_ERROR));
        }
    }

    /**
     * Vérifier si le numéro de compte est défini pour un matricule
     */
    @GetMapping("/salaire/info-personnel/{matricule}/check-numero-compte")
    public ResponseEntity<Response> checkNumeroCompte(
            @PathVariable(name = "matricule") String matricule,
            HttpServletRequest request) {
        
        log.info("API: Vérification du numéro de compte pour matricule: {}", matricule);
        
        return salaireService.checkNumeroCompte(matricule)
                .map(personnel -> {
                    boolean hasNumeroCompte = personnel.getNumeroCompte() != null 
                            && !personnel.getNumeroCompte().trim().isEmpty();
                    
                    return ResponseEntity.ok(getResponse(request, Map.of(
                            "matricule", personnel.getMatricule(),
                            "nom", personnel.getNom(),
                            "prenom", personnel.getPrenom(),
                            "numeroCompte", personnel.getNumeroCompte() != null ? personnel.getNumeroCompte() : "",
                            "hasNumeroCompte", hasNumeroCompte,
                            "message", hasNumeroCompte 
                                    ? "Le numéro de compte est défini" 
                                    : "Le numéro de compte n'est pas défini"
                    ), hasNumeroCompte 
                            ? "Numéro de compte trouvé" 
                            : "Numéro de compte non défini", OK));
                })
                .orElse(ResponseEntity.status(NOT_FOUND)
                        .body(getResponse(request, Map.of(
                                "matricule", matricule,
                                "found", false
                        ), "Matricule non trouvé dans la base", NOT_FOUND)));
    }

    // ==================== AVANCE SALAIRE ENDPOINTS ====================

    /**
     * Importer les avances salaire depuis un fichier Excel
     * Format attendu: Matricule | NET A PAYER
     * SANS authentification nécessaire pour id_user
     */
    @PostMapping("/salaire/import/avance-salaire")
    public ResponseEntity<Response> importAvanceSalaire(
            @RequestParam("file") MultipartFile file,
            HttpServletRequest request) {

        log.info("API: Import fichier avance_salaire: {}", file.getOriginalFilename());

        if (file.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(getResponse(request, Map.of(), "Le fichier est vide", BAD_REQUEST));
        }

        try {
            ImportResultDto result = salaireService.importAvanceSalaireFromExcel(file);

            String message = String.format("Import terminé: %d/%d lignes importées",
                    result.getLignesImportees(), result.getTotalLignes());

            return ResponseEntity.ok(getResponse(request, Map.of(
                    "importResult", result,
                    "success", result.getSuccess(),
                    "totalLignes", result.getTotalLignes(),
                    "lignesImportees", result.getLignesImportees(),
                    "lignesEnErreur", result.getLignesEnErreur()
            ), message, result.getSuccess() ? OK : BAD_REQUEST));

        } catch (Exception e) {
            log.error("Erreur lors de l'import avance_salaire", e);
            return ResponseEntity.status(INTERNAL_SERVER_ERROR)
                    .body(getResponse(request, Map.of("error", e.getMessage()),
                            "Erreur lors de l'import: " + e.getMessage(), INTERNAL_SERVER_ERROR));
        }
    }

    /**
     * Récupérer toutes les avances salaire
     */
    @GetMapping("/salaire/avance-salaire")
    public ResponseEntity<Response> getAllAvanceSalaire(HttpServletRequest request) {
        log.info("API: Récupération de toutes les avances salaire");
        List<AvanceSalaireDto> avances = salaireService.getAllAvanceSalaire();
        return ResponseEntity.ok(getResponse(request, Map.of(
                "avances", avances,
                "count", avances.size()
        ), "Liste des avances salaire récupérée avec succès", OK));
    }

    /**
     * Récupérer mon avance salaire (utilisateur connecté)
     * Utilise le matricule lié au compte de l'utilisateur
     */
    @GetMapping("/salaire/avance-salaire/me")
    public ResponseEntity<Response> getMyAvanceSalaire(
            Authentication authentication,
            HttpServletRequest request) {

        User user = userClient.getUserByUuid(authentication.getName());
        log.info("API: Récupération de l'avance salaire pour l'utilisateur: {} (matricule: {})",
                user.getUserId(), user.getMatricule());

        // Vérifier que l'utilisateur a un matricule
        if (user.getMatricule() == null || user.getMatricule().trim().isEmpty()) {
            return ResponseEntity.status(BAD_REQUEST)
                    .body(getResponse(request, Map.of(
                            "hasMatricule", false
                    ), "Aucun matricule n'est associé à votre compte. Contactez le service RH.", BAD_REQUEST));
        }

        return salaireService.getMyAvanceSalaire(user.getUserId())
                .map(avance -> ResponseEntity.ok(getResponse(request, Map.of(
                        "avance", avance,
                        "matricule", user.getMatricule(),
                        "hasMatricule", true
                ), "Avance salaire trouvée", OK)))
                .orElse(ResponseEntity.status(NOT_FOUND)
                        .body(getResponse(request, Map.of(
                                "matricule", user.getMatricule(),
                                "hasMatricule", true
                        ), "Aucune donnée de salaire trouvée pour votre matricule. Le fichier des salaires n'a peut-être pas été importé.", NOT_FOUND)));
    }
    /**
     * Récupérer les avances par utilisateur
     */
    @GetMapping("/salaire/avance-salaire/user/{userId}")
    public ResponseEntity<Response> getAvanceSalaireByUser(
            @PathVariable(name = "userId") Long userId,
            HttpServletRequest request) {
        
        log.info("API: Récupération des avances pour l'utilisateur: {}", userId);
        List<AvanceSalaireDto> avances = salaireService.getAvanceSalaireByUser(userId);
        return ResponseEntity.ok(getResponse(request, Map.of(
                "avances", avances,
                "count", avances.size(),
                "userId", userId
        ), "Avances salaire récupérées avec succès", OK));
    }

    /**
     * Récupérer une avance par ID
     */
    @GetMapping("/salaire/avance-salaire/{id}")
    public ResponseEntity<Response> getAvanceSalaireById(
            @PathVariable(name = "id") Long id,
            HttpServletRequest request) {
        
        log.info("API: Récupération de l'avance: {}", id);
        return salaireService.getAvanceSalaireById(id)
                .map(a -> ResponseEntity.ok(getResponse(request, Map.of("avance", a), 
                        "Avance trouvée", OK)))
                .orElse(ResponseEntity.status(NOT_FOUND)
                        .body(getResponse(request, Map.of(), "Avance non trouvée", NOT_FOUND)));
    }

    /**
     * Récupérer avances par statut
     */
    @GetMapping("/salaire/avance-salaire/statut/{statut}")
    public ResponseEntity<Response> getAvanceSalaireByStatut(
            @PathVariable(name = "statut") String statut,
            HttpServletRequest request) {
        
        log.info("API: Récupération des avances par statut: {}", statut);
        List<AvanceSalaireDto> avances = salaireService.getAvanceSalaireByStatut(statut);
        return ResponseEntity.ok(getResponse(request, Map.of(
                "avances", avances,
                "count", avances.size(),
                "statut", statut
        ), "Avances salaire récupérées avec succès", OK));
    }

    /**
     * Mettre à jour le statut d'une avance (APPROUVE, REJETE)
     */
    @PutMapping("/salaire/avance-salaire/{id}/statut")
    public ResponseEntity<Response> updateAvanceSalaireStatut(
            @PathVariable(name = "id") Long id,
            @RequestParam String statut,
            HttpServletRequest request) {
        
        log.info("API: Mise à jour du statut de l'avance {} vers {}", id, statut);
        
        // Validation du statut
        if (!List.of("EN_ATTENTE", "APPROUVE", "REJETE").contains(statut.toUpperCase())) {
            return ResponseEntity.badRequest()
                    .body(getResponse(request, Map.of(), 
                            "Statut invalide. Valeurs acceptées: EN_ATTENTE, APPROUVE, REJETE", BAD_REQUEST));
        }
        
        salaireService.updateAvanceSalaireStatut(id, statut.toUpperCase());
        return ResponseEntity.ok(getResponse(request, Map.of(
                "id", id,
                "newStatut", statut.toUpperCase()
        ), "Statut mis à jour avec succès", OK));
    }

    /**
     * Supprimer toutes les avances d'un utilisateur (pour réimport)
     */
    @DeleteMapping("/salaire/avance-salaire/user/{userId}")
    public ResponseEntity<Response> deleteAvanceSalaireByUser(
            @PathVariable(name = "userId") Long userId,
            HttpServletRequest request) {
        
        log.info("API: Suppression des avances pour l'utilisateur: {}", userId);
        int deleted = salaireService.deleteAvanceSalaireByUser(userId);
        return ResponseEntity.ok(getResponse(request, Map.of(
                "deleted", deleted,
                "userId", userId
        ), deleted + " avances supprimées avec succès", OK));
    }

    /**
     * Vider la table avance_salaire (reset mensuel)
     * À appeler chaque mois pour réinitialiser les avances
     */
    @DeleteMapping("/salaire/avance-salaire/truncate")
    public ResponseEntity<Response> truncateAvanceSalaire(HttpServletRequest request) {
        log.info("API: Vidage de la table avance_salaire (reset mensuel)");
        int deleted = salaireService.truncateAvanceSalaire();
        return ResponseEntity.ok(getResponse(request, Map.of(
                "deleted", deleted,
                "message", "Table avance_salaire vidée avec succès"
        ), "Reset mensuel effectué: " + deleted + " enregistrements supprimés", OK));
    }

    // ==================== DEMANDE SALARY ENDPOINTS ====================

    /**
     * Créer une demande d'avance sur salaire
     * Vérifie que le montant ne dépasse pas 50% du salaire net (net_amount_limit)
     */
    @PostMapping("/salaire/demande-salary")
    public ResponseEntity<Response> createDemandeSalary(
            @RequestParam String matricule,
            @RequestParam BigDecimal amount,
            @RequestParam(required = false) String numeroCompte,
            Authentication authentication,
            HttpServletRequest request) {
        
        log.info("API: Création d'une demande de salaire pour matricule: {}", matricule);
        
        try {
            // Récupérer l'utilisateur connecté
            User user = userClient.getUserByUuid(authentication.getName());
            Long idUser = user.getUserId();
            
            DemandeSalaryDto demande = salaireService.createDemandeSalary(idUser, matricule, amount, numeroCompte);
            
            return ResponseEntity.ok(getResponse(request, Map.of(
                    "demande", demande,
                    "message", "Demande créée avec succès"
            ), "Demande d'avance sur salaire créée avec succès", CREATED));
            
        } catch (Exception e) {
            log.error("Erreur lors de la création de la demande", e);
            return ResponseEntity.status(BAD_REQUEST)
                    .body(getResponse(request, Map.of("error", e.getMessage()), 
                            e.getMessage(), BAD_REQUEST));
        }
    }

    /**
     * Récupérer toutes les demandes de salaire
     */
    @GetMapping("/salaire/demande-salary")
    public ResponseEntity<Response> getAllDemandeSalary(HttpServletRequest request) {
        log.info("API: Récupération de toutes les demandes de salaire");
        List<DemandeSalaryDto> demandes = salaireService.getAllDemandeSalary();
        return ResponseEntity.ok(getResponse(request, Map.of(
                "demandes", demandes,
                "count", demandes.size()
        ), "Liste des demandes de salaire récupérée avec succès", OK));
    }

    /**
     * Récupérer les demandes de salaire de l'utilisateur connecté
     */
    @GetMapping("/salaire/demande-salary/me")
    public ResponseEntity<Response> getMyDemandeSalary(
            Authentication authentication,
            HttpServletRequest request) {
        
        User user = userClient.getUserByUuid(authentication.getName());
        log.info("API: Récupération des demandes de l'utilisateur: {}", user.getUserId());
        
        List<DemandeSalaryDto> demandes = salaireService.getDemandeSalaryByUser(user.getUserId());
        return ResponseEntity.ok(getResponse(request, Map.of(
                "demandes", demandes,
                "count", demandes.size(),
                "userId", user.getUserId()
        ), "Demandes de salaire récupérées avec succès", OK));
    }

    /**
     * Récupérer une demande par ID
     */
    @GetMapping("/salaire/demande-salary/{id}")
    public ResponseEntity<Response> getDemandeSalaryById(
            @PathVariable(name = "id") Long id,
            HttpServletRequest request) {
        
        log.info("API: Récupération de la demande: {}", id);
        return salaireService.getDemandeSalaryById(id)
                .map(d -> ResponseEntity.ok(getResponse(request, Map.of("demande", d), 
                        "Demande trouvée", OK)))
                .orElse(ResponseEntity.status(NOT_FOUND)
                        .body(getResponse(request, Map.of(), "Demande non trouvée", NOT_FOUND)));
    }

    /**
     * Récupérer demandes par statut
     */
    @GetMapping("/salaire/demande-salary/statut/{statut}")
    public ResponseEntity<Response> getDemandeSalaryByStatut(
            @PathVariable(name = "statut") String statut,
            HttpServletRequest request) {
        
        log.info("API: Récupération des demandes par statut: {}", statut);
        List<DemandeSalaryDto> demandes = salaireService.getDemandeSalaryByStatut(statut.toUpperCase());
        return ResponseEntity.ok(getResponse(request, Map.of(
                "demandes", demandes,
                "count", demandes.size(),
                "statut", statut.toUpperCase()
        ), "Demandes de salaire récupérées avec succès", OK));
    }

    /**
     * Annuler une demande de salaire (par l'utilisateur)
     */
    @PutMapping("/salaire/demande-salary/{id}/annuler")
    public ResponseEntity<Response> annulerDemandeSalary(
            @PathVariable(name = "id") Long id,
            HttpServletRequest request) {
        
        log.info("API: Annulation de la demande: {}", id);
        
        try {
            int updated = salaireService.annulerDemandeSalary(id);
            return ResponseEntity.ok(getResponse(request, Map.of(
                    "id", id,
                    "newStatut", "ANNULLER",
                    "updated", updated > 0
            ), "Demande annulée avec succès", OK));
        } catch (Exception e) {
            log.error("Erreur lors de l'annulation", e);
            return ResponseEntity.status(BAD_REQUEST)
                    .body(getResponse(request, Map.of("error", e.getMessage()), 
                            e.getMessage(), BAD_REQUEST));
        }
    }

    /**
     * Rejeter une demande de salaire (par le responsable)
     */
    @PutMapping("/salaire/demande-salary/{id}/rejeter")
    public ResponseEntity<Response> rejeterDemandeSalary(
            @PathVariable(name = "id") Long id,
            HttpServletRequest request) {
        
        log.info("API: Rejet de la demande: {}", id);
        
        try {
            int updated = salaireService.rejeterDemandeSalary(id);
            return ResponseEntity.ok(getResponse(request, Map.of(
                    "id", id,
                    "newStatut", "REJET",
                    "updated", updated > 0
            ), "Demande rejetée avec succès", OK));
        } catch (Exception e) {
            log.error("Erreur lors du rejet", e);
            return ResponseEntity.status(BAD_REQUEST)
                    .body(getResponse(request, Map.of("error", e.getMessage()), 
                            e.getMessage(), BAD_REQUEST));
        }
    }

    /**
     * Valider une demande de salaire (par le responsable)
     */
    @PutMapping("/salaire/demande-salary/{id}/valider")
    public ResponseEntity<Response> validerDemandeSalary(
            @PathVariable(name = "id") Long id,
            HttpServletRequest request) {
        
        log.info("API: Validation de la demande: {}", id);
        
        try {
            int updated = salaireService.validerDemandeSalary(id);
            return ResponseEntity.ok(getResponse(request, Map.of(
                    "id", id,
                    "newStatut", "VALIDER",
                    "updated", updated > 0
            ), "Demande validée avec succès", OK));
        } catch (Exception e) {
            log.error("Erreur lors de la validation", e);
            return ResponseEntity.status(BAD_REQUEST)
                    .body(getResponse(request, Map.of("error", e.getMessage()), 
                            e.getMessage(), BAD_REQUEST));
        }
    }

    /**
     * Confirmer une demande de salaire
     */
    @PutMapping("/salaire/demande-salary/{id}/confirmer")
    public ResponseEntity<Response> confirmerDemandeSalary(
            @PathVariable(name = "id") Long id,
            HttpServletRequest request) {
        
        log.info("API: Confirmation de la demande: {}", id);
        
        try {
            int updated = salaireService.confirmerDemandeSalary(id);
            return ResponseEntity.ok(getResponse(request, Map.of(
                    "id", id,
                    "newStatut", "CONFIRMER",
                    "updated", updated > 0
            ), "Demande confirmée avec succès", OK));
        } catch (Exception e) {
            log.error("Erreur lors de la confirmation", e);
            return ResponseEntity.status(BAD_REQUEST)
                    .body(getResponse(request, Map.of("error", e.getMessage()), 
                            e.getMessage(), BAD_REQUEST));
        }
    }


    /**
     * Récupérer une avance salaire par matricule
     */
    @GetMapping("/salaire/avance-salaire/matricule/{matricule}")
    public ResponseEntity<Response> getAvanceSalaireByMatricule(
            @PathVariable String matricule,
            HttpServletRequest request) {

        log.info("API: Récupération de l'avance salaire par matricule: {}", matricule);
        return salaireService.getAvanceSalaireByMatricule(matricule)
                .map(a -> ResponseEntity.ok(getResponse(request, Map.of("avance", a),
                        "Avance trouvée", OK)))
                .orElse(ResponseEntity.status(NOT_FOUND)
                        .body(getResponse(request, Map.of(), "Aucune avance trouvée pour ce matricule", NOT_FOUND)));
    }


    /**
     * Créer une demande d'avance sur salaire (SÉCURISÉ)
     * Le matricule est automatiquement récupéré depuis le compte utilisateur
     */
    @PostMapping("/salaire/demande-salary/me")
    public ResponseEntity<Response> createMyDemandeSalary(
            @RequestParam(name = "amount") BigDecimal amount,
            @RequestParam(required = false,name = "numeroCompte") String numeroCompte,
            Authentication authentication,
            HttpServletRequest request) {

        User user = userClient.getUserByUuid(authentication.getName());
        log.info("API: Création demande salaire pour utilisateur: {} (matricule: {})",
                user.getUserId(), user.getMatricule());

        // Vérifier que l'utilisateur a un matricule
        if (user.getMatricule() == null || user.getMatricule().trim().isEmpty()) {
            return ResponseEntity.status(BAD_REQUEST)
                    .body(getResponse(request, Map.of(),
                            "Aucun matricule n'est associé à votre compte. Contactez le service RH.", BAD_REQUEST));
        }

        try {
            DemandeSalaryDto demande = salaireService.createDemandeSalary(
                    user.getUserId(),
                    user.getMatricule(),  // ✅ Utilise le matricule du compte, pas celui saisi
                    amount,
                    numeroCompte
            );

            return ResponseEntity.ok(getResponse(request, Map.of(
                    "demande", demande,
                    "message", "Demande créée avec succès"
            ), "Demande d'avance sur salaire créée avec succès", CREATED));

        } catch (ApiException e) {
            log.error("Erreur lors de la création de la demande: {}", e.getMessage());
            return ResponseEntity.status(BAD_REQUEST)
                    .body(getResponse(request, Map.of("error", e.getMessage()),
                            e.getMessage(), BAD_REQUEST));
        }
    }



    /**
     * Valider plusieurs demandes de salaire en une seule opération (validation massive)
     * @param ids Liste des IDs des demandes à valider
     */
    @PutMapping("/salaire/demande-salary/valider-multiple")
    public ResponseEntity<Response> validerMultipleDemandeSalary(
            @RequestBody List<Long> ids,
            HttpServletRequest request) {

        log.info("API: Validation massive de {} demandes: {}", ids.size(), ids);

        if (ids == null || ids.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(getResponse(request, Map.of(),
                            "Aucune demande sélectionnée", BAD_REQUEST));
        }

        try {
            int totalValidated = salaireService.validerMultipleDemandeSalary(ids);
            return ResponseEntity.ok(getResponse(request, Map.of(
                    "totalRequested", ids.size(),
                    "totalValidated", totalValidated,
                    "ids", ids
            ), totalValidated + " demande(s) validée(s) avec succès", OK));
        } catch (Exception e) {
            log.error("Erreur lors de la validation massive", e);
            return ResponseEntity.status(BAD_REQUEST)
                    .body(getResponse(request, Map.of("error", e.getMessage()),
                            e.getMessage(), BAD_REQUEST));
        }
    }

    /**
     * Récupérer les demandes groupées par date
     */
    @GetMapping("/salaire/demande-salary/grouped-by-date")
    public ResponseEntity<Response> getDemandesGroupedByDate(
            @RequestParam(name = "statut",required = false, defaultValue = "ENCOURS") String statut,
            HttpServletRequest request) {

        log.info("API: Récupération des demandes groupées par date, statut: {}", statut);

        List<DemandeSalaryDto> demandes = salaireService.getDemandeSalaryByStatut(statut);

        // Grouper par date (sans heure)
        Map<String, List<DemandeSalaryDto>> grouped = demandes.stream()
                .collect(java.util.stream.Collectors.groupingBy(
                        d -> d.getCreatedAt().toLocalDate().toString()
                ));

        // Calculer les stats par jour
        List<Map<String, Object>> result = grouped.entrySet().stream()
                .sorted((a, b) -> b.getKey().compareTo(a.getKey())) // Plus récent en premier
                .map(entry -> {
                    List<DemandeSalaryDto> dayDemandes = entry.getValue();
                    BigDecimal totalAmount = dayDemandes.stream()
                            .map(DemandeSalaryDto::getAmount)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);

                    return Map.<String, Object>of(
                            "date", entry.getKey(),
                            "count", dayDemandes.size(),
                            "totalAmount", totalAmount,
                            "demandes", dayDemandes
                    );
                })
                .collect(java.util.stream.Collectors.toList());

        return ResponseEntity.ok(getResponse(request, Map.of(
                "groupedDemandes", result,
                "totalDemandes", demandes.size(),
                "statut", statut
        ), "Demandes groupées par date récupérées avec succès", OK));
    }



    /**
     * Confirmer plusieurs demandes de salaire en une seule opération (confirmation massive DF)
     */
    @PutMapping("/salaire/demande-salary/confirmer-multiple")
    public ResponseEntity<Response> confirmerMultipleDemandeSalary(
            @RequestBody List<Long> ids,
            HttpServletRequest request) {

        log.info("API: Confirmation massive de {} demandes: {}", ids.size(), ids);

        if (ids == null || ids.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(getResponse(request, Map.of(),
                            "Aucune demande sélectionnée", BAD_REQUEST));
        }

        try {
            int totalConfirmed = salaireService.confirmerMultipleDemandeSalary(ids);
            return ResponseEntity.ok(getResponse(request, Map.of(
                    "totalRequested", ids.size(),
                    "totalConfirmed", totalConfirmed,
                    "ids", ids
            ), totalConfirmed + " demande(s) confirmée(s) avec succès", OK));
        } catch (Exception e) {
            log.error("Erreur lors de la confirmation massive", e);
            return ResponseEntity.status(BAD_REQUEST)
                    .body(getResponse(request, Map.of("error", e.getMessage()),
                            e.getMessage(), BAD_REQUEST));
        }
    }

    /**
     * Exporter les demandes confirmées en Excel
     * @param ids Liste optionnelle des IDs à exporter. Si vide, exporte toutes les confirmées.
     */
    @PostMapping("/salaire/demande-salary/export-excel")
    public ResponseEntity<byte[]> exportDemandesExcel(
            @RequestBody(required = false) List<Long> ids) {

        log.info("API: Export Excel des demandes. IDs: {}", ids);

        try {
            byte[] excelBytes = salaireService.exportDemandesConfirmeesToExcel(ids);

            String filename = "avances_salaire_" +
                    java.time.LocalDate.now().format(java.time.format.DateTimeFormatter.ofPattern("yyyyMMdd")) +
                    ".xlsx";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
            headers.setContentDispositionFormData("attachment", filename);
            headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(excelBytes);

        } catch (Exception e) {
            log.error("Erreur lors de l'export Excel", e);
            return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(null);
        }
    }

    /**
     * Exporter toutes les demandes confirmées en Excel (GET simple)
     */
    @GetMapping("/salaire/demande-salary/export-excel/confirmer")
    public ResponseEntity<byte[]> exportAllConfirmedDemandesExcel() {

        log.info("API: Export Excel de toutes les demandes confirmées");

        try {
            byte[] excelBytes = salaireService.exportDemandesConfirmeesToExcel(null);

            String filename = "avances_salaire_confirmees_" +
                    java.time.LocalDate.now().format(java.time.format.DateTimeFormatter.ofPattern("yyyyMMdd")) +
                    ".xlsx";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
            headers.setContentDispositionFormData("attachment", filename);
            headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(excelBytes);

        } catch (Exception e) {
            log.error("Erreur lors de l'export Excel", e);
            return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(null);
        }
    }


    // ==================== AUTHORIZE SALAIRE ENDPOINTS ====================

    /**
     * Récupérer l'état d'autorisation des demandes de salaire
     * Accessible par tous (pour que les utilisateurs sachent si c'est ouvert)
     */
    @GetMapping("/salaire/authorize")
    public ResponseEntity<Response> getAuthorizeSalaire(HttpServletRequest request) {
        log.info("API: Récupération de l'état d'autorisation des demandes");
        AuthorizeSalaireDto authorize = salaireService.getAuthorizeSalaire();
        return ResponseEntity.ok(getResponse(request, Map.of(
                "authorize", authorize,
                "isAuthorized", authorize.getIsAuthorized(),
                "message", authorize.getMessage()
        ), "État d'autorisation récupéré", OK));
    }

    /**
     * Mettre à jour l'autorisation des demandes de salaire (DRH uniquement)
     */
    @PutMapping("/salaire/authorize")
    public ResponseEntity<Response> updateAuthorizeSalaire(
            @RequestParam(name = "isAuthorized") Boolean isAuthorized,
            @RequestParam(name = "message", required = false) String message,
            Authentication authentication,
            HttpServletRequest request) {

        User user = userClient.getUserByUuid(authentication.getName());
        log.info("API: Mise à jour autorisation demandes par user {}: {}", user.getUserId(), isAuthorized);

        String finalMessage = message;
        if (finalMessage == null || finalMessage.trim().isEmpty()) {
            finalMessage = isAuthorized
                    ? "Les demandes d'avance sur salaire sont ouvertes."
                    : "Les demandes d'avance sur salaire ne sont pas disponibles pour le moment. Contactez la Direction des Ressources Humaines.";
        }

        int updated = salaireService.updateAuthorizeSalaire(isAuthorized, finalMessage, user.getUserId());

        return ResponseEntity.ok(getResponse(request, Map.of(
                "isAuthorized", isAuthorized,
                "message", finalMessage,
                "updated", updated > 0
        ), isAuthorized ? "Demandes de salaire activées" : "Demandes de salaire désactivées", OK));
    }

    /**
     * Activer les demandes de salaire (raccourci)
     */
    @PutMapping("/salaire/authorize/enable")
    public ResponseEntity<Response> enableAuthorizeSalaire(
            Authentication authentication,
            HttpServletRequest request) {

        User user = userClient.getUserByUuid(authentication.getName());
        log.info("API: Activation des demandes de salaire par user {}", user.getUserId());

        int updated = salaireService.enableAuthorizeSalaire(user.getUserId());

        return ResponseEntity.ok(getResponse(request, Map.of(
                "isAuthorized", true,
                "updated", updated > 0
        ), "Demandes de salaire activées avec succès", OK));
    }

    /**
     * Désactiver les demandes de salaire (raccourci)
     */
    @PutMapping("/salaire/authorize/disable")
    public ResponseEntity<Response> disableAuthorizeSalaire(
            Authentication authentication,
            HttpServletRequest request) {

        User user = userClient.getUserByUuid(authentication.getName());
        log.info("API: Désactivation des demandes de salaire par user {}", user.getUserId());

        int updated = salaireService.disableAuthorizeSalaire(user.getUserId());

        return ResponseEntity.ok(getResponse(request, Map.of(
                "isAuthorized", false,
                "updated", updated > 0
        ), "Demandes de salaire désactivées avec succès", OK));
    }



}
