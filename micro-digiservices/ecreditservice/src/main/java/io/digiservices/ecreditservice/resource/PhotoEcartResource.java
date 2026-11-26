package io.digiservices.ecreditservice.resource;

import io.digiservices.ecreditservice.domain.Response;
import io.digiservices.ecreditservice.dto.PhotoEcartDtos.PhotoRecue;
import io.digiservices.ecreditservice.dto.PhotoEcartDtos.SuiviChangement;
import io.digiservices.ecreditservice.dto.PhotoEcartDtos.SuiviCreation;
import io.digiservices.ecreditservice.service.PhotoEcartService;
import io.digiservices.ecreditservice.service.SuiviVariationService;
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
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Map;

import static io.digiservices.ecreditservice.utils.RequestUtils.getResponse;
import static org.springframework.http.HttpStatus.OK;

/**
 * Lecture de la photo quotidienne des ecarts (V217), pour l'ecran « Evolution des ecarts ».
 *
 * <p>L'ECRITURE n'est pas ici : l'outil de bureau pousse ses photos sur
 * {@code /ecredit/rapprochement/photo}, protege par cle API ({@link PhotoIngestionResource}),
 * parce que la tache planifiee du poste DSIG tourne sans aucun compte connecte.</p>
 */
@RestController
@RequestMapping("/ecredit/rapprochement/ecarts")
@RequiredArgsConstructor
@Slf4j
public class PhotoEcartResource {

    private final PhotoEcartService service;
    private final SuiviVariationService suivis;

    /** La courbe du reseau : un module, les N derniers jours. */
    @GetMapping("/courbe")
    public ResponseEntity<Response> courbe(@NotNull Authentication authentication,
                                           @RequestParam(value = "module", defaultValue = "COMPTES") String module,
                                           @RequestParam(value = "jours", required = false) Integer jours,
                                           HttpServletRequest request) {
        var points = service.courbe(authentication.getName(), module, jours);
        return ResponseEntity.ok(getResponse(request, Map.of("courbe", points),
                points.isEmpty() ? "Aucune photo enregistree pour ce module" : points.size() + " jour(s)", OK));
    }

    /** La situation d'un jour : la photo du reseau et le tableau des points de service. */
    @GetMapping("/situation")
    public ResponseEntity<Response> situation(@NotNull Authentication authentication,
                                              @RequestParam(value = "module", defaultValue = "COMPTES") String module,
                                              @RequestParam(value = "jour", required = false)
                                              @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate jour,
                                              HttpServletRequest request) {
        var situation = service.situation(authentication.getName(), module, jour);
        return ResponseEntity.ok(getResponse(request, Map.of("situation", situation),
                situation.photo() == null ? "Aucune photo enregistree pour ce module"
                        : "Photo du " + situation.photo().jour(), OK));
    }

    /** Les comptes comptables d'un point de service, pour un jour. */
    @GetMapping("/points/{codAgencia}/comptes")
    public ResponseEntity<Response> comptes(@NotNull Authentication authentication,
                                            @PathVariable("codAgencia") String codAgencia,
                                            @RequestParam(value = "module", defaultValue = "COMPTES") String module,
                                            @RequestParam(value = "jour", required = false)
                                            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate jour,
                                            HttpServletRequest request) {
        var comptes = service.comptesDuPoint(authentication.getName(), module, jour, codAgencia);
        return ResponseEntity.ok(getResponse(request, Map.of("comptes", comptes),
                comptes.size() + " compte(s) comptable(s)", OK));
    }

    /** Les comptes clients touches par un couple dans la photo d'un jour : le niveau sous le compte comptable. */
    @GetMapping("/points/{codAgencia}/comptes/{compte}/clients")
    public ResponseEntity<Response> comptesClients(@NotNull Authentication authentication,
                                                   @PathVariable("codAgencia") String codAgencia,
                                                   @PathVariable("compte") String compte,
                                                   @RequestParam(value = "module", defaultValue = "COMPTES") String module,
                                                   @RequestParam(value = "jour", required = false)
                                                   @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate jour,
                                                   HttpServletRequest request) {
        var clients = service.comptesClients(authentication.getName(), module, jour, codAgencia, compte);
        return ResponseEntity.ok(getResponse(request, Map.of("clients", clients),
                clients.isEmpty() ? "Aucun compte client emporte par la photo pour ce couple" : clients.size() + " compte(s) client(s)", OK));
    }

