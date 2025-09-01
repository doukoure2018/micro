package io.digiservices.ecreditservice.resource;

import io.digiservices.clients.UserClient;
import io.digiservices.clients.domain.User;
import io.digiservices.ecreditservice.domain.Response;
import io.digiservices.ecreditservice.dto.*;
import io.digiservices.ecreditservice.service.StockService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.Map;

import static io.digiservices.ecreditservice.utils.RequestUtils.getResponse;
import static java.util.Collections.emptyMap;
import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.OK;
import static org.springframework.http.ResponseEntity.ok;

@RestController
@AllArgsConstructor
@RequestMapping("/ecredit")
@Slf4j
public class StockResource {

    private final StockService stockService;
    private final UserClient userClient;

    // Créer un nouveau bon de commande
    @PostMapping("/stock")
    public ResponseEntity<Response> createStock(@Valid @RequestBody CreateStockDto stockDto, HttpServletRequest request) {
        log.info("API: Création d'un bon de commande");
        StockResponseDto response = stockService.addStock(stockDto);
        return ok(getResponse(request, Map.of("stock", response), "Bon de commande créé avec succès", CREATED));
    }

    // Mettre à jour un bon de commande
    @PutMapping("/stock/{idCmd}")
    public ResponseEntity<Response> updateStock(
            @PathVariable Long idCmd,
            @RequestBody UpdateStockDto stockDto,
            HttpServletRequest request) {
        log.info("API: Mise à jour du bon de commande {}", idCmd);
        StockResponseDto response = stockService.updateStock(idCmd, stockDto);
        return ok(getResponse(request, Map.of("stock", response), "Bon de commande mis à jour avec succès", OK));
    }

    // Changer le statut d'un bon de commande
    @PatchMapping("/stock/{idCmd}/status")
    public ResponseEntity<Response> updateStatus(
            @PathVariable Long idCmd,
            @Valid @RequestBody UpdateStatusDto statusDto,
            HttpServletRequest request) {
        log.info("API: Changement de statut du bon {}", idCmd);
        StockResponseDto response = stockService.updateStatus(idCmd, statusDto);
        return ok(getResponse(request, Map.of("stock", response), "Statut mis à jour avec succès", OK));
    }

    // Récupérer tous les bons de commande en cours
    @GetMapping("/stock/encours")
    public ResponseEntity<Response> getAllStockEncours(HttpServletRequest request) {
        log.info("API: Récupération des bons en cours");
        List<StockResponseDto> stocks = stockService.getAllStockEncours();
        return ok(getResponse(request, Map.of("stocks", stocks, "count", stocks.size()),
                "Bons de commande en cours récupérés avec succès", OK));
    }

    // Récupérer tous les bons de commande avec pagination
    @GetMapping("/stock")
    public ResponseEntity<Response> getAllStock(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            HttpServletRequest request) {
        log.info("API: Récupération des bons - page: {}, taille: {}", page, size);
        List<StockResponseDto> stocks = stockService.getAllStock(page, size);
        return ok(getResponse(request, Map.of(
                "stocks", stocks,
                "page", page,
                "size", size,
                "totalElements", stocks.size()
        ), "Bons de commande récupérés avec succès", OK));
    }

    // Récupérer un bon de commande par ID
    @GetMapping("/stock/{idCmd}")
    public ResponseEntity<Response> getStockById(@PathVariable Long idCmd, HttpServletRequest request) {
        log.info("API: Récupération du bon {}", idCmd);
        StockResponseDto stock = stockService.getStockById(idCmd);
        return ok(getResponse(request, Map.of("stock", stock),
                "Bon de commande récupéré avec succès", OK));
    }

    // Récupérer les bons de commande d'un utilisateur
    @GetMapping("/stock/user/{userId}")
    public ResponseEntity<Response> getStockByUser(@PathVariable(name = "userId") Long userId, HttpServletRequest request) {
        log.info("API: Récupération des bons de l'utilisateur {}", userId);
        List<StockResponseDto> stocks = stockService.getStockByUser(userId);
        return ok(getResponse(request, Map.of(
                "stocks", stocks,
                "userId", userId,
                "count", stocks.size()
        ), "Bons de commande de l'utilisateur récupérés avec succès", OK));
    }

    // Récupérer les statistiques
    @GetMapping("/stock/statistics")
    public ResponseEntity<Response> getStatistics(HttpServletRequest request) {
        log.info("API: Récupération des statistiques");
        Map<String, Long> stats = stockService.getStatistics();
        return ok(getResponse(request, Map.of("statistics", stats),
                "Statistiques récupérées avec succès", OK));
    }

    // Approuver un bon de commande
    @PostMapping("/stock/{idCmd}/approve")
    public ResponseEntity<Response> approveStock(
            @PathVariable Long idCmd,
            @RequestParam Long traitePar,
            @RequestParam(required = false) String observations,
            HttpServletRequest request) {
        log.info("API: Approbation du bon {}", idCmd);
        UpdateStatusDto statusDto = UpdateStatusDto.builder()
                .status("ACCEPT")
                .traitePar(traitePar)
                .observations(observations)
                .build();
        StockResponseDto response = stockService.updateStatus(idCmd, statusDto);
        return ok(getResponse(request, Map.of("stock", response),
                "Bon de commande approuvé avec succès", OK));
    }

