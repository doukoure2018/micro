package io.digiservices.ecreditservice.resource;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.digiservices.clients.EbankingClient;
import io.digiservices.clients.UserClient;
import io.digiservices.clients.domain.AgenceDto;
import io.digiservices.clients.domain.DelegationDto;
import io.digiservices.clients.domain.PointVenteDto;
import io.digiservices.clients.domain.User;
import io.digiservices.ecreditservice.domain.Response;
import io.digiservices.ecreditservice.dto.*;
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
        return ok(getResponse(request, Map.of("resumeCredit", resume,"user", userClient.getUserByUuid(authentication.getName())), "Resume Retrieved Successfully", OK));
    }

    @GetMapping("/info/{delegationId}/{agenceId}/{pointVenteId}")
    public ResponseEntity<Response> getInfoResumeCredit(@NotNull Authentication authentication,
                                                        @PathVariable(name = "delegationId") Long delegationId,
                                                        @PathVariable(name = "agenceId") Long agenceId,
                                                        @PathVariable(name = "pointVenteId") Long pointVenteId,
                                                        HttpServletRequest request) {
        User user = userClient.getUserByUuid(authentication.getName());
        DelegationDto delegationDto = userClient.getAllDelegationOffLineById(delegationId);
        AgenceDto agenceDto = userClient.getAgenceById(agenceId);
        PointVenteDto pointVenteDto = userClient.getPointVenteClient(pointVenteId);
        InfoAdministrative infoAdministrative = new InfoAdministrative();
        infoAdministrative.setUser(user);
        infoAdministrative.setAgenceDto(agenceDto);
        infoAdministrative.setDelegationDto(delegationDto);
        infoAdministrative.setPointVenteDto(pointVenteDto);
        return ok(getResponse(request, Map.of("infoAdministrative",infoAdministrative), "Information sur localisation", OK));
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


    @PostMapping("/addMotif/{demandeCreditId}")
    public ResponseEntity<Response> addMotif(@NotNull Authentication authentication,
                                             @PathVariable(name = "demandeCreditId") Long demandeCreditId,
                                             @RequestBody @Valid MotifAnalyse motifAnalyse,
                                             HttpServletRequest request) {

        // Set the required fields from path variable and authentication
        motifAnalyse.setDemandeCreditId(demandeCreditId);
        motifAnalyse.setUserId(userClient.getUserByUuid(authentication.getName()).getUserId());

        // Save the motif analyse
        MotifAnalyse savedMotifAnalyse = demandeCreditService.addMotifAnalyse(motifAnalyse);

        return ResponseEntity.status(CREATED)
                .body(getResponse(request, Map.of("motifAnalyse", savedMotifAnalyse),
                        "Motif added Successfully", CREATED));
    }


    @PutMapping("/analyseComplet/update")
    public ResponseEntity<Response> mettreAJourDemande(
            @NotNull Authentication authentication,
            @Valid @RequestBody DemandeUpdateRequest request,
            HttpServletRequest httpRequest) {

        log.info("Tentative de mise à jour de la demande de crédit ID: {} par l'utilisateur: {}",
                request.getDemandeCreditId(), authentication.getName());

        // Sérialiser les cautions en JSON
        String cautionsJson = "";
        try {
            if (request.getCautions() != null && !request.getCautions().isEmpty()) {
                ObjectMapper objectMapper = new ObjectMapper();
                cautionsJson = objectMapper.writeValueAsString(request.getCautions());
            }
        } catch (Exception e) {
            log.error("Erreur lors de la sérialisation des cautions: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(getResponse(httpRequest,
                            Map.of("success", false,
                                    "demandeCreditId", request.getDemandeCreditId()),
                            "Erreur lors du traitement des cautions",
                            HttpStatus.BAD_REQUEST));
        }

        // Appeler la méthode avec les deux paramètres
        Boolean success = demandeCreditService.mettreAJourDemande(request, cautionsJson);

        if (success) {
            return ok(getResponse(httpRequest,
                    Map.of("success", true,
                            "demandeCreditId", request.getDemandeCreditId(),
                            "user", userClient.getUserByUuid(authentication.getName())),
                    "Demande de crédit mise à jour avec succès",
                    OK));
        } else {
            return ResponseEntity.badRequest()
                    .body(getResponse(httpRequest,
                            Map.of("success", false,
                                    "demandeCreditId", request.getDemandeCreditId()),
                            "Échec de la mise à jour de la demande de crédit",
                            HttpStatus.BAD_REQUEST));
        }
    }

    @GetMapping("/analyseComplete/{demandeCreditId}")
    public ResponseEntity<Response> obtenirAnalyseComplete(
            @NotNull Authentication authentication,
            @PathVariable(name = "demandeCreditId") Integer demandeCreditId,
            HttpServletRequest request) {

        Map<String, Object> analyseComplete = demandeCreditService.obtenirAnalyseComplete(demandeCreditId);

        return ok(getResponse(request,
                Map.of("analyseComplete", analyseComplete,
                        "user", userClient.getUserByUuid(authentication.getName())),
                "Resume Retrieved Successfully",
                OK));
    }


    /**
     * Analyse de credit
     * @return
     */

    private URI getUri() {
        return URI.create("/credit/demandeCreditId");
    }
}
