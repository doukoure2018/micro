package io.digiservices.ecreditservice.resource;

import io.digiservices.ecreditservice.domain.Response;
import io.digiservices.ecreditservice.service.EcheancierService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Map;

import static io.digiservices.ecreditservice.utils.RequestUtils.getResponse;
import static org.springframework.http.HttpStatus.OK;

/**
 * Échéancier prévisionnel avec moratoire : une seule implémentation du calcul, appelée par
 * la saisie de la demande (aperçu), l'analyse agricole et le détail vu par les approbateurs.
 */
@RestController
@AllArgsConstructor
@RequestMapping("/ecredit/echeancier")
public class EcheancierResource {

    private final EcheancierService echeancierService;

    /** Aperçu en saisie : GET /ecredit/echeancier/simulation?montant=2000000&taux=3&duree=9&moratoire=7&nombreEcheances=2&dateOctroi=2026-07-10 */
    @GetMapping("/simulation")
    public ResponseEntity<Response> simuler(
            @RequestParam BigDecimal montant,
            @RequestParam(defaultValue = "0") BigDecimal taux,
            @RequestParam Integer duree,
            @RequestParam(defaultValue = "0") Integer moratoire,
            @RequestParam Integer nombreEcheances,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateOctroi,
            HttpServletRequest httpRequest) {
        var echeancier = echeancierService.simuler(montant, taux, duree, moratoire, nombreEcheances, dateOctroi);
        return ResponseEntity.ok(getResponse(httpRequest, Map.of("echeancier", echeancier), "Échéancier simulé", OK));
    }

    /** Échéancier d'une demande enregistrée (modalités sollicitées). */
    @GetMapping("/demande/{demandeId}")
    public ResponseEntity<Response> pourDemande(@PathVariable Long demandeId, HttpServletRequest httpRequest) {
        var echeancier = echeancierService.pourDemande(demandeId);
        return ResponseEntity.ok(getResponse(httpRequest, Map.of("echeancier", echeancier), "Échéancier de la demande", OK));
    }
}
