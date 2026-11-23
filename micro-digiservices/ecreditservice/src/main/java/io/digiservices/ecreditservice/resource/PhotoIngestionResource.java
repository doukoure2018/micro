package io.digiservices.ecreditservice.resource;

import io.digiservices.ecreditservice.domain.Response;
import io.digiservices.ecreditservice.dto.PhotoEcartDtos.PhotoRecue;
import io.digiservices.ecreditservice.service.PhotoEcartService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

import static io.digiservices.ecreditservice.utils.RequestUtils.getResponse;
import static org.springframework.http.HttpStatus.OK;

/**
 * La porte par laquelle l'outil de bureau pousse ses photos d'ecarts (V217).
 *
 * <p><b>Pourquoi une cle API et non un jeton d'utilisateur.</b> La photo du matin est prise par
 * une tache planifiee du poste DSIG, a 7 h 45, sans personne devant l'ecran : il n'y a aucun
 * compte connecte dont on pourrait porter le jeton. Le chemin
 * {@code /ecredit/rapprochement/photo} a donc sa propre chaine de securite, calquee sur celle du
 * perimetre partenaire ({@code /ecredit/agri/**}) : cle API comparee en temps constant, refus
 * ferme quand aucune cle n'est configuree, et la cle jamais ecrite dans les journaux.</p>
 *
 * <p>Ce chemin n'ouvre qu'une seule chose : l'ecriture d'une photo. La lecture reste sur la
 * chaine JWT, bornee au perimetre du compte ({@link PhotoEcartResource}).</p>
 */
@RestController
@RequestMapping("/ecredit/rapprochement/photo")
@RequiredArgsConstructor
@Slf4j
public class PhotoIngestionResource {

    private final PhotoEcartService service;

    /** Une photo. Un second envoi du meme jour et du meme module remplace le premier. */
    @PostMapping
    public ResponseEntity<Response> recevoir(@RequestBody PhotoRecue photo,
                                             HttpServletRequest request) {
        long id = service.recevoir(photo);
        return ResponseEntity.ok(getResponse(request,
                Map.of("photoId", id, "jour", photo.jour(), "module", photo.module()),
                "Photo du " + photo.jour() + " enregistree pour le module " + photo.module(), OK));
    }

    /**
     * Plusieurs photos d'un coup : le rattrapage du tampon local.
     *
     * <p>Quand le reseau est tombe, l'outil garde ses photos et les renvoie toutes au passage
     * suivant. Chacune est rangee independamment : une photo refusee n'empeche pas les autres,
     * et la reponse dit laquelle a echoue — sans quoi le tampon ne saurait pas quoi reessayer.</p>
     */
    @PostMapping("/lot")
    public ResponseEntity<Response> recevoirLot(@RequestBody List<PhotoRecue> photos,
                                                HttpServletRequest request) {
        List<Map<String, Object>> resultats = new java.util.ArrayList<>();
        int rangees = 0;
        for (PhotoRecue photo : photos == null ? List.<PhotoRecue>of() : photos) {
            try {
                long id = service.recevoir(photo);
                rangees++;
                resultats.add(Map.of("jour", String.valueOf(photo.jour()),
                        "module", String.valueOf(photo.module()), "photoId", id, "rangee", true));
            } catch (Exception e) {
                log.warn("[PHOTO ECARTS] Photo refusee ({} {}) : {}",
                        photo == null ? "?" : photo.jour(), photo == null ? "?" : photo.module(),
                        e.getMessage());
                resultats.add(Map.of("jour", String.valueOf(photo == null ? null : photo.jour()),
                        "module", String.valueOf(photo == null ? null : photo.module()),
                        "rangee", false, "raison", String.valueOf(e.getMessage())));
            }
        }
        return ResponseEntity.ok(getResponse(request,
                Map.of("resultats", resultats, "rangees", rangees),
                rangees + " photo(s) rangee(s) sur " + resultats.size(), OK));
    }
}
