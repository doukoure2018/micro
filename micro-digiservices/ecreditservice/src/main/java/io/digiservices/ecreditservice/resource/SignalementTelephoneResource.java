package io.digiservices.ecreditservice.resource;

import io.digiservices.ecreditservice.domain.Response;
import io.digiservices.ecreditservice.dto.CreateSignalementTelephoneRequest;
import io.digiservices.ecreditservice.dto.SignalementTelephoneDto;
import io.digiservices.ecreditservice.service.SignalementTelephoneService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

import static io.digiservices.ecreditservice.utils.RequestUtils.getResponse;
import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.OK;

/**
 * Signalement d'un numero de telephone client depuis l'etat TT1 (V156).
 *
 * <p>Le DA, le DR et la Direction de l'Exploitation signalent ; les agents de credit du point
 * de service concerne prennent en charge en creant une demande de changement (circuit V109)
 * ou classent sans suite. Tout est borne par le perimetre SAF de l'utilisateur.</p>
 */
@RestController
@RequestMapping("/ecredit/signalement-telephone")
@AllArgsConstructor
@Slf4j
public class SignalementTelephoneResource {

    private final SignalementTelephoneService service;

    /** DA, DR, DE : signaler le numero d'un client depuis une ligne du TT1. */
    @PostMapping
    public ResponseEntity<Response> signaler(@NotNull Authentication authentication,
                                             @Valid @RequestBody CreateSignalementTelephoneRequest request,
                                             HttpServletRequest httpRequest) {
        SignalementTelephoneDto s = service.signaler(authentication.getName(), request);
        return ResponseEntity.status(CREATED).body(getResponse(httpRequest,
                Map.of("signalement", s),
                "Signalement transmis au point de service", CREATED));
    }

    /** Signalements ouverts du perimetre, indexes par code client : etiquettes des lignes du TT1. */
    @GetMapping("/ouverts")
    public ResponseEntity<Response> ouverts(@NotNull Authentication authentication, HttpServletRequest request) {
        return ResponseEntity.ok(getResponse(request,
                service.capacitesEtOuverts(authentication.getName()),
                "Signalements ouverts", OK));
    }

    /** Liste de suivi : tous les signalements du perimetre de l'utilisateur. */
    @GetMapping
    public ResponseEntity<Response> duPerimetre(@NotNull Authentication authentication, HttpServletRequest request) {
        List<SignalementTelephoneDto> liste = service.duPerimetre(authentication.getName());
        return ResponseEntity.ok(getResponse(request,
                Map.of("signalements", liste), "Signalements du perimetre", OK));
    }

    /** Agent de credit : signalements recus pour son point de service. */
    @GetMapping("/recus")
    public ResponseEntity<Response> recus(@NotNull Authentication authentication,
                                          @RequestParam(name = "statut", defaultValue = "TOUS") String statut,
                                          HttpServletRequest request) {
        return ResponseEntity.ok(getResponse(request,
                Map.of("signalements", service.recus(authentication.getName(), statut)),
                "Signalements recus", OK));
    }

    /** Compteur pour la cloche de l'agent de credit. */
    @GetMapping("/recus/nouveaux")
    public ResponseEntity<Response> compterNouveaux(@NotNull Authentication authentication, HttpServletRequest request) {
        return ResponseEntity.ok(getResponse(request,
                Map.of("nouveaux", service.compterNouveaux(authentication.getName())),
                "Signalements nouveaux", OK));
    }

    /** Accuse de lecture : la cloche cesse de signaler ce qui a ete ouvert. */
    @PutMapping("/recus/vus")
    public ResponseEntity<Response> marquerVus(@NotNull Authentication authentication, HttpServletRequest request) {
        service.marquerVus(authentication.getName());
        return ResponseEntity.ok(getResponse(request, Map.of(), "Signalements marques comme vus", OK));
    }

    /** Agent de credit : rattache la demande de changement qu'il vient de creer. */
    @PutMapping("/{id}/prendre-en-charge")
    public ResponseEntity<Response> prendreEnCharge(@NotNull Authentication authentication,
                                                    @PathVariable Long id,
                                                    @RequestParam(name = "demandeId") Long demandeId,
                                                    HttpServletRequest request) {
        return ResponseEntity.ok(getResponse(request,
                Map.of("signalement", service.prendreEnCharge(authentication.getName(), id, demandeId)),
                "Signalement pris en charge", OK));
    }

    /** Agent de credit : classement sans suite, motif obligatoire. */
    @PutMapping("/{id}/classer")
    public ResponseEntity<Response> classer(@NotNull Authentication authentication,
                                            @PathVariable Long id,
                                            @RequestBody Map<String, String> corps,
                                            HttpServletRequest request) {
        return ResponseEntity.ok(getResponse(request,
                Map.of("signalement", service.classer(authentication.getName(), id, corps.get("motif"))),
                "Signalement classe sans suite", OK));
    }
}
