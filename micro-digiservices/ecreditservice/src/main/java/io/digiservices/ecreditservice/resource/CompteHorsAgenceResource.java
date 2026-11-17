package io.digiservices.ecreditservice.resource;

import io.digiservices.ecreditservice.domain.Response;
import io.digiservices.ecreditservice.repository.CompteHorsAgenceRepository.Filtres;
import io.digiservices.ecreditservice.service.CompteHorsAgenceService;
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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.Map;

import static io.digiservices.ecreditservice.utils.RequestUtils.getResponse;
import static org.springframework.http.HttpStatus.OK;

/**
 * La page « Comptes hors agence » (V214, lots 2 et 3). Lecture ouverte a la rubrique des credits
 * negatifs et au groupe Audit ; l'ecriture — prise en charge, verification — a la seule rubrique
 * des credits negatifs. Le controle est fait par le service a chaque appel.
 */
@RestController
@RequestMapping("/ecredit/comptes-hors-agence")
@RequiredArgsConstructor
@Slf4j
public class CompteHorsAgenceResource {

    private final CompteHorsAgenceService service;

    /** La situation. Par defaut la liste ne montre que les comptes a traiter (actifs) ; les compteurs, tout. */
    @GetMapping
    public ResponseEntity<Response> situation(@NotNull Authentication authentication,
                                              @RequestParam(name = "situation", required = false) String situation,
                                              @RequestParam(name = "etat", required = false) String etat,
                                              @RequestParam(name = "agence", required = false) String agence,
                                              @RequestParam(name = "agenceAgent", required = false) String agenceAgent,
                                              @RequestParam(name = "creePar", required = false) String creePar,
                                              @RequestParam(name = "recherche", required = false) String recherche,
                                              @RequestParam(name = "inclureCorriges", defaultValue = "false") boolean inclureCorriges,
                                              @RequestParam(name = "tout", defaultValue = "false") boolean tout,
                                              HttpServletRequest request) {
        Filtres f = new Filtres(situation, etat, agence, agenceAgent, creePar, recherche, inclureCorriges, tout);
        return ResponseEntity.ok(getResponse(request,
                Map.of("situation", service.situation(authentication.getName(), f)),
                "Comptes ouverts hors de l'agence du client", OK));
    }

    /** Prise en charge, ou retour a « a traiter » : digi note qui s'en occupe, il ne corrige pas SAF. */
    @PostMapping("/{id}/suivi")
    public ResponseEntity<Response> suivi(@NotNull Authentication authentication,
                                          @PathVariable("id") Long id,
                                          @RequestParam(name = "traite", defaultValue = "true") boolean traite,
                                          @RequestParam(name = "commentaire", required = false) String commentaire,
                                          HttpServletRequest request) {
        String message = service.marquerTraite(authentication.getName(), id, commentaire, traite);
        return ResponseEntity.ok(getResponse(request, Map.of(), message, OK));
    }

    /** Confronte UN compte a la production, tout de suite. */
    @PostMapping("/{id}/verifier")
    public ResponseEntity<Response> verifier(@NotNull Authentication authentication,
                                             @PathVariable("id") Long id,
                                             HttpServletRequest request) {
        var v = service.verifier(authentication.getName(), id);
        return ResponseEntity.ok(getResponse(request, Map.of("verification", v), v.explication(), OK));
    }

    /** Confronte a la production tous les comptes pris en charge et encore ouverts. */
    @PostMapping("/verifier-prises-en-charge")
    public ResponseEntity<Response> verifierPrisesEnCharge(@NotNull Authentication authentication,
                                                           HttpServletRequest request) {
        var resultats = service.verifierPrisesEnCharge(authentication.getName());
        long fermees = resultats.stream().filter(v -> v.ferme()).count();
        String message = resultats.isEmpty()
                ? "Aucun compte pris en charge à vérifier"
                : resultats.size() + " compte(s) confronté(s) à SAF, " + fermees + " fermé(s)";
        return ResponseEntity.ok(getResponse(request, Map.of("verifications", resultats), message, OK));
    }

    /** Le dossier d'un compte en regard de SAF : ce que digi a note, et ce que SAF dit maintenant. */
    @GetMapping("/{id}/dossier")
    public ResponseEntity<Response> dossier(@NotNull Authentication authentication,
                                            @PathVariable("id") Long id,
                                            HttpServletRequest request) {
        return ResponseEntity.ok(getResponse(request,
                Map.of("dossier", service.dossier(authentication.getName(), id)),
                "Dossier SAF du compte", OK));
    }

    @GetMapping("/export")
    public ResponseEntity<byte[]> exporter(@NotNull Authentication authentication,
                                           @RequestParam(name = "situation", required = false) String situation,
                                           @RequestParam(name = "etat", required = false) String etat,
                                           @RequestParam(name = "agence", required = false) String agence,
                                           @RequestParam(name = "agenceAgent", required = false) String agenceAgent,
                                           @RequestParam(name = "creePar", required = false) String creePar,
                                           @RequestParam(name = "recherche", required = false) String recherche,
                                           @RequestParam(name = "inclureCorriges", defaultValue = "false") boolean inclureCorriges,
                                           @RequestParam(name = "tout", defaultValue = "false") boolean tout) {
        Filtres f = new Filtres(situation, etat, agence, agenceAgent, creePar, recherche, inclureCorriges, tout);
        byte[] contenu = service.exporter(authentication.getName(), f);
        String nom = "Comptes_hors_agence_" + LocalDate.now() + ".xlsx";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType(
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
        headers.setContentDispositionFormData("attachment", nom);
        headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");
        headers.setContentLength(contenu.length);
        return ResponseEntity.ok().headers(headers).body(contenu);
    }
}
