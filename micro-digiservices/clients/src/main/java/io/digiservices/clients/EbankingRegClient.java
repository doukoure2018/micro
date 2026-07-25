package io.digiservices.clients;

import io.digiservices.clients.agri.PageDto;
import io.digiservices.clients.reg.RegEncoursDto;
import io.digiservices.clients.reg.RegEngagementDto;
import io.digiservices.clients.reg.RegPersonneMoraleDto;
import io.digiservices.clients.reg.RegPersonnePhysiqueDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

/**
 * Client Feign vers le perimetre reglementaire (declaration BCRG) d'ebanking
 * ({@code /ebanking/reg/**}).
 *
 * <p>Service Eureka {@code EBANKING}. Ces endpoints sont proteges par cle API :
 * l'en-tete {@code X-API-Key} est injecte cote bcrgservice via un RequestInterceptor
 * Feign (cf. {@code FeignRegConfig}).</p>
 */
@FeignClient(name = "EBANKING", contextId = "ebankingRegClient")
public interface EbankingRegClient {

    @GetMapping("/ebanking/reg/personnes-physiques")
    PageDto<RegPersonnePhysiqueDto> getPersonnesPhysiques(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size);

    @GetMapping("/ebanking/reg/personnes-physiques/{codCliente}")
    RegPersonnePhysiqueDto getPersonnePhysiqueById(@PathVariable("codCliente") String codCliente);

    @GetMapping("/ebanking/reg/personnes-morales")
    PageDto<RegPersonneMoraleDto> getPersonnesMorales(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size);

    @GetMapping("/ebanking/reg/personnes-morales/{codCliente}")
    RegPersonneMoraleDto getPersonneMoraleById(@PathVariable("codCliente") String codCliente);

    @GetMapping("/ebanking/reg/engagements")
    PageDto<RegEngagementDto> getEngagements(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size);

    @GetMapping("/ebanking/reg/engagements/{numCredito}")
    RegEngagementDto getEngagementById(@PathVariable("numCredito") Long numCredito);

    @GetMapping("/ebanking/reg/encours")
    PageDto<RegEncoursDto> getEncours(
            @RequestParam(value = "periode") String periode,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size);
}
