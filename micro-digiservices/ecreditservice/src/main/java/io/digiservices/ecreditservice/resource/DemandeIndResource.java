package io.digiservices.ecreditservice.resource;

import io.digiservices.clients.EbankingClient;
import io.digiservices.clients.UserClient;
import io.digiservices.clients.domain.CreditRequest;
import io.digiservices.clients.domain.CreditoDTO;
import io.digiservices.clients.domain.CreditosDto;
import io.digiservices.clients.domain.User;
import io.digiservices.ecreditservice.domain.Response;
import io.digiservices.ecreditservice.dto.*;
import io.digiservices.ecreditservice.exception.ApiException;
import io.digiservices.ecreditservice.service.BilanEntrepriseService;
import io.digiservices.ecreditservice.service.DemandeCreditService;
import io.digiservices.ecreditservice.service.DemandeIndService;
import io.digiservices.ecreditservice.service.SelectionService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.modelmapper.internal.bytebuddy.pool.TypePool;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.net.URI;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
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
    private final UserClient userClient;
    private final EbankingClient ebankingClient;
    private final DemandeCreditService demandeCreditService;

    @PostMapping("/addDemandeInd")
    public ResponseEntity<Response> addDemandeInd(@RequestBody DemandeIndividuel demandeIndividuel, HttpServletRequest request) {
        demandeIndService.addDemandeInd(demandeIndividuel);
        return created(getUri()).body(getResponse(request, emptyMap(), "DemandeInd Created Successfully", CREATED));
    }


    @GetMapping("/attente")
    public ResponseEntity<Response> listDemandAttente(@NotNull Authentication authentication,
                                                      HttpServletRequest request) {

        User user = userClient.getUserByUuid(authentication.getName());

        if (user == null) {
            throw new ApiException("User not found");
        }

        Map<String, Object> responseData = new HashMap<>();

        // Role-based logic
        if ("DA".equals(user.getRole())) {
            // DA gets all demands from their agency
            responseData.put("demandeAttentes",
                    demandeIndService.getListDemandeAttente(null, user.getAgenceId()));
            responseData.put("creditDtos", Collections.emptyList());
            responseData.put("pointVente", null);
        } else {
            // Regular user gets demands from their point de vente
            responseData.put("demandeAttentes",
                    demandeIndService.getListDemandeAttente(user.getPointventeId(), user.getAgenceId()));
            responseData.put("nombreDemandeInd",
                    demandeIndService.countNombreCreditAttente(user.getPointventeId()));
            responseData.put("creditDtos",
                    demandeIndService.getListCreditByPos(user.getPointventeId()));
            responseData.put("pointVente",
                    user.getPointventeId() != null ?
                            userClient.getPointVenteClient(user.getPointventeId()) : null);
        }

        // Common for both roles
        responseData.put("agence",
                user.getAgenceId() != null ?
                        userClient.getAgenceById(user.getAgenceId()) : null);

        return created(getUri()).body(getResponse(request, responseData,
                "Liste des demandes en attente", OK));
    }


    @GetMapping("/detail/{demandeIndividuel_id}")
    public ResponseEntity<Response> getDetailDemandeInd(@NotNull Authentication authentication,
                                                      @PathVariable(name = "demandeIndividuel_id") Long demandeIndividuel_id,
                                                      HttpServletRequest request) {
        DemandeIndividuel demandeIndividuel = demandeIndService.getDetailDemandeIndividuel(demandeIndividuel_id);
        var message = "";
        if(demandeIndividuel.getStatutDemande().equals("EN_ATTENTE") && demandeIndividuel.getValidationState().equals("SELECTION")){
            message = "Demande encours de Selection par l'agent";
        }if(demandeIndividuel.getStatutDemande().equals("EN_ATTENTE") && demandeIndividuel.getValidationState().equals("APPROVED")){
            message = "Demande approvée pour la selection par l'agent de Crédit";
        }else{
            message = "Nouvelle Demande";
        }
        return created(getUri()).body(getResponse(request,Map.of(
                "demandeIndividuel",demandeIndividuel,
                "documents",selectionService.getAllImages(demandeIndividuel_id),
                "pointVente",userClient.getPointVenteClient(Long.valueOf(demandeIndividuel.getPos()))
                ), message, OK));
    }

    @GetMapping("/selection")
    public ResponseEntity<Response> listeDemandeCreditSelection(@NotNull Authentication authentication,
                                                      HttpServletRequest request) {
        return created(getUri()).body(getResponse(request,Map.of("demandeAttentes",demandeIndService.getListDemandeCreditByDate(userClient.getUserByUuid(authentication.getName()).getPointventeId())), "Liste des demandes en attente", OK));
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

    @GetMapping("/existNumeroMembre/{numeroMembre}")
    public ResponseEntity<Response> listeDemandeCreditSelection(@NotNull Authentication authentication,
                                                                @PathVariable(name = "numeroMembre") String numeroMembre,
                                                                HttpServletRequest request) {
        return created(getUri()).body(getResponse(request,Map.of("existMembre",demandeIndService.existMembre(numeroMembre)), "Numero Membre existe", OK));
    }

    @GetMapping("/lastDemandeInd/{numeroMembre}")
    public ResponseEntity<Response> lastDemandeByNumeroMembre(@NotNull Authentication authentication,
                                                              @PathVariable(name = "numeroMembre") String numeroMembre,
                                                      HttpServletRequest request)
    {
        return created(getUri()).body(getResponse(request,Map.of("demandeIndividuel",demandeIndService.getLastDemandeInd(numeroMembre),"user",userClient.getUserByUuid(authentication.getName())), "Information detaillée de la demande de Crédit", OK));
    }


    @PostMapping("/startCredit/{numeroMembre}")
    public ResponseEntity<Response> startCredit(@NotNull Authentication authentication,
                                                  @PathVariable(name = "numeroMembre") String numeroMembre,HttpServletRequest request)
    {
        demandeIndService.addNewCredit(numeroMembre,userClient.getUserByUuid(authentication.getName()).getUserId());
        return created(getUri()).body(getResponse(request, emptyMap(), "Nouvelle mise en place de credit", CREATED));
    }


    @GetMapping("/listCredit")
    public ResponseEntity<Response> ListCreditAttente(@NotNull Authentication authentication,
                                                      HttpServletRequest request) {

        return created(getUri()).body(getResponse(request,Map.of(
                         "demandeAnalyseCredits",demandeIndService.listDemandeAnalyseCreditByUserId(),
                         "creditDtos",demandeIndService.getListCreditAttente(userClient.getUserByUuid(authentication.getName()).getAgenceId()),
                        "agence",userClient.getAgenceById(userClient.getUserByUuid(authentication.getName()).getAgenceId())), "Liste des Credits Pour la Mise en Place", OK));
    }

    @GetMapping("/viewCredit/{referenceCredit}/{numeroMembre}/{userId}")
    public ResponseEntity<Response> viewInstanceCredit(@NotNull Authentication authentication,
                                                      @PathVariable(name = "referenceCredit") String referenceCredit,
                                                      @PathVariable(name = "numeroMembre") String numeroMembre,
                                                       @PathVariable(name = "userId") Long userId,
                                                      HttpServletRequest request)
    {
        return created(getUri()).body(getResponse(request,Map.of("instanceCreditInd",
                demandeIndService.getInstanceCredit(referenceCredit),
//                        "membre",ebankingClient.getClientes(numeroMembre),
                        "products",
                demandeIndService.getListProductByRef(referenceCredit),"charges",
                demandeIndService.getListChargeByRef(referenceCredit),"garantieCaution",
                demandeIndService.getListGarantiePersonneCautionByRef(referenceCredit),"user",
                userClient.getUserById(userId),
                        "noteProfile",
                demandeIndService.getLastNoteProfile(referenceCredit), "noteAnalyse",
                        demandeIndService.getLastNoteAnalyse(referenceCredit), "noteGarantie",
                demandeIndService.getLasteGarantie(referenceCredit),
                        "membre", ebankingClient.getClientes(numeroMembre),
                "creditDto", demandeIndService.getCreditByReference(referenceCredit)
                ),
                "Voir Information detaillée du credit", OK));
    }


    @PostMapping("/addNoteProfile/{referenceCredit}")
    public ResponseEntity<Response> noteProfile(@NotNull Authentication authentication,
                                                @RequestBody NoteProfile noteProfile,
                                                @PathVariable(name = "referenceCredit") String referenceCredit,
                                                HttpServletRequest request)
    {
        demandeIndService.addNoteProfile(referenceCredit,noteProfile);
        return created(getUri()).body(getResponse(request,Map.of("noteProfile",
                demandeIndService.getLastNoteProfile(referenceCredit), "noteAnalyse",
                demandeIndService.getLastNoteAnalyse(referenceCredit), "noteGarantie",
                demandeIndService.getLasteGarantie(referenceCredit)), "Note profil Successful", CREATED));
    }

    @PostMapping("/addNoteAnalyse/{referenceCredit}")
    public ResponseEntity<Response> noteAnalyse(@NotNull Authentication authentication,
                                                @RequestBody NoteAnalyse noteAnalyse,
                                                @PathVariable(name = "referenceCredit") String referenceCredit,
                                                HttpServletRequest request)
    {
        demandeIndService.addNoteAnalyse(referenceCredit,noteAnalyse);
        return created(getUri()).body(getResponse(request,Map.of("noteProfile",
                demandeIndService.getLastNoteProfile(referenceCredit), "noteAnalyse",
                demandeIndService.getLastNoteAnalyse(referenceCredit), "noteGarantie",
                demandeIndService.getLasteGarantie(referenceCredit)), "Note Analyse Successful", CREATED));
    }

    @PostMapping("/addNoteGarantie/{referenceCredit}")
    public ResponseEntity<Response> noteGarantie(@NotNull Authentication authentication,
                                                @RequestBody NoteGarantie noteGarantie,
                                                @PathVariable(name = "referenceCredit") String referenceCredit,
                                                HttpServletRequest request)
    {
        demandeIndService.addNoteGarantie(referenceCredit,noteGarantie);
        return created(getUri()).body(getResponse(request,Map.of("noteProfile",
                demandeIndService.getLastNoteProfile(referenceCredit), "noteAnalyse",
                demandeIndService.getLastNoteAnalyse(referenceCredit), "noteGarantie",
                demandeIndService.getLasteGarantie(referenceCredit)), "Note Garantie Successful", CREATED));
    }

    /**
     *  Cette action est execute par le DA
     * @param authentication
     * @param threshold
     * @param appreciation
     * @param request
     * @return
     */
    @PostMapping("/calculate/{threshold}")
    public ResponseEntity<Response> calculate_notes_and_update_credit(@NotNull Authentication authentication,
                                                                      @PathVariable(name = "threshold")BigDecimal threshold,
                                                                      @RequestBody Appreciation appreciation,
                                                                      HttpServletRequest request)
    {
        return created(getUri()).body(getResponse(request,Map.of("resultNote",demandeIndService.calculate_notes_and_update_credit(threshold,appreciation)),"Calcul effectué avec success", OK));
    }


    @GetMapping("/viewDetailCredit/{referenceCredit}/{numeroMembre}")
    public ResponseEntity<Response> viewInformationCreditAfterNotation(@NotNull Authentication authentication,
                                                                       @PathVariable(name = "referenceCredit") String referenceCredit,
                                                                       @PathVariable(name = "numeroMembre") String numeroMembre,

                                                                       HttpServletRequest request)
    {
        User user =userClient.getUserById(userClient.getUserByUuid(authentication.getName()).getUserId());
        return created(getUri()).body(getResponse(request, Map.ofEntries(
                        Map.entry("instanceCreditInd", demandeIndService.getInstanceCredit(referenceCredit)),
                        Map.entry("membre", ebankingClient.getClientes(numeroMembre)),
                        Map.entry("products", demandeIndService.getListProductByRef(referenceCredit)),
                        Map.entry("charges", demandeIndService.getListChargeByRef(referenceCredit)),
                        Map.entry("garantieCaution", demandeIndService.getListGarantiePersonneCautionByRef(referenceCredit)),
                        Map.entry("user", user),
                        Map.entry("noteProfile", demandeIndService.getLastNoteProfile(referenceCredit)),
                        Map.entry("noteAnalyse", demandeIndService.getLastNoteAnalyse(referenceCredit)),
                        Map.entry("noteGarantie", demandeIndService.getLasteGarantie(referenceCredit)),
                        Map.entry("appreciation", demandeIndService.getAppreciation(referenceCredit)),

                        Map.entry("terms", ebankingClient.getAllTypePlazo()),
                        Map.entry("pointVente",user.getPointventeId()),
                        Map.entry("cumulCredit",ebankingClient.getCumulCreditoByCodClientes(numeroMembre)),
                        Map.entry("countCredit",ebankingClient.getNombreCreditByClientes(numeroMembre)),
                        Map.entry("inversions",ebankingClient.getAllInversion()),
                        Map.entry("actividas",ebankingClient.getAllActivida()),
                        Map.entry("sousActividas",ebankingClient.getAllSousActivite()),
                        Map.entry("sousSousActividas",ebankingClient.getAllSousSousActivite()),
                        Map.entry("requisitos",ebankingClient.getAllRequisito()),
                        Map.entry("originFonds",ebankingClient.getAllOrigineFond())

                ),
                "Voir Information detaillée du credit", OK));
    }

    @GetMapping("/startInsertingCredit/{referenceCredit}/{numeroMembre}/{userId}")
    public ResponseEntity<Response> startInsertingCredit(@NotNull Authentication authentication,
                                                         @PathVariable(name = "referenceCredit") String referenceCredit,
                                                         @PathVariable(name = "numeroMembre") String numeroMembre,
                                                         @PathVariable(name = "userId") Long userId,
                                                         HttpServletRequest request) {

        BigDecimal cumulCredit = BigDecimal.ZERO;
        Long countCredit = 0L;

        User user = userClient.getUserById(userId);
        CreditDto infoNewCredito = demandeIndService.getNewCreditByReference(referenceCredit);

        List<CreditosDto> listCreditos = ebankingClient.getAllCreditosByCodCliente(numeroMembre);

        if (listCreditos.isEmpty()) {
            cumulCredit = BigDecimal.ZERO;
            countCredit = 0L;
        } else {
            // Calculate cumulative credit amount (sum of all monCredito)
            cumulCredit = listCreditos.stream()
                    .filter(credito -> credito.getMonCredito() != null)
                    .map(CreditosDto::getMonCredito)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            // Count of credits
            countCredit = (long) listCreditos.size();

        }

        return created(getUri()).body(getResponse(request, Map.ofEntries(
                        Map.entry("membre", ebankingClient.getClientes(numeroMembre)),
                        Map.entry("user", user),
                        Map.entry("terms", ebankingClient.getAllTypePlazo()),
                        Map.entry("pointVente", user.getPointventeId()),
                        Map.entry("cumulCredit", cumulCredit),
                        Map.entry("countCredit", countCredit),
                        Map.entry("inversions", ebankingClient.getAllInversion()),
                        Map.entry("actividas", ebankingClient.getAllActivida()),
                        Map.entry("sousActividas", ebankingClient.getAllSousActivite()),
                        Map.entry("sousSousActividas", ebankingClient.getAllSousSousActivite()),
                        Map.entry("requisitos", ebankingClient.getAllRequisito()),
                        Map.entry("originFonds", ebankingClient.getAllOrigineFond()),
                        Map.entry("typeCredito", ebankingClient.getTypeCredito("00000", Long.valueOf(infoNewCredito.getTypeCredit()))),
                        Map.entry("creditDto", infoNewCredito)
                ),
                "Validation de la mise en place dans saf", OK));
    }


    @PatchMapping("/updateStateCredit/{referenceCredit}")
    public ResponseEntity<Response> updateInfoCredfit(@NotNull Authentication authentication,
                                                                      @PathVariable(name = "referenceCredit") String referenceCredit,
                                                                      HttpServletRequest request)
    {
        demandeIndService.updateStateCredit(referenceCredit);
        return created(getUri()).body(getResponse(request,emptyMap(),"Mise à jour Effectuée avec Success", OK));
    }

    @PostMapping("/processInsertingCredit/{referenceCredit}")
    public ResponseEntity<Response> processInsertingCredit(@NotNull Authentication authentication,
                                                           @PathVariable(name = "referenceCredit") String referenceCredit,
                                                           @RequestBody CreditRequest creditRequest,
                                                      HttpServletRequest request)
    {
        demandeIndService.updateStateCredit(referenceCredit);
        return created(getUri()).body(getResponse(request,Map.of("creditResponse",ebankingClient.createCredit(creditRequest)),"Mise à jour Effectuée avec Success", OK));
    }

    @GetMapping("/search")
    public ResponseEntity<Response> searchClientes(@RequestParam(name = "query") String query,
                                                      HttpServletRequest request)
    {
        return created(getUri()).body(getResponse(request,Map.of(
                "clientes",ebankingClient.searchClientes(query)), "Membre Trouvé", OK));
    }

    /**
     *  Get all delegation, all agence , all pointeVente, And all Type de credits
     * @param request
     * @return
     */

    @GetMapping("/newDemandeInd")
    public ResponseEntity<Response> newDemandeInd(HttpServletRequest request)
    {
        return created(getUri()).body(getResponse(request,Map.of(
                     "delegations",userClient.getAllDelegationOffLine(),
                     "agences",userClient.allAgenceOfLine(),
                        "pointVentes",userClient.pointVenteOffline()),

                "Nouvelle demande de credit", OK));
    }

    @GetMapping("/listPointVenteByAgence/{agenceId}")
    public ResponseEntity<Response> listPointVenteByAgence(@NotNull Authentication authentication,
                                                           @PathVariable(name = "agenceId") Long agenceId,
                                                           HttpServletRequest request)
    {
        return created(getUri()).body(getResponse(request,Map.of(
                        "pointVentes",userClient.getAllPointVentes(agenceId)),
                "Liste des Point de Vente", OK));
    }

    @GetMapping("/getListUsuariosByCodAgencia/{codAgencia}/{codPuesto}/{indActivo}")
    public ResponseEntity<Response> listPointVenteByAgence(@NotNull Authentication authentication,
                                                           @PathVariable(value="codAgencia") String codAgencia,
                                                           @PathVariable(value = "codPuesto") String codPuesto,
                                                           @PathVariable(value = "indActivo") String indActivo,
                                                           HttpServletRequest request)
    {
        return created(getUri()).body(getResponse(request,Map.of(
                        "usuarios",ebankingClient.getListUsuariosByCodAgenciaOffLine(codAgencia,codPuesto,indActivo)),
                "Liste des usager actifs dans saf", OK));
    }

    @GetMapping("/testMigration")
    public ResponseEntity<Response> test(@NotNull Authentication authentication,
                                                           HttpServletRequest request)
    {
        return created(getUri()).body(getResponse(request,emptyMap(),
                "This is a test for migration and add Moumine", OK));
    }

    private URI getUri() {
        return URI.create("/demandeInd");
    }
}
