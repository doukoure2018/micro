package io.digiservices.ebanking.service;

import io.digiservices.ebanking.paylaod.DistrictDto;

import java.util.List;

public interface DistrictService {

    List<DistrictDto> getListDistrict();

    List<DistrictDto> getListDistrictByCodCanton(String codCanton,String codProvincia);

    DistrictDto getInfoDistricto(String codCanton,String codProvincia,String codDistrito);

}
