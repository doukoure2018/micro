package io.digiservices.ecreditservice.resource;

import io.digiservices.clients.EbankingClient;
import io.digiservices.ecreditservice.domain.Response;
import io.digiservices.ecreditservice.dto.CreditProcessParams;
import io.digiservices.ecreditservice.dto.IndividuelDto;
import io.digiservices.ecreditservice.service.IndividuelService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.Map;

import static io.digiservices.ecreditservice.utils.RequestUtils.getResponse;
import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.OK;
import static org.springframework.http.ResponseEntity.created;

@RestController
@AllArgsConstructor
@RequestMapping("/ecredit")
public class IndividuelResource {

    private final IndividuelService individuelService;
    private final EbankingClient ebankingClient;

    @PostMapping("/addIndividuel/{numeroMembre}")
    public ResponseEntity<Response> addIndividuel(@NotNull Authentication authentication,
                                                  @RequestBody IndividuelDto individuelDto,
                                                  @PathVariable(name = "numeroMembre") String numeroMembre,
                                                  HttpServletRequest request) {
        return created(getUri()).body(getResponse(request, Map.of("individuelDto", individuelService.addIndividuel(numeroMembre,individuelDto)), "Membre Created Success", CREATED));
    }


    @GetMapping(value = "/credit/{numeroMembre}")
    public ResponseEntity<Response> getInfoCredit(@NotNull Authentication authentication,
                                                 @PathVariable(name = "numeroMembre") String numeroMembre,
                                                 HttpServletRequest request)
    {
        return created(getUri()).body(getResponse(request,Map.of(
                 "creditDto", individuelService.getInfoCredit(numeroMembre),
                 "cumulCredit",ebankingClient.getCumulCreditoByCodClientes(numeroMembre),
                "countCredit",ebankingClient.getNombreCreditByClientes(numeroMembre)
                ), "Mise en Place Pétit Crédit Individuel", OK));
    }


    @PostMapping("/process-credit/{referenceCredit}/{userId}/{individuelId}")
    public ResponseEntity<Response> processPetitCredit(@NotNull Authentication authentication,
                                                       @RequestBody CreditProcessParams creditProcessParams,
                                                       @PathVariable(name = "referenceCredit") String referenceCredit,
                                                       @PathVariable(name = "userId") Long userId,
                                                       @PathVariable(name = "individuelId") Long individuelId,
                                                       HttpServletRequest request)
    {
        return created(getUri()).body(getResponse(request, Map.of("creditProcessParams", individuelService.processCredit(creditProcessParams,userId,individuelId)), "Credit Individuel Crée avec Success", CREATED));
    }


    private URI getUri() {
        return URI.create("/individuel/numeroMembre");
    }
}
