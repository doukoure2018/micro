package io.digiservices.bcrgservice.resource;

import io.digiservices.bcrgservice.dto.EncoursDto;
import io.digiservices.bcrgservice.dto.EngagementDto;
import io.digiservices.bcrgservice.dto.PageDto;
import io.digiservices.bcrgservice.dto.ParIdsRequete;
import io.digiservices.bcrgservice.dto.PersonneMoraleDto;
import io.digiservices.bcrgservice.dto.PersonnePhysiqueDto;
import io.digiservices.bcrgservice.exception.BadRequestException;
import io.digiservices.bcrgservice.service.BcrgService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * API publique de declaration reglementaire exposee a la plateforme BCRG.
 * Protegee par cle API ({@code X-API-Key}). Modules M1 (PP/PM), M2 (engagements), M4 (encours).
 *
 * <p>Extraction incrementale : par defaut (statut=restantes) les modules M1/M2 ne
 * renvoient que les donnees non encore notifiees comme traitees par la BCRG
 * (cf. {@link TraitementResource}). L'encours (M4) reste une photo complete d'arrete.</p>
 */
@RestController
@RequestMapping("/bcrg")
@RequiredArgsConstructor
@Slf4j
public class BcrgResource {

    private static final int MAX_PAGE_SIZE = 100;

    private final BcrgService bcrgService;

