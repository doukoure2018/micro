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

    @GetMapping("/ebanking/reg/engagements/{codAgencia}/{numCredito}")
    RegEngagementDto getEngagementById(@PathVariable("codAgencia") String codAgencia,
                                       @PathVariable("numCredito") Long numCredito);

    @GetMapping("/ebanking/reg/encours")
    PageDto<RegEncoursDto> getEncours(
            @RequestParam(value = "periode") String periode,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size);

    // ==================== Lots keyset + details par ids (extraction filtree "restantes") ====================

    @GetMapping("/ebanking/reg/personnes-physiques/lot")
    java.util.List<RegPersonnePhysiqueDto> getPersonnesPhysiquesLot(
            @RequestParam(value = "afterId", defaultValue = "") String afterId,
            @RequestParam(value = "limit", defaultValue = "500") int limit);

    @GetMapping("/ebanking/reg/personnes-physiques/par-ids")
    java.util.List<RegPersonnePhysiqueDto> getPersonnesPhysiquesByIds(
            @RequestParam(value = "ids") java.util.List<String> ids);

    @GetMapping("/ebanking/reg/personnes-morales/lot")
    java.util.List<RegPersonneMoraleDto> getPersonnesMoralesLot(
            @RequestParam(value = "afterId", defaultValue = "") String afterId,
            @RequestParam(value = "limit", defaultValue = "500") int limit);

    @GetMapping("/ebanking/reg/personnes-morales/par-ids")
    java.util.List<RegPersonneMoraleDto> getPersonnesMoralesByIds(
            @RequestParam(value = "ids") java.util.List<String> ids);

    @GetMapping("/ebanking/reg/engagements/lot")
    java.util.List<RegEngagementDto> getEngagementsLot(
            @RequestParam(value = "afterAgence", defaultValue = "") String afterAgence,
            @RequestParam(value = "afterId", defaultValue = "0") Long afterId,
            @RequestParam(value = "limit", defaultValue = "500") int limit);
}
