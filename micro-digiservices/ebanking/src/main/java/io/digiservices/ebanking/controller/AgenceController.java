package io.digiservices.ebanking.controller;


import io.digiservices.ebanking.domain.Response;
import io.digiservices.ebanking.dto.HttpResponse;
import io.digiservices.ebanking.paylaod.AgenceDto;
import io.digiservices.ebanking.paylaod.PointVenteDto;
import io.digiservices.ebanking.service.AgenceService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.Map;

import static io.digiservices.ebanking.controller.CreditosController.getResponse;
import static java.time.LocalTime.now;
import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.OK;
import static org.springframework.http.ResponseEntity.ok;

@RestController
@RequestMapping("/ebanking")
@RequiredArgsConstructor
public class AgenceController {

    private final AgenceService agenceService;

    @PostMapping("/addAgence")
    public ResponseEntity<HttpResponse> addAgence(@RequestBody AgenceDto agenceDto)
    {
        return ResponseEntity.created(URI.create(""))
                .body(
                        HttpResponse.builder()
                                .timeStamp(now().toString())
                                .data(Map.of("agence", agenceService.addAgence(agenceDto)))
                                .message("Agence Created")
                                .status(CREATED)
                                .statusCode(CREATED.value())
                                .build());
    }

    @GetMapping("/agences/{delegation_id}")
    public ResponseEntity<Response> agences(@PathVariable(name = "delegation_id") Long delegation_id, HttpServletRequest request)
    {
        return ok(getResponse(request, Map.of("agences",agenceService.getAllAgenceByDelegation(delegation_id)), "Liste des Agences", OK));
    }

    @GetMapping("/agence/{agence_id}")
    public ResponseEntity<AgenceDto> agence(@PathVariable(name = "agence_id") Long agence_id)
    {
        return ResponseEntity.ok(agenceService.getAgenceById(agence_id));
    }

}
