package io.digiservices.ecreditservice.resource;

import io.digiservices.clients.EbankingClient;
import io.digiservices.clients.UserClient;
import io.digiservices.clients.domain.PointVenteDto;
import io.digiservices.clients.domain.ReconciliationResultDTO;
import io.digiservices.clients.domain.User;
import io.digiservices.ecreditservice.domain.Response;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.time.LocalDate;
import java.util.Map;

import static io.digiservices.ecreditservice.utils.RequestUtils.getResponse;
import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.ResponseEntity.created;

@RestController
@AllArgsConstructor
@RequestMapping("/ecredit")
public class RapprochementResource {

    private final EbankingClient ebankingClient;
    private final UserClient userClient;
    @GetMapping("/rapprochement/check")
    public ResponseEntity<Response> checkReconciliation(
                                    @NotNull Authentication authentication,
                                    @RequestParam(value = "dateDebut") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateDebut,
                                    @RequestParam(value = "dateFin") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFin,
                                    HttpServletRequest request)
    {
        // get the instance user
        User user = userClient.getUserByUuid(authentication.getName());
        // get point de service info
        PointVenteDto pointVenteDto = userClient.getPointVenteClient(user.getPointventeId());
        ReconciliationResultDTO reconciliationResultDTO = ebankingClient.checkReconciliation(
                pointVenteDto.getCode(),dateDebut,dateFin
        );
        return created(getUri()).body(getResponse(request, Map.of("reconciliationResultDTO", reconciliationResultDTO), "Rapprochement effectué avec success", CREATED));
    }

    private URI getUri() {
        return URI.create("/ecredit/rapprochement-caisse");
    }
}
