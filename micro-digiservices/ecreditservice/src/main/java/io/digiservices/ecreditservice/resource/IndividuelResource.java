package io.digiservices.ecreditservice.resource;

import io.digiservices.clients.EbankingClient;
import io.digiservices.clients.UserClient;
import io.digiservices.ecreditservice.domain.Response;
import io.digiservices.ecreditservice.dto.*;
import io.digiservices.ecreditservice.exception.ApiException;
import io.digiservices.ecreditservice.service.DemandeIndService;
import io.digiservices.ecreditservice.service.IndividuelService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.net.URI;
import java.util.List;
import java.util.Map;

import static io.digiservices.ecreditservice.utils.RequestUtils.getResponse;
import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.OK;
import static org.springframework.http.ResponseEntity.*;

@RestController
@AllArgsConstructor
@RequestMapping("/ecredit")
public class IndividuelResource {

    private final IndividuelService individuelService;
    private final EbankingClient ebankingClient;

    private final UserClient userClient;
    private final DemandeIndService demandeIndService;

    @PostMapping("/addIndividuel/{numeroMembre}")
    public ResponseEntity<Response> addIndividuel(@NotNull Authentication authentication,
                                                  @RequestBody IndividuelDto individuelDto,
                                                  @PathVariable(name = "numeroMembre") String numeroMembre,
                                                  HttpServletRequest request) {
        return created(getUri()).body(getResponse(request, Map.of("individuelDto", individuelService.addIndividuel(numeroMembre,individuelDto)), "Membre Created Success", CREATED));
    }


    @GetMapping(value = "/credit/{numeroMembre}")
    public ResponseEntity<Response> getInfoCredit(@NotNull Authentication authentication,
                                                 @PathVariable(name = "numeroMembre") String numeroMembre,
                                                 HttpServletRequest request)
    {
        return created(getUri()).body(getResponse(request,Map.of(
                 "creditDto", individuelService.getInfoCredit(numeroMembre),
                 "cumulCredit",ebankingClient.getCumulCreditoByCodClientes(numeroMembre),
                "countCredit",ebankingClient.getNombreCreditByClientes(numeroMembre)
                ), "Mise en Place Pétit Crédit Individuel", OK));
    }


    @PostMapping("/process-credit/{referenceCredit}/{individuelId}")
    public ResponseEntity<Response> processPetitCredit(@NotNull Authentication authentication,
                                                       @RequestBody CreditProcessParams creditProcessParams,
                                                       @PathVariable(name = "referenceCredit") String referenceCredit,
                                                       @PathVariable(name = "individuelId") Long individuelId,
                                                       HttpServletRequest request)
    {
        return created(getUri()).body(getResponse(request, Map.of("creditProcessParams", individuelService.processCredit(creditProcessParams,userClient.getUserByUuid(authentication.getName()).getUserId(),individuelId)), "Credit Individuel Crée avec Success", CREATED));
    }


    /**
     * Endpoint pour récupérer les données complètes d'un crédit par sa référence
     */
    @GetMapping("/get-credit/{referenceCredit}")
    public ResponseEntity<Response> getCreditData(@NotNull Authentication authentication,
                                                  @PathVariable(name = "referenceCredit") String referenceCredit,
                                                  HttpServletRequest request) {

        try {
            // Récupérer les données pour le credit
            CreditDataResponse creditData = individuelService.getCreditData(referenceCredit);

            return ok().body(getResponse(request,
                    Map.of("creditData", creditData),
                    "Données du crédit récupérées avec succès",
                    HttpStatus.OK));

        } catch (ApiException e) {
            return badRequest().body(getResponse(request,
                    Map.of("error", e.getMessage()),
                    "Erreur lors de la récupération des données du crédit",
                    HttpStatus.BAD_REQUEST));

        } catch (Exception e) {
            return internalServerError().body(getResponse(request,
                    Map.of("error", "Erreur interne du serveur"),
                    "Erreur lors de la récupération des données du crédit",
                    HttpStatus.INTERNAL_SERVER_ERROR));
        }
    }

