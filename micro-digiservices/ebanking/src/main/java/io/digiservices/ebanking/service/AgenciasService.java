package io.digiservices.ebanking.service;


import io.digiservices.ebanking.paylaod.AgenciasDto;
import io.digiservices.ebanking.paylaod.AgenciasPkId;

public interface AgenciasService {
    AgenciasDto getInfoAgencias(AgenciasPkId agenciasPkId);
}
