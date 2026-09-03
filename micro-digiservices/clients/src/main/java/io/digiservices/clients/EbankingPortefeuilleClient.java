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
            @RequestParam(value = "recherche", required = false) String recherche,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size);

    @GetMapping("/ebanking/portefeuille/indicateurs")
    PortefeuilleIndicateursDto getIndicateurs(@RequestParam(value = "codAgencia") String codAgencia);

    @GetMapping("/ebanking/portefeuille/credits/{codAgencia}/{numCredito}/echeancier")
    List<PortefeuilleEcheanceDto> getEcheancier(@PathVariable("codAgencia") String codAgencia,
                                                @PathVariable("numCredito") Long numCredito);
}
