package io.digiservices.ebanking.service;

import io.digiservices.ebanking.paylaod.SousSousActiviteDto;

import java.util.List;

public interface SousSousActiviteService {

    List<SousSousActiviteDto> getAllSousSousActivite();

    List<SousSousActiviteDto> getAllSousSousActiviteByCod(String codSousActivite);
}
