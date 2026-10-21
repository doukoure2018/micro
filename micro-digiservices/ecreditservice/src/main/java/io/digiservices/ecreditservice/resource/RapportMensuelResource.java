package io.digiservices.ecreditservice.resource;

import io.digiservices.ecreditservice.domain.Response;
import io.digiservices.ecreditservice.dto.RapportMensuelDtos.BrouillonRequest;
import io.digiservices.ecreditservice.dto.RapportMensuelDtos.DecisionRequest;
import io.digiservices.ecreditservice.dto.RapportMensuelDtos.PeriodeRequest;
import io.digiservices.ecreditservice.service.RapportMensuelService;
import io.digiservices.ecreditservice.utils.RapportMensuelExcelUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

import static io.digiservices.ecreditservice.utils.RequestUtils.getResponse;
import static org.springframework.http.HttpStatus.OK;

/**
 * Rapport « Indicateurs mensuels » (V167) : saisie par le DA, brouillon a tout moment,
 * soumission a la delegation, validation ou renvoi par le DR, consolidation par la DE.
 * Le perimetre et les droits sont verifies par le service a chaque appel.
 */
@RestController
@RequestMapping("/ecredit/rapports/mensuels")
@RequiredArgsConstructor
public class RapportMensuelResource {

    private final RapportMensuelService service;

    /** Le mois pour le perimetre de l'utilisateur ; les rapports manquants sont ouverts vides. */
    @GetMapping
    public ResponseEntity<Response> charger(@NotNull Authentication authentication,
                                            @RequestParam(value = "module", required = false) String module,
                                            @RequestParam("annee") int annee, @RequestParam("mois") int mois,
                                            HttpServletRequest request) {
        return ResponseEntity.ok(getResponse(request,
                Map.of("rapport", service.charger(authentication.getName(), module, annee, mois)),
                "Rapport du mois", OK));
    }

    @GetMapping("/rubriques")
    public ResponseEntity<Response> rubriques(@RequestParam(value = "module", required = false) String module,
                                              HttpServletRequest request) {
        return ResponseEntity.ok(getResponse(request,
                Map.of("rubriques", service.rubriques(module), "sections", service.sections(module)), "Rubriques", OK));
    }

    /** Vue annuelle (V168) : un point de service, une agence ou tout le perimetre, mois par mois puis annuel. */
    @GetMapping("/annuel")
    public ResponseEntity<Response> annuel(@NotNull Authentication authentication,
                                           @RequestParam(value = "module", required = false) String module,
                                           @RequestParam("annee") int annee,
                                           @RequestParam(value = "codAgencia", required = false) String codAgencia,
                                           @RequestParam(value = "agenceId", required = false) Long agenceId,
                                           HttpServletRequest request) {
        return ResponseEntity.ok(getResponse(request,
                Map.of("annuel", service.annuel(authentication.getName(), module, annee, codAgencia, agenceId)),
                "Exercice", OK));
    }

    /** Enregistre le brouillon d'un point de service (DA) ; appele au fil de la saisie. */
    @PutMapping("/{id}/brouillon")
    public ResponseEntity<Response> brouillon(@NotNull Authentication authentication, @PathVariable("id") Long id,
                                              @RequestBody BrouillonRequest body, HttpServletRequest request) {
        return ResponseEntity.ok(getResponse(request,
                Map.of("ligne", service.enregistrerBrouillon(authentication.getName(), id, body)),
                "Brouillon enregistre", OK));
    }

    /** Le DA soumet ses points de service du mois (tous, ou ceux listes). */
    @PostMapping("/soumettre")
    public ResponseEntity<Response> soumettre(@NotNull Authentication authentication,
                                              @Valid @RequestBody PeriodeRequest body, HttpServletRequest request) {
        int n = service.soumettre(authentication.getName(), body);
        return ResponseEntity.ok(getResponse(request, Map.of("nbSoumis", n),
                n + " rapport(s) soumis a la delegation", OK));
    }

    @PostMapping("/valider")
    public ResponseEntity<Response> valider(@NotNull Authentication authentication,
                                            @Valid @RequestBody DecisionRequest body, HttpServletRequest request) {
        int n = service.valider(authentication.getName(), body);
        return ResponseEntity.ok(getResponse(request, Map.of("nbValides", n),
                n == 0 ? "Aucun rapport soumis a valider dans la selection" : n + " rapport(s) valide(s)", OK));
    }

