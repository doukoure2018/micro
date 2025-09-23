package io.digiservices.ecreditservice.resource;

import feign.FeignException;
import io.digiservices.clients.EbankingClient;
import io.digiservices.clients.UserClient;
import io.digiservices.clients.domain.UpdateFicheSignaletiqueDTO;

import io.digiservices.clients.domain.User;
import io.digiservices.ecreditservice.domain.Response;

import io.digiservices.ecreditservice.dto.PersonnePhysique;
import io.digiservices.ecreditservice.service.CorrectionService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.common.errors.ResourceNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static io.digiservices.ecreditservice.utils.RequestUtils.getResponse;
import static org.springframework.http.HttpStatus.*;
import static org.springframework.http.ResponseEntity.created;

@RestController
@AllArgsConstructor
@RequestMapping("/ecredit")
@Slf4j
public class CorrectionResource {

    private final EbankingClient ebankingClient;

    private final CorrectionService correctionService;

    private final UserClient userClient;

    /**
     * Récupère la fiche signalétique d'un client
     * @param authentication Authentication context
     * @param codCliente Code du client
     * @param request HttpServletRequest
     * @return La fiche signalétique complète
     */
    @GetMapping("/fiche-signaletique/{codCliente}")
    public ResponseEntity<Response> getFicheSignaletique(
            @NotNull Authentication authentication,
            @PathVariable("codCliente") String codCliente,
            HttpServletRequest request)
    {

        log.info("Récupération fiche signalétique via ecredit - Client: {}", codCliente);

        try {
            // Appel au service ebanking via Feign
            Map<String, Object> result = ebankingClient.getFicheSignaletique(codCliente);

            // Vérifier le statut de la réponse
            String status = (String) result.get("status");

            if ("SUCCESS".equals(status)) {
                log.info("Fiche signalétique récupérée avec succès - Client: {}", codCliente);
                return ResponseEntity.ok(
                        getResponse(request,
                                result,
                                "Fiche signalétique récupérée avec succès",
                                OK)
                );
            } else {
                log.warn("Échec de récupération - Client: {}, Status: {}", codCliente, status);
                return ResponseEntity.status(BAD_REQUEST).body(
                        getResponse(request,
                                result,
                                "Échec de récupération de la fiche signalétique",
                                BAD_REQUEST)
                );
            }

        } catch (FeignException.NotFound e) {
            log.warn("Client non trouvé: {}", codCliente);
            return ResponseEntity.status(NOT_FOUND).body(
                    getResponse(request,
                            Map.of("errorCode", "NOT_FOUND",
                                    "codCliente", codCliente,
                                    "message", "Client non trouvé"),
                            "Client non trouvé",
                            NOT_FOUND)
            );

        } catch (FeignException.BadRequest e) {
            log.error("Erreur de requête - Client: {}", codCliente, e);
            return ResponseEntity.status(BAD_REQUEST).body(
                    getResponse(request,
                            Map.of("errorCode", "BAD_REQUEST",
                                    "codCliente", codCliente,
                                    "message", "Requête invalide"),
                            "Erreur de validation",
                            BAD_REQUEST)
            );

        } catch (FeignException e) {
            log.error("Erreur Feign lors de la récupération - Client: {}", codCliente, e);

            // Déterminer le status HTTP de l'erreur Feign
            HttpStatus status = HttpStatus.resolve(e.status());
            if (status == null) {
                status = INTERNAL_SERVER_ERROR;
            }

            return ResponseEntity.status(status).body(
                    getResponse(request,
                            Map.of("errorCode", "FEIGN_ERROR",
                                    "codCliente", codCliente,
                                    "message", "Erreur de communication avec le service ebanking",
                                    "details", e.getMessage()),
                            "Erreur de communication",
                            status)
            );

        } catch (Exception e) {
            log.error("Erreur inattendue lors de la récupération - Client: {}", codCliente, e);
            return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(
                    getResponse(request,
                            Map.of("errorCode", "INTERNAL_ERROR",
                                    "codCliente", codCliente,
                                    "message", "Une erreur inattendue s'est produite"),
                            "Erreur interne du serveur",
                            INTERNAL_SERVER_ERROR)
            );
        }
    }

