package io.digiservices.ebanking.service.impl;


import io.digiservices.ebanking.entity.Activida;
import io.digiservices.ebanking.exception.ResourceNotFoundException;
import io.digiservices.ebanking.paylaod.ActividaDto;
import io.digiservices.ebanking.repository.ActividaRepository;
import io.digiservices.ebanking.service.ActividaService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ActividaServiceImpl implements ActividaService {

    private ActividaRepository actividaRepository;
    private ModelMapper modelMapper;

    public ActividaServiceImpl(ActividaRepository actividaRepository, ModelMapper modelMapper) {
        this.actividaRepository = actividaRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public List<ActividaDto> getAllActivida() {
        List<Activida> actividas=actividaRepository.findAll();
        return actividas.stream().map((activida)->modelMapper.map(activida, ActividaDto.class))
                .collect(Collectors.toList());
    }

    @Override
    public ActividaDto getInfoActivite(String Id) {
        Activida activida = actividaRepository.findById(Id).orElseThrow(() -> new ResourceNotFoundException("Activida", "Id", Id));
        return modelMapper.map(activida,ActividaDto.class);
    }


}