    @PostMapping("/renvoyer")
    public ResponseEntity<Response> renvoyer(@NotNull Authentication authentication,
                                             @Valid @RequestBody DecisionRequest body, HttpServletRequest request) {
        int n = service.renvoyer(authentication.getName(), body);
        return ResponseEntity.ok(getResponse(request, Map.of("nbRenvoyes", n),
                n == 0 ? "Aucun rapport a renvoyer dans la selection" : n + " rapport(s) renvoye(s) a l'agence", OK));
    }

    @PostMapping("/consolider")
    public ResponseEntity<Response> consolider(@NotNull Authentication authentication,
                                               @Valid @RequestBody PeriodeRequest body, HttpServletRequest request) {
        int[] n = service.consolider(authentication.getName(), body);
        String message = n[0] + " rapport(s) consolide(s)" + (n[1] > 0 ? ", " + n[1] + " pas encore valide(s)" : "");
        return ResponseEntity.ok(getResponse(request, Map.of("nbConsolides", n[0], "nbNonValides", n[1]), message, OK));
    }

    /** Relit les valeurs de controle SAF pour les rapports non consolides du perimetre. */
    @PostMapping("/controle-saf")
    public ResponseEntity<Response> controleSaf(@NotNull Authentication authentication,
                                                @Valid @RequestBody PeriodeRequest body, HttpServletRequest request) {
        int n = service.actualiserControleSaf(authentication.getName(), body);
        return ResponseEntity.ok(getResponse(request, Map.of("nbActualises", n),
                "Controle SAF actualise pour " + n + " point(s) de service", OK));
    }

    // ==================== Agents designes pour la saisie (DA, V169) ====================

    @GetMapping("/designations")
    public ResponseEntity<Response> designations(@NotNull Authentication authentication, HttpServletRequest request) {
        return ResponseEntity.ok(getResponse(request,
                Map.of("designations", service.designationsAgence(authentication.getName())), "Agents saisissants", OK));
    }

    @PostMapping("/designations")
    public ResponseEntity<Response> designer(@NotNull Authentication authentication,
                                             @Valid @RequestBody io.digiservices.ecreditservice.dto.RapportMensuelDtos.DesignationRequest body,
                                             HttpServletRequest request) {
        boolean fait = service.designer(authentication.getName(), body.getCodAgencia(), body.getAgentUserId());
        return ResponseEntity.ok(getResponse(request, Map.of("fait", fait),
                fait ? "Agent designe : il peut saisir les rapports de ce point de service" : "Cet agent etait deja designe", OK));
    }

    @PostMapping("/designations/retirer")
    public ResponseEntity<Response> retirer(@NotNull Authentication authentication,
                                            @Valid @RequestBody io.digiservices.ecreditservice.dto.RapportMensuelDtos.DesignationRequest body,
                                            HttpServletRequest request) {
        boolean fait = service.retirer(authentication.getName(), body.getCodAgencia(), body.getAgentUserId());
        return ResponseEntity.ok(getResponse(request, Map.of("fait", fait),
                fait ? "Designation retiree : l'agent consulte seulement" : "Cet agent n'etait pas designe", OK));
    }

    /** Export Excel du mois au format du fichier de la Direction de l'Exploitation. */
    @GetMapping("/export")
    public ResponseEntity<byte[]> exporter(@NotNull Authentication authentication,
                                           @RequestParam(value = "module", required = false) String module,
                                           @RequestParam("annee") int annee, @RequestParam("mois") int mois,
                                           @RequestParam(value = "agenceId", required = false) Long agenceId) {
        byte[] contenu = service.exporter(authentication.getName(), module, annee, mois, agenceId);
        String nom = "ACTIVITE".equals(module)
                ? "rapport_activite_" + annee + ".xlsx"
                : "indicateurs_mensuels_" + RapportMensuelExcelUtils.MOIS[mois - 1].toLowerCase() + "_" + annee + ".xlsx";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
        headers.setContentDispositionFormData("attachment", nom);
        headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");
        return ResponseEntity.ok().headers(headers).body(contenu);
    }
}