    /**
     * Endpoint pour mettre à jour les données complètes d'un crédit existant
     */
    @PutMapping("/update-credit/{referenceCredit}/{individuelId}")
    public ResponseEntity<Response> updateCreditData(@NotNull Authentication authentication,
                                                     @RequestBody CreditProcessParams creditProcessParams,
                                                     @PathVariable(name = "referenceCredit") String referenceCredit,
                                                     @PathVariable(name = "individuelId") Long individuelId,
                                                     HttpServletRequest request) {

        try {
            // S'assurer que la référence du crédit correspond
            creditProcessParams.setReferenceCredit(referenceCredit);

            // Mettre à jour les données du crédit
            boolean updateSuccess = individuelService.updateCredit(creditProcessParams);

            if (updateSuccess) {
                return ok().body(getResponse(request,
                        Map.of("creditProcessParams", creditProcessParams, "updated", true),
                        "Crédit Individuel mis à jour avec succès",
                        HttpStatus.OK));
            } else {
                return badRequest().body(getResponse(request,
                        Map.of("updated", false),
                        "Échec de la mise à jour du crédit",
                        HttpStatus.BAD_REQUEST));
            }

        } catch (ApiException e) {
            return badRequest().body(getResponse(request,
                    Map.of("error", e.getMessage()),
                    "Erreur lors de la mise à jour du crédit",
                    HttpStatus.BAD_REQUEST));

        } catch (Exception e) {
            return internalServerError().body(getResponse(request,
                    Map.of("error", "Erreur interne du serveur"),
                    "Erreur lors de la mise à jour du crédit",
                    HttpStatus.INTERNAL_SERVER_ERROR));
        }
    }

    /**
     * Endpoint pour récupérer les données d'un crédit avec parsing des données JSON
     * (Version enrichie qui parse automatiquement les données JSON)
     */
    @GetMapping("/get-credit-detailed/{referenceCredit}")
    public ResponseEntity<Response> getCreditDataDetailed(@NotNull Authentication authentication,
                                                          @PathVariable(name = "referenceCredit") String referenceCredit,
                                                          HttpServletRequest request) {

        try {
            // Récupérer les données du crédit
            CreditDataResponse creditData = individuelService.getCreditData(referenceCredit);

            // Parser les données JSON en objets Java
            List<ProductInd> produits = individuelService.parseProduitsData(creditData.getProduitsData());
            List<ChargeInd> charges = individuelService.parseChargesData(creditData.getChargesData());
            List<Personnecaution> cautions = individuelService.parseCautionsData(creditData.getCautionsData());

            // Obtenir le numero membre a partir de sa reference de credit

            CreditDto creditDto = demandeIndService.getCreditByReference(referenceCredit);
            // Créer une réponse enrichie
            Map<String, Object> detailedResponse = Map.of(
                    "creditData", creditData,
                    "products", produits,
                    "charges", charges,
                    "cautions", cautions,
                    "creditDto",creditDto
            );

            return ok().body(getResponse(request,
                    detailedResponse,
                    "Données détaillées du crédit récupérées avec succès",
                    HttpStatus.OK));

        } catch (ApiException e) {
            return badRequest().body(getResponse(request,
                    Map.of("error", e.getMessage()),
                    "Erreur lors de la récupération des données détaillées du crédit",
                    HttpStatus.BAD_REQUEST));

        } catch (Exception e) {
            return internalServerError().body(getResponse(request,
                    Map.of("error", "Erreur interne du serveur"),
                    "Erreur lors de la récupération des données détaillées du crédit",
                    HttpStatus.INTERNAL_SERVER_ERROR));
        }
    }

