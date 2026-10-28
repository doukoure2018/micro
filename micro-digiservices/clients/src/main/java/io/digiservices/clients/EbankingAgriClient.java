package io.digiservices.clients;

import io.digiservices.clients.agri.AgriAgencyDto;
import io.digiservices.clients.agri.AgriCreditDto;
import io.digiservices.clients.agri.AgriInstallmentDto;
import io.digiservices.clients.agri.CooperativeDto;
import io.digiservices.clients.agri.CooperativeMemberDto;
import io.digiservices.clients.agri.FarmerDto;
import io.digiservices.clients.agri.PageDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

/**
 * Client Feign vers le perimetre agricole d'ebanking ({@code /ebanking/agri/**}).
 *
 * <p>L'id de service Eureka est {@code EBANKING} (cf. spring.application.name d'ebanking).
 * Ces endpoints sont proteges par cle API : l'en-tete {@code X-API-Key} est injecte
 * cote agriculteurservice via un RequestInterceptor Feign.</p>
 */
@FeignClient(name = "EBANKING", contextId = "ebankingAgriClient")
public interface EbankingAgriClient {

    @GetMapping("/ebanking/agri/agences")
    List<AgriAgencyDto> getAllAgencies();

    @GetMapping("/ebanking/agri/agences/{codAgencia}/portfolio")
    PageDto<AgriCreditDto> getAgencyPortfolio(
            @PathVariable("codAgencia") String codAgencia,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size);

    /**
     * Portefeuille national pagine (KUMY, lot 1). {@code codes} restreint aux points de service
     * donnes (codes SAF, separes par des virgules) ; {@code inclureClos} ajoute les credits clos.
     */
    @GetMapping("/ebanking/agri/portfolio")
    PageDto<AgriCreditDto> getPortfolio(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "100") int size,
            @RequestParam(value = "codes", required = false) String codes,
            @RequestParam(value = "inclureClos", defaultValue = "false") boolean inclureClos);

    /** De quand datent les donnees servies : date de restauration de la base lue par l'API agricole. */
    @GetMapping("/ebanking/agri/sorties")
    PageDto<io.digiservices.clients.agri.AgriSortieDto> getSorties(@RequestParam("debut") String debut,
            @RequestParam("fin") String fin, @RequestParam("page") int page, @RequestParam("size") int size,
            @RequestParam(value = "codes", required = false) String codes);

    @GetMapping("/ebanking/agri/referentiels/activites")
    List<java.util.Map<String, Object>> getReferentielActivites();

    @GetMapping("/ebanking/agri/donnees-saf")
    java.util.Map<String, Object> getDonneesSaf();

    @GetMapping("/ebanking/agri/farmers")
    PageDto<FarmerDto> getFarmers(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size);

    @GetMapping("/ebanking/agri/farmers/{codCliente}")
    FarmerDto getFarmerById(@PathVariable("codCliente") String codCliente);

    @GetMapping("/ebanking/agri/credits/{codCliente}")
    List<AgriCreditDto> getAgriculturalCreditsByClient(@PathVariable("codCliente") String codCliente);

    @GetMapping("/ebanking/agri/credits/{numCredito}/detail")
    AgriCreditDto getCreditDetail(@PathVariable("numCredito") Long numCredito);

    @GetMapping("/ebanking/agri/credits/{numCredito}/repayment-schedule")
    List<AgriInstallmentDto> getRepaymentSchedule(@PathVariable("numCredito") Long numCredito);

    @GetMapping("/ebanking/agri/cooperatives")
    PageDto<CooperativeDto> getCooperatives(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size);

    @GetMapping("/ebanking/agri/cooperatives/{codGrupo}")
    CooperativeDto getCooperativeById(@PathVariable("codGrupo") String codGrupo);

    @GetMapping("/ebanking/agri/cooperatives/{codGrupo}/members")
    PageDto<CooperativeMemberDto> getCooperativeMembers(
            @PathVariable("codGrupo") String codGrupo,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size);

    /** Comptes de credit (CC008) et de remboursement (CC014) d'un membre. */
    @GetMapping("/ebanking/agri/comptes/{codCliente}")
    io.digiservices.clients.agri.ComptesMembreDto getComptesMembre(
            @PathVariable("codCliente") String codCliente);

    /** Identite et contacts d'un membre. */
    @GetMapping("/ebanking/agri/identite/{codCliente}")
    io.digiservices.clients.agri.IdentiteMembreDto getIdentiteMembre(
            @PathVariable("codCliente") String codCliente);

    /** Comptes et credits des membres dont l'un des trois telephones est ce numero (9 chiffres). */
    @GetMapping("/ebanking/agri/telephones/{telephone}/comptes")
    io.digiservices.clients.agri.ComptesParTelephoneDto getComptesParTelephone(
            @PathVariable("telephone") String telephone);
}
