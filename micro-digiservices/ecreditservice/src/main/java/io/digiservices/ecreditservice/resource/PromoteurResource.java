package io.digiservices.ecreditservice.resource;

import io.digiservices.ecreditservice.domain.Response;
import io.digiservices.ecreditservice.dto.Promoteur;
import io.digiservices.ecreditservice.service.PromoteurService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.net.URI;
import java.util.Map;

import static io.digiservices.ecreditservice.utils.RequestUtils.getResponse;
import static java.util.Collections.emptyMap;
import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.OK;
import static org.springframework.http.ResponseEntity.created;
import static org.springframework.http.ResponseEntity.ok;


@RestController
@AllArgsConstructor
@RequestMapping("/ecredit")
public class PromoteurResource {
    private final PromoteurService promoteurService;

    @PostMapping("/addPromoteur")
    public ResponseEntity<Response> registerPromoteur(@RequestBody Promoteur promoteur, HttpServletRequest request) {
        Promoteur savedPromoteur = promoteurService.createPromoteur(promoteur);
        return created(getUri()).body(getResponse(request,Map.of("promoteur", savedPromoteur), "Promoteur Created Success", CREATED));
    }

    // When user is not logged in
    @GetMapping("/promoteurId")
    public ResponseEntity<Response> verifyAccount(@RequestParam("promoteurId") Long promoteurId, HttpServletRequest request) {

        return ok(getResponse(request, Map.of("promoteur", promoteurService.getPromoteurById(promoteurId)), "Account verified. You may login now", OK));
    }


    private URI getUri() {
        return URI.create("/promoteur/promoteurId");
    }
}