    /** Les comptes clients dont le solde ne suit pas ses mouvements : la reponse a « lequel des 209 comptes ». */
    @GetMapping("/points/{codAgencia}/comptes/{compte}/divergences")
    public ResponseEntity<Response> divergences(@NotNull Authentication authentication,
                                                @PathVariable("codAgencia") String codAgencia,
                                                @PathVariable("compte") String compte,
                                                @RequestParam(value = "module", defaultValue = "COMPTES") String module,
                                                @RequestParam(value = "jour", required = false)
                                                @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate jour,
                                                HttpServletRequest request) {
        var divergences = service.divergences(authentication.getName(), module, jour, codAgencia, compte);
        return ResponseEntity.ok(getResponse(request, Map.of("divergences", divergences),
                divergences.isEmpty() ? "Aucun compte divergent emporte par la photo pour ce couple" : divergences.size() + " compte(s) divergent(s)", OK));
    }

    /** Les ecritures comptables passees sans mouvement client : les corrections derriere une variation. */
    @GetMapping("/points/{codAgencia}/comptes/{compte}/ecritures")
    public ResponseEntity<Response> ecrituresSansMouvement(@NotNull Authentication authentication,
                                                           @PathVariable("codAgencia") String codAgencia,
                                                           @PathVariable("compte") String compte,
                                                           @RequestParam(value = "module", defaultValue = "COMPTES") String module,
                                                           @RequestParam(value = "jour", required = false)
                                                           @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate jour,
                                                           HttpServletRequest request) {
        var ecritures = service.ecrituresSansMouvement(authentication.getName(), module, jour, codAgencia, compte);
        return ResponseEntity.ok(getResponse(request, Map.of("ecritures", ecritures),
                ecritures.isEmpty() ? "Aucune ecriture sans mouvement pour ce couple" : ecritures.size() + " ecriture(s)", OK));
    }

    /** La fiche d'un couple dans le temps : chaque jour photographie avec sa cause, et ses fiches de suivi. */
    @GetMapping("/points/{codAgencia}/comptes/{compte}/historique")
    public ResponseEntity<Response> historiqueCouple(@NotNull Authentication authentication,
                                                     @PathVariable("codAgencia") String codAgencia,
                                                     @PathVariable("compte") String compte,
                                                     @RequestParam(value = "module", defaultValue = "COMPTES") String module,
                                                     @RequestParam(value = "jours", required = false) Integer jours,
                                                     HttpServletRequest request) {
        var historique = service.historiqueCouple(authentication.getName(), module, codAgencia, compte, jours);
        return ResponseEntity.ok(getResponse(request, Map.of("historique", historique),
                historique.jours().size() + " jour(s) photographie(s)", OK));
    }

    /** La courbe d'un point de service. */
    @GetMapping("/points/{codAgencia}/courbe")
    public ResponseEntity<Response> seriePoint(@NotNull Authentication authentication,
                                               @PathVariable("codAgencia") String codAgencia,
                                               @RequestParam(value = "module", defaultValue = "COMPTES") String module,
                                               @RequestParam(value = "jours", required = false) Integer jours,
                                               HttpServletRequest request) {
        var serie = service.seriePoint(authentication.getName(), module, codAgencia, jours);
        return ResponseEntity.ok(getResponse(request, Map.of("serie", serie),
                serie.size() + " jour(s)", OK));
    }

