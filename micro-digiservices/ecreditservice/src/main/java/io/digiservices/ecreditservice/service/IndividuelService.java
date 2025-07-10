package io.digiservices.ecreditservice.service;

import io.digiservices.ecreditservice.dto.*;

import java.util.List;

public interface IndividuelService {

    IndividuelDto addIndividuel(String numeroMembre, IndividuelDto individuelDto);

    boolean processCredit(CreditProcessParams creditParams, Long userId, Long individuelId);

    CreditDto getInfoCredit(String numeroMembre);

    CreditDataResponse getCreditData(String referenceCredit);

     boolean updateCredit(CreditProcessParams creditParams);

    List<ProductInd> parseProduitsData(String produitsDataJson);

    public List<ChargeInd> parseChargesData(String chargesDataJson);

    public List<Personnecaution> parseCautionsData(String cautionsDataJson);


}
