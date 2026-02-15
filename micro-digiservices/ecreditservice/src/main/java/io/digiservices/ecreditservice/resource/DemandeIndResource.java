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
import io.digiservices.ecreditservice.exception.ValidationException;
import io.digiservices.ecreditservice.service.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.net.URI;
import java.util.*;

import static io.digiservices.ecreditservice.utils.RequestUtils.getResponse;
import static java.util.Collections.emptyMap;
import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.OK;
import static org.springframework.http.ResponseEntity.created;

@RestController
@RequestMapping("/ecredit")
@RequiredArgsConstructor
@Slf4j
public class DemandeIndResource {

    private final DemandeIndService demandeIndService;
    private final SelectionService selectionService;
    private final UserClient userClient;
    private final EbankingClient ebankingClient;
    private final DemandeCreditService demandeCreditService;
    private final AnalyseService analyseService;
    private final AnalyseFinanciereService analyseFinanciereService;


    /**
     * Valeurs autorisées pour la nature du client
     */
    private static final Set<String> VALID_NATURE_CLIENT = Set.of(
            "Demande de credit Pour Professionnels",
            "Demande de Credit Pour PME/PMI",
            "Demande credit Pour Particulier"
    );

    /**
     * Valeurs autorisées pour les types de garantie
     */
    private static final Set<String> VALID_TYPE_GARANTIE = Set.of(
            "Caution Solidaire",
            "Garantie Financiere",
            "Garantie Materielle",
            "Autre Garantie"
    );


