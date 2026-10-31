package io.digiservices.ecreditservice.resource;

import io.digiservices.ecreditservice.domain.Response;
import io.digiservices.ecreditservice.repository.CompteMalAdosseRepository.Filtres;
import io.digiservices.ecreditservice.service.CompteMalAdosseService;
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
 * La page « Comptes mal adossés » (V196, lot 2).
 *
 * <p>Lecture ouverte a la rubrique des credits negatifs et au groupe Audit ; l'ecriture — la
 * prise en charge — a la seule rubrique des credits negatifs, l'Audit etant en lecture seule.
 * Le controle est fait par le service a chaque appel.</p>
 */
@RestController
@RequestMapping("/ecredit/comptes-mal-adosses")
@RequiredArgsConstructor
@Slf4j
public class CompteMalAdosseResource {

    private final CompteMalAdosseService service;

    /**
     * La situation. Par defaut la liste ne montre que les cas a traiter — credit vivant et
     * famille alertee — parce que le stock complet depasse quatorze mille lignes ; les
     * compteurs, eux, portent toujours sur la totalite.
     */
    @GetMapping
    public ResponseEntity<Response> situation(@NotNull Authentication authentication,
                                              @RequestParam(name = "famille", required = false) String famille,
                                              @RequestParam(name = "etat", required = false) String etat,
                                              @RequestParam(name = "agence", required = false) String agence,
                                              @RequestParam(name = "saisiPar", required = false) String saisiPar,
                                              @RequestParam(name = "recherche", required = false) String recherche,
                                              @RequestParam(name = "inclureCorriges", defaultValue = "false") boolean inclureCorriges,
                                              @RequestParam(name = "tout", defaultValue = "false") boolean tout,
                                              HttpServletRequest request) {
        Filtres f = new Filtres(famille, etat, agence, saisiPar, recherche, inclureCorriges, tout);
        return ResponseEntity.ok(getResponse(request,
                Map.of("situation", service.situation(authentication.getName(), f)),
                "Comptes de remboursement mal adossés", OK));
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

    @GetMapping("/export")
    public ResponseEntity<byte[]> exporter(@NotNull Authentication authentication,
                                           @RequestParam(name = "famille", required = false) String famille,
                                           @RequestParam(name = "etat", required = false) String etat,
                                           @RequestParam(name = "agence", required = false) String agence,
                                           @RequestParam(name = "saisiPar", required = false) String saisiPar,
                                           @RequestParam(name = "recherche", required = false) String recherche,
                                           @RequestParam(name = "inclureCorriges", defaultValue = "false") boolean inclureCorriges,
                                           @RequestParam(name = "tout", defaultValue = "false") boolean tout) {
        Filtres f = new Filtres(famille, etat, agence, saisiPar, recherche, inclureCorriges, tout);
        byte[] contenu = service.exporter(authentication.getName(), f);
        String nom = "Comptes_mal_adosses_" + LocalDate.now() + ".xlsx";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType(
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
        headers.setContentDispositionFormData("attachment", nom);
        headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");
        headers.setContentLength(contenu.length);
        return ResponseEntity.ok().headers(headers).body(contenu);
    }
}
