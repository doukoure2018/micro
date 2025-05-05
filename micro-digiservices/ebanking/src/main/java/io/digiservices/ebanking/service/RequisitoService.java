package io.digiservices.ebanking.service;

import io.digiservices.ebanking.paylaod.RequisitoDto;

import java.util.List;

public interface RequisitoService {

    RequisitoDto createRequisito(RequisitoDto requisitoDto);

    List<RequisitoDto> getAllRequisito();
}
