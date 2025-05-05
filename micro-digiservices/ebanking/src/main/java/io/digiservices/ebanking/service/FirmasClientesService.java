package io.digiservices.ebanking.service;


import io.digiservices.ebanking.paylaod.FirmasClientesDto;
import io.digiservices.ebanking.paylaod.FirmasClientesPkId;

public interface FirmasClientesService {

    FirmasClientesDto createFirmaClientes(FirmasClientesDto firmasClientesDto);

    FirmasClientesDto getInfoFirmaClientes(FirmasClientesPkId firmasClientesPkId);
}
