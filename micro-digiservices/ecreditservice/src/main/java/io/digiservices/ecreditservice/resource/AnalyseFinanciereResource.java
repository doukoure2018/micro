package io.digiservices.ecreditservice.resource;

import io.digiservices.clients.UserClient;
import io.digiservices.ecreditservice.domain.Response;
import io.digiservices.ecreditservice.dto.*;
import io.digiservices.ecreditservice.service.AnalyseFinanciereService;
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
@RequestMapping("/ecredit/bilan_finance")
@Slf4j
public class AnalyseFinanciereResource {

    private final AnalyseFinanciereService analyseService;
    private final UserClient userClient;

    // ==================== ANALYSE (Header) - 5 endpoints ====================

    @PostMapping("/analyse")
    public ResponseEntity<Response> createAnalyse(
            Authentication authentication,
            @Valid @RequestBody CreateAnalyseRequest request,
            HttpServletRequest httpRequest) {

        var user = userClient.getUserByUuid(authentication.getName());
        String fullName = user.getFirstName() + " " + user.getLastName();
        var result = analyseService.createAnalyse(request, user.getUsername(), fullName);

        return ResponseEntity.status(CREATED).body(
                getResponse(httpRequest, Map.of("analyse", result),
                        "Analyse financiere creee avec succes", CREATED));
    }

