package io.digiservices.ecreditservice.resource;

import io.digiservices.ecreditservice.domain.Response;
import io.digiservices.ecreditservice.service.CreditNegatifService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.time.LocalDate;
import java.util.Map;

import static io.digiservices.ecreditservice.utils.RequestUtils.getResponse;
import static org.springframework.http.HttpStatus.OK;

/**
 * Credits a solde negatif dans SAF (V177, lot 2). Reserve au service DSIG : le perimetre est
 * verifie par le service, pas par le role.
 */
@RestController
@RequestMapping("/ecredit/credits-negatifs")
@RequiredArgsConstructor
@Slf4j
public class CreditNegatifResource {

    private final CreditNegatifService service;

    /** La situation : tous les etats, les compteurs, le suivi. */
    @GetMapping
    public ResponseEntity<Response> situation(@NotNull Authentication authentication,
                                              @RequestParam(value = "corriges", defaultValue = "false")
                                              boolean inclureCorriges,
                                              HttpServletRequest request) {
        return ResponseEntity.ok(getResponse(request,
                Map.of("situation", service.situation(authentication.getName(), inclureCorriges)),
                "Credits negatifs", OK));
    }

    /** Prise en charge par la DSIG ; rien n'est ecrit dans SAF. */
    @PostMapping("/{id}/suivi")
    public ResponseEntity<Response> suivi(@NotNull Authentication authentication,
                                          @PathVariable("id") Long id,
                                          @RequestBody(required = false) Map<String, Object> corps,
                                          HttpServletRequest request) {
        String commentaire = corps == null ? null : (String) corps.get("commentaire");
        boolean traite = corps == null || !Boolean.FALSE.equals(corps.get("traite"));
        String message = service.marquerTraite(authentication.getName(), id, commentaire, traite);
        return ResponseEntity.ok(getResponse(request, Map.of("id", id), message, OK));
    }

    /** Confronte un credit pris en charge a SAF production, a l'instant (V183). */
    @PostMapping("/{id}/verifier")
    public ResponseEntity<Response> verifier(@NotNull Authentication authentication,
                                             @PathVariable("id") Long id,
                                             HttpServletRequest request) {
        var v = service.verifier(authentication.getName(), id);
        return ResponseEntity.ok(getResponse(request, Map.of("verification", v), v.libelle(), OK));
    }

    /** Tous les credits pris en charge encore ouverts, confrontes a SAF d'un coup. */
    @PostMapping("/verifier-pris-en-charge")
    public ResponseEntity<Response> verifierPrisesEnCharge(@NotNull Authentication authentication,
                                                           HttpServletRequest request) {
        var liste = service.verifierPrisesEnCharge(authentication.getName());
        long corriges = liste.stream().filter(v -> CreditNegatifService.CORRIGE.equals(v.conclusion())).count();
        long clos = liste.stream().filter(v -> CreditNegatifService.CLOS_SAF.equals(v.conclusion())).count();
        long toujours = liste.size() - corriges - clos;
        return ResponseEntity.ok(getResponse(request, Map.of("verifications", liste),
                liste.isEmpty() ? "Aucun crédit pris en charge à vérifier"
                        : corriges + " corrigé(s), " + clos + " clos dans SAF, " + toujours + " toujours négatif(s)", OK));
    }

    /** Le meme tableau en classeur Excel, feuille de travail pour la correction dans SAF. */
    @GetMapping("/export")
    public ResponseEntity<byte[]> exporter(@NotNull Authentication authentication,
                                           @RequestParam(value = "corriges", defaultValue = "false")
                                           boolean inclureCorriges) throws IOException {
        byte[] classeur = service.exporter(authentication.getName(), inclureCorriges);
        String nom = "Credits_negatifs_" + LocalDate.now() + ".xlsx";
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + nom + "\"")
                .contentType(MediaType.parseMediaType(
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(classeur);
    }
}
