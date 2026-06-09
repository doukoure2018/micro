package io.digiservices.agriculteurservice.resource;

import io.digiservices.agriculteurservice.dto.AgenceDto;
import io.digiservices.agriculteurservice.dto.AgriculteurDto;
import io.digiservices.agriculteurservice.dto.CooperativeDto;
import io.digiservices.agriculteurservice.dto.CreditAgricoleDto;
import io.digiservices.agriculteurservice.dto.MembreCooperativeDto;
import io.digiservices.agriculteurservice.dto.PageDto;
import io.digiservices.agriculteurservice.exception.BadRequestException;
import io.digiservices.agriculteurservice.service.AgriculteurService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * API publique AgriPilot ({@code /agriculteurs/**}). Reponses : DTO / PageDto bruts.
 * Delegue a {@link AgriculteurService}. Securisee par JWT + role AGRIPILOT (Phase 4).
 */
@RestController
@RequestMapping("/agriculteurs")
@RequiredArgsConstructor
@Slf4j
public class AgriculteurResource {

    private static final int MAX_PAGE_SIZE = 100;

    private final AgriculteurService agriculteurService;

    @GetMapping("/agencies")
    public ResponseEntity<List<AgenceDto>> getAgencies() {
        log.info("[AGRI] GET /agriculteurs/agencies");
        return ResponseEntity.ok(agriculteurService.getAgencies());
    }

    @GetMapping("/agencies/{agencyId}/portfolio")
    public ResponseEntity<PageDto<CreditAgricoleDto>> getAgencyPortfolio(
            @PathVariable("agencyId") String agencyId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        validatePagination(page, size);
        log.info("[AGRI] GET /agriculteurs/agencies/{}/portfolio page={} size={}", agencyId, page, size);
        return ResponseEntity.ok(agriculteurService.getAgencyPortfolio(agencyId, page, size));
    }

    @GetMapping("/farmers")
    public ResponseEntity<PageDto<AgriculteurDto>> getFarmers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        validatePagination(page, size);
        log.info("[AGRI] GET /agriculteurs/farmers page={} size={}", page, size);
        return ResponseEntity.ok(agriculteurService.getFarmers(page, size));
    }

    @GetMapping("/farmers/{clientId}")
    public ResponseEntity<AgriculteurDto> getFarmer(@PathVariable("clientId") String clientId) {
        log.info("[AGRI] GET /agriculteurs/farmers/{}", clientId);
        return ResponseEntity.ok(agriculteurService.getFarmer(clientId));
    }

    @GetMapping("/farmers/{clientId}/credits")
    public ResponseEntity<List<CreditAgricoleDto>> getCreditsByFarmer(@PathVariable("clientId") String clientId) {
        log.info("[AGRI] GET /agriculteurs/farmers/{}/credits", clientId);
        return ResponseEntity.ok(agriculteurService.getCreditsByFarmer(clientId));
    }

    @GetMapping("/credits/{creditId}")
    public ResponseEntity<CreditAgricoleDto> getCredit(@PathVariable("creditId") Long creditId) {
        log.info("[AGRI] GET /agriculteurs/credits/{}", creditId);
        return ResponseEntity.ok(agriculteurService.getCredit(creditId));
    }

    @GetMapping("/cooperatives")
    public ResponseEntity<PageDto<CooperativeDto>> getCooperatives(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        validatePagination(page, size);
        log.info("[AGRI] GET /agriculteurs/cooperatives page={} size={}", page, size);
        return ResponseEntity.ok(agriculteurService.getCooperatives(page, size));
    }

    @GetMapping("/cooperatives/{groupId}")
    public ResponseEntity<CooperativeDto> getCooperative(@PathVariable("groupId") String groupId) {
        log.info("[AGRI] GET /agriculteurs/cooperatives/{}", groupId);
        return ResponseEntity.ok(agriculteurService.getCooperative(groupId));
    }

    @GetMapping("/cooperatives/{groupId}/members")
    public ResponseEntity<PageDto<MembreCooperativeDto>> getCooperativeMembers(
            @PathVariable("groupId") String groupId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        validatePagination(page, size);
        log.info("[AGRI] GET /agriculteurs/cooperatives/{}/members page={} size={}", groupId, page, size);
        return ResponseEntity.ok(agriculteurService.getCooperativeMembers(groupId, page, size));
    }

    /** page &gt;= 0 et 1 &le; size &le; 100, sinon HTTP 400. */
    private void validatePagination(int page, int size) {
        if (page < 0) {
            throw new BadRequestException("Le parametre 'page' doit etre >= 0");
        }
        if (size < 1 || size > MAX_PAGE_SIZE) {
            throw new BadRequestException("Le parametre 'size' doit etre compris entre 1 et " + MAX_PAGE_SIZE);
        }
    }
}