    @PutMapping("/update/fiche-signaletique")
    public ResponseEntity<Response> updateClientIndividuel(
            @NotNull Authentication authentication,
            @Valid @RequestBody UpdateFicheSignaletiqueDTO updateFicheSignaletiqueDTO,
            HttpServletRequest request) {

        log.info("Mise à jour fiche signalétique via ecredit - Client: {}",
                updateFicheSignaletiqueDTO.getCodClientes());

        try {
            Map<String, Object> result = ebankingClient.updateFicheSignaletique(updateFicheSignaletiqueDTO);

            // Vérifier le code de retour
            Integer code = (Integer) result.get("code");

            if (code != null && code == 0) {
                log.info("Mise à jour réussie - Client: {}", updateFicheSignaletiqueDTO.getCodClientes());
                return ResponseEntity.ok(
                        getResponse(request,
                                result,
                                "Fiche signalétique mise à jour avec succès",
                                OK)
                );
            } else {
                log.warn("Échec de mise à jour - Client: {}, Code: {}",
                        updateFicheSignaletiqueDTO.getCodClientes(), code);
                return ResponseEntity.badRequest().body(
                        getResponse(request,
                                result,
                                "Échec de la mise à jour",
                                BAD_REQUEST)
                );
            }

        } catch (FeignException e) {
            log.error("Erreur Feign lors de la mise à jour - Client: {}",
                    updateFicheSignaletiqueDTO.getCodClientes(), e);

            HttpStatus status = HttpStatus.resolve(e.status());
            if (status == null) {
                status = INTERNAL_SERVER_ERROR;
            }

            return ResponseEntity.status(status).body(
                    getResponse(request,
                            Map.of("error", e.getMessage(),
                                    "client", updateFicheSignaletiqueDTO.getCodClientes()),
                            "Erreur de communication avec le service ebanking",
                            status)
            );

        } catch (Exception e) {
            log.error("Erreur inattendue lors de la mise à jour - Client: {}",
                    updateFicheSignaletiqueDTO.getCodClientes(), e);
            return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(
                    getResponse(request,
                            Map.of("error", e.getMessage(),
                                    "client", updateFicheSignaletiqueDTO.getCodClientes()),
                            "Erreur interne du serveur",
                            INTERNAL_SERVER_ERROR)
            );
        }
    }