    // Rejeter un bon de commande
    @PostMapping("/stock/{idCmd}/reject")
    public ResponseEntity<Response> rejectStock(
            @PathVariable Long idCmd,
            @RequestParam Long traitePar,
            @RequestParam String motif,
            @RequestParam(required = false) String observations,
            HttpServletRequest request) {
        log.info("API: Rejet du bon {}", idCmd);
        UpdateStatusDto statusDto = UpdateStatusDto.builder()
                .status("REJET")
                .traitePar(traitePar)
                .motif(motif)
                .observations(observations)
                .build();
        StockResponseDto response = stockService.updateStatus(idCmd, statusDto);
        return ok(getResponse(request, Map.of("stock", response),
                "Bon de commande rejeté avec succès", OK));
    }

    // Récupérer les bons en cours par délégation
    @GetMapping("/stock/encours/{delegationId}")
    public ResponseEntity<Response> getAllStockEncoursByDelegation(
            @PathVariable(name = "delegationId") Long delegationId,
            HttpServletRequest request) {
        log.info("API: Récupération des bons en cours par delegation {}", delegationId);
        List<StockResponseDto> stocks = stockService.getAllStockEncoursByDelegation(delegationId);
        return ok(getResponse(request, Map.of(
                "stocks", stocks,
                "delegationId", delegationId,
                "delegation", userClient.getAllDelegationOffLineById(delegationId),
                "count", stocks.size()
        ), "Bons de commande par délégation récupérés avec succès", OK));
    }

    // Récupérer la liste des catégories de stock
    @GetMapping("/listCategorieStock")
    public ResponseEntity<Response> listCategorieStock(HttpServletRequest request) {
        log.info("API: Récupération des catégories de stock");
        List<CategorieStockDto> listCategorieStock = stockService.listCategorieStock();
        return ok(getResponse(request, Map.of(
                "listCategorieStock", listCategorieStock,
                "count", listCategorieStock.size()
        ), "Catégories de stock récupérées avec succès", OK));
    }

    @PutMapping("/update/stock/{idCmd}")
    public ResponseEntity<Response> updateStock(@NotNull Authentication authentication,
                                                @Valid @RequestBody UpdateStatusDto stockStatut,
                                                @PathVariable(name = "idCmd") Long idCmd,
                                                HttpServletRequest request) {
        log.info("API: Modification d'un bon de commande par {}", authentication.getName());

        // Récupérer l'utilisateur connecté
        User user = userClient.getUserByUuid(authentication.getName());

        // Déterminer le stateValidation selon le rôle et l'action
        String action = stockStatut.getStateValidation(); // "VALIDER" ou "REJETER" depuis le frontend
        String finalStateValidation;

        if ("REJETER".equalsIgnoreCase(action)) {
            // Pour un rejet, le stateValidation est toujours "REFUSE"
            finalStateValidation = "REFUSE";

            // Vérifier que le motif est fourni pour un rejet
            if (stockStatut.getMotif() == null || stockStatut.getMotif().trim().isEmpty()) {
                throw new IllegalArgumentException("Un motif est obligatoire pour rejeter une commande");
            }
        } else if ("VALIDER".equalsIgnoreCase(action)) {
            // Pour une validation, ça dépend du rôle
            if ("DR".equalsIgnoreCase(user.getRole())) {
                finalStateValidation = "VALIDE";
                log.info("Validation par DR - stateValidation: VALIDE");
            } else {
                finalStateValidation = "ACCEPTE";
                log.info("Validation par non-DR - stateValidation: ACCEPTE");
            }
        } else {
            throw new IllegalArgumentException("Action non reconnue: " + action);
        }

        // Mettre à jour le DTO avec les bonnes valeurs
        stockStatut.setStatus("ENCOURS"); // Le statut reste toujours ENCOURS
        stockStatut.setStateValidation(finalStateValidation);
        stockStatut.setTraitePar(user.getUserId());

        // Appeler le service pour effectuer la mise à jour
        stockService.updateStockStatut(stockStatut, idCmd);

        String message = String.format("Bon de commande %s avec succès",
                "REFUSE".equals(finalStateValidation) ? "rejeté" : "validé");

        return ok(getResponse(request, emptyMap(), message, CREATED));
    }

    // Endpoint séparé pour valider (optionnel, pour plus de clarté)
    @PutMapping("/validate/{idCmd}")
    public ResponseEntity<Response> validateStock(@NotNull Authentication authentication,
                                                  @RequestBody(required = false) Map<String, String> body,
                                                  @PathVariable Long idCmd,
                                                  HttpServletRequest request) {
        UpdateStatusDto dto = UpdateStatusDto.builder()
                .stateValidation("VALIDER")
                .observations(body != null ? body.get("observations") : null)
                .build();

        return updateStock(authentication, dto, idCmd, request);
    }

    // Endpoint séparé pour rejeter (optionnel, pour plus de clarté)
    @PutMapping("/reject/{idCmd}")
    public ResponseEntity<Response> rejectStock(@NotNull Authentication authentication,
                                                @RequestBody Map<String, String> body,
                                                @PathVariable Long idCmd,
                                                HttpServletRequest request) {
        if (!body.containsKey("motif") || body.get("motif").trim().isEmpty()) {
            throw new IllegalArgumentException("Le motif est obligatoire pour rejeter une commande");
        }

        UpdateStatusDto dto = UpdateStatusDto.builder()
                .stateValidation("REJETER")
                .motif(body.get("motif"))
                .observations(body.get("observations"))
                .build();

        return updateStock(authentication, dto, idCmd, request);
    }

    // Méthode utilitaire si nécessaire
    private URI getUri() {
        return URI.create("/stock");
    }
}
