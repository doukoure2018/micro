package io.digiservices.ecreditservice.resource;

import io.digiservices.ecreditservice.domain.Response;
import io.digiservices.ecreditservice.dto.EtatDocumentDto;
import io.digiservices.ecreditservice.service.PublicCartePrepaidService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

import static io.digiservices.ecreditservice.utils.RequestUtils.getResponse;
import static org.springframework.http.HttpStatus.*;

/**
 * Endpoints PUBLICS (sans authentification) pour la remontée des documents carte prépayée.
 * Le préfixe /ecredit/public/** est déjà en permitAll (gateway + resource server).
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/ecredit/public/carte-prepaid")
@Slf4j
public class PublicCartePrepaidResource {

    private final PublicCartePrepaidService service;

    @GetMapping("/delegations")
    public ResponseEntity<Response> getDelegations(HttpServletRequest request) {
        return ResponseEntity.ok(getResponse(request,
                Map.of("delegations", service.getDelegations()),
                "Liste des délégations", OK));
    }

    @GetMapping("/agences/{delegationId}")
    public ResponseEntity<Response> getAgences(@PathVariable("delegationId") Long delegationId,
                                               HttpServletRequest request) {
        return ResponseEntity.ok(getResponse(request,
                Map.of("agences", service.getAgences(delegationId)),
                "Liste des agences", OK));
    }

    @GetMapping("/pointventes/{agenceId}")
    public ResponseEntity<Response> getPointVentes(@PathVariable("agenceId") Long agenceId,
                                                   HttpServletRequest request) {
        return ResponseEntity.ok(getResponse(request,
                Map.of("pointVentes", service.getPointVentes(agenceId)),
                "Liste des points de service", OK));
    }

    @PostMapping(value = "/submit", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Response> submit(
            @RequestParam("files") MultipartFile[] files,
            @RequestParam("delegationId") Long delegationId,
            @RequestParam("agenceId") Long agenceId,
            @RequestParam("pointventeId") Long pointventeId,
            HttpServletRequest request) {
        log.info("Remontée publique carte prépayée: {} fichier(s), delegation={}, agence={}, pointvente={}",
                files != null ? files.length : 0, delegationId, agenceId, pointventeId);
        EtatDocumentDto etat = service.submit(files, delegationId, agenceId, pointventeId);
        return ResponseEntity.status(CREATED).body(getResponse(request,
                Map.of("etat", etat, "count", files.length),
                "Documents remontés avec succès", CREATED));
    }
}
