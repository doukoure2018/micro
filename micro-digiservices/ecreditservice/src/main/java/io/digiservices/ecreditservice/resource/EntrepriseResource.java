package io.digiservices.ecreditservice.resource;

import io.digiservices.ecreditservice.domain.Response;
import io.digiservices.ecreditservice.dto.Entreprise;
import io.digiservices.ecreditservice.dto.Promoteur;
import io.digiservices.ecreditservice.service.EntrepriseService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.Map;

import static io.digiservices.ecreditservice.utils.RequestUtils.getResponse;
import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.OK;
import static org.springframework.http.ResponseEntity.created;
import static org.springframework.http.ResponseEntity.ok;

@RestController
@AllArgsConstructor
@RequestMapping("/ecredit")
public class EntrepriseResource {

    private final EntrepriseService entrepriseService;

    @PostMapping("/addEntreprise")
    public ResponseEntity<Response> registerEntreprise(@RequestBody Entreprise entreprise, HttpServletRequest request) {
        return created(getUri()).body(getResponse(request, Map.of("entreprises", entrepriseService.savedEntreprise(entreprise,entreprise.getPromoteurId())), "Promoteur Created Success", CREATED));
    }

    private URI getUri() {
        return URI.create("/entreprise/entrepriseId");
    }
}
