package io.digiservices.ebanking.controller;

import io.digiservices.ebanking.dto.FicheSignaletiqueResponseDTO;
import io.digiservices.ebanking.dto.FicheSignaletiqueResponseSoldeDTO;
import io.digiservices.ebanking.dto.UpdateFicheSignaletiqueDTO;
import io.digiservices.ebanking.exception.ApiException;
import io.digiservices.ebanking.exception.ResourceNotFoundException;
import io.digiservices.ebanking.service.FicheSignaletiqueService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/ebanking")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Slf4j
public class FicheSignaletiqueController {

    private final FicheSignaletiqueService ficheSignaletiqueService;

    @PutMapping("/fiche-signaletique")
    public ResponseEntity<Map<String, Object>> updateFicheSignaletique(
            @Valid @RequestBody UpdateFicheSignaletiqueDTO dto)
    {

        log.info("Demande de mise à jour fiche signalétique - Client: {}", dto.getCodCliente());

        try {
            // Log des données reçues pour debug
            logReceivedData(dto);

            Map<String, Object> result = ficheSignaletiqueService.updateFicheSignaletique(dto);

            log.info("Mise à jour réussie - Client: {}", dto.getCodCliente());

            return ResponseEntity.ok(result);

        } catch (Exception e) {
            log.error("Erreur lors de la mise à jour - Client: {}", dto.getCodCliente(), e);

            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("code", -1);
            errorResponse.put("message", "Erreur lors de la mise à jour: " + e.getMessage());
            errorResponse.put("client", dto.getCodCliente());

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    private void logReceivedData(UpdateFicheSignaletiqueDTO dto) {
        log.debug("Données reçues:");
        log.debug("  - Code client: {} (longueur: {})",
                dto.getCodCliente(),
                dto.getCodCliente() != null ? dto.getCodCliente().length() : 0);
        log.debug("  - Nom client: {} (longueur: {})",
                dto.getNomCliente(),
                dto.getNomCliente() != null ? dto.getNomCliente().length() : 0);
        log.debug("  - Tel principal: {} (longueur: {})",
                dto.getTelPrincipal(),
                dto.getTelPrincipal() != null ? dto.getTelPrincipal().length() : 0);
        log.debug("  - Prénom: {} (longueur: {})",
                dto.getPrenomClient(),
                dto.getPrenomClient() != null ? dto.getPrenomClient().length() : 0);
        log.debug("  - Nom: {} (longueur: {})",
                dto.getNomClient(),
                dto.getNomClient() != null ? dto.getNomClient().length() : 0);
    }



    /**
     * Récupère la fiche signalétique d'un client par son code
     * @param codCliente Le code du client
     * @return La fiche signalétique complète
     */
    @GetMapping("/fiche-signaletique/{codCliente}")
    public ResponseEntity<?> getFicheSignaletique(@PathVariable(name = "codCliente") String codCliente) {
        log.info("Demande de récupération fiche signalétique - Client: {}", codCliente);

        try {
            FicheSignaletiqueResponseDTO result = ficheSignaletiqueService.getFicheSignaletique(codCliente);

            return ResponseEntity.ok(createSuccessResponse(result));

        } catch (ResourceNotFoundException e) {
            log.warn("Client non trouvé: {}", codCliente);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse("NOT_FOUND", e.getMessage(), codCliente));

        } catch (ApiException e) {
            log.error("Erreur API lors de la récupération - Client: {}", codCliente, e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(createErrorResponse("BAD_REQUEST", e.getMessage(), codCliente));

        } catch (Exception e) {
            log.error("Erreur inattendue lors de la récupération - Client: {}", codCliente, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("INTERNAL_ERROR",
                            "Une erreur inattendue s'est produite", codCliente));
        }
    }


    /**
     * Récupère la fiche signalétique d'un client par son code
     * avec les soldes disponibles
     * @param codCliente Le code du client
     * @return La fiche signalétique complète avec soldes
     */
    @GetMapping("/fiche-signaletique-solde/{codCliente}")
    public ResponseEntity<?> getFicheSignaletiqueWithSolde(@PathVariable(name = "codCliente") String codCliente) {
        log.info("Demande de récupération fiche signalétique avec soldes - Client: {}", codCliente);

        try {
            FicheSignaletiqueResponseSoldeDTO result = ficheSignaletiqueService.getFicheSignaletiqueWithSolde(codCliente);

            return ResponseEntity.ok(createSuccessResponseWithSolde(result));

        } catch (ResourceNotFoundException e) {
            log.warn("Client non trouvé: {}", codCliente);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse("NOT_FOUND", e.getMessage(), codCliente));

        } catch (ApiException e) {
            log.error("Erreur API lors de la récupération avec soldes - Client: {}", codCliente, e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(createErrorResponse("BAD_REQUEST", e.getMessage(), codCliente));

        } catch (Exception e) {
            log.error("Erreur inattendue lors de la récupération avec soldes - Client: {}", codCliente, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("INTERNAL_ERROR",
                            "Une erreur inattendue s'est produite", codCliente));
        }
    }

    /**
     * Creates a success response for fiche with soldes
     * @param data The fiche signalétique with soldes data
     * @return Formatted response map
     */
    private Map<String, Object> createSuccessResponseWithSolde(FicheSignaletiqueResponseSoldeDTO data) {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "SUCCESS");
        response.put("code", 0);
        response.put("data", data);

        // Ajouter des métadonnées enrichies
        Map<String, Object> metadata = new HashMap<>();
        metadata.put("clientExists", data.getClientExists());
        metadata.put("nomComplet", data.getNombreComplet());
        metadata.put("typePersonne", data.getIndPersona());
        metadata.put("statut", data.getStatutClientLibelle());

        // Métadonnées spécifiques aux soldes
        metadata.put("totalComptes", data.getTotalComptes());
        metadata.put("comptesActifs", data.getComptesActifs());
        metadata.put("comptesInactifs", data.getComptesInactifs());
        metadata.put("nombreComptes", data.getComptes() != null ? data.getComptes().size() : 0);

        // Résumé des soldes
        Map<String, Object> soldeSummary = new HashMap<>();
        soldeSummary.put("totalDisponible", data.getTotalSoldeDisponible());
        soldeSummary.put("totalMoyen", data.getTotalSoldeMoyen());
        soldeSummary.put("totalCongelado", data.getTotalSoldeCongelado());
        soldeSummary.put("totalTransit", data.getTotalSoldeTransit());
        soldeSummary.put("totalReserve", data.getTotalSoldeReserve());

        metadata.put("soldeSummary", soldeSummary);

        // Statistiques par catégorie si nécessaire
        if (data.getComptes() != null && !data.getComptes().isEmpty()) {
            Map<String, Long> comptesParCategorie = data.getComptes().stream()
                    .collect(Collectors.groupingBy(
                            c -> c.getCodCategoria() != null ? c.getCodCategoria() : "UNKNOWN",
                            Collectors.counting()
                    ));
            metadata.put("comptesParCategorie", comptesParCategorie);
        }

        response.put("metadata", metadata);

        return response;
    }

    private Map<String, Object> createSuccessResponse(FicheSignaletiqueResponseDTO data) {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "SUCCESS");
        response.put("code", 0);
        response.put("data", data);

        // Ajouter des métadonnées utiles
        Map<String, Object> metadata = new HashMap<>();
        metadata.put("clientExists", data.getClientExists());
        metadata.put("nomComplet", data.getNombreComplet());
        metadata.put("typePersonne", data.getIndPersona());
        metadata.put("statut", data.getStatutClientLibelle());

        response.put("metadata", metadata);

        return response;
    }