    /**
     * Endpoint pour créer une nouvelle demande individuelle avec garanties
     * @param demandeIndividuel Objet contenant les données de la demande
     * @return ResponseEntity avec le résultat de l'opération
     */
    @PostMapping("/addDemandeInd")
    public ResponseEntity<Response> addDemandeIndWithGaranties(
            @Valid @RequestBody DemandeIndividuel demandeIndividuel) {

        try {
            // Validation de la nature du client
            validateNatureClient(demandeIndividuel);

            // Validation des types de garanties
            validateGaranties(demandeIndividuel.getGaranties());

            // Validation des nouveaux champs obligatoires selon la nature du client
            validateNewFields(demandeIndividuel);

            DemandeResponse result = demandeIndService.addDemandeIndWithGaranties(demandeIndividuel);

            Map<String, Object> data = Map.of(
                    "demandeId", result.getDemandeId(),
                    "message", result.getMessage(),
                    "success", result.isSuccess(),
                    "natureClient", demandeIndividuel.getNatureClient(),
                    "prefecture", demandeIndividuel.getPrefecture() != null ?
                            demandeIndividuel.getPrefecture() : "",
                    "sousPrefecture", demandeIndividuel.getSousPrefecture() != null ?
                            demandeIndividuel.getSousPrefecture() : ""
            );

            return ResponseEntity
                    .created(URI.create("/api/demandes/" + result.getDemandeId()))
                    .body(Response.builder()
                            .timeStamp(System.currentTimeMillis())
                            .data(data)
                            .message("Demande créée avec succès")
                            .status(CREATED)
                            .statusCode(CREATED.value())
                            .build());

        } catch (ValidationException e) {
            log.error("Erreur de validation: ", e);
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Response.builder()
                            .timeStamp(System.currentTimeMillis())
                            .message("Erreur de validation: " + e.getMessage())
                            .status(HttpStatus.BAD_REQUEST)
                            .statusCode(HttpStatus.BAD_REQUEST.value())
                            .build());
        } catch (Exception e) {
            log.error("Erreur lors de la création de la demande: ", e);
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Response.builder()
                            .timeStamp(System.currentTimeMillis())
                            .message("Erreur: " + e.getMessage())
                            .status(HttpStatus.BAD_REQUEST)
                            .statusCode(HttpStatus.BAD_REQUEST.value())
                            .build());
        }
    }

    /**
     * Valide la nature du client
     * @param demande La demande à valider
     * @throws ValidationException Si la nature du client n'est pas valide
     */
    private void validateNatureClient(DemandeIndividuel demande) {
        String natureClient = demande.getNatureClient();

        if (natureClient == null || natureClient.isBlank()) {
            // Valeur par défaut si non spécifiée
            demande.setNatureClient("Demande credit Pour Particulier");
            return;
        }

        if (!VALID_NATURE_CLIENT.contains(natureClient)) {
            throw new ValidationException(
                    "Nature de client invalide: '" + natureClient + "'. " +
                            "Valeurs autorisées: " + String.join(", ", VALID_NATURE_CLIENT)
            );
        }

        // Validation spécifique pour PME/PMI - le nom de la personne morale est obligatoire
        if ("Demande de Credit Pour PME/PMI".equals(natureClient)) {
            if (demande.getNomPersonneMorale() == null || demande.getNomPersonneMorale().isBlank()) {
                throw new ValidationException(
                        "Le nom de l'entreprise est obligatoire pour une demande PME/PMI"
                );
            }
        }
    }

    /**
     * Valide les garanties proposées
     * @param garanties Liste des garanties à valider
     * @throws ValidationException Si une garantie a un type invalide
     */
    private void validateGaranties(List<GarantiePropose> garanties) {
        if (garanties == null || garanties.isEmpty()) {
            throw new ValidationException("Au moins une garantie est obligatoire");
        }

        for (int i = 0; i < garanties.size(); i++) {
            GarantiePropose garantie = garanties.get(i);

            if (garantie.getTypeGarantie() == null || garantie.getTypeGarantie().isBlank()) {
                throw new ValidationException(
                        "Le type de garantie est obligatoire pour la garantie #" + (i + 1)
                );
            }

            if (!VALID_TYPE_GARANTIE.contains(garantie.getTypeGarantie())) {
                throw new ValidationException(
                        "Type de garantie invalide pour la garantie #" + (i + 1) + ": '" +
                                garantie.getTypeGarantie() + "'. " +
                                "Valeurs autorisées: " + String.join(", ", VALID_TYPE_GARANTIE)
                );
            }

            if (garantie.getDescriptionGarantie() == null || garantie.getDescriptionGarantie().isBlank()) {
                throw new ValidationException(
                        "La description est obligatoire pour la garantie #" + (i + 1)
                );
            }

            if (garantie.getValeurGarantie() == null ||
                    garantie.getValeurGarantie().compareTo(java.math.BigDecimal.ZERO) <= 0) {
                throw new ValidationException(
                        "La valeur de la garantie #" + (i + 1) + " doit être supérieure à 0"
                );
            }
        }
    }

    /**
     * Valide les nouveaux champs ajoutés
     * @param demande La demande à valider
     * @throws ValidationException Si un champ obligatoire est manquant
     */
    private void validateNewFields(DemandeIndividuel demande) {
        // La préfecture et sous-préfecture sont optionnelles mais si fournies,
        // elles doivent avoir une longueur raisonnable
        if (demande.getPrefecture() != null && demande.getPrefecture().length() > 255) {
            throw new ValidationException("La préfecture ne doit pas dépasser 255 caractères");
        }

        if (demande.getSousPrefecture() != null && demande.getSousPrefecture().length() > 255) {
            throw new ValidationException("La sous-préfecture ne doit pas dépasser 255 caractères");
        }

        // Validation du surnom (sernom) si fourni
        if (demande.getSernom() != null && demande.getSernom().length() > 255) {
            throw new ValidationException("Le surnom ne doit pas dépasser 255 caractères");
        }

        // Validation de la catégorie si fournie
        if (demande.getCategorie() != null && demande.getCategorie().length() > 100) {
            throw new ValidationException("La catégorie ne doit pas dépasser 100 caractères");
        }

        // Validation des noms de famille
        if (demande.getNomPere() != null && demande.getNomPere().length() > 255) {
            throw new ValidationException("Le nom du père ne doit pas dépasser 255 caractères");
        }

        if (demande.getNomMere() != null && demande.getNomMere().length() > 255) {
            throw new ValidationException("Le nom de la mère ne doit pas dépasser 255 caractères");
        }

        if (demande.getNomConjoint() != null && demande.getNomConjoint().length() > 255) {
            throw new ValidationException("Le nom du conjoint ne doit pas dépasser 255 caractères");
        }

        // Validation de la nature d'activité si fournie
        if (demande.getNatureActivite() != null && demande.getNatureActivite().length() > 255) {
            throw new ValidationException("La nature de l'activité ne doit pas dépasser 255 caractères");
        }
    }

    @GetMapping("/{demandeId}")
    public ResponseEntity<Response> getDemandeWithGaranties(@NotNull Authentication authentication,
                                                            @PathVariable(name = "demandeId") Long demandeId)
    {
        try {
            DemandeIndividuel demandeIndividuel = demandeIndService.getDemandeWithGaranties(demandeId);
            //get Instance user connected
            User user = userClient.getUserByUuid(authentication.getName());

            // check if demandeid existe in demande_credit
            DemandeCredit demande_credit = demandeCreditService.getDemandeCreditByDemandeInd(demandeIndividuel.getDemandeIndividuelId());

            //Get Information Dossier by demandeIndividuelId
            DossierCreditDto dossierCredit = analyseService.getDossierByDemandeIndividuelId(demandeId);

            // Get Analyse Financiere status
            AnalyseFinanciereDto analyseFinanciere = null;
            try {
                analyseFinanciere = analyseFinanciereService.getAnalyseByDemandeId(demandeId);
            } catch (Exception e) {
                log.debug("Aucune analyse financiere trouvée pour la demande {}", demandeId);
            }

            // Calculer la somme des valeurEmprunte des garanties pour R.6
            BigDecimal totalValeurEmprunte = BigDecimal.ZERO;
            if (demandeIndividuel.getGaranties() != null) {
                totalValeurEmprunte = demandeIndividuel.getGaranties().stream()
                        .map(g -> g.getValeurEmprunte() != null ? g.getValeurEmprunte() : BigDecimal.ZERO)
                        .reduce(BigDecimal.ZERO, BigDecimal::add);
            }

            // Créer la réponse avec ou sans demandeCredit
            Map<String, Object> responseData = new HashMap<>();
            responseData.put("demandeIndividuel", demandeIndividuel);
            responseData.put("user", user);
            responseData.put("totalValeurEmprunte", totalValeurEmprunte);

            if (demande_credit != null) {
                responseData.put("demande_credit", demande_credit);
                responseData.put("hasDemandeCredit", true);
            } else {
                responseData.put("demande_credit", null);
                responseData.put("hasDemandeCredit", false);
            }

            if (dossierCredit != null) {
                responseData.put("dossierCredit", dossierCredit);
                responseData.put("hasDossierCredit", true);
            } else {
                responseData.put("dossierCredit", null);
                responseData.put("hasDossierCredit", false);
            }

            // Ajouter les informations de l'analyse financière
            if (analyseFinanciere != null) {
                responseData.put("analyseFinanciere", analyseFinanciere);
                responseData.put("hasAnalyseFinanciere", true);
                responseData.put("analyseStatut", analyseFinanciere.getStatut());
            } else {
                responseData.put("analyseFinanciere", null);
                responseData.put("hasAnalyseFinanciere", false);
                responseData.put("analyseStatut", null);
            }

            return ResponseEntity.ok(
                    Response.builder()
                            .timeStamp(System.currentTimeMillis())
                            .data(responseData)
                            .message(demande_credit != null ?
                                    "Demande récupérée avec succès" :
                                    "Demande récupérée avec succès (pas encore de demande de crédit associée)")
                            .status(OK)
                            .statusCode(OK.value())
                            .build()
            );
        } catch (Exception e) {
            log.error("Erreur lors de la récupération de la demande: ", e);
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Response.builder()
                            .timeStamp(System.currentTimeMillis())
                            .message("Erreur interne du serveur")
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .build());
        }
    }

    @GetMapping("/attente")
    public ResponseEntity<Response> listDemandAttente(@NotNull Authentication authentication,
                                                      HttpServletRequest request)
    {
        log.info("🔍 Endpoint /attente appelé avec authentication: {}", authentication.getName());

        User user = userClient.getUserByUuid(authentication.getName());

        // AJOUT : Log de debug
        log.info("✅ User récupéré: {} avec rôle: {}", user != null ? user.getUsername() : "NULL",
                user != null ? user.getRole() : "NULL");

        if (user == null) {
            log.error("❌ User not found pour UUID: {}", authentication.getName());
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
        return created(getUri()).body(getResponse(request,
                                          Map.of("demandeAttentes",demandeIndService.getListDemandeCreditByDate(userClient.getUserByUuid(authentication.getName()).getPointventeId())), "Liste des demandes en attente", OK));
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
                        "agence",userClient.getAgenceById(userClient.getUserByUuid(authentication.getName()).getAgenceId())
                ),
                "Liste des Credits Pour la Mise en Place", OK));
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

    /**
     * Récupérer toutes les demandes avec garanties (sans pagination)
     * To activate Database migration
     */
    @GetMapping("/all-with-garanties")
    public ResponseEntity<Response> getAllDemandesWithGaranties(
            @RequestParam(name = "agenceId", required = false) Long agenceId,
            @RequestParam(name = "pointVenteId", required = false) Long pointVenteId)
    {
        try {
            List<DemandeIndividuel> demandes = demandeIndService.getAllDemandesWithGaranties(agenceId, pointVenteId);

            return ResponseEntity.ok(
                    Response.builder()
                            .timeStamp(System.currentTimeMillis())
                            .data(Map.of(
                                    "demandes", demandes,
                                    "count", demandes.size()
                            ))
                            .message(String.format("Récupération de %d demandes avec succès", demandes.size()))
                            .status(OK)
                            .statusCode(OK.value())
                            .build()
            );
        } catch (ApiException e) {
            log.error("Erreur de validation: ", e);
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Response.builder()
                            .timeStamp(System.currentTimeMillis())
                            .message(e.getMessage())
                            .status(HttpStatus.BAD_REQUEST)
                            .statusCode(HttpStatus.BAD_REQUEST.value())
                            .build());
        } catch (Exception e) {
            log.error("Erreur lors de la récupération des demandes: ", e);
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Response.builder()
                            .timeStamp(System.currentTimeMillis())
                            .message("Erreur lors de la récupération des demandes")
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .build());
        }
    }

    @PatchMapping("/update/{demandeindividuel_id}")
    public ResponseEntity<Response> rejetDemandeCredit(@NotNull Authentication authentication,
                                                     @PathVariable(name = "demandeindividuel_id") Long demandeindividuel_id,
                                                     HttpServletRequest request) {
        demandeIndService.rejetDemandeInd(demandeindividuel_id);
        return created(getUri()).body(getResponse(request, emptyMap(), "Mise à jour effectué avec Success", OK));
    }

    /**
     * Liste des credits par delegations
     */
    @GetMapping("/listCreditParDelegation")
    public ResponseEntity<Response> listCreditParDelegation(@NotNull Authentication authentication,
                                                            HttpServletRequest request) {
        return created(getUri()).body(getResponse(request, Map.of(
                        "listCreditParDelegation", demandeIndService.listCreditParDelegation()
                ),
                "Liste des Credits Par Délégation", OK));
    }

    @PutMapping("/updateDemandeComplete/{demandeId}")
    public ResponseEntity<Response> updateDemandeComplete(
            @NotNull Authentication authentication,
            @PathVariable(name = "demandeId") Long demandeId,
            @Valid @RequestBody DemandeIndividuel demandeIndividuel,
            HttpServletRequest request) {
        try {
            demandeIndividuel.setDemandeIndividuelId(demandeId);

            // Valider les garanties si fournies
            if (demandeIndividuel.getGaranties() != null && !demandeIndividuel.getGaranties().isEmpty()) {
                validateGaranties(demandeIndividuel.getGaranties());
            }

            demandeIndService.updateDemandeComplete(demandeIndividuel);

            // Retourner la demande mise a jour
            DemandeIndividuel updated = demandeIndService.getDemandeWithGaranties(demandeId);

            return ResponseEntity.ok(
                    Response.builder()
                            .timeStamp(System.currentTimeMillis())
                            .data(Map.of("demandeIndividuel", updated))
                            .message("Demande mise a jour avec succes")
                            .status(OK)
                            .statusCode(OK.value())
                            .build()
            );
        } catch (ApiException e) {
            log.error("Erreur: {}", e.getMessage());
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Response.builder()
                            .timeStamp(System.currentTimeMillis())
                            .message(e.getMessage())
                            .status(HttpStatus.BAD_REQUEST)
                            .statusCode(HttpStatus.BAD_REQUEST.value())
                            .build());
        } catch (Exception e) {
            log.error("Erreur lors de la mise a jour de la demande: ", e);
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Response.builder()
                            .timeStamp(System.currentTimeMillis())
                            .message("Erreur lors de la mise a jour: " + e.getMessage())
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .build());
        }
    }

    @GetMapping("/doukoure/test")
    public ResponseEntity<Response> doukoureTest(@NotNull Authentication authentication,HttpServletRequest request) {
        return created(getUri()).body(getResponse(request, emptyMap(), "this is the test for doukoure salifou", OK));
    }



    private URI getUri() {
        return URI.create("/demandeInd");
    }
}
