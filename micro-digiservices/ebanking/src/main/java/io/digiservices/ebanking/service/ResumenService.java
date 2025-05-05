package io.digiservices.ebanking.service;


import io.digiservices.ebanking.paylaod.ResumenDto;
import io.digiservices.ebanking.paylaod.ResumenPkId;

public interface ResumenService {

    ResumenDto getInfoResumen(ResumenPkId resumenPkId);

    ResumenDto createResumen(ResumenDto resumenDto);
}
