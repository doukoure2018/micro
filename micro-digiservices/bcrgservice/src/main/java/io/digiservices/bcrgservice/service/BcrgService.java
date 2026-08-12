package io.digiservices.bcrgservice.service;

import io.digiservices.bcrgservice.dto.EncoursDto;
import io.digiservices.bcrgservice.dto.EngagementDto;
import io.digiservices.bcrgservice.dto.PageDto;
import io.digiservices.bcrgservice.dto.PersonneMoraleDto;
import io.digiservices.bcrgservice.dto.PersonnePhysiqueDto;

public interface BcrgService {

    PageDto<PersonnePhysiqueDto> getPersonnesPhysiques(int page, int size, boolean toutes);

    PersonnePhysiqueDto getPersonnePhysique(String idClient);

    PageDto<PersonneMoraleDto> getPersonnesMorales(int page, int size, boolean toutes);

    PersonneMoraleDto getPersonneMorale(String idClient);

    PageDto<EngagementDto> getEngagements(int page, int size, boolean toutes);

    EngagementDto getEngagement(Long refEng);

    PageDto<EncoursDto> getEncours(String periode, int page, int size);
}
