package io.digiservices.ebanking.service;


import io.digiservices.ebanking.paylaod.AstoDetailDto;
import io.digiservices.ebanking.paylaod.AstoDetailPkId;

public interface AstoDetailService {

    AstoDetailDto getInfoAstoDetailById(AstoDetailPkId astoDetailPkId);

    AstoDetailDto createAstoDetail(AstoDetailDto astoDetailDto);

    AstoDetailDto updateAstoDetail(AstoDetailDto astoDetailDto,AstoDetailPkId astoDetailPkId);

    AstoDetailDto updateAstoDetailReferencia(AstoDetailDto astoDetailDto,AstoDetailPkId astoDetailPkId);
}

