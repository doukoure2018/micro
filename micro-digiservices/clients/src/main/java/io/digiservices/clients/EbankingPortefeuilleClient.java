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

    @GetMapping("/ebanking/portefeuille/indicateurs")
    PortefeuilleIndicateursDto getIndicateurs(@RequestParam(value = "codAgencia") String codAgencia,
                                              @RequestParam(value = "statut", defaultValue = "actifs") String statut,
                                              @RequestParam(value = "tranche", required = false) String tranche,
                                              @RequestParam(value = "recherche", required = false) String recherche);

    // ==================== Alertes (phase 3) : balayages reseau ====================

    @GetMapping("/ebanking/portefeuille/echeances-avenir")
    List<io.digiservices.clients.portefeuille.EcheanceAvenirDto> getEcheancesAvenir(
            @RequestParam(value = "joursAvant", defaultValue = "3") int joursAvant);

    @GetMapping("/ebanking/portefeuille/nouveaux-impayes")
    List<io.digiservices.clients.portefeuille.NouvelImpayeDto> getNouveauxImpayes(
            @RequestParam(value = "depuisJours", defaultValue = "1") int depuisJours);

    @GetMapping("/ebanking/portefeuille/indicateurs-reseau")
    List<io.digiservices.clients.portefeuille.IndicateursAgenceDto> getIndicateursReseau();

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
