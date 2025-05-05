package io.digiservices.ebanking.service;

import io.digiservices.ebanking.paylaod.CantonesDto;
import io.digiservices.ebanking.paylaod.CantonesPKId;

import java.util.List;

public interface CantonesService {

    List<CantonesDto> listCantones();

    List<CantonesDto> getListeByCodProvincia(String codProvincia);

    CantonesDto getInfoCommune(CantonesPKId cantonesPKId);
}
