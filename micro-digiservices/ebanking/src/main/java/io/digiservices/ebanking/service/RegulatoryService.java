package io.digiservices.ebanking.service;

import io.digiservices.clients.agri.PageDto;
import io.digiservices.clients.reg.RegEncoursDto;
import io.digiservices.clients.reg.RegEngagementDto;
import io.digiservices.clients.reg.RegPersonneMoraleDto;
import io.digiservices.clients.reg.RegPersonnePhysiqueDto;

/**
 * Service d'agregation du perimetre reglementaire (declaration BCRG) SAF2000,
 * lecture seule via la datasource tertiary (meme acces que le credit agricole).
 */
public interface RegulatoryService {

    PageDto<RegPersonnePhysiqueDto> getPersonnesPhysiques(int page, int size);

    RegPersonnePhysiqueDto getPersonnePhysiqueById(String codCliente);

    // Extraction filtree "restantes" (bcrgservice) : lots keyset + details par ids
    java.util.List<RegPersonnePhysiqueDto> getPersonnesPhysiquesLot(String afterId, int limit);

    java.util.List<RegPersonnePhysiqueDto> getPersonnesPhysiquesByIds(java.util.List<String> ids);

    java.util.List<RegPersonneMoraleDto> getPersonnesMoralesLot(String afterId, int limit);

    java.util.List<RegPersonneMoraleDto> getPersonnesMoralesByIds(java.util.List<String> ids);

    java.util.List<RegEngagementDto> getEngagementsLot(String afterAgence, Long afterId, int limit);

    PageDto<RegPersonneMoraleDto> getPersonnesMorales(int page, int size);

    RegPersonneMoraleDto getPersonneMoraleById(String codCliente);

    PageDto<RegEngagementDto> getEngagements(int page, int size);

    RegEngagementDto getEngagementById(String codAgencia, Long numCredito);

    PageDto<RegEncoursDto> getEncours(String periode, int page, int size);
}
