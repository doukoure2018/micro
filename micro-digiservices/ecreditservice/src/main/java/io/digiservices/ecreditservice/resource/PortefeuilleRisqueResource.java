package io.digiservices.ecreditservice.resource;

import io.digiservices.ecreditservice.domain.Response;
import io.digiservices.ecreditservice.service.PortefeuilleRisqueService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Map;

import static io.digiservices.ecreditservice.utils.RequestUtils.getResponse;
import static org.springframework.http.HttpStatus.OK;

/**
 * Portefeuille a risque par agent et par produit (lot 1). La rubrique d'habilitation et le
 * perimetre SAF sont verifies par le service a chaque appel.
 */
@RestController
@RequestMapping("/ecredit/portefeuille/risque")
@RequiredArgsConstructor
@Slf4j
public class PortefeuilleRisqueResource {

    private final PortefeuilleRisqueService service;

    /** Ventilation d'un point de service : total, par produit, par agent, croisement. */
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

    /** Classeur Excel : Par produit, Par agent, Croisement. */
    @GetMapping("/export")
    public ResponseEntity<byte[]> exporter(@NotNull Authentication authentication,
                                           @RequestParam(name = "codAgencia") String codAgencia) {
        byte[] contenu = service.exporter(authentication.getName(), codAgencia);
        String nom = "portefeuille_risque_" + codAgencia + "_"
                + LocalDate.now().format(DateTimeFormatter.BASIC_ISO_DATE) + ".xlsx";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
        headers.setContentDispositionFormData("attachment", nom);
        headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");
        headers.setContentLength(contenu.length);
        return ResponseEntity.ok().headers(headers).body(contenu);
    }
}