    @GetMapping("/analyse/{analyseId}")
    public ResponseEntity<Response> getAnalyseById(
            @PathVariable Long analyseId,
            HttpServletRequest httpRequest) {

        var result = analyseService.getAnalyseById(analyseId);
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("analyse", result),
                        "Analyse financiere recuperee", OK));
    }

    @GetMapping("/analyse/demande/{demandeId}")
    public ResponseEntity<Response> getAnalyseByDemandeId(
            @PathVariable(name = "demandeId") Long demandeId,
            HttpServletRequest httpRequest) {

        var result = analyseService.getAnalyseByDemandeId(demandeId);
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("analyse", result),
                        "Analyse financiere recuperee", OK));
    }

    @PutMapping("/analyse/{analyseId}")
    public ResponseEntity<Response> updateAnalyse(
            @PathVariable(name = "analyseId") Long analyseId,
            @Valid @RequestBody AnalyseFinanciereDto dto,
            HttpServletRequest httpRequest) {

        var result = analyseService.updateAnalyse(analyseId, dto);
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("analyse", result),
                        "Analyse financiere mise a jour", OK));
    }

    @DeleteMapping("/analyse/{analyseId}")
    public ResponseEntity<Response> deleteAnalyse(
            @PathVariable(name = "analyseId") Long analyseId,
            HttpServletRequest httpRequest) {

        analyseService.deleteAnalyse(analyseId);
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("deleted", true),
                        "Analyse financiere supprimee", OK));
    }

    // ==================== BILAN - 4 endpoints ====================

    @PostMapping("/bilan")
    public ResponseEntity<Response> createBilan(
            @Valid @RequestBody CreateBilanRequest request,
            HttpServletRequest httpRequest) {

        var result = analyseService.createBilan(request);
        return ResponseEntity.status(CREATED).body(
                getResponse(httpRequest, Map.of("bilan", result),
                        "Bilan cree avec succes", CREATED));
    }

    @GetMapping("/bilan/analyse/{analyseId}")
    public ResponseEntity<Response> getBilansByAnalyse(
            @PathVariable(name = "analyseId") Long analyseId,
            HttpServletRequest httpRequest)
    {

        var result = analyseService.getBilansByAnalyse(analyseId);
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("bilans", result),
                        "Bilans recuperes", OK));
    }

    @GetMapping("/bilan/analyse/{analyseId}/periode/{typePeriode}")
    public ResponseEntity<Response> getBilanByPeriode(
            @PathVariable(name = "analyseId") Long analyseId,
            @PathVariable(name = "typePeriode") String typePeriode,
            HttpServletRequest httpRequest) {

        var result = analyseService.getBilanByPeriode(analyseId, typePeriode);
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("bilan", result),
                        "Bilan recupere", OK));
    }

    @PutMapping("/bilan/{bilanId}")
    public ResponseEntity<Response> updateBilan(
            @PathVariable(name = "bilanId") Long bilanId,
            @Valid @RequestBody AnalyseBilanDto dto,
            HttpServletRequest httpRequest)
    {

        var result = analyseService.updateBilan(bilanId, dto);
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("bilan", result),
                        "Bilan mis a jour", OK));
    }

    // ==================== RENTABILITE - 4 endpoints ====================

    @PostMapping("/rentabilite")
    public ResponseEntity<Response> createRentabilite(
            @Valid @RequestBody CreateRentabiliteRequest request,
            HttpServletRequest httpRequest) {

        var result = analyseService.createRentabilite(request);
        return ResponseEntity.status(CREATED).body(
                getResponse(httpRequest, Map.of("rentabilite", result),
                        "Rentabilite creee avec succes", CREATED));
    }

    @GetMapping("/rentabilite/analyse/{analyseId}")
    public ResponseEntity<Response> getRentabilitesByAnalyse(
            @PathVariable(name = "analyseId") Long analyseId,
            HttpServletRequest httpRequest)
    {

        var result = analyseService.getRentabilitesByAnalyse(analyseId);
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("rentabilites", result),
                        "Rentabilites recuperees", OK));
    }

    @GetMapping("/rentabilite/analyse/{analyseId}/periode/{typePeriode}")
    public ResponseEntity<Response> getRentabiliteByPeriode(
            @PathVariable(name = "analyseId") Long analyseId,
            @PathVariable(name = "typePeriode") String typePeriode,
            HttpServletRequest httpRequest)
    {

        var result = analyseService.getRentabiliteByPeriode(analyseId, typePeriode);
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("rentabilite", result),
                        "Rentabilite recuperee", OK));
    }

    @PutMapping("/rentabilite/{rentabiliteId}")
    public ResponseEntity<Response> updateRentabilite(
            @PathVariable(name = "rentabiliteId") Long rentabiliteId,
            @Valid @RequestBody AnalyseRentabiliteDto dto,
            HttpServletRequest httpRequest) {

        var result = analyseService.updateRentabilite(rentabiliteId, dto);
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("rentabilite", result),
                        "Rentabilite mise a jour", OK));
    }

    // ==================== BESOIN CREDIT - 3 endpoints ====================

    @PostMapping("/besoin-credit")
    public ResponseEntity<Response> createBesoinCredit(
            @Valid @RequestBody CreateBesoinCreditRequest request,
            HttpServletRequest httpRequest) {

        var result = analyseService.createBesoinCredit(request);
        return ResponseEntity.status(CREATED).body(
                getResponse(httpRequest, Map.of("besoinCredit", result),
                        "Besoin credit cree avec succes", CREATED));
    }

    @GetMapping("/besoin-credit/analyse/{analyseId}")
    public ResponseEntity<Response> getBesoinCreditByAnalyse(
            @PathVariable(name = "analyseId") Long analyseId,
            HttpServletRequest httpRequest) {

        var result = analyseService.getBesoinCreditByAnalyse(analyseId);
        if (result == null) {
            return ResponseEntity.ok(
                    getResponse(httpRequest, java.util.Collections.emptyMap(),
                            "Besoin credit non encore cree", OK));
        }
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("besoinCredit", result),
                        "Besoin credit recupere", OK));
    }

    @PutMapping("/besoin-credit/analyse/{analyseId}")
    public ResponseEntity<Response> updateBesoinCredit(
            @PathVariable(name = "analyseId") Long analyseId,
            @Valid @RequestBody AnalyseBesoinCreditDto dto,
            HttpServletRequest httpRequest)
    {

        var result = analyseService.updateBesoinCredit(analyseId, dto);
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("besoinCredit", result),
                        "Besoin credit mis a jour", OK));
    }

    // ==================== PROPOSITION - 3 endpoints ====================

    @PutMapping("/proposition/{demandeId}")
    public ResponseEntity<Response> updateProposition(
            @PathVariable(name = "demandeId") Long demandeId,
            @Valid @RequestBody PropositionDto dto,
            HttpServletRequest httpRequest)
    {

        var result = analyseService.updateProposition(demandeId, dto);
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("proposition", result),
                        "Proposition mise a jour", OK));
    }

    @GetMapping("/proposition/{demandeId}")
    public ResponseEntity<Response> getProposition(
            @PathVariable(name = "demandeId") Long demandeId,
            HttpServletRequest httpRequest)
    {

        var result = analyseService.getProposition(demandeId);
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("proposition", result),
                        "Proposition recuperee", OK));
    }

    @DeleteMapping("/proposition/{demandeId}")
    public ResponseEntity<Response> deleteProposition(
            @PathVariable(name = "demandeId") Long demandeId,
            HttpServletRequest httpRequest)
    {

        analyseService.deleteProposition(demandeId);
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("deleted", true),
                        "Proposition supprimee", OK));
    }

    // ==================== RATIOS - 2 endpoints ====================

    @PostMapping("/ratios/calculer/{analyseId}")
    public ResponseEntity<Response> calculateRatios(
            @PathVariable(name = "analyseId") Long analyseId,
            HttpServletRequest httpRequest)
    {

        var result = analyseService.calculateRatios(analyseId);
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("ratios", result),
                        "Ratios calcules avec succes", OK));
    }

    @GetMapping("/ratios/analyse/{analyseId}")
    public ResponseEntity<Response> getRatiosByAnalyse(
            @PathVariable Long analyseId,
            HttpServletRequest httpRequest) {

        var result = analyseService.getRatiosByAnalyse(analyseId);
        if (result == null) {
            return ResponseEntity.ok(
                    getResponse(httpRequest, java.util.Collections.emptyMap(),
                            "Ratios non encore calcules", OK));
        }
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("ratios", result),
                        "Ratios recuperes", OK));
    }

    // ==================== SYNTHESE - 2 endpoints ====================

    @GetMapping("/synthese/analyse/{analyseId}")
    public ResponseEntity<Response> getSyntheseByAnalyse(
            @PathVariable Long analyseId,
            HttpServletRequest httpRequest) {

        var result = analyseService.getSyntheseByAnalyse(analyseId);
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("synthese", result),
                        "Synthese recuperee", OK));
    }

    @GetMapping("/synthese/demande/{demandeId}")
    public ResponseEntity<Response> getSyntheseByDemande(
            Authentication authentication,
            @PathVariable Long demandeId,
            HttpServletRequest httpRequest) {

        var result = analyseService.getSyntheseByDemande(demandeId);
        var user = userClient.getUserByUuid(authentication.getName());
        var personnesCaution = analyseService.getPersonnesCautionByDemande(demandeId);
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("synthese", result, "user", user, "personnesCaution", personnesCaution),
                        "Synthese recuperee", OK));
    }

    // ==================== UTILITY - 3 endpoints ====================

    @GetMapping("/export/pdf/{analyseId}")
    public ResponseEntity<byte[]> exportPdf(
            @PathVariable Long analyseId) {

        byte[] pdf = analyseService.exportPdf(analyseId);
        return ResponseEntity.ok()
                .header("Content-Type", "application/pdf")
                .header("Content-Disposition", "attachment; filename=analyse_" + analyseId + ".pdf")
                .body(pdf);
    }

    @GetMapping("/parametres/cycles")
    public ResponseEntity<Response> getParametresCycles(HttpServletRequest httpRequest) {
        var result = analyseService.getParametresCycles();
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("cycles", result),
                        "Parametres cycles recuperes", OK));
    }

    @GetMapping("/parametres/normes")
    public ResponseEntity<Response> getNormesRatios(HttpServletRequest httpRequest) {
        var result = analyseService.getNormesRatios();
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("normes", result),
                        "Normes ratios recuperees", OK));
    }

    // ==================== SOUMISSION - 1 endpoint ====================

    @PostMapping("/analyse/soumettre")
    public ResponseEntity<Response> soumettreAnalyse(
            Authentication authentication,
            @Valid @RequestBody SoumissionRequest request,
            HttpServletRequest httpRequest) {

        var user = userClient.getUserByUuid(authentication.getName());
        String fullName = user.getFirstName() + " " + user.getLastName();

        var result = analyseService.soumettreAnalyse(request, user.getUsername(), fullName);

        if (result.getSucces()) {
            return ResponseEntity.ok(
                    getResponse(httpRequest, Map.of("soumission", result),
                            "Analyse soumise avec succes", OK));
        } else {
            return ResponseEntity.status(BAD_REQUEST).body(
                    getResponse(httpRequest, Map.of("soumission", result),
                            "Echec de la soumission: " + result.getNombreErreurs() + " erreur(s)", BAD_REQUEST));
        }
    }

    // ==================== AUTO-REMPLIR DEPUIS COLLECTE ====================

    @PostMapping("/analyse/{analyseId}/auto-remplir/{collecteId}")
    public ResponseEntity<Response> autoRemplirDepuisCollecte(
            @PathVariable Long analyseId,
            @PathVariable Long collecteId,
            HttpServletRequest httpRequest) {
        var result = analyseService.autoRemplirDepuisCollecte(analyseId, collecteId);
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("data", result),
                        "Donnees pre-remplies depuis la collecte", OK));
    }

    @GetMapping("/analyse/{analyseId}/alternatives/{collecteId}")
    public ResponseEntity<Response> getAlternatives(
            @PathVariable Long analyseId,
            @PathVariable Long collecteId,
            HttpServletRequest httpRequest) {
        var result = analyseService.getAlternatives(analyseId, collecteId);
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("alternatives", result),
                        "Alternatives CA et marge", OK));
    }
}
