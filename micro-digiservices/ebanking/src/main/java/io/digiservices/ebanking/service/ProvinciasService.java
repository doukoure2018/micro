package io.digiservices.ebanking.service;

import io.digiservices.ebanking.paylaod.ProvinciasDto;
import io.digiservices.ebanking.paylaod.ProvinciasPKId;

import java.util.List;

public interface ProvinciasService {

    List<ProvinciasDto> getListProvincias();

    ProvinciasDto getInfoProvincia(ProvinciasPKId provinciasPKId);


}
