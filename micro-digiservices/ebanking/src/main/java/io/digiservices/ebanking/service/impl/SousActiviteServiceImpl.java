package io.digiservices.ebanking.service.impl;

import io.digiservices.ebanking.entity.SousActivite;
import io.digiservices.ebanking.paylaod.SousActiviteDto;
import io.digiservices.ebanking.repository.SousActiviteRepository;
import io.digiservices.ebanking.service.SousActiviteService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SousActiviteServiceImpl implements SousActiviteService {

    private SousActiviteRepository sousActiviteRepository;
    private ModelMapper modelMapper;

    public SousActiviteServiceImpl(SousActiviteRepository sousActiviteRepository, ModelMapper modelMapper) {
        this.sousActiviteRepository = sousActiviteRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public List<SousActiviteDto> getAllSousActivite() {
        List<SousActivite> sousActivites=sousActiviteRepository.findAll();

        return sousActivites.stream().map((sousActivite)->modelMapper.map(sousActivite, SousActiviteDto.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<SousActiviteDto> getAllSousActiviteByActivite(String codActividad)
    {
        List<SousActivite> sousActivites=sousActiviteRepository.findAllByCodActividad(codActividad);

        return sousActivites.stream().map((sousActivite)->modelMapper.map(sousActivite, SousActiviteDto.class))
                .collect(Collectors.toList());
    }
}