    @GetMapping("/personnes-physiques")
    public ResponseEntity<PageDto<PersonnePhysiqueDto>> getPersonnesPhysiques(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "20") int size,
            @RequestParam(name = "statut", defaultValue = "restantes") String statut) {
        validatePagination(page, size);
        return ResponseEntity.ok(bcrgService.getPersonnesPhysiques(page, size, toutes(statut)));
    }

    /** PP V2 : personnes physiques à partir d'une liste d'identifiants internes (1 à 200). */
    @GetMapping("/personnes-physiques/par-ids")
    public ResponseEntity<java.util.List<PersonnePhysiqueDto>> getPersonnesPhysiquesParIds(
            @RequestParam(name = "ids") java.util.List<String> ids) {
        return ResponseEntity.ok(bcrgService.getPersonnesPhysiquesParIds(validerIds(ids)));
    }

    /** v1.7 (demande BCRG) : identifiants dans le corps de la requête — {"ids": [...]}. */
    @PostMapping("/personnes-physiques/par-ids")
    public ResponseEntity<java.util.List<PersonnePhysiqueDto>> postPersonnesPhysiquesParIds(
            @RequestBody ParIdsRequete requete) {
        return ResponseEntity.ok(bcrgService.getPersonnesPhysiquesParIds(validerIds(idsDe(requete))));
    }

    /** v1.7 (demande BCRG) : personnes morales à partir d'une liste d'identifiants internes. */
    @GetMapping("/personnes-morales/par-ids")
    public ResponseEntity<java.util.List<PersonneMoraleDto>> getPersonnesMoralesParIds(
            @RequestParam(name = "ids") java.util.List<String> ids) {
        return ResponseEntity.ok(bcrgService.getPersonnesMoralesParIds(validerIds(ids)));
    }

    /** v1.7 (demande BCRG) : identifiants dans le corps de la requête — {"ids": [...]}. */
    @PostMapping("/personnes-morales/par-ids")
    public ResponseEntity<java.util.List<PersonneMoraleDto>> postPersonnesMoralesParIds(
            @RequestBody ParIdsRequete requete) {
        return ResponseEntity.ok(bcrgService.getPersonnesMoralesParIds(validerIds(idsDe(requete))));
    }

    private static java.util.List<String> idsDe(ParIdsRequete requete) {
        return requete == null ? null : requete.getIds();
    }

    private static java.util.List<String> validerIds(java.util.List<String> ids) {
        if (ids == null || ids.isEmpty() || ids.size() > 200) {
            throw new BadRequestException("La liste 'ids' doit contenir entre 1 et 200 identifiants");
        }
        return ids;
    }

    /**
     * PP V2 : personnes modifiées depuis leur déclaration à la BCRG — comparaison de
     * l'empreinte actuelle avec celle stockée lors de la notification POST /traitements.
     */
    @GetMapping("/personnes-physiques/modifiees")
    public ResponseEntity<PageDto<PersonnePhysiqueDto>> getPersonnesPhysiquesModifiees(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "20") int size) {
        validatePagination(page, size);
        return ResponseEntity.ok(bcrgService.getPersonnesPhysiquesModifiees(page, size));
    }

    @GetMapping("/personnes-physiques/{idClient}")
    public ResponseEntity<PersonnePhysiqueDto> getPersonnePhysique(@PathVariable("idClient") String idClient) {
        return ResponseEntity.ok(bcrgService.getPersonnePhysique(idClient));
    }

    @GetMapping("/personnes-morales")
    public ResponseEntity<PageDto<PersonneMoraleDto>> getPersonnesMorales(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "20") int size,
            @RequestParam(name = "statut", defaultValue = "restantes") String statut) {
        validatePagination(page, size);
        return ResponseEntity.ok(bcrgService.getPersonnesMorales(page, size, toutes(statut)));
    }

    @GetMapping("/personnes-morales/{idClient}")
    public ResponseEntity<PersonneMoraleDto> getPersonneMorale(@PathVariable("idClient") String idClient) {
        return ResponseEntity.ok(bcrgService.getPersonneMorale(idClient));
    }

    @GetMapping("/engagements")
    public ResponseEntity<PageDto<EngagementDto>> getEngagements(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "20") int size,
            @RequestParam(name = "statut", defaultValue = "restantes") String statut) {
        validatePagination(page, size);
        return ResponseEntity.ok(bcrgService.getEngagements(page, size, toutes(statut)));
    }

    /** v1.6 : la référence d'engagement est composite — {@code <codAgence>-<numCredito>}. */
    @GetMapping("/engagements/{refEng}")
    public ResponseEntity<EngagementDto> getEngagement(@PathVariable("refEng") String refEng) {
        return ResponseEntity.ok(bcrgService.getEngagement(refEng));
    }

    /**
     * v1.6 : filtre=declares (défaut) limite la photo aux engagements déjà notifiés
     * traités — la page peut contenir moins de size éléments, se fier à hasNext ;
     * filtre=aucun restitue la photo complète d'arrêté (audit).
     */
    @GetMapping("/encours")
    public ResponseEntity<PageDto<EncoursDto>> getEncours(
            @RequestParam(name = "periode") String periode,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "20") int size,
            @RequestParam(name = "filtre", defaultValue = "declares") String filtre) {
        validatePagination(page, size);
        boolean filtreDeclares = switch (filtre == null ? "" : filtre.trim().toLowerCase()) {
            case "", "declares" -> true;
            case "aucun" -> false;
            default -> throw new BadRequestException("Le parametre 'filtre' doit valoir 'declares' ou 'aucun'");
        };
        return ResponseEntity.ok(bcrgService.getEncours(periode, page, size, filtreDeclares));
    }

    /**
     * statut=restantes (defaut) : seules les donnees non encore notifiees traitees
     * (POST /bcrg/traitements) sont renvoyees ; statut=toutes : extraction complete.
     */
    private boolean toutes(String statut) {
        return switch (statut == null ? "" : statut.trim().toLowerCase()) {
            case "toutes" -> true;
            case "", "restantes" -> false;
            default -> throw new BadRequestException("Le parametre 'statut' doit valoir 'restantes' ou 'toutes'");
        };
    }

    private void validatePagination(int page, int size) {
        if (page < 0) {
            throw new BadRequestException("Le parametre 'page' doit etre >= 0");
        }
        if (size < 1 || size > MAX_PAGE_SIZE) {
            throw new BadRequestException("Le parametre 'size' doit etre compris entre 1 et " + MAX_PAGE_SIZE);
        }
    }
}
