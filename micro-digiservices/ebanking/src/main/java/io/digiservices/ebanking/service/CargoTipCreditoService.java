package io.digiservices.ebanking.service;

import io.digiservices.ebanking.paylaod.CargoTipCreditoDto;

import java.util.List;

public interface CargoTipCreditoService {

    List<CargoTipCreditoDto> getAllCargoTipCredito(Long tipCredito);

}