    /**
     * Les variations entre deux photos : ce qui a bouge, par compte comptable et par couple
     * (point de service, compte). Sans reference, la photo precedente ; sans seuil, 1 000 GNF.
     */
    @GetMapping("/variations")
    public ResponseEntity<Response> variations(@NotNull Authentication authentication,
                                               @RequestParam(value = "module", defaultValue = "COMPTES") String module,
                                               @RequestParam(value = "jour", required = false)
                                               @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate jour,
                                               @RequestParam(value = "reference", required = false)
                                               @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate reference,
                                               @RequestParam(value = "seuil", required = false) BigDecimal seuil,
                                               HttpServletRequest request) {
        var variations = service.variations(authentication.getName(), module, jour, reference, seuil);
        String message = variations.photo() == null ? "Aucune photo enregistree pour ce module"
                : variations.reference() == null ? "Une seule photo : rien a comparer encore"
                : variations.nbCouples() + " variation(s) entre le " + variations.reference().jour()
                  + " et le " + variations.photo().jour();
        return ResponseEntity.ok(getResponse(request, Map.of("variations", variations), message, OK));
    }

    /** Les variations en classeur Excel : par compte, par point de service, points exclus. */
    @GetMapping("/variations/export")
    public ResponseEntity<byte[]> exporterVariations(@NotNull Authentication authentication,
                                                     @RequestParam(value = "module", defaultValue = "COMPTES") String module,
                                                     @RequestParam(value = "jour", required = false)
                                                     @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate jour,
                                                     @RequestParam(value = "reference", required = false)
                                                     @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate reference,
                                                     @RequestParam(value = "seuil", required = false) BigDecimal seuil)
            throws IOException {
        var classeur = service.exporterVariations(authentication.getName(), module, jour, reference, seuil);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + classeur.nomFichier() + "\"")
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(classeur.contenu());
    }

    /** Les jours photographies, pour le selecteur de date. */
    @GetMapping("/jours")
    public ResponseEntity<Response> jours(@NotNull Authentication authentication,
                                          @RequestParam(value = "module", defaultValue = "COMPTES") String module,
                                          HttpServletRequest request) {
        var jours = service.joursConnus(authentication.getName(), module);
        return ResponseEntity.ok(getResponse(request, Map.of("jours", jours),
                jours.size() + " jour(s) photographie(s)", OK));
    }

    // ======================= Suivi de correction (V220) =======================

    /** Les fiches de suivi d'un module : vivantes par defaut, un etat, ou « TOUTES ». */
    @GetMapping("/suivis")
    public ResponseEntity<Response> suivis(@NotNull Authentication authentication,
                                           @RequestParam(value = "module", defaultValue = "COMPTES") String module,
                                           @RequestParam(value = "etat", required = false) String etat,
                                           HttpServletRequest request) {
        var fiches = suivis.lister(authentication.getName(), module, etat);
        return ResponseEntity.ok(getResponse(request, Map.of("suivis", fiches), fiches.size() + " fiche(s)", OK));
    }

    @GetMapping("/suivis/{id}")
    public ResponseEntity<Response> suivi(@NotNull Authentication authentication, @PathVariable("id") Long id,
                                          HttpServletRequest request) {
        var fiche = suivis.fiche(authentication.getName(), id);
        return ResponseEntity.ok(getResponse(request, Map.of("suivi", fiche), "Fiche " + id, OK));
    }

    /** Ouvre une fiche sur un couple, ou rafraichit la fiche vivante. */
    @PostMapping("/suivis")
    public ResponseEntity<Response> ouvrirSuivi(@NotNull Authentication authentication,
                                                @RequestBody SuiviCreation creation,
                                                HttpServletRequest request) {
        var fiche = suivis.ouvrir(authentication.getName(), creation);
        return ResponseEntity.ok(getResponse(request, Map.of("suivi", fiche), "Fiche enregistree", OK));
    }

    /** Fait avancer une fiche. CONFIRMEE est refuse : c'est la photo qui le pose. */
    @PutMapping("/suivis/{id}")
    public ResponseEntity<Response> changerSuivi(@NotNull Authentication authentication, @PathVariable("id") Long id,
                                                 @RequestBody SuiviChangement changement,
                                                 HttpServletRequest request) {
        var fiche = suivis.changer(authentication.getName(), id, changement);
        return ResponseEntity.ok(getResponse(request, Map.of("suivi", fiche), "Fiche mise a jour", OK));
    }
}
