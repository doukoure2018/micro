package io.digiservices.ecreditservice.reclamation.resource;

import io.digiservices.ecreditservice.domain.Response;
import io.digiservices.ecreditservice.reclamation.service.ReclamationService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

import static io.digiservices.ecreditservice.utils.RequestUtils.getResponse;
import static org.springframework.http.HttpStatus.OK;

/**
 * Les réclamations du terrain, côté directions : la file, la prise en charge, la réponse.
 *
 * <p>L'accès n'est pas borné par un rôle écrit ici, mais par la rubrique RECLAMATIONS de la
 * matrice d'habilitation : exactement ceux qui reçoivent le courriel peuvent répondre.</p>
 */
@RestController
@RequestMapping("/ecredit/reclamations")
@RequiredArgsConstructor
public class ReclamationResource {

    private final ReclamationService service;

    /** La file. Sans filtre, tout remonte — personne ne doit croire qu'une réclamation s'est perdue. */
    @GetMapping
    public ResponseEntity<Response> file(@NotNull Authentication authentication,
                                         @RequestParam(name = "statut", required = false) String statut,
                                         @RequestParam(name = "categorie", required = false) String categorie,
                                         @RequestParam(name = "limite", defaultValue = "100") int limite,
                                         HttpServletRequest request) {
        var file = service.file(authentication.getName(), statut, categorie, Math.min(limite, 500));
        return ResponseEntity.ok(getResponse(request, Map.of("file", file),
                file.ouvertes() + " ouverte(s), " + file.enCours() + " en cours", OK));
    }

    /** Les catégories, pour les filtres de l'écran. */
    @GetMapping("/categories")
    public ResponseEntity<Response> categories(@NotNull Authentication authentication,
                                               HttpServletRequest request) {
        return ResponseEntity.ok(getResponse(request,
                Map.of("categories", service.categories()), "Categories", OK));
    }

    /** « Je m'en occupe » : nomme celui qui prend la main, pour que six directions ne s'attendent pas. */
    @PostMapping("/{id}/prise-en-charge")
    public ResponseEntity<Response> prendreEnCharge(@NotNull Authentication authentication,
                                                    @PathVariable(name = "id") Long id,
                                                    HttpServletRequest request) {
        var vue = service.prendreEnCharge(authentication.getName(), id);
        return ResponseEntity.ok(getResponse(request, Map.of("reclamation", vue),
                "Reclamation prise en charge", OK));
    }

    /** La réponse, qui clôt la réclamation et revient à l'agent sur son téléphone. */
    @PostMapping("/{id}/reponse")
    public ResponseEntity<Response> repondre(@NotNull Authentication authentication,
                                             @PathVariable(name = "id") Long id,
                                             @RequestBody Map<String, String> corps,
                                             HttpServletRequest request) {
        var vue = service.repondre(authentication.getName(), id, corps.get("reponse"));
        return ResponseEntity.ok(getResponse(request, Map.of("reclamation", vue),
                "Reponse enregistree", OK));
    }
}
