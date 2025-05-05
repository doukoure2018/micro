package io.digiservices.ebanking.service.impl;


import io.digiservices.ebanking.entity.SecteurEco;
import io.digiservices.ebanking.paylaod.SecteurEcoDto;
import io.digiservices.ebanking.paylaod.SectorEconomicoPKId;
import io.digiservices.ebanking.repository.SecteurEcoRepository;
import io.digiservices.ebanking.service.SecteurEcoService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SecteurEcoServiceImpl implements SecteurEcoService {
    private SecteurEcoRepository secteurEcoRepository;
    private ModelMapper modelMapper;

    public SecteurEcoServiceImpl(SecteurEcoRepository secteurEcoRepository, ModelMapper modelMapper) {
        this.secteurEcoRepository = secteurEcoRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public List<SecteurEcoDto> getAllSector() {
        List<SecteurEco> secteurEcos=secteurEcoRepository.findAll();
        return secteurEcos.stream().map((secteurEco)->modelMapper.map(secteurEco,SecteurEcoDto.class))
                .collect(Collectors.toList());
    }

    @Override
    public SecteurEcoDto getInfoSector(SectorEconomicoPKId sectorEconomicoPKId) {
        SecteurEco secteurEco=secteurEcoRepository.getReferenceById(sectorEconomicoPKId);
        return modelMapper.map(secteurEco,SecteurEcoDto.class);
    }
}

