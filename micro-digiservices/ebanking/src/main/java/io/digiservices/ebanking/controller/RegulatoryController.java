package io.digiservices.ebanking.controller;

import io.digiservices.clients.agri.PageDto;
import io.digiservices.clients.reg.RegEncoursDto;
import io.digiservices.clients.reg.RegEngagementDto;
import io.digiservices.clients.reg.RegPersonneMoraleDto;
import io.digiservices.clients.reg.RegPersonnePhysiqueDto;
import io.digiservices.ebanking.exception.BlogAPIException;
import io.digiservices.ebanking.service.RegulatoryService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Endpoints internes du perimetre reglementaire (declaration BCRG) SAF2000,
 * consommes par {@code bcrgservice} via Feign. Lecture seule sur la datasource
 * tertiary (meme acces que le credit agricole). Reponses : DTO / PageDto bruts.
 *
 * <p>Ne PAS exposer ces routes au gateway public.</p>
 */
@RestController
@RequestMapping("/ebanking/reg")
@AllArgsConstructor
@Slf4j
public class RegulatoryController {

    private static final int MAX_PAGE_SIZE = 100;

    private final RegulatoryService regulatoryService;

    @GetMapping("/personnes-physiques")
    public ResponseEntity<PageDto<RegPersonnePhysiqueDto>> getPersonnesPhysiques(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "20") int size) {
        validatePagination(page, size);
        log.info("[REG] GET /personnes-physiques page={} size={}", page, size);
        return ResponseEntity.ok(regulatoryService.getPersonnesPhysiques(page, size));
    }

    @GetMapping("/personnes-physiques/{codCliente}")
    public ResponseEntity<RegPersonnePhysiqueDto> getPersonnePhysiqueById(
            @PathVariable("codCliente") String codCliente) {
        log.info("[REG] GET /personnes-physiques/{}", codCliente);
        return ResponseEntity.ok(regulatoryService.getPersonnePhysiqueById(codCliente));
    }

    // ==================== LOTS KEYSET + DETAILS PAR IDS (extraction filtree bcrgservice) ====================

    @GetMapping("/personnes-physiques/lot")
    public ResponseEntity<java.util.List<RegPersonnePhysiqueDto>> getPersonnesPhysiquesLot(
            @RequestParam(name = "afterId", defaultValue = "") String afterId,
            @RequestParam(name = "limit", defaultValue = "500") int limit) {
        validateLimit(limit);
        return ResponseEntity.ok(regulatoryService.getPersonnesPhysiquesLot(afterId, limit));
    }

    @GetMapping("/personnes-physiques/par-ids")
    public ResponseEntity<java.util.List<RegPersonnePhysiqueDto>> getPersonnesPhysiquesByIds(
            @RequestParam(name = "ids") java.util.List<String> ids) {
        validateIds(ids);
        return ResponseEntity.ok(regulatoryService.getPersonnesPhysiquesByIds(ids));
    }

    @GetMapping("/personnes-morales/lot")
    public ResponseEntity<java.util.List<RegPersonneMoraleDto>> getPersonnesMoralesLot(
            @RequestParam(name = "afterId", defaultValue = "") String afterId,
            @RequestParam(name = "limit", defaultValue = "500") int limit) {
        validateLimit(limit);
        return ResponseEntity.ok(regulatoryService.getPersonnesMoralesLot(afterId, limit));
    }

    @GetMapping("/personnes-morales/par-ids")
    public ResponseEntity<java.util.List<RegPersonneMoraleDto>> getPersonnesMoralesByIds(
            @RequestParam(name = "ids") java.util.List<String> ids) {
        validateIds(ids);
        return ResponseEntity.ok(regulatoryService.getPersonnesMoralesByIds(ids));
    }

    // v1.6 : curseur keyset composite (agence, numero) — NUM_CREDITO seul n'est pas unique
    @GetMapping("/engagements/lot")
    public ResponseEntity<java.util.List<RegEngagementDto>> getEngagementsLot(
            @RequestParam(name = "afterAgence", defaultValue = "") String afterAgence,
            @RequestParam(name = "afterId", defaultValue = "0") Long afterId,
            @RequestParam(name = "limit", defaultValue = "500") int limit) {
        validateLimit(limit);
        return ResponseEntity.ok(regulatoryService.getEngagementsLot(afterAgence, afterId, limit));
    }

    // v1.11 : engagements d'un lot de beneficiaires (extraction restantes inversee)
    @GetMapping("/engagements/par-beneficiaires")
    public ResponseEntity<java.util.List<RegEngagementDto>> getEngagementsParBeneficiaires(
            @RequestParam(name = "ids") java.util.List<String> ids) {
        validateIds(ids);
        return ResponseEntity.ok(regulatoryService.getEngagementsParBeneficiaires(ids));
    }

    private void validateLimit(int limit) {
        if (limit < 1 || limit > 1000) {
            throw new BlogAPIException(HttpStatus.BAD_REQUEST, "Le parametre 'limit' doit etre compris entre 1 et 1000");
        }
    }

    private void validateIds(java.util.List<String> ids) {
        if (ids == null || ids.isEmpty() || ids.size() > 200) {
            throw new BlogAPIException(HttpStatus.BAD_REQUEST, "Le parametre 'ids' doit contenir entre 1 et 200 identifiants");
        }
    }

    @GetMapping("/personnes-morales")
    public ResponseEntity<PageDto<RegPersonneMoraleDto>> getPersonnesMorales(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "20") int size) {
        validatePagination(page, size);
        log.info("[REG] GET /personnes-morales page={} size={}", page, size);
        return ResponseEntity.ok(regulatoryService.getPersonnesMorales(page, size));
    }

    @GetMapping("/personnes-morales/{codCliente}")
    public ResponseEntity<RegPersonneMoraleDto> getPersonneMoraleById(
            @PathVariable("codCliente") String codCliente) {
        log.info("[REG] GET /personnes-morales/{}", codCliente);
        return ResponseEntity.ok(regulatoryService.getPersonneMoraleById(codCliente));
    }

    @GetMapping("/engagements")
    public ResponseEntity<PageDto<RegEngagementDto>> getEngagements(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "20") int size) {
        validatePagination(page, size);
        log.info("[REG] GET /engagements page={} size={}", page, size);
        return ResponseEntity.ok(regulatoryService.getEngagements(page, size));
    }

    // v1.6 : detail par cle composite (agence, numero)
    @GetMapping("/engagements/{codAgencia}/{numCredito}")
    public ResponseEntity<RegEngagementDto> getEngagementById(
            @PathVariable("codAgencia") String codAgencia,
            @PathVariable("numCredito") Long numCredito) {
        log.info("[REG] GET /engagements/{}/{}", codAgencia, numCredito);
        return ResponseEntity.ok(regulatoryService.getEngagementById(codAgencia, numCredito));
    }

    @GetMapping("/encours")
    public ResponseEntity<PageDto<RegEncoursDto>> getEncours(
            @RequestParam(name = "periode") String periode,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "20") int size) {
        validatePagination(page, size);
        log.info("[REG] GET /encours periode={} page={} size={}", periode, page, size);
        return ResponseEntity.ok(regulatoryService.getEncours(periode, page, size));
    }

    private void validatePagination(int page, int size) {
        if (page < 0) {
            throw new BlogAPIException(HttpStatus.BAD_REQUEST, "Le parametre 'page' doit etre >= 0");
        }
        if (size < 1 || size > MAX_PAGE_SIZE) {
            throw new BlogAPIException(HttpStatus.BAD_REQUEST,
                    "Le parametre 'size' doit etre compris entre 1 et " + MAX_PAGE_SIZE);
        }
    }
}
