package io.digiservices.ecreditservice.resource;

import io.digiservices.clients.agri.PageDto;
import io.digiservices.ecreditservice.domain.Response;
import io.digiservices.ecreditservice.service.CreditsOctroyesService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.Map;

import static io.digiservices.ecreditservice.utils.RequestUtils.getResponse;
import static org.springframework.http.HttpStatus.OK;

/**
 * Les credits deja octroyes du reseau de l'appelant : synthese par niveau, puis descente.
 *
 * <p>Aucun identifiant de perimetre n'est accepte sans verification : le service borne chaque
 * filtre de descente au rattachement du compte connecte. Le DA voit son agence, le DR sa
 * delegation, les directions du siege tout le reseau.</p>
 */
@RestController
@RequestMapping("/ecredit/credits-octroyes")
@RequiredArgsConstructor
public class CreditsOctroyesResource {

    private final CreditsOctroyesService service;

    /**
     * Synthese du niveau demande (« auto » = le plus large que le profil peut voir), avec les
     * niveaux consultables pour que l'ecran sache quelles descentes proposer.
     */
    @GetMapping("/synthese")
    public ResponseEntity<Response> synthese(
            @NotNull Authentication authentication,
            @RequestParam(name = "niveau", defaultValue = "auto") String niveau,
            @RequestParam(name = "delegationId", required = false) Long delegationId,
            @RequestParam(name = "agenceId", required = false) Long agenceId,
            @RequestParam(name = "posId", required = false) Long posId,
            @RequestParam(name = "du", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate du,
            @RequestParam(name = "au", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate au,
            @RequestParam(name = "recherche", required = false) String recherche,
            HttpServletRequest request) {
        var synthese = service.synthese(authentication.getName(), niveau,
                delegationId, agenceId, posId, du, au, recherche);
        return ResponseEntity.ok(getResponse(request, Map.of("synthese", synthese),
                "Synthese des credits octroyes", OK));
    }

    /**
     * La situation de ces credits dans SAF : mis en place ou non, encours, retard.
     *
     * <p>Seul point d'entree de l'ecran qui lit SAF, et il lit la sauvegarde de la veille. Le
     * perimetre est plafonne cote service : au-dela, il refuse plutot que de rendre un encours
     * partiel.</p>
     */
    @GetMapping("/situation")
    public ResponseEntity<Response> situation(
            @NotNull Authentication authentication,
            @RequestParam(name = "delegationId", required = false) Long delegationId,
            @RequestParam(name = "agenceId", required = false) Long agenceId,
            @RequestParam(name = "posId", required = false) Long posId,
            @RequestParam(name = "du", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate du,
            @RequestParam(name = "au", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate au,
            @RequestParam(name = "recherche", required = false) String recherche,
            HttpServletRequest request) {
        var resultat = service.situation(authentication.getName(),
                delegationId, agenceId, posId, du, au, recherche);
        return ResponseEntity.ok(getResponse(request,
                Map.of("dossiers", resultat.dossiers(), "totaux", resultat.totaux()),
                "Situation des credits octroyes", OK));
    }

    /**
     * Les comptes et les soldes du membre d'un dossier octroye de son reseau.
     *
     * <p>L'acces part du dossier, pas du client : le directeur d'agence voit la situation
     * financiere des credits qu'il a fait accorder, et rien d'autre. La recherche libre dans
     * la clientele reste l'ecran « Verification client », avec son habilitation propre.</p>
     */
    @GetMapping("/{demandeIndividuelId}/situation-financiere")
    public ResponseEntity<Response> situationFinanciere(
            @NotNull Authentication authentication,
            @PathVariable("demandeIndividuelId") Long demandeIndividuelId,
            HttpServletRequest request) {
        return ResponseEntity.ok(getResponse(request,
                Map.of("fiche", service.situationFinanciere(authentication.getName(), demandeIndividuelId)),
                "Situation financiere du membre", OK));
    }

    /** Les derniers mouvements d'un compte du membre ; chaque consultation est journalisee. */
    @GetMapping("/{demandeIndividuelId}/comptes/{numCuenta}/mouvements")
    public ResponseEntity<Response> mouvements(
            @NotNull Authentication authentication,
            @PathVariable("demandeIndividuelId") Long demandeIndividuelId,
            @PathVariable("numCuenta") String numCuenta,
            @RequestParam(name = "limite", defaultValue = "5") int limite,
            HttpServletRequest request) {
        return ResponseEntity.ok(getResponse(request,
                service.mouvementsDuCompte(authentication.getName(), demandeIndividuelId, numCuenta, limite),
                "Derniers mouvements du compte", OK));
    }

    /** Les dossiers du perimetre affiche, page par page. */
    @GetMapping
    public ResponseEntity<Response> liste(
            @NotNull Authentication authentication,
            @RequestParam(name = "delegationId", required = false) Long delegationId,
            @RequestParam(name = "agenceId", required = false) Long agenceId,
            @RequestParam(name = "posId", required = false) Long posId,
            @RequestParam(name = "du", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate du,
            @RequestParam(name = "au", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate au,
            @RequestParam(name = "recherche", required = false) String recherche,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "50") int size,
            HttpServletRequest request) {
        String uuid = authentication.getName();
        long total = service.compter(uuid, delegationId, agenceId, posId, du, au, recherche);
        var contenu = service.liste(uuid, delegationId, agenceId, posId, du, au, recherche, page, size);
        return ResponseEntity.ok(getResponse(request,
                Map.of("credits", PageDto.of(contenu, page, size, total)),
                "Credits octroyes", OK));
    }
}
