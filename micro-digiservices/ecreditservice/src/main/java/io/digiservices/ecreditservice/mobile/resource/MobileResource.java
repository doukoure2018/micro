package io.digiservices.ecreditservice.mobile.resource;

import io.digiservices.ecreditservice.domain.Response;
import io.digiservices.ecreditservice.mobile.dto.MobileDtos.LotRecu;
import io.digiservices.ecreditservice.mobile.dto.MobileDtos.SortSaisie;
import io.digiservices.ecreditservice.agri.dto.AgriDtos.ParcelleRecue;
import io.digiservices.ecreditservice.agri.dto.AgriDtos.RecolteRecue;
import io.digiservices.ecreditservice.agri.dto.AgriDtos.VisiteCampagneRecue;
import io.digiservices.ecreditservice.agri.service.AgriCollecteService;
import io.digiservices.ecreditservice.mobile.service.MobileService;
import io.digiservices.ecreditservice.reclamation.dto.ReclamationDtos.ReclamationRecue;
import io.digiservices.ecreditservice.reclamation.dto.ReclamationDtos.SortReclamation;
import io.digiservices.ecreditservice.reclamation.service.ReclamationService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.time.OffsetDateTime;
import java.util.Map;

import static io.digiservices.ecreditservice.utils.RequestUtils.getResponse;
import static org.springframework.http.HttpStatus.OK;

/**
 * Les points d'entrée de l'application mobile des agents de crédit (lot 1 : recouvrement).
 *
 * <p>Un seul préfixe, {@code /ecredit/mobile}, pour que la passerelle et les journaux
 * distinguent d'un coup d'œil ce qui vient d'un téléphone. Aucun identifiant d'agent n'est
 * accepté en paramètre : le compte est celui du jeton, et le service en déduit le périmètre.</p>
 *
 * <p>Les réponses gardent l'enveloppe commune de la plateforme : l'application lit la même
 * forme que les écrans web, et une erreur se présente partout de la même façon.</p>
 */
@RestController
@RequestMapping("/ecredit/mobile")
@RequiredArgsConstructor
public class MobileResource {

    private final MobileService service;
    private final ReclamationService reclamations;
    private final AgriCollecteService agri;

    /** Le profil affiché en tête de l'application, et gardé hors ligne. */
    @GetMapping("/moi")
    public ResponseEntity<Response> moi(@NotNull Authentication authentication,
                                        HttpServletRequest request) {
        return ResponseEntity.ok(getResponse(request,
                Map.of("profil", service.profil(authentication.getName())),
                "Profil de l'agent", OK));
    }

    /** Les crédits affectés à l'agent, avec leur situation SAF et le suivi de digi. */
    @GetMapping("/portefeuille")
    public ResponseEntity<Response> portefeuille(@NotNull Authentication authentication,
                                                 HttpServletRequest request) {
        var credits = service.portefeuille(authentication.getName());
        return ResponseEntity.ok(getResponse(request,
                Map.of("credits", credits, "nombre", credits.size()),
                "Portefeuille de l'agent", OK));
    }

    /**
     * Les listes fermées, servies par différence : le téléphone envoie la date de sa dernière
     * synchronisation et ne reçoit que ce qui a changé depuis.
     */
    @GetMapping("/referentiels")
    public ResponseEntity<Response> referentiels(
            @NotNull Authentication authentication,
            @RequestParam(name = "depuis", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) OffsetDateTime depuis,
            HttpServletRequest request) {
        var entrees = service.referentiels(authentication.getName(), depuis);
        return ResponseEntity.ok(getResponse(request,
                Map.of("referentiels", entrees, "nombre", entrees.size()),
                "Listes de reference", OK));
    }

    /** Les visites déjà enregistrées sur un crédit, telles que la fiche les montre. */
    @GetMapping("/credits/{codAgencia}/{numCredito}/visites")
    public ResponseEntity<Response> visites(@NotNull Authentication authentication,
                                            @PathVariable String codAgencia,
                                            @PathVariable Long numCredito,
                                            HttpServletRequest request) {
        var visites = service.visitesDuCredit(authentication.getName(), codAgencia, numCredito);
        return ResponseEntity.ok(getResponse(request, Map.of("visites", visites),
                "Visites du credit", OK));
    }

    /**
     * Reçoit un lot de saisies faites hors ligne.
     *
     * <p>Rejouable : une saisie déjà reçue revient « doublon » et n'est pas écrite deux fois.
     * La réponse donne le sort de chaque saisie, pour que le téléphone vide sa file sans
     * deviner.</p>
     */
    @PostMapping("/sync")
    public ResponseEntity<Response> synchroniser(@NotNull Authentication authentication,
                                                 @RequestBody LotRecu lot,
                                                 HttpServletRequest request) {
        var traite = service.synchroniser(authentication.getName(), lot);
        return ResponseEntity.ok(getResponse(request, Map.of("lot", traite),
                traite.acceptees() + " saisie(s) transmise(s), " + traite.refusees() + " refusee(s)",
                OK));
    }

