package io.digiservices.ecreditservice.resource;

import io.digiservices.ecreditservice.domain.Response;
import io.digiservices.ecreditservice.dto.BilanEntreprise;
import io.digiservices.ecreditservice.dto.DemandeIndividuel;
import io.digiservices.ecreditservice.service.BilanEntrepriseService;
import io.digiservices.ecreditservice.service.DemandeIndService;
import io.digiservices.ecreditservice.service.SelectionService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.Collections;
import java.util.Map;

import static io.digiservices.ecreditservice.utils.RequestUtils.getResponse;
import static java.util.Collections.emptyMap;
import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.OK;
import static org.springframework.http.ResponseEntity.created;

@RestController
@RequestMapping("/ecredit")
@RequiredArgsConstructor
public class DemandeIndResource {

    private final DemandeIndService demandeIndService;
    private final SelectionService selectionService;

    @PostMapping("/addDemandeInd")
    public ResponseEntity<Response> addDemandeInd(@RequestBody DemandeIndividuel demandeIndividuel, HttpServletRequest request) {
        demandeIndService.addDemandeInd(demandeIndividuel);
        return created(getUri()).body(getResponse(request, emptyMap(), "DemandeInd Created Successfully", CREATED));
    }

    @GetMapping("/attente/{pointventeId}")
    public ResponseEntity<Response> listDemandAttente(@NotNull Authentication authentication,
                                                      @PathVariable(name = "pointventeId") Long pointventeId,
                                                      HttpServletRequest request) {
        return created(getUri()).body(getResponse(request,Map.of("demandeAttentes",demandeIndService.getListDemandeAttente(pointventeId)), "Liste de demande en attente", OK));
    }

    @GetMapping("/detail/{demandeIndividuel_id}")
    public ResponseEntity<Response> getDetailDemandeInd(@NotNull Authentication authentication,
                                                      @PathVariable(name = "demandeIndividuel_id") Long demandeIndividuel_id,
                                                      HttpServletRequest request) {
        DemandeIndividuel demandeIndividuel = demandeIndService.getDetailDemandeIndividuel(demandeIndividuel_id);
        var message = "";
        if(demandeIndividuel.getStatutDemande().equals("EN_ATTENTE") && demandeIndividuel.getValidationState().equals("SELECTION")){
            message = "Demande encours de Selection par l'agent";
        }else{
            message = "Nouvelle Demande";
        }
        return created(getUri()).body(getResponse(request,Map.of("demandeIndividuel",demandeIndividuel), message, OK));
    }

    @GetMapping("/selection/{pointventeId}")
    public ResponseEntity<Response> listeDemandeCreditSelection(@NotNull Authentication authentication,
                                                      @PathVariable(name = "pointventeId") Long pointventeId,
                                                      HttpServletRequest request) {
        return created(getUri()).body(getResponse(request,Map.of("demandeAttentes",demandeIndService.getListDemandeCreditByDate(pointventeId)), "Liste de demande en attente", OK));
    }

    @PatchMapping("/update/{statut}/{codUsuarios}/{demandeindividuel_id}")
    public ResponseEntity<Response> updateDemandeInd(@NotNull Authentication authentication,
                                                     @PathVariable(name = "statut") String statut,
                                                     @PathVariable(name = "codUsuarios") String codUsuarios,
                                                     @PathVariable(name = "demandeindividuel_id") Long demandeindividuel_id,
                                                     HttpServletRequest request) {
        demandeIndService.updateStatutDemandeInd(demandeindividuel_id,statut,codUsuarios);
        return created(getUri()).body(getResponse(request, emptyMap(), "Mise à jour effectué avec Success", OK));
    }




    private URI getUri() {
        return URI.create("/demandeInd");
    }
}
