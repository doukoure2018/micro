package io.digiservices.ecreditservice.resource;

import io.digiservices.ecreditservice.domain.Response;
import io.digiservices.ecreditservice.dto.PortefeuilleRisqueDtos.FamilleRequest;
import io.digiservices.ecreditservice.dto.PortefeuilleRisqueDtos.SeuilsRequest;
import io.digiservices.ecreditservice.service.PortefeuilleRisqueService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Map;

import static io.digiservices.ecreditservice.utils.RequestUtils.getResponse;
import static org.springframework.http.HttpStatus.OK;

/**
 * Portefeuille a risque par agent et par produit (lots 1 et 2). La rubrique d'habilitation et
 * le perimetre SAF sont verifies par le service a chaque appel.
 */
@RestController
@RequestMapping("/ecredit/portefeuille/risque")
@RequiredArgsConstructor
@Slf4j
public class PortefeuilleRisqueResource {

    private final PortefeuilleRisqueService service;

    // ------------------------------------------------------------------ un point de service (lot 1)

    /** Ventilation d'un point de service : total, par produit, par famille, par agent, croisement. */
    @GetMapping
    public ResponseEntity<Response> charger(@NotNull Authentication authentication,
                                            @RequestParam(name = "codAgencia") String codAgencia,
                                            HttpServletRequest request) {
        return ResponseEntity.ok(getResponse(request,
                Map.of("risque", service.charger(authentication.getName(), codAgencia)),
                "Portefeuille a risque du point de service", OK));
    }

    /**
     * Les credits derriere un chiffre : par produit, par agent ({@code agent} = identifiant,
     * {@code NON_AFFECTE} ou vide) et par tranche ({@code 30}, {@code 90}, {@code retard} ou vide).
     */
    @GetMapping("/credits")
    public ResponseEntity<Response> credits(@NotNull Authentication authentication,
                                            @RequestParam(name = "codAgencia") String codAgencia,
                                            @RequestParam(name = "tipCredito", required = false) Long tipCredito,
                                            @RequestParam(name = "agent", required = false) String agent,
                                            @RequestParam(name = "tranche", required = false) String tranche,
                                            HttpServletRequest request) {
        return ResponseEntity.ok(getResponse(request,
                Map.of("credits", service.credits(authentication.getName(), codAgencia, tipCredito, agent, tranche)),
                "Credits du portefeuille a risque", OK));
    }

    /** Classeur Excel d'un point de service : Par produit, Par famille, Par agent, Croisement. */
    @GetMapping("/export")
    public ResponseEntity<byte[]> exporter(@NotNull Authentication authentication,
                                           @RequestParam(name = "codAgencia") String codAgencia) {
        return fichier(service.exporter(authentication.getName(), codAgencia), "portefeuille_risque_" + codAgencia);
    }

    // ------------------------------------------------------------------ un perimetre (lot 2)

    /** Le perimetre du compte, ou une delegation ou une agence dedans ; niveau = delegation, agence, ps ou auto. */
    @GetMapping("/reseau")
    public ResponseEntity<Response> reseau(@NotNull Authentication authentication,
                                           @RequestParam(name = "niveau", defaultValue = "auto") String niveau,
                                           @RequestParam(name = "agenceId", required = false) Long agenceId,
                                           @RequestParam(name = "delegationId", required = false) Long delegationId,
                                           HttpServletRequest request) {
        return ResponseEntity.ok(getResponse(request,
                Map.of("risque", service.reseau(authentication.getName(), niveau, agenceId, delegationId)),
                "Portefeuille a risque du perimetre", OK));
    }

    @GetMapping("/reseau/export")
    public ResponseEntity<byte[]> exporterReseau(@NotNull Authentication authentication,
                                                 @RequestParam(name = "niveau", defaultValue = "auto") String niveau,
                                                 @RequestParam(name = "agenceId", required = false) Long agenceId,
                                                 @RequestParam(name = "delegationId", required = false) Long delegationId) {
        return fichier(service.exporterReseau(authentication.getName(), niveau, agenceId, delegationId), "portefeuille_risque_perimetre");
    }

    /** Relance la photo du matin (Direction de l'exploitation, SUPER_ADMIN) : repond tout de suite. */
    @PostMapping("/photo")
    public ResponseEntity<Response> photographier(@NotNull Authentication authentication, HttpServletRequest request) {
        String message = service.photographier(authentication.getName());
        return ResponseEntity.ok(getResponse(request, Map.of("message", message), message, OK));
    }

    // ------------------------------------------------------------------ familles et seuils

    @GetMapping("/familles")
    public ResponseEntity<Response> familles(@NotNull Authentication authentication, HttpServletRequest request) {
        return ResponseEntity.ok(getResponse(request,
                Map.of("familles", service.familles(authentication.getName())),
                "Types de credit et familles", OK));
    }

    @PutMapping("/familles")
    public ResponseEntity<Response> enregistrerFamille(@NotNull Authentication authentication,
                                                       @Valid @RequestBody FamilleRequest body,
                                                       HttpServletRequest request) {
        String message = service.enregistrerFamille(authentication.getName(), body);
        return ResponseEntity.ok(getResponse(request, Map.of("message", message), message, OK));
    }

    @PutMapping("/seuils")
    public ResponseEntity<Response> enregistrerSeuils(@NotNull Authentication authentication,
                                                      @Valid @RequestBody SeuilsRequest body,
                                                      HttpServletRequest request) {
        String message = service.enregistrerSeuils(authentication.getName(), body);
        return ResponseEntity.ok(getResponse(request, Map.of("message", message), message, OK));
    }

    // ------------------------------------------------------------------ interne

    private static ResponseEntity<byte[]> fichier(byte[] contenu, String prefixe) {
        String nom = prefixe + "_" + LocalDate.now().format(DateTimeFormatter.BASIC_ISO_DATE) + ".xlsx";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
        headers.setContentDispositionFormData("attachment", nom);
        headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");
        headers.setContentLength(contenu.length);
        return ResponseEntity.ok().headers(headers).body(contenu);
    }
}
