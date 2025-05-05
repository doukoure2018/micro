package io.digiservices.ebanking.service;

import io.digiservices.ebanking.paylaod.SousActiviteDto;

import java.util.List;

public interface SousActiviteService {

    List<SousActiviteDto> getAllSousActivite();
    List<SousActiviteDto> getAllSousActiviteByActivite(String codActividad);
}
