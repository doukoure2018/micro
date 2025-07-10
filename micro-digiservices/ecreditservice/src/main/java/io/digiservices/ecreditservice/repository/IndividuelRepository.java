package io.digiservices.ecreditservice.repository;

import io.digiservices.ecreditservice.dto.CreditDataResponse;
import io.digiservices.ecreditservice.dto.CreditDto;
import io.digiservices.ecreditservice.dto.CreditProcessParams;
import io.digiservices.ecreditservice.dto.IndividuelDto;

public interface IndividuelRepository {

    IndividuelDto addIndividuel(String numeroMembre,IndividuelDto individuelDto);

    boolean processCredit(CreditProcessParams creditParams,Long userId,Long individuelId);

    CreditDto getInfoCredit(String numeroMembre);

    CreditDataResponse getCreditData(String referenceCredit);

    public boolean updateCredit(CreditProcessParams creditParams);

}
