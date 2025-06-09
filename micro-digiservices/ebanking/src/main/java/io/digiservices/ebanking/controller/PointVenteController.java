package io.digiservices.ebanking.controller;

import io.digiservices.ebanking.domain.Response;
import io.digiservices.ebanking.dto.HttpResponse;
import io.digiservices.ebanking.paylaod.PointVenteDto;
import io.digiservices.ebanking.service.PointVenteService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.apache.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
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
public class PointVenteController {

    private final PointVenteService pointVenteService;

    @PostMapping("/addPointVente")
    public ResponseEntity<HttpResponse> addPointVente(@RequestBody PointVenteDto pointVenteDto)
    {
        return ResponseEntity.created(URI.create(""))
                .body(
                        HttpResponse.builder()
                                .timeStamp(now().toString())
                                .data(Map.of("pointVente", pointVenteService.addPointVente(pointVenteDto)))
                                .message("PointVente Created")
                                .status(CREATED)
                                .statusCode(CREATED.value())
                                .build());
    }

    @GetMapping("/pointventes/{agence_id}")
    public ResponseEntity<Response> pointventes(@PathVariable(name = "agence_id") Long agence_id, HttpServletRequest request)
    {
        return ok(getResponse(request, Map.of("pointVentes",pointVenteService.getAllPointeVenteByAgence(agence_id)), "Liste des Points de vente", OK));
    }

    @GetMapping("/pointvente/{idPs}")
    public ResponseEntity<PointVenteDto> pointvente(@PathVariable(name = "idPs") Long idPs)
    {
        return ResponseEntity.ok(pointVenteService.getPsById(idPs));
    }
}