    /**
     * Ce que le directeur d'agence voit de son équipe : ses agents, ceux qui se sont tus, et
     * les dernières visites. Lecture seule — toute décision reste sur le poste de travail.
     */
    @GetMapping("/equipe")
    public ResponseEntity<Response> equipe(@NotNull Authentication authentication,
                                           HttpServletRequest request) {
        var vue = service.equipe(authentication.getName());
        return ResponseEntity.ok(getResponse(request, Map.of("equipe", vue),
                vue.agents().size() + " agent(s), " + vue.silencieux().size() + " sans visite recente",
                OK));
    }

    /**
     * La photo d'une visite, envoyée APRÈS elle et une par une.
     *
     * <p>Elle porte son propre identifiant, créé sur le téléphone : renvoyée après une coupure,
     * elle est répondue « doublon » et n'est pas rangée deux fois. La réponse est toujours 200,
     * même pour un refus : c'est le sort rendu qui dit au téléphone s'il doit garder la photo
     * ou la ranger, et une erreur HTTP lui ferait croire à une panne de réseau.</p>
     */
    @PostMapping(value = "/photos", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Response> recevoirPhoto(
            @NotNull Authentication authentication,
            @RequestParam(name = "identifiant") String identifiantClient,
            @RequestParam(name = "visite") String visiteIdentifiant,
            @RequestParam(name = "priseAt", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) OffsetDateTime priseAt,
            @RequestParam(name = "fichier") MultipartFile fichier,
            HttpServletRequest request) {
        var sort = service.recevoirPhoto(authentication.getName(), identifiantClient,
                visiteIdentifiant, priseAt, fichier);
        return ResponseEntity.ok(getResponse(request, Map.of("sort", sort),
                SortSaisie.REFUSEE.equals(sort.sort()) ? sort.motif() : "Photo " + sort.sort().toLowerCase(),
                OK));
    }

    /** Les catégories de réclamation, que le téléphone garde hors ligne. */
    @GetMapping("/reclamations/categories")
    public ResponseEntity<Response> categoriesDeReclamation(@NotNull Authentication authentication,
                                                            HttpServletRequest request) {
        return ResponseEntity.ok(getResponse(request,
                Map.of("categories", reclamations.categories()), "Categories", OK));
    }

    /**
     * Une réclamation du terrain. Même langage que les saisies de recouvrement : la réponse
     * est toujours 200, et c'est le SORT qui dit au téléphone s'il doit la ranger ou la garder.
     */
    @PostMapping("/reclamations")
    public ResponseEntity<Response> signaler(@NotNull Authentication authentication,
                                             @RequestBody ReclamationRecue reclamation,
                                             @RequestParam(name = "jetonAppareil", required = false) String jetonAppareil,
                                             HttpServletRequest request) {
        Long appareilId = service.idAppareil(jetonAppareil);
        var sort = reclamations.recevoir(authentication.getName(), reclamation, appareilId, null);
        return ResponseEntity.ok(getResponse(request, Map.of("sort", sort),
                SortReclamation.REFUSEE.equals(sort.sort()) ? sort.motif()
                        : "Reclamation " + sort.sort().toLowerCase(), OK));
    }

    /** Ce que l'agent a signalé, et ce qui lui a été répondu. */
    @GetMapping("/reclamations")
    public ResponseEntity<Response> mesReclamations(@NotNull Authentication authentication,
                                                    HttpServletRequest request) {
        var mes = reclamations.mes(authentication.getName(), 50);
        return ResponseEntity.ok(getResponse(request, Map.of("reclamations", mes),
                mes.size() + " reclamation(s)", OK));
    }

    /**
     * Les dossiers de l'agent, en cours ou clôturés. Les libellés d'état sont ceux du web,
     * calculés par le serveur : le téléphone et le poste du DA doivent dire la même chose.
     */
    @GetMapping("/dossiers")
    public ResponseEntity<Response> mesDossiers(@NotNull Authentication authentication,
                                                @RequestParam(name = "scope", defaultValue = "EN_COURS") String scope,
                                                HttpServletRequest request) {
        var liste = service.mesDossiers(authentication.getName(), "CLOTURES".equalsIgnoreCase(scope));
        return ResponseEntity.ok(getResponse(request, Map.of("dossiers", liste),
                liste.size() + " dossier(s)", OK));
    }

    /**
     * Le détail d'un crédit : échéancier SAF, cautions connues de digi, dernière position.
     * Un seul appel — trois, sur un forfait de terrain, c'est trois risques d'échec.
     */
    @GetMapping("/credits/{codAgencia}/{numCredito}/fiche")
    public ResponseEntity<Response> ficheCredit(@NotNull Authentication authentication,
                                                @PathVariable(name = "codAgencia") String codAgencia,
                                                @PathVariable(name = "numCredito") Long numCredito,
                                                HttpServletRequest request) {
        var fiche = service.ficheCredit(authentication.getName(), codAgencia, numCredito);
        return ResponseEntity.ok(getResponse(request, Map.of("fiche", fiche),
                fiche.echeancier().size() + " echeance(s)", OK));
    }

    // --------------------------------------------------------------- la collecte agricole

    /**
     * Une parcelle déclarée sur le terrain. Comme tout ce qui vient du téléphone : identifiant
     * créé là-bas, réponse 200, et c'est le sort qui dit quoi faire.
     */
    @PostMapping("/agri/parcelles")
    public ResponseEntity<Response> declarerParcelle(
            @NotNull Authentication authentication,
            @RequestBody ParcelleRecue parcelle,
            @RequestParam(name = "jetonAppareil", required = false) String jetonAppareil,
            HttpServletRequest request) {
        var sort = agri.declarerParcelle(authentication.getName(), parcelle,
                service.idAppareil(jetonAppareil), null);
        return ResponseEntity.ok(getResponse(request, Map.of("sort", sort), message(sort), OK));
    }

    /** Un passage sur une parcelle pendant la campagne. */
    @PostMapping("/agri/visites")
    public ResponseEntity<Response> visiterParcelle(
            @NotNull Authentication authentication,
            @RequestBody VisiteCampagneRecue visite,
            @RequestParam(name = "jetonAppareil", required = false) String jetonAppareil,
            HttpServletRequest request) {
        var sort = agri.enregistrerVisite(authentication.getName(), visite,
                service.idAppareil(jetonAppareil), null);
        return ResponseEntity.ok(getResponse(request, Map.of("sort", sort), message(sort), OK));
    }

    /** Ce que la parcelle a donné. */
    @PostMapping("/agri/recoltes")
    public ResponseEntity<Response> declarerRecolte(
            @NotNull Authentication authentication,
            @RequestBody RecolteRecue recolte,
            @RequestParam(name = "jetonAppareil", required = false) String jetonAppareil,
            HttpServletRequest request) {
        var sort = agri.enregistrerRecolte(authentication.getName(), recolte,
                service.idAppareil(jetonAppareil), null);
        return ResponseEntity.ok(getResponse(request, Map.of("sort", sort), message(sort), OK));
    }

    /** Les parcelles que l'agent suit. */
    @GetMapping("/agri/parcelles")
    public ResponseEntity<Response> mesParcelles(@NotNull Authentication authentication,
                                                 @RequestParam(name = "membre", required = false) String membre,
                                                 HttpServletRequest request) {
        var parcelles = membre == null || membre.isBlank()
                ? agri.mesParcelles(authentication.getName(), 100)
                : agri.parcellesDuMembre(authentication.getName(), membre);
        return ResponseEntity.ok(getResponse(request, Map.of("parcelles", parcelles),
                parcelles.size() + " parcelle(s)", OK));
    }

    /** Une parcelle, son suivi et sa récolte — avec le prévisionnel du dossier en regard. */
    @GetMapping("/agri/parcelles/{id}")
    public ResponseEntity<Response> ficheParcelle(@NotNull Authentication authentication,
                                                  @PathVariable(name = "id") Long id,
                                                  HttpServletRequest request) {
        var fiche = agri.fiche(authentication.getName(), id);
        return ResponseEntity.ok(getResponse(request, Map.of("fiche", fiche), "Parcelle", OK));
    }

    /** Le même langage pour les trois : accepté, doublon, ou refusé avec son motif. */
    private static String message(io.digiservices.ecreditservice.mobile.dto.MobileDtos.SortSaisie sort) {
        return SortSaisie.REFUSEE.equals(sort.sort()) ? sort.motif()
                : "Saisie " + sort.sort().toLowerCase();
    }

    /** Déclare le téléphone, ou le réveille : c'est lui qui recevra les notifications. */
    @PostMapping("/appareils")
    public ResponseEntity<Response> declarerAppareil(
            @NotNull Authentication authentication,
            @RequestParam(name = "jeton") String jeton,
            @RequestParam(name = "plateforme") String plateforme,
            @RequestParam(name = "modele", required = false) String modele,
            @RequestParam(name = "version", required = false) String version,
            HttpServletRequest request) {
        Long id = service.declarerAppareil(authentication.getName(), jeton, plateforme, modele, version);
        return ResponseEntity.ok(getResponse(request, Map.of("appareilId", id),
                "Appareil declare", OK));
    }

    /** À la déconnexion : ce téléphone ne reçoit plus rien. */
    @DeleteMapping("/appareils")
    public ResponseEntity<Response> retirerAppareil(@NotNull Authentication authentication,
                                                    @RequestParam(name = "jeton") String jeton,
                                                    HttpServletRequest request) {
        service.retirerAppareil(authentication.getName(), jeton);
        return ResponseEntity.ok(getResponse(request, Map.of(), "Appareil retire", OK));
    }
}
