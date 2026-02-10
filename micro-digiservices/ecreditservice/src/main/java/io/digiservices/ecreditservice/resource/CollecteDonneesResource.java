package io.digiservices.ecreditservice.resource;

import io.digiservices.clients.UserClient;
import io.digiservices.ecreditservice.domain.Response;
import io.digiservices.ecreditservice.dto.*;
import io.digiservices.ecreditservice.service.CollecteDonneesService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

import static io.digiservices.ecreditservice.utils.RequestUtils.getResponse;
import static org.springframework.http.HttpStatus.*;

@RestController
@AllArgsConstructor
@RequestMapping("/ecredit/collecte")
@Slf4j
public class CollecteDonneesResource {

    private final CollecteDonneesService collecteService;
    private final UserClient userClient;

    // ==================== COLLECTE (Header + Section 1) ====================

    @PostMapping("/{demandeId}")
    public ResponseEntity<Response> createCollecte(
            Authentication authentication,
            @PathVariable(name = "demandeId") Long demandeId,
            @Valid @RequestBody CreateCollecteRequest request,
            HttpServletRequest httpRequest) {

        var user = userClient.getUserByUuid(authentication.getName());
        String fullName = user.getFirstName() + " " + user.getLastName();
        request.setDemandeindividuelId(demandeId);
        var result = collecteService.createCollecte(request, user.getUsername(), fullName);

        return ResponseEntity.status(CREATED).body(
                getResponse(httpRequest, Map.of("collecte", result),
                        "Collecte creee avec succes", CREATED));
    }

