package io.digiservices.ebanking.service;


import io.digiservices.ebanking.paylaod.IdentificationDto;
import io.digiservices.ebanking.paylaod.IdentificationPKId;

public interface IdentificationService {

    IdentificationDto getIdentification(IdentificationPKId identificationPKId);

    IdentificationDto createDatos(IdentificationDto identificationDto);

    IdentificationDto updateIdentificationClientes(IdentificationDto identificationDto,IdentificationPKId identificationPKId);

}
