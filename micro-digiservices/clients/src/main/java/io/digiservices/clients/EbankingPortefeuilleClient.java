package io.digiservices.clients;

import io.digiservices.clients.agri.PageDto;
import io.digiservices.clients.portefeuille.AgenceSafDto;
import io.digiservices.clients.portefeuille.PortefeuilleCreditDto;
import io.digiservices.clients.portefeuille.PortefeuilleEcheanceDto;
import io.digiservices.clients.portefeuille.PortefeuilleIndicateursDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

/**
 * Client Feign du module de suivi du portefeuille credits SAF
 * ({@code /ebanking/portefeuille/**}, lecture seule, datasource primary).
 */
@FeignClient(name = "EBANKING", contextId = "ebankingPortefeuilleClient")
public interface EbankingPortefeuilleClient {

    @GetMapping("/ebanking/portefeuille/agences")
    List<AgenceSafDto> getAgences();

    /** Sonde de sante des bases SAF (connexion directe courte, message SQL Server exact). */
    @GetMapping("/ebanking/portefeuille/sante")
    io.digiservices.clients.portefeuille.SanteSafDto getSanteSaf();

    @GetMapping("/ebanking/portefeuille/credits")
    PageDto<PortefeuilleCreditDto> getCredits(
            @RequestParam(value = "codAgencia") String codAgencia,
            @RequestParam(value = "statut", defaultValue = "actifs") String statut,
            @RequestParam(value = "tranche", required = false) String tranche,
            @RequestParam(value = "recherche", required = false) String recherche,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size);

    /** Tous les credits vivants d'un point de service, sans pagination (affectation aux agents, V159). */
    @GetMapping("/ebanking/portefeuille/credits-complets")
    List<PortefeuilleCreditDto> getTousCredits(@RequestParam(value = "codAgencia") String codAgencia);

    /** Tout le reseau par agence SAF et par type de credit, credits en cours (portefeuille a risque, lot 2). */
    @GetMapping("/ebanking/portefeuille/indicateurs-reseau-produit")
    List<io.digiservices.clients.portefeuille.IndicateursProduitAgenceDto> getIndicateursReseauParProduit();

    @GetMapping("/ebanking/portefeuille/indicateurs")
    PortefeuilleIndicateursDto getIndicateurs(@RequestParam(value = "codAgencia") String codAgencia,
                                              @RequestParam(value = "statut", defaultValue = "actifs") String statut,
                                              @RequestParam(value = "tranche", required = false) String tranche,
                                              @RequestParam(value = "recherche", required = false) String recherche);

    // ==================== Alertes (phase 3) : balayages reseau ====================

    /**
     * Un client SAF par son numero de membre, lu dans la base de PRODUCTION. Reponse 404 si le
     * numero est inconnu : la verification a la saisie s'appuie sur cette distinction.
     */
    @GetMapping("/ebanking/portefeuille/membres/{codCliente}")
    io.digiservices.clients.portefeuille.MembreSafDto getMembre(@PathVariable("codCliente") String codCliente);

    /** L'etat d'un credit a l'instant, lu dans la base de PRODUCTION ; 404 si le credit n'existe pas. */
    @GetMapping("/ebanking/portefeuille/credits/{codAgencia}/{numCredito}/etat")
    io.digiservices.clients.portefeuille.CreditEtatDto getEtatCredit(@PathVariable("codAgencia") String codAgencia,
                                                                     @PathVariable("numCredito") Long numCredito);

    /** Dossier complet d'un credit : les cinq tables SAF du script d'extraction DSIG. */
    @GetMapping("/ebanking/portefeuille/credits/{codAgencia}/{numCredito}/dossier")
    io.digiservices.clients.portefeuille.DossierCreditDto getDossierCredit(
            @PathVariable("codAgencia") String codAgencia,
            @PathVariable("numCredito") Long numCredito,
            @RequestParam(value = "max", required = false) Integer max);

    @GetMapping("/ebanking/portefeuille/credits-negatifs")
    List<io.digiservices.clients.portefeuille.CreditNegatifDto> getCreditsNegatifs();

    @GetMapping("/ebanking/portefeuille/echeances-avenir")
    List<io.digiservices.clients.portefeuille.EcheanceAvenirDto> getEcheancesAvenir(
            @RequestParam(value = "joursAvant", defaultValue = "3") int joursAvant);

    @GetMapping("/ebanking/portefeuille/nouveaux-impayes")
    List<io.digiservices.clients.portefeuille.NouvelImpayeDto> getNouveauxImpayes(
            @RequestParam(value = "depuisJours", defaultValue = "1") int depuisJours);

    @GetMapping("/ebanking/portefeuille/indicateurs-reseau")
    List<io.digiservices.clients.portefeuille.IndicateursAgenceDto> getIndicateursReseau();

    /** Controles SAF du rapport mensuel des indicateurs (V167), tout le reseau, pour un mois. */
    @GetMapping("/ebanking/portefeuille/controles-mensuels")
    List<io.digiservices.clients.portefeuille.ControleMensuelDto> getControlesMensuels(
            @RequestParam(value = "annee") int annee, @RequestParam(value = "mois") int mois);

    // ==================== TT1 (lot 1) : echeances de la periode ====================

    /** Echeances tombant entre du et au (ISO yyyy-MM-dd) sur une liste de codes agence SAF. */
    @GetMapping("/ebanking/portefeuille/echeances-periode")
    io.digiservices.clients.agri.PageDto<io.digiservices.clients.portefeuille.EcheancePeriodeDto> getEcheancesPeriode(
            @RequestParam(value = "codes") List<String> codes,
            @RequestParam(value = "du") String du,
            @RequestParam(value = "au") String au,
            @RequestParam(value = "etat", defaultValue = "toutes") String etat,
            @RequestParam(value = "recherche", required = false) String recherche,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "50") int size);

    /** Synthese TT1 par code agence SAF (une ligne par point de service, niveau PS). */
    @GetMapping("/ebanking/portefeuille/echeances-periode/synthese")
    List<io.digiservices.clients.portefeuille.EcheancesSyntheseDto> getEcheancesPeriodeSynthese(
            @RequestParam(value = "codes") List<String> codes,
            @RequestParam(value = "du") String du,
            @RequestParam(value = "au") String au,
            @RequestParam(value = "etat", defaultValue = "toutes") String etat,
            @RequestParam(value = "recherche", required = false) String recherche);

    @GetMapping("/ebanking/portefeuille/echeances-periode/indicateurs")
    io.digiservices.clients.portefeuille.EcheancesIndicateursDto getEcheancesPeriodeIndicateurs(
            @RequestParam(value = "codes") List<String> codes,
            @RequestParam(value = "du") String du,
            @RequestParam(value = "au") String au,
            @RequestParam(value = "etat", defaultValue = "toutes") String etat,
            @RequestParam(value = "recherche", required = false) String recherche);

    @GetMapping("/ebanking/portefeuille/credits/{codAgencia}/{numCredito}/echeancier")
    List<PortefeuilleEcheanceDto> getEcheancier(@PathVariable("codAgencia") String codAgencia,
                                                @PathVariable("numCredito") Long numCredito);
}
