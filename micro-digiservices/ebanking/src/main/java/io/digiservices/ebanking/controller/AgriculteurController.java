package io.digiservices.ebanking.controller;

import io.digiservices.ebanking.exception.BlogAPIException;
import io.digiservices.clients.agri.AgriAgencyDto;
import io.digiservices.clients.agri.AgriCreditDto;
import io.digiservices.clients.agri.CooperativeDto;
import io.digiservices.clients.agri.CooperativeMemberDto;
import io.digiservices.clients.agri.FarmerDto;
import io.digiservices.clients.agri.PageDto;
import io.digiservices.ebanking.service.AgriculteurService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Endpoints internes du perimetre agricole SAF2000 (BDCRG PROD), consommes par
 * {@code agriculteurservice} via Feign. Lecture seule, filtre agricole applique
 * cote service/repository. Reponses : DTO / PageDto bruts (sans enveloppe).
 *
 * <p>Ne PAS exposer ces routes au gateway public.</p>
 */
@RestController
@RequestMapping("/ebanking/agri")
@AllArgsConstructor
@Slf4j
public class AgriculteurController {

    private static final int MAX_PAGE_SIZE = 100;

    private final AgriculteurService agriculteurService;

    @GetMapping("/agences")
    public ResponseEntity<List<AgriAgencyDto>> getAllAgencies() {
        log.info("[AGRI] GET /agences");
        return ResponseEntity.ok(agriculteurService.getAllAgencies());
    }

    @GetMapping("/agences/{codAgencia}/portfolio")
    public ResponseEntity<PageDto<AgriCreditDto>> getAgencyPortfolio(
            @PathVariable("codAgencia") String codAgencia,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "20") int size) {
        validatePagination(page, size);
        log.info("[AGRI] GET /agences/{}/portfolio page={} size={}", codAgencia, page, size);
        return ResponseEntity.ok(agriculteurService.getAgencyPortfolio(codAgencia, page, size));
    }

    @GetMapping("/farmers")
    public ResponseEntity<PageDto<FarmerDto>> getFarmers(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "20") int size) {
        validatePagination(page, size);
        log.info("[AGRI] GET /farmers page={} size={}", page, size);
        return ResponseEntity.ok(agriculteurService.getFarmers(page, size));
    }

    @GetMapping("/farmers/{codCliente}")
    public ResponseEntity<FarmerDto> getFarmerById(@PathVariable("codCliente") String codCliente) {
        log.info("[AGRI] GET /farmers/{}", codCliente);
        return ResponseEntity.ok(agriculteurService.getFarmerById(codCliente));
    }

    @GetMapping("/credits/{codCliente}")
    public ResponseEntity<List<AgriCreditDto>> getAgriculturalCreditsByClient(
            @PathVariable("codCliente") String codCliente) {
        log.info("[AGRI] GET /credits/{}", codCliente);
        return ResponseEntity.ok(agriculteurService.getAgriculturalCreditsByClient(codCliente));
    }

    @GetMapping("/credits/{numCredito}/detail")
    public ResponseEntity<AgriCreditDto> getCreditDetail(@PathVariable("numCredito") Long numCredito) {
        log.info("[AGRI] GET /credits/{}/detail", numCredito);
        return ResponseEntity.ok(agriculteurService.getCreditDetail(numCredito));
    }

    @GetMapping("/cooperatives")
    public ResponseEntity<PageDto<CooperativeDto>> getCooperatives(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "20") int size) {
        validatePagination(page, size);
        log.info("[AGRI] GET /cooperatives page={} size={}", page, size);
        return ResponseEntity.ok(agriculteurService.getCooperatives(page, size));
    }

    @GetMapping("/cooperatives/{codGrupo}")
    public ResponseEntity<CooperativeDto> getCooperativeById(@PathVariable("codGrupo") String codGrupo) {
        log.info("[AGRI] GET /cooperatives/{}", codGrupo);
        return ResponseEntity.ok(agriculteurService.getCooperativeById(codGrupo));
    }

    @GetMapping("/cooperatives/{codGrupo}/members")
    public ResponseEntity<PageDto<CooperativeMemberDto>> getCooperativeMembers(
            @PathVariable("codGrupo") String codGrupo,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "20") int size) {
        validatePagination(page, size);
        log.info("[AGRI] GET /cooperatives/{}/members page={} size={}", codGrupo, page, size);
        return ResponseEntity.ok(agriculteurService.getCooperativeMembers(codGrupo, page, size));
    }

    /**
     * page &gt;= 0 et 1 &le; size &le; 100, sinon HTTP 400.
     */
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