    /**
     * Endpoint pour mettre à jour partiellement un crédit (PATCH)
     */
    @PatchMapping("/update-credit-partial/{referenceCredit}/{individuelId}")
    public ResponseEntity<Response> updateCreditDataPartial(@NotNull Authentication authentication,
                                                            @RequestBody CreditProcessParams creditProcessParams,
                                                            @PathVariable(name = "referenceCredit") String referenceCredit,
                                                            @PathVariable(name = "individuelId") Long individuelId,
                                                            HttpServletRequest request) {

        try {
            // Récupérer d'abord les données existantes
            CreditDataResponse existingCredit = individuelService.getCreditData(referenceCredit);

            // Fusionner les données existantes avec les nouvelles données
            CreditProcessParams mergedParams = mergePartialUpdate(existingCredit, creditProcessParams);
            mergedParams.setReferenceCredit(referenceCredit);

            // Mettre à jour avec les données fusionnées
            boolean updateSuccess = individuelService.updateCredit(mergedParams);

            if (updateSuccess) {
                return ok().body(getResponse(request,
                        Map.of("creditProcessParams", mergedParams, "updated", true),
                        "Crédit Individuel mis à jour partiellement avec succès",
                        HttpStatus.OK));
            } else {
                return badRequest().body(getResponse(request,
                        Map.of("updated", false),
                        "Échec de la mise à jour partielle du crédit",
                        HttpStatus.BAD_REQUEST));
            }

        } catch (ApiException e) {
            return badRequest().body(getResponse(request,
                    Map.of("error", e.getMessage()),
                    "Erreur lors de la mise à jour partielle du crédit",
                    HttpStatus.BAD_REQUEST));

        } catch (Exception e) {
            return internalServerError().body(getResponse(request,
                    Map.of("error", "Erreur interne du serveur"),
                    "Erreur lors de la mise à jour partielle du crédit",
                    HttpStatus.INTERNAL_SERVER_ERROR));
        }
    }

// =====================================================================
// MÉTHODE UTILITAIRE POUR LA FUSION DES DONNÉES PARTIELLES
// =====================================================================