    private Map<String, Object> createErrorResponse(String errorCode, String message, String codCliente) {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "ERROR");
        response.put("errorCode", errorCode);
        response.put("message", message);
        response.put("codCliente", codCliente);
        response.put("timestamp", System.currentTimeMillis());

        return response;
    }

    // Optional: Add a method to get soldes only (without full fiche)
    @GetMapping("/soldes/{codCliente}")
    public ResponseEntity<?> getSoldesClient(@PathVariable(name = "codCliente") String codCliente) {
        log.info("Demande de récupération des soldes uniquement - Client: {}", codCliente);

        try {
            FicheSignaletiqueResponseSoldeDTO result = ficheSignaletiqueService.getFicheSignaletiqueWithSolde(codCliente);

            // Extract only solde information
            Map<String, Object> soldeData = new HashMap<>();
            soldeData.put("codCliente", codCliente);
            soldeData.put("nomClient", result.getNombreComplet());
            soldeData.put("comptes", result.getComptes());
            soldeData.put("totalComptes", result.getTotalComptes());
            soldeData.put("comptesActifs", result.getComptesActifs());
            soldeData.put("totalSoldeDisponible", result.getTotalSoldeDisponible());
            soldeData.put("totalSoldeMoyen", result.getTotalSoldeMoyen());

            Map<String, Object> response = new HashMap<>();
            response.put("status", "SUCCESS");
            response.put("code", 0);
            response.put("data", soldeData);

            return ResponseEntity.ok(response);

        } catch (ResourceNotFoundException e) {
            log.warn("Client non trouvé pour soldes: {}", codCliente);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse("NOT_FOUND", e.getMessage(), codCliente));

        } catch (ApiException e) {
            log.error("Erreur API lors de la récupération des soldes - Client: {}", codCliente, e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(createErrorResponse("BAD_REQUEST", e.getMessage(), codCliente));

        } catch (Exception e) {
            log.error("Erreur inattendue lors de la récupération des soldes - Client: {}", codCliente, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("INTERNAL_ERROR",
                            "Une erreur inattendue s'est produite", codCliente));
        }
    }

}