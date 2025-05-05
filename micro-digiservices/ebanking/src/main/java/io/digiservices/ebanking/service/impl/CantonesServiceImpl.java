package io.digiservices.ebanking.service.impl;

import io.digiservices.ebanking.entity.Cantones;
import io.digiservices.ebanking.paylaod.CantonesDto;
import io.digiservices.ebanking.paylaod.CantonesPKId;
import io.digiservices.ebanking.repository.CantonesRepository;
import io.digiservices.ebanking.service.CantonesService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CantonesServiceImpl implements CantonesService {

    private CantonesRepository cantonesRepository;
    private ModelMapper mapper;

    public CantonesServiceImpl(CantonesRepository cantonesRepository, ModelMapper mapper) {
        this.cantonesRepository = cantonesRepository;
        this.mapper = mapper;
    }

    @Override
    public List<CantonesDto> listCantones() {
        List<Cantones> cantones=cantonesRepository.findAll();
        return cantones.stream().map((cantones1)->mapper.map(cantones1,CantonesDto.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<CantonesDto> getListeByCodProvincia(String codProvincia) {
        List<Cantones> cantones=cantonesRepository.findAllByCantonesPKIdCodProvincia(codProvincia);
        return cantones.stream().map((cantones1)->mapper.map(cantones1,CantonesDto.class))
                .collect(Collectors.toList());
    }

    @Override
    public CantonesDto getInfoCommune(CantonesPKId cantonesPKId) {
        Cantones cantones=cantonesRepository.getReferenceById(cantonesPKId);
        return mapper.map(cantones,CantonesDto.class);
    }


}
