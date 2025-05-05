package io.digiservices.ebanking.service;


import io.digiservices.ebanking.paylaod.SecteurEcoDto;
import io.digiservices.ebanking.paylaod.SectorEconomicoPKId;

import java.util.List;

public interface SecteurEcoService {

    List<SecteurEcoDto> getAllSector();

    SecteurEcoDto getInfoSector(SectorEconomicoPKId sectorEconomicoPKId);
}
