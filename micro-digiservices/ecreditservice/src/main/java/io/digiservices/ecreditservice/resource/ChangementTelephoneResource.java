package io.digiservices.ecreditservice.resource;

import io.digiservices.clients.UserClient;
import io.digiservices.clients.domain.User;
import io.digiservices.ecreditservice.domain.Response;
import io.digiservices.ecreditservice.dto.CreateDemandeTelephoneRequest;
import io.digiservices.ecreditservice.dto.DemandeChangementTelephoneDto;
import io.digiservices.ecreditservice.dto.RejetTelephoneRequest;
import io.digiservices.ecreditservice.dto.ResoumissionTelephoneRequest;
import io.digiservices.ecreditservice.service.ChangementTelephoneService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

import static io.digiservices.ecreditservice.utils.RequestUtils.getResponse;
import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.OK;

@RestController
@RequestMapping("/ecredit/changement-telephone")
@AllArgsConstructor
@Slf4j
public class ChangementTelephoneResource {

    private final ChangementTelephoneService service;
    private final UserClient userClient;

    /**
     * AGENT_CREDIT cree une nouvelle demande d'autorisation.
     */
    @PostMapping
    public ResponseEntity<Response> creer(@Valid @RequestBody CreateDemandeTelephoneRequest request,
                                          Authentication authentication,
                                          HttpServletRequest httpRequest) {
        User user = userClient.getUserByUuid(authentication.getName());
        DemandeChangementTelephoneDto dto = service.creer(
                request,
                user.getUserId(),
                user.getDelegationId(),
                user.getAgenceId(),
                user.getPointventeId()
        );
        return ResponseEntity.status(CREATED).body(getResponse(httpRequest,
                Map.of("demande", dto),
                "Demande de changement de telephone creee", CREATED));
    }

    /**
     * DA: liste des demandes en attente d'approbation pour son agence.
     */
    @GetMapping("/attente")
    public ResponseEntity<Response> getEnAttenteForDA(Authentication authentication,
                                                      HttpServletRequest httpRequest) {
        User user = userClient.getUserByUuid(authentication.getName());
        var demandes = service.getEnAttenteForDA(user.getAgenceId());
        return ResponseEntity.ok(getResponse(httpRequest,
                Map.of("demandes", demandes),
                "Demandes en attente d'approbation DA", OK));
    }

    /**
     * AGENT_CREDIT: liste de ses propres demandes (toutes statuts).
     */
    @GetMapping("/mes-demandes")
    public ResponseEntity<Response> getMesDemandes(Authentication authentication,
                                                   HttpServletRequest httpRequest) {
        User user = userClient.getUserByUuid(authentication.getName());
        var demandes = service.getByDemandeur(user.getUserId());
        return ResponseEntity.ok(getResponse(httpRequest,
                Map.of("demandes", demandes),
                "Mes demandes de changement de telephone", OK));
    }

    /**
     * DA approuve la demande -> statut APPROUVE.
     */
    @PutMapping("/{id}/approuver")
    public ResponseEntity<Response> approuver(@PathVariable Long id,
                                              Authentication authentication,
                                              HttpServletRequest httpRequest) {
        User user = userClient.getUserByUuid(authentication.getName());
        DemandeChangementTelephoneDto dto = service.approuver(id, user.getUserId());
        return ResponseEntity.ok(getResponse(httpRequest,
                Map.of("demande", dto),
                "Demande approuvee", OK));
    }

    /**
     * DA rejette la demande (motif obligatoire). definitif=true => REJETE_DEFINITIF.
     */
    @PutMapping("/{id}/rejeter")
    public ResponseEntity<Response> rejeter(@PathVariable Long id,
                                            @Valid @RequestBody RejetTelephoneRequest request,
                                            Authentication authentication,
                                            HttpServletRequest httpRequest) {
        User user = userClient.getUserByUuid(authentication.getName());
        DemandeChangementTelephoneDto dto = service.rejeter(id, request, user.getUserId());
        return ResponseEntity.ok(getResponse(httpRequest,
                Map.of("demande", dto),
                request.isDefinitif() ? "Demande rejetee definitivement" : "Demande rejetee", OK));
    }

    /**
     * AGENT_CREDIT: resoumet une demande precedemment rejetee (REJETE).
     */
    @PutMapping("/{id}/resoumettre")
    public ResponseEntity<Response> resoumettre(@PathVariable Long id,
                                                @Valid @RequestBody ResoumissionTelephoneRequest request,
                                                Authentication authentication,
                                                HttpServletRequest httpRequest) {
        User user = userClient.getUserByUuid(authentication.getName());
        DemandeChangementTelephoneDto dto = service.resoumettre(id, request, user.getUserId());
        return ResponseEntity.ok(getResponse(httpRequest,
                Map.of("demande", dto),
                "Demande resoumise au DA", OK));
    }

    /**
     * AGENT_CREDIT: declenche la mise a jour SAF (idempotent tant que != VALIDE_SAF).
     */
    @PutMapping("/{id}/valider-saf")
    public ResponseEntity<Response> validerSaf(@PathVariable Long id,
                                               Authentication authentication,
                                               HttpServletRequest httpRequest) {
        User user = userClient.getUserByUuid(authentication.getName());
        DemandeChangementTelephoneDto dto = service.validerSaf(id, user.getUserId());
        return ResponseEntity.ok(getResponse(httpRequest,
                Map.of("demande", dto),
                "Telephone mis a jour dans SAF", OK));
    }

    /**
     * Detail d'une demande + son historique de cycles rejet/resoumission.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Response> getDetail(@PathVariable Long id,
                                              HttpServletRequest httpRequest) {
        DemandeChangementTelephoneDto demande = service.getById(id);
        var historique = service.getHistorique(id);
        return ResponseEntity.ok(getResponse(httpRequest,
                Map.of("demande", demande, "historique", historique),
                "Detail de la demande", OK));
    }

    /**
     * Recupere la fiche signaletique d'un client depuis SAF avec message d'erreur preserve.
     * Utilise par AGENT_CREDIT (avant soumission) et DA (avant validation).
     */
    @GetMapping("/fiche-client/{codCliente}")
    public ResponseEntity<Response> getFicheClient(@PathVariable String codCliente,
                                                   HttpServletRequest httpRequest) {
        Map<String, Object> fiche = service.getFicheClient(codCliente);
        return ResponseEntity.ok(getResponse(httpRequest,
                Map.of("fiche", fiche),
                "Fiche client SAF", OK));
    }

    /**
     * Inspection (DI): vue globale avec filtres optionnels delegation/agence/point de vente/statut.
     */
    @GetMapping("/inspection")
    public ResponseEntity<Response> getInspection(
            @RequestParam(required = false) Long delegationId,
            @RequestParam(required = false) Long agenceId,
            @RequestParam(required = false) Long pointVenteId,
            @RequestParam(required = false) String statut,
            HttpServletRequest httpRequest) {
        var demandes = service.getForInspection(delegationId, agenceId, pointVenteId, statut);
        var stats = service.getStatistiquesInspection(delegationId, agenceId, pointVenteId);

        Map<String, Object> data = new HashMap<>();
        data.put("demandes", demandes);
        data.put("statistiques", stats);
        return ResponseEntity.ok(getResponse(httpRequest, data,
                "Vue inspection des demandes de changement de telephone", OK));
    }

}
