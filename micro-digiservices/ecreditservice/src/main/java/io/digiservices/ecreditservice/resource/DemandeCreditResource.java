package io.digiservices.ecreditservice.resource;

import io.digiservices.ecreditservice.domain.Response;
import io.digiservices.ecreditservice.dto.DemandeCredit;
import io.digiservices.ecreditservice.dto.DemandeCredititCompleteDTO;
import io.digiservices.ecreditservice.dto.Entreprise;
import io.digiservices.ecreditservice.service.DemandeCreditService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;
import java.util.Map;

import static io.digiservices.ecreditservice.utils.RequestUtils.getResponse;
import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.ResponseEntity.created;

@RestController
@AllArgsConstructor
@RequestMapping("/ecredit")
public class DemandeCreditResource {

    private final DemandeCreditService demandeCreditService;
    @PostMapping("/addDemandeCredit")
    public ResponseEntity<Response> registerDemandeCredit(@RequestBody DemandeCredit demandeCredit, HttpServletRequest request) {
        return created(getUri()).body(getResponse(request, Map.of("credit", demandeCreditService.saveDemandeCredit(demandeCredit.getEntrepriseId(),demandeCredit)), "Credit added Success", CREATED));
    }

    @PostMapping("/submitCompleteDemande")
    public ResponseEntity<Response> submitCompleteDemande(@RequestBody DemandeCredititCompleteDTO demande, HttpServletRequest request) {
        Map<String, Object> result = demandeCreditService.traiterDemandeComplete(demande);
        boolean success = result.containsKey("success") && Boolean.TRUE.equals(result.get("success"));

        if (success) {
            return created(getUri()).body(getResponse(request, Map.of("demande", result), "Demande ajoutée avec succès", CREATED));
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(getResponse(request, null, "Erreur lors du traitement de la demande", HttpStatus.INTERNAL_SERVER_ERROR));
        }
    }

    private URI getUri() {
        return URI.create("/credit/demandeCreditId");
    }
}