    @GetMapping("/{collecteId}")
    public ResponseEntity<Response> getCollecteComplete(
            @PathVariable Long collecteId,
            HttpServletRequest httpRequest) {

        var result = collecteService.getCollecteComplete(collecteId);
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("collecte", result),
                        "Collecte recuperee", OK));
    }

    @GetMapping("/demande/{demandeId}")
    public ResponseEntity<Response> getCollecteByDemande(
            @PathVariable(name = "demandeId") Long demandeId,
            HttpServletRequest httpRequest) {

        var result = collecteService.getCollecteByDemande(demandeId);
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("collecte", result),
                        "Collecte recuperee", OK));
    }

    @PutMapping("/{collecteId}/section1")
    public ResponseEntity<Response> updateSection1(
            @PathVariable Long collecteId,
            @Valid @RequestBody CreateCollecteRequest dto,
            HttpServletRequest httpRequest) {

        var result = collecteService.updateSection1(collecteId, dto);
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("collecte", result),
                        "Section 1 mise a jour", OK));
    }

    @DeleteMapping("/{collecteId}")
    public ResponseEntity<Response> deleteCollecte(
            @PathVariable Long collecteId,
            HttpServletRequest httpRequest) {

        collecteService.deleteCollecte(collecteId);
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("deleted", true),
                        "Collecte supprimee", OK));
    }

    // ==================== SECTIONS ====================

    @PutMapping("/{collecteId}/section2")
    public ResponseEntity<Response> updateSection2(
            @PathVariable Long collecteId,
            @Valid @RequestBody ConditionCreditDto dto,
            HttpServletRequest httpRequest) {

        var result = collecteService.updateSection2(collecteId, dto);
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("collecte", result),
                        "Section 2 (Condition credit) mise a jour", OK));
    }

    @PutMapping("/{collecteId}/section3")
    public ResponseEntity<Response> updateSection3(
            @PathVariable Long collecteId,
            @Valid @RequestBody ChiffreAffairesDto dto,
            HttpServletRequest httpRequest) {

        var result = collecteService.updateSection3(collecteId, dto);
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("collecte", result),
                        "Section 3 (Chiffre d'affaires) mise a jour", OK));
    }

    @PutMapping("/{collecteId}/section4")
    public ResponseEntity<Response> updateSection4(
            @PathVariable Long collecteId,
            @Valid @RequestBody MargeBruteDto dto,
            HttpServletRequest httpRequest) {

        var result = collecteService.updateSection4(collecteId, dto);
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("collecte", result),
                        "Section 4 (Marge brute) mise a jour", OK));
    }

    @PutMapping("/{collecteId}/section5")
    public ResponseEntity<Response> updateSection5(
            @PathVariable Long collecteId,
            @Valid @RequestBody ActifPassifDto dto,
            HttpServletRequest httpRequest) {

        var result = collecteService.updateSection5(collecteId, dto);
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("collecte", result),
                        "Section 5 (Actifs/Passifs) mise a jour", OK));
    }

    @PutMapping("/{collecteId}/section6")
    public ResponseEntity<Response> updateSection6(
            @PathVariable Long collecteId,
            @Valid @RequestBody ChargeEntrepriseDto dto,
            HttpServletRequest httpRequest) {

        var result = collecteService.updateSection6(collecteId, dto);
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("collecte", result),
                        "Section 6 (Charges entreprise) mise a jour", OK));
    }

    @PutMapping("/{collecteId}/section7")
    public ResponseEntity<Response> updateSection7(
            @PathVariable Long collecteId,
            @Valid @RequestBody ChargePersonnelleDto dto,
            HttpServletRequest httpRequest) {

        var result = collecteService.updateSection7(collecteId, dto);
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("collecte", result),
                        "Section 7 (Charges personnelles) mise a jour", OK));
    }

    @PutMapping("/{collecteId}/section8")
    public ResponseEntity<Response> updateSection8(
            @PathVariable Long collecteId,
            @Valid @RequestBody AutreRevenuDto dto,
            HttpServletRequest httpRequest) {

        var result = collecteService.updateSection8(collecteId, dto);
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("collecte", result),
                        "Section 8 (Autres revenus) mise a jour", OK));
    }

    @PutMapping("/{collecteId}/section9")
    public ResponseEntity<Response> updateSection9(
            @PathVariable Long collecteId,
            @Valid @RequestBody BienPersonnelDto dto,
            HttpServletRequest httpRequest) {

        var result = collecteService.updateSection9(collecteId, dto);
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("collecte", result),
                        "Section 9 (Biens personnels) mise a jour", OK));
    }

    // ==================== AMORTISSEMENTS ====================

    @GetMapping("/{collecteId}/amortissements")
    public ResponseEntity<Response> getAmortissements(
            @PathVariable Long collecteId,
            HttpServletRequest httpRequest) {

        var result = collecteService.getAmortissements(collecteId);
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("amortissements", result),
                        "Amortissements recuperes", OK));
    }

    @PostMapping("/{collecteId}/amortissements")
    public ResponseEntity<Response> addAmortissement(
            @PathVariable Long collecteId,
            @Valid @RequestBody AmortissementDto dto,
            HttpServletRequest httpRequest) {

        var result = collecteService.addAmortissement(collecteId, dto);
        return ResponseEntity.status(CREATED).body(
                getResponse(httpRequest, Map.of("amortissement", result),
                        "Amortissement ajoute avec succes", CREATED));
    }

    @PutMapping("/amortissements/{amortId}")
    public ResponseEntity<Response> updateAmortissement(
            @PathVariable(name = "amortId") Long amortId,
            @Valid @RequestBody AmortissementDto dto,
            HttpServletRequest httpRequest) {

        var result = collecteService.updateAmortissement(amortId, dto);
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("amortissement", result != null ? result : Map.of()),
                        "Amortissement mis a jour", OK));
    }

    @DeleteMapping("/amortissements/{amortId}")
    public ResponseEntity<Response> deleteAmortissement(
            @PathVariable(name = "amortId") Long amortId,
            HttpServletRequest httpRequest) {

        collecteService.deleteAmortissement(amortId);
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("deleted", true),
                        "Amortissement supprime", OK));
    }

    @PostMapping("/{collecteId}/amortissements/recalculer")
    public ResponseEntity<Response> recalculerAmortissements(
            @PathVariable Long collecteId,
            HttpServletRequest httpRequest) {

        var result = collecteService.recalculerAmortissements(collecteId);
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("amortissements", result),
                        "Amortissements recalcules avec succes", OK));
    }
}
