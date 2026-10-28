package io.digiservices.clients;

import io.digiservices.clients.agri.AffectationDigiDto;
import io.digiservices.clients.agri.AgentCreditDto;
import io.digiservices.clients.agri.DemandeCreditPartenaireDto;
import io.digiservices.clients.agri.PageDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

/**
 * Client Feign vers le perimetre partenaire d'ecreditservice ({@code /ecredit/agri/**}) :
 * ce que digi sait et que SAF ignore — l'affectation des credits aux agents et les demandes
 * de credit (points 8 et 9 du tableau de bord DE).
 *
 * <p>Protege par cle API ; l'en-tete {@code X-API-Key} est injecte cote agriculteurservice
 * par {@code FeignAgriConfig}, comme pour {@code /ebanking/agri/**}.</p>
 */
@FeignClient(name = "ECREDITSERVICE", contextId = "ecreditAgriClient")
public interface EcreditAgriClient {

    @GetMapping("/ecredit/agri/agents")
    List<AgentCreditDto> getAgents(@RequestParam("codeAgence") String codeAgence);

    /**
     * Affectations digi des credits d'une page de portefeuille. En POST : une page porte
     * jusqu'a 500 cles, qui ne tiennent pas raisonnablement dans une URL.
     */
    @PostMapping("/ecredit/agri/affectations")
    List<AffectationDigiDto> getAffectations(@RequestBody List<String> cles);

    @GetMapping("/ecredit/agri/demandes")
    PageDto<DemandeCreditPartenaireDto> getDemandes(@RequestParam("page") int page,
                                                    @RequestParam("size") int size,
                                                    @RequestParam(value = "depuis", required = false) String depuis,
                                                    @RequestParam(value = "delegationId", required = false) Long delegationId,
                                                    @RequestParam(value = "codeAgence", required = false) String codeAgence,
                                                    @RequestParam(value = "etape", required = false) String etape);
}
