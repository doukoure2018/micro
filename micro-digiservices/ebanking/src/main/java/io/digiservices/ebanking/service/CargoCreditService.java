package io.digiservices.ebanking.service;

import io.digiservices.ebanking.paylaod.CargoCreditDto;

import java.util.List;

public interface CargoCreditService {

    CargoCreditDto createCargoCredit(CargoCreditDto cargoCreditDto);

    List<CargoCreditDto> getAllCargoCredito();
}
