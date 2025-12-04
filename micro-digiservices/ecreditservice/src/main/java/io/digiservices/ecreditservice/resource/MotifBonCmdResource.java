package io.digiservices.ecreditservice.resource;

import io.digiservices.ecreditservice.domain.Response;
import io.digiservices.ecreditservice.dto.MotifBonCmdDto;
import io.digiservices.ecreditservice.dto.MotifBonCmdRequest;
import io.digiservices.ecreditservice.service.MotifBonCmdService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/ecredit")
@RequiredArgsConstructor
@Slf4j
public class MotifBonCmdResource {

    private final MotifBonCmdService service;

    @PostMapping("/motif-bon-cmd")
    public ResponseEntity<Response> ajouterMotif(@RequestBody MotifBonCmdRequest request, HttpServletRequest httpRequest) {
        log.info("API: Ajout motif pour bon commande: {}", request.getIdBonCmd());
        MotifBonCmdDto motif = service.ajouterMotif(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(getResponse(httpRequest, Map.of("motif", motif), "Motif ajouté avec succès", HttpStatus.CREATED));
    }

    @PutMapping("/motif-bon-cmd/{id}")
    public ResponseEntity<Response> updateMotif(@PathVariable Long id, @RequestBody MotifBonCmdRequest request, HttpServletRequest httpRequest) {
        log.info("API: Update motif: {}", id);
        MotifBonCmdDto motif = service.updateMotif(id, request);
        return ResponseEntity.ok(getResponse(httpRequest, Map.of("motif", motif), "Motif mis à jour avec succès", HttpStatus.OK));
    }

    @GetMapping("/motif-bon-cmd/{id}")
    public ResponseEntity<Response> getById(@PathVariable Long id, HttpServletRequest httpRequest) {
        return ResponseEntity.ok(getResponse(httpRequest, Map.of("motif", service.getById(id)), "Motif récupéré", HttpStatus.OK));
    }

    @GetMapping("/motif-bon-cmd/bon-commande/{idBonCmd}")
    public ResponseEntity<Response> getByBonCommande(@PathVariable Long idBonCmd, HttpServletRequest httpRequest) {
        return ResponseEntity.ok(getResponse(httpRequest, Map.of("motif", service.getByBonCommandeId(idBonCmd)), "Motif récupéré", HttpStatus.OK));
    }

    @GetMapping("/motif-bon-cmd/user/{userId}")
    public ResponseEntity<Response> getByUser(@PathVariable Long userId, HttpServletRequest httpRequest) {
        var motifs = service.getByUserId(userId);
        return ResponseEntity.ok(getResponse(httpRequest, Map.of("motifs", motifs, "count", motifs.size()), "Motifs récupérés", HttpStatus.OK));
    }

    @GetMapping("/motif-bon-cmd/statut/{statut}")
    public ResponseEntity<Response> getByStatut(@PathVariable String statut, HttpServletRequest httpRequest) {
        var motifs = service.getByStatut(statut);
        return ResponseEntity.ok(getResponse(httpRequest, Map.of("motifs", motifs, "count", motifs.size()), "Motifs récupérés", HttpStatus.OK));
    }

    private Response getResponse(HttpServletRequest request, Map<String, ?> data, String message, org.springframework.http.HttpStatus status) {
        return Response.builder().timeStamp(Long.valueOf(LocalDateTime.now().toString())).path(request.getRequestURI())
                .status(status).statusCode(status.value()).message(message).data(data).build();
    }
}
