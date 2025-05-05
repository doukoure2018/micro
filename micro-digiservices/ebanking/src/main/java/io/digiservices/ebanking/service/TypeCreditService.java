package io.digiservices.ebanking.service;


import io.digiservices.ebanking.paylaod.TypeCreditDto;
import io.digiservices.ebanking.paylaod.TypeCreditPKId;

import java.util.List;

public interface TypeCreditService {
    List<TypeCreditDto> getAllTypeCredito();

    TypeCreditDto getTypeCredito(TypeCreditPKId typeCreditPKId);

}
