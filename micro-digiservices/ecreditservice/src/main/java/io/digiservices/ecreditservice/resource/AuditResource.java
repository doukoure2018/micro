package io.digiservices.ecreditservice.resource;

import io.digiservices.ecreditservice.domain.Response;
import io.digiservices.ecreditservice.service.AuditService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.Map;

import static io.digiservices.ecreditservice.utils.RequestUtils.getResponse;
import static org.springframework.http.HttpStatus.OK;

/**
 * Les journaux du service Audit (lot 2). Lecture seule : aucun point d'entree n'ecrit.
 * L'habilitation est verifiee par le service a chaque appel.
 */
@RestController
@RequestMapping("/ecredit/audit")
@RequiredArgsConstructor
@Slf4j
public class AuditResource {

    private final AuditService service;

    // ------------------------------------------------------------------ journal des decisions

    /** Le journal du circuit des dossiers, page par page, avec le delai entre deux evenements. */
    @GetMapping("/decisions")
    public ResponseEntity<Response> decisions(@NotNull Authentication authentication,
                                              @RequestParam(name = "dossier", required = false) Long dossier,
                                              @RequestParam(name = "acteur", required = false) String acteur,
                                              @RequestParam(name = "evenement", required = false) String evenement,
                                              @RequestParam(name = "etat", required = false) String etat,
                                              @RequestParam(name = "du", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate du,
                                              @RequestParam(name = "au", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate au,
                                              @RequestParam(name = "page", defaultValue = "0") int page,
                                              @RequestParam(name = "size", defaultValue = "50") int size,
                                              HttpServletRequest request) {
        return ResponseEntity.ok(getResponse(request,
                Map.of("decisions", service.decisions(authentication.getName(), dossier, acteur, evenement, etat, du, au, page, size)),
                "Journal des decisions", OK));
    }

    /** Les volumes et les delais du journal entier, independants des filtres. */
    @GetMapping("/decisions/synthese")
    public ResponseEntity<Response> syntheseDecisions(@NotNull Authentication authentication,
                                                      HttpServletRequest request) {
        return ResponseEntity.ok(getResponse(request,
                Map.of("synthese", service.syntheseDecisions(authentication.getName())),
                "Synthese du journal des decisions", OK));
    }

    @GetMapping("/decisions/export")
    public ResponseEntity<byte[]> exporterDecisions(@NotNull Authentication authentication,
                                                    @RequestParam(name = "dossier", required = false) Long dossier,
                                                    @RequestParam(name = "acteur", required = false) String acteur,
                                                    @RequestParam(name = "evenement", required = false) String evenement,
                                                    @RequestParam(name = "etat", required = false) String etat,
                                                    @RequestParam(name = "du", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate du,
                                                    @RequestParam(name = "au", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate au) {
        return fichier(service.exporterDecisions(authentication.getName(), dossier, acteur, evenement, etat, du, au),
                "Audit_journal_decisions");
    }

    // ------------------------------------------------------------------ sorties de dossiers

    /** Les annulations en regle, les demandes en attente, et les sorties sans motif ni auteur. */
    @GetMapping("/annulations")
    public ResponseEntity<Response> annulations(@NotNull Authentication authentication, HttpServletRequest request) {
        return ResponseEntity.ok(getResponse(request,
                Map.of("annulations", service.annulations(authentication.getName())),
                "Annulations et sorties de dossiers", OK));
    }

    @GetMapping("/annulations/export")
    public ResponseEntity<byte[]> exporterAnnulations(@NotNull Authentication authentication) {
        return fichier(service.exporterAnnulations(authentication.getName()), "Audit_sorties_dossiers");
    }

    // ------------------------------------------------------------------ corrections de numero

    @GetMapping("/numeros-membre")
    public ResponseEntity<Response> correctionsNumero(@NotNull Authentication authentication, HttpServletRequest request) {
        return ResponseEntity.ok(getResponse(request,
                Map.of("corrections", service.correctionsNumero(authentication.getName())),
                "Corrections de numero de membre", OK));
    }

    @GetMapping("/numeros-membre/export")
    public ResponseEntity<byte[]> exporterCorrectionsNumero(@NotNull Authentication authentication) {
        return fichier(service.exporterCorrectionsNumero(authentication.getName()), "Audit_corrections_numero");
    }

    // ------------------------------------------------------------------ comptes et habilitations

    /** Les comptes, le journal de leurs blocages, celui des habilitations, et la matrice en lecture. */
    @GetMapping("/comptes")
    public ResponseEntity<Response> comptes(@NotNull Authentication authentication,
                                            @RequestParam(name = "recherche", required = false) String recherche,
                                            HttpServletRequest request) {
        return ResponseEntity.ok(getResponse(request,
                Map.of("comptes", service.comptes(authentication.getName(), recherche)),
                "Comptes et habilitations", OK));
    }

    @GetMapping("/comptes/export")
    public ResponseEntity<byte[]> exporterComptes(@NotNull Authentication authentication,
                                                  @RequestParam(name = "recherche", required = false) String recherche) {
        return fichier(service.exporterComptes(authentication.getName(), recherche), "Audit_comptes_habilitations");
    }

    // ------------------------------------------------------------------ interne

    private static ResponseEntity<byte[]> fichier(byte[] contenu, String prefixe) {
        String nom = prefixe + "_" + LocalDate.now() + ".xlsx";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType(
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
        headers.setContentDispositionFormData("attachment", nom);
        headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");
        headers.setContentLength(contenu.length);
        return ResponseEntity.ok().headers(headers).body(contenu);
    }
}