    @PostMapping("/addPersonnePhysique")
    public ResponseEntity<Response> insertPersonnePhysique(
            @Valid @RequestBody PersonnePhysique personnePhysique,
            HttpServletRequest request) {

        log.info("Endpoint - Création personne physique: {}", personnePhysique.getCodCliente());

        try {
            PersonnePhysique newPersonnePhysique = correctionService.addPersonnePhysique(personnePhysique);

            return created(getUri())
                    .body(getResponse(request,
                            Map.of("personnePhysique", newPersonnePhysique),
                            "Personne Physique créée avec succès",
                            CREATED));

        } catch (IllegalArgumentException e) {
            log.error("Erreur de validation: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(getResponse(request,
                            Map.of("error", e.getMessage()),
                            "Erreur de validation",
                            BAD_REQUEST));

        } catch (Exception e) {
            log.error("Erreur lors de la création", e);
            return ResponseEntity.status(INTERNAL_SERVER_ERROR)
                    .body(getResponse(request,
                            Map.of("error", "Erreur interne du serveur"),
                            "Erreur lors de la création",
                            INTERNAL_SERVER_ERROR));
        }
    }

    @GetMapping("/personnePhysique/{codClientes}")
    public ResponseEntity<Response> getPersonnePhysique(
            @PathVariable String codClientes,
            HttpServletRequest request) {

        log.info("Endpoint - Récupération personne physique: {}", codClientes);

        try {
            Optional<PersonnePhysique> personnePhysique = correctionService
                    .findPersonnePhysiqueByCodClientes(codClientes);

            if (personnePhysique.isPresent()) {
                return ResponseEntity.ok(
                        getResponse(request,
                                Map.of("personnePhysique", personnePhysique.get()),
                                "Personne physique trouvée",
                                OK));
            } else {
                return ResponseEntity.status(NOT_FOUND)
                        .body(getResponse(request,
                                Map.of("codClientes", codClientes),
                                "Personne physique non trouvée",
                                NOT_FOUND));
            }

        } catch (Exception e) {
            log.error("Erreur lors de la récupération", e);
            return ResponseEntity.status(INTERNAL_SERVER_ERROR)
                    .body(getResponse(request,
                            Map.of("error", "Erreur interne"),
                            "Erreur lors de la récupération",
                            INTERNAL_SERVER_ERROR));
        }
    }

    @PutMapping("/updatePersonnePhysique")
    public ResponseEntity<Response> updatePersonnePhysique(
            @Valid @RequestBody PersonnePhysique personnePhysique,
            HttpServletRequest request) {

        log.info("Endpoint - Mise à jour personne physique: {}", personnePhysique.getCodCliente());

        try {
            PersonnePhysique updated = correctionService.updatePersonnePhysique(personnePhysique);

            return ResponseEntity.ok(
                    getResponse(request,
                            Map.of("personnePhysique", updated),
                            "Personne physique mise à jour avec succès",
                            OK));

        } catch (ResourceNotFoundException e) {
            log.error("Personne physique non trouvée: {}", e.getMessage());
            return ResponseEntity.status(NOT_FOUND)
                    .body(getResponse(request,
                            Map.of("error", e.getMessage()),
                            "Personne physique non trouvée",
                            NOT_FOUND));

        } catch (IllegalArgumentException e) {
            log.error("Erreur de validation: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(getResponse(request,
                            Map.of("error", e.getMessage()),
                            "Erreur de validation",
                            BAD_REQUEST));

        } catch (Exception e) {
            log.error("Erreur lors de la mise à jour", e);
            return ResponseEntity.status(INTERNAL_SERVER_ERROR)
                    .body(getResponse(request,
                            Map.of("error", "Erreur interne"),
                            "Erreur lors de la mise à jour",
                            INTERNAL_SERVER_ERROR));
        }
    }

    @DeleteMapping("/personnePhysique/{codClientes}")
    public ResponseEntity<Response> deletePersonnePhysique(
            @PathVariable String codClientes,
            HttpServletRequest request) {

        log.info("Endpoint - Suppression personne physique: {}", codClientes);

        try {
            boolean deleted = correctionService.deletePersonnePhysique(codClientes);

            if (deleted) {
                return ResponseEntity.ok(
                        getResponse(request,
                                Map.of("codClientes", codClientes),
                                "Personne physique supprimée avec succès",
                                OK));
            } else {
                return ResponseEntity.status(NOT_FOUND)
                        .body(getResponse(request,
                                Map.of("codClientes", codClientes),
                                "Personne physique non trouvée",
                                NOT_FOUND));
            }

        } catch (ResourceNotFoundException e) {
            log.error("Personne physique non trouvée: {}", e.getMessage());
            return ResponseEntity.status(NOT_FOUND)
                    .body(getResponse(request,
                            Map.of("error", e.getMessage()),
                            "Personne physique non trouvée",
                            NOT_FOUND));

        } catch (Exception e) {
            log.error("Erreur lors de la suppression", e);
            return ResponseEntity.status(INTERNAL_SERVER_ERROR)
                    .body(getResponse(request,
                            Map.of("error", "Erreur interne"),
                            "Erreur lors de la suppression",
                            INTERNAL_SERVER_ERROR));
        }
    }


    @GetMapping("/listPPAttente")
    public ResponseEntity<Response> getListePersonnePhysique(@NotNull Authentication authentication,
                                                             HttpServletRequest request) {
        try {
            User user = userClient.getUserByUuid(authentication.getName());
             String codAgencia = userClient.getPointVenteClient(user.getPointventeId()).getCode();
             // get liste of personne Physique
            List<PersonnePhysique> listePPAttente = correctionService.getListePPAttente(codAgencia);
                return ResponseEntity.ok(
                        getResponse(request,
                                Map.of("listePPAttente", listePPAttente),
                                "Personne physique trouvée",
                                OK));
        } catch (Exception e) {
            log.error("Erreur lors de la récupération", e);
            return ResponseEntity.status(INTERNAL_SERVER_ERROR)
                    .body(getResponse(request,
                            Map.of("error", "Erreur interne"),
                            "Erreur lors de la récupération",
                            INTERNAL_SERVER_ERROR));
        }
    }


    private URI getUri() {
        return URI.create("/ecredit/personnePhysique");
    }


}
