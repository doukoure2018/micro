package io.digiservices.bcrgservice.resource;

import io.digiservices.bcrgservice.dto.TraitementNotificationDto;
import io.digiservices.bcrgservice.exception.BadRequestException;
import io.digiservices.bcrgservice.repository.TraitementRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * API de notification des données traitées par la plateforme BCRG.
 *
 * <p>La BCRG notifie ici les références qu'elle a intégrées ; les extractions
 * M1/M2 (statut=restantes, comportement par défaut) ne renvoient ensuite que
 * les données non encore traitées. Protégé par la même clé X-API-Key que le
 * reste de l'API /bcrg/**.</p>
 */
@RestController
@AllArgsConstructor
@RequestMapping("/bcrg/traitements")
@Slf4j
public class TraitementResource {

    private static final Set<String> MODULES_VALIDES =
            Set.of("PERSONNE_PHYSIQUE", "PERSONNE_MORALE", "ENGAGEMENT");
    private static final int MAX_REFERENCES_PAR_APPEL = 1000;

    private final TraitementRepository traitementRepository;
    private final io.digiservices.bcrgservice.service.BcrgService bcrgService;

    /** Notification d'un lot de références traitées ; idempotent (upsert). */
    @PostMapping
    public ResponseEntity<Map<String, Object>> notifier(@RequestBody TraitementNotificationDto notification) {
        String module = validerModule(notification.getModule());
        if (notification.getReferences() == null || notification.getReferences().isEmpty()) {
            throw new BadRequestException("La liste 'references' est obligatoire (1 a " + MAX_REFERENCES_PAR_APPEL + " elements)");
        }
        // Dedoublonnage + nettoyage, en preservant l'ordre
        Set<String> references = new LinkedHashSet<>();
        for (String r : notification.getReferences()) {
            if (r != null && !r.isBlank()) references.add(r.trim());
        }
        if (references.isEmpty() || references.size() > MAX_REFERENCES_PAR_APPEL) {
            throw new BadRequestException("La liste 'references' doit contenir entre 1 et " + MAX_REFERENCES_PAR_APPEL + " elements");
        }

        // PP V2 : empreinte du contenu déclaré, base de /personnes-physiques/modifiees
        Map<String, String> empreintes = "PERSONNE_PHYSIQUE".equals(module)
                ? bcrgService.calculerEmpreintesPersonnesPhysiques(List.copyOf(references))
                : Map.of();
        int nouvelles = traitementRepository.enregistrer(module, List.copyOf(references),
                notification.getDateTraitement(), empreintes);
        Map<String, Object> stats = traitementRepository.stats(module);
        // v1.9 (demande BCRG) : identifiant interne CRG par reference, dans l'ordre recu
        Map<String, Long> ids = traitementRepository.findIdsParReference(module, List.copyOf(references));
        List<Map<String, String>> statutReferences = references.stream()
                .map(r -> Map.of(
                        "referenceRecu", r,
                        "referenceCrg", referenceCrg(module, ids.get(r))))
                .toList();
        log.info("[BCRG] Notification traitement module={} recues={} nouvelles={}", module, references.size(), nouvelles);
        return ResponseEntity.ok(Map.of(
                "module", module,
                "referencesRecues", references.size(),
                "referencesNouvelles", nouvelles,
                "referencesDejaConnues", references.size() - nouvelles,
                "totalTraitees", stats.get("totalTraitees"),
                "statutReferences", statutReferences));
    }

    /**
     * Identifiant interne CRG d'une référence notifiée (v1.9, demande BCRG) :
     * préfixe du module + identifiant de suivi sur 6 positions (ex. PP000123).
     * Stable dans le temps pour un couple (module, référence) donné.
     */
    private static String referenceCrg(String module, Long id) {
        if (id == null) return "";
        String prefixe = switch (module) {
            case "PERSONNE_PHYSIQUE" -> "PP";
            case "PERSONNE_MORALE" -> "PM";
            default -> "ENG";
        };
        return prefixe + String.format("%06d", id);
    }

    /** État du suivi pour un module (contrôle de cohérence côté BCRG). */
    @GetMapping("/{module}")
    public ResponseEntity<Map<String, Object>> stats(@PathVariable String module) {
        return ResponseEntity.ok(traitementRepository.stats(validerModule(module)));
    }

    /** Retire une référence du suivi : la donnée réapparaît dans l'extraction « restantes ». */
    @DeleteMapping("/{module}/{reference}")
    public ResponseEntity<Map<String, Object>> supprimer(
            @PathVariable String module, @PathVariable String reference) {
        String moduleValide = validerModule(module);
        boolean supprimee = traitementRepository.supprimer(moduleValide, reference);
        if (!supprimee) {
            throw new BadRequestException("Reference inconnue pour ce module : " + reference);
        }
        log.info("[BCRG] Reference {}/{} retiree du suivi (retraitement possible)", moduleValide, reference);
        return ResponseEntity.ok(Map.of("module", moduleValide, "reference", reference, "statut", "RETIREE"));
    }

    private String validerModule(String module) {
        String m = module == null ? "" : module.trim().toUpperCase();
        if (!MODULES_VALIDES.contains(m)) {
            throw new BadRequestException("Module invalide : attendu PERSONNE_PHYSIQUE, PERSONNE_MORALE ou ENGAGEMENT");
        }
        return m;
    }
}
