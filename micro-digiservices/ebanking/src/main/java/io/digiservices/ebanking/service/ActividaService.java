package io.digiservices.ebanking.service;

import io.digiservices.ebanking.paylaod.ActividaDto;

import java.util.List;

public interface ActividaService {

    List<ActividaDto> getAllActivida();

    ActividaDto getInfoActivite(String Id);
}
