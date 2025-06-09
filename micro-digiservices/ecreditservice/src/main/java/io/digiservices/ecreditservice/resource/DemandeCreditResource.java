package io.digiservices.ecreditservice.resource;

import io.digiservices.clients.EbankingClient;
import io.digiservices.clients.UserClient;
import io.digiservices.ecreditservice.domain.Response;
import io.digiservices.ecreditservice.dto.DemandeCredit;
import io.digiservices.ecreditservice.dto.DemandeCreditCompleteDTO;
import io.digiservices.ecreditservice.service.DemandeCreditService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.HashMap;
import java.util.Map;

import static io.digiservices.ecreditservice.utils.RequestUtils.getResponse;
import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.OK;
import static org.springframework.http.ResponseEntity.created;
import static org.springframework.http.ResponseEntity.ok;

@RestController
@AllArgsConstructor
@RequestMapping("/ecredit")
@Slf4j
public class DemandeCreditResource {

    private final DemandeCreditService demandeCreditService;
    private final UserClient userClient;
    private final EbankingClient ebankingClient;
    @PostMapping("/addDemandeCredit")
    public ResponseEntity<Response> registerDemandeCredit(@RequestBody DemandeCredit demandeCredit, HttpServletRequest request) {
        return created(getUri()).body(getResponse(request, Map.of("credit", demandeCreditService.saveDemandeCredit(demandeCredit.getEntrepriseId(),demandeCredit)), "Credit added Success", CREATED));
    }


    @PostMapping("/submitCompleteDemande")
    public ResponseEntity<Response> submitCompleteDemande(
            @Valid @RequestBody DemandeCreditCompleteDTO demande,
            HttpServletRequest request) {

        try {
            Map<String, Object> result = demandeCreditService.traiterDemandeComplete(demande);
            boolean success = result.containsKey("success") && Boolean.TRUE.equals(result.get("success"));

            if (success) {
                return created(getUri())
                        .body(getResponse(request, Map.of("demande", result),
                                "Demande ajoutée avec succès", CREATED));
            } else {
                // Déterminer le type d'erreur
                String errorType = (String) result.get("errorType");
                String errorMessage = (String) result.get("error");

                if ("VALIDATION_ERROR".equals(errorType)) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body(getResponse(request, result,
                                    errorMessage != null ? errorMessage : "Erreur de validation",
                                    HttpStatus.BAD_REQUEST));
                } else {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .body(getResponse(request, result,
                                    errorMessage != null ? errorMessage : "Erreur lors du traitement de la demande",
                                    HttpStatus.INTERNAL_SERVER_ERROR));
                }
            }

        } catch (Exception e) {
            log.error("Erreur inattendue dans le contrôleur lors du traitement de la demande: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(getResponse(request, null,
                            "Erreur technique inattendue",
                            HttpStatus.INTERNAL_SERVER_ERROR));
        }
    }

    @GetMapping("/getAllCreditOngoing/{statut}")
    public ResponseEntity<Response> getAllCreditOngoing(@NotNull Authentication authentication,
                                                        @PathVariable(name = "statut") String statut,
                                                        @RequestParam(name = "userId", required = false) Long userId,
                                                        HttpServletRequest request) {

        Map<String, Object> responseData = new HashMap<>();
        responseData.put("demandeAnalyseCredits", demandeCreditService.getAllDemandeOngoing(statut));

        // Ajouter l'utilisateur seulement si userId est fourni et valide
        if (userId != null) {
            try {
                responseData.put("user", userClient.getUserById(userId));
            } catch (Exception e) {
                log.warn("Erreur lors de la récupération de l'utilisateur {}: {}", userId, e.getMessage());
            }
        }

        return ok(getResponse(request, responseData, "Liste de toutes les analyses de crédit en cours", OK));
    }

    @GetMapping("/resumeCredit/{demandeCreditId}")
    public ResponseEntity<Response> obtenirResume(@NotNull Authentication authentication,
                                                  @PathVariable(name = "demandeCreditId") Integer demandeCreditId,
                                                  HttpServletRequest request) {
        Map<String, Object> resume = demandeCreditService.obtenirResumeComplet(demandeCreditId);
        return ok(getResponse(request, Map.of("resumeCredit", resume), "Resume Retrieved Successfully", OK));
    }


    @GetMapping("/seachCreditos/{codCliente}")
    public ResponseEntity<Response> seachCreditos(@NotNull Authentication authentication,
                                                  @PathVariable(name = "codCliente") String codCliente,
                                                  HttpServletRequest request) {
        return ok(getResponse(request, Map.of("histoCredits", ebankingClient.obtenerCreditosYPlanPagosPorCliente(codCliente)), "Historisque des Credits encours", OK));
    }

    @GetMapping("/getPlanPagos/{numCredito}")
    public ResponseEntity<Response> getPlanPagos(@NotNull Authentication authentication,
                                                  @PathVariable(name = "numCredito") Long numCredito,
                                                  HttpServletRequest request) {
        return ok(getResponse(request, Map.of("planpagos", ebankingClient.getAllPlanPagosByCreditos(numCredito)), "Historisque des paiements", OK));
    }

    @GetMapping("/historiqueCredit/{codCliente}")
    public ResponseEntity<Response> historiqueCredits(@NotNull Authentication authentication,
                                                 @PathVariable(name = "codCliente") String codCliente,
                                                 HttpServletRequest request) {
        return ok(getResponse(request, Map.of("histoCredits", ebankingClient.obtenerCreditosYPlanPagosPorCliente(codCliente)), "Historoque Credits Client", OK));
    }

    private URI getUri() {
        return URI.create("/credit/demandeCreditId");
    }
}