    /**
     * Fusionne les données existantes avec les nouvelles données pour une mise à jour partielle
     */
    private CreditProcessParams mergePartialUpdate(CreditDataResponse existing, CreditProcessParams updates) {
        CreditProcessParams merged = new CreditProcessParams();

        // Utiliser les nouvelles valeurs si elles existent, sinon garder les anciennes
        merged.setReferenceCredit(existing.getReferenceCredit());
        merged.setMoyenPerson(updates.getMoyenPerson() != null ? updates.getMoyenPerson() : existing.getMoyenPerson());
        merged.setBien(updates.getBien() != null ? updates.getBien() : existing.getBien());
        merged.setCapital(updates.getCapital() != null ? updates.getCapital() : existing.getCapital());
        merged.setCreance(updates.getCreance() != null ? updates.getCreance() : existing.getCreance());
        merged.setDette(updates.getDette() != null ? updates.getDette() : existing.getDette());
        merged.setStatutActivite(updates.getStatutActivite() != null ? updates.getStatutActivite() : existing.getStatutActivite());
        merged.setExperience(updates.getExperience() != null ? updates.getExperience() : existing.getExperience());
        merged.setLieuxAct(updates.getLieuxAct() != null ? updates.getLieuxAct() : existing.getLieuxAct());
        merged.setPersonEmp(updates.getPersonEmp() != null ? updates.getPersonEmp() : existing.getPersonEmp());
        merged.setLien(updates.getLien() != null ? updates.getLien() : existing.getLien());
        merged.setNombre(updates.getNombre() != null ? updates.getNombre() : existing.getNombre());
        merged.setCumulCredit(updates.getCumulCredit() != null ? updates.getCumulCredit() : existing.getCumulCredit());
        merged.setNbreCredit(updates.getNbreCredit() != null ? updates.getNbreCredit() : existing.getNbreCredit());
        merged.setFrequence(updates.getFrequence() != null ? updates.getFrequence() : existing.getFrequenceValue());

        // Données de garantie
        merged.setGarantieLibele(updates.getGarantieLibele() != null ? updates.getGarantieLibele() : existing.getGarantieLibele());
        merged.setGarantieMontant(updates.getGarantieMontant() != null ? updates.getGarantieMontant() : existing.getGarantieMontant());
        merged.setItAss(updates.getItAss() != null ? updates.getItAss() : existing.getItAss());
        merged.setItPc(updates.getItPc() != null ? updates.getItPc() : existing.getItPc());

        // Pour les arrays, utiliser les nouvelles si fournies, sinon convertir depuis JSON
        merged.setProduitsLibele(updates.getProduitsLibele() != null ? updates.getProduitsLibele() :
                convertProduitsFromJson(existing.getProduitsData()));
        merged.setProduitsPrixUnit(updates.getProduitsPrixUnit() != null ? updates.getProduitsPrixUnit() :
                convertProduitsPrixFromJson(existing.getProduitsData()));
        merged.setProduitsQte(updates.getProduitsQte() != null ? updates.getProduitsQte() :
                convertProduitsQteFromJson(existing.getProduitsData()));
        merged.setProduitsObservation(updates.getProduitsObservation() != null ? updates.getProduitsObservation() :
                convertProduitsObsFromJson(existing.getProduitsData()));

        // Même logique pour charges et cautions...
        merged.setChargesLibele(updates.getChargesLibele() != null ? updates.getChargesLibele() :
                convertChargesFromJson(existing.getChargesData()));
        merged.setChargesPrixUnit(updates.getChargesPrixUnit() != null ? updates.getChargesPrixUnit() :
                convertChargesPrixFromJson(existing.getChargesData()));
        merged.setChargesQte(updates.getChargesQte() != null ? updates.getChargesQte() :
                convertChargesQteFromJson(existing.getChargesData()));

        merged.setCautionsNom(updates.getCautionsNom() != null ? updates.getCautionsNom() :
                convertCautionsNomFromJson(existing.getCautionsData()));
        merged.setCautionsPrenom(updates.getCautionsPrenom() != null ? updates.getCautionsPrenom() :
                convertCautionsPrenomFromJson(existing.getCautionsData()));
        merged.setCautionsTelephone(updates.getCautionsTelephone() != null ? updates.getCautionsTelephone() :
                convertCautionsTelFromJson(existing.getCautionsData()));
        merged.setCautionsActivite(updates.getCautionsActivite() != null ? updates.getCautionsActivite() :
                convertCautionsActFromJson(existing.getCautionsData()));
        merged.setCautionsAge(updates.getCautionsAge() != null ? updates.getCautionsAge() :
                convertCautionsAgeFromJson(existing.getCautionsData()));
        merged.setCautionsProfession(updates.getCautionsProfession() != null ? updates.getCautionsProfession() :
                convertCautionsProfFromJson(existing.getCautionsData()));

        return merged;
    }

// =====================================================================
// MÉTHODES UTILITAIRES POUR CONVERTIR JSON EN ARRAYS
// =====================================================================

    private String[] convertProduitsFromJson(String jsonData) {
        // Implémentation pour convertir les données JSON en array de strings
        // À implémenter selon vos besoins spécifiques
        return new String[0];
    }

    private BigDecimal[] convertProduitsPrixFromJson(String jsonData) {
        // Implémentation pour convertir les prix des produits
        return new BigDecimal[0];
    }

    private Integer[] convertProduitsQteFromJson(String jsonData) {
        // Implémentation pour convertir les quantités
        return new Integer[0];
    }

    private String[] convertProduitsObsFromJson(String jsonData) {
        // Implémentation pour convertir les observations
        return new String[0];
    }

    // Même logique pour charges et cautions...
    private String[] convertChargesFromJson(String jsonData) { return new String[0]; }
    private BigDecimal[] convertChargesPrixFromJson(String jsonData) { return new BigDecimal[0]; }
    private Integer[] convertChargesQteFromJson(String jsonData) { return new Integer[0]; }
    private String[] convertCautionsNomFromJson(String jsonData) { return new String[0]; }
    private String[] convertCautionsPrenomFromJson(String jsonData) { return new String[0]; }
    private String[] convertCautionsTelFromJson(String jsonData) { return new String[0]; }
    private String[] convertCautionsActFromJson(String jsonData) { return new String[0]; }
    private Long[] convertCautionsAgeFromJson(String jsonData) { return new Long[0]; }
    private String[] convertCautionsProfFromJson(String jsonData) { return new String[0]; }

    private URI getUri() {
        return URI.create("/individuel/numeroMembre");
    }
}
