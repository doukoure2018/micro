package io.digiservices.clients;

import io.digiservices.clients.agri.AgriAgencyDto;
import io.digiservices.clients.agri.AgriCreditDto;
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
}
