package io.digiservices.ebanking.service.impl;

import io.digiservices.ebanking.entity.CargoCredit;
import io.digiservices.ebanking.paylaod.CargoCreditDto;
import io.digiservices.ebanking.repository.CargoCreditRepository;
import io.digiservices.ebanking.service.CargoCreditService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CargoCreditServiceImpl implements CargoCreditService {

    private CargoCreditRepository cargoCreditRepository;
    private ModelMapper modelMapper;

    public CargoCreditServiceImpl(CargoCreditRepository cargoCreditRepository, ModelMapper modelMapper) {
        this.cargoCreditRepository = cargoCreditRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public CargoCreditDto createCargoCredit(CargoCreditDto cargoCreditDto) {
        CargoCredit cargoCredit=modelMapper.map(cargoCreditDto,CargoCredit.class);
        CargoCredit cargoCredit1=cargoCreditRepository.save(cargoCredit);
        CargoCreditDto cargoCreditoResponse=modelMapper.map(cargoCredit1,CargoCreditDto.class);
        return cargoCreditoResponse;
    }

    @Override
    public List<CargoCreditDto> getAllCargoCredito() {
        List<CargoCredit> cargoCredit=cargoCreditRepository.findAll();
        return cargoCredit.stream().map((cargoCredit1)->modelMapper.map(cargoCredit1,CargoCreditDto.class))
                .collect(Collectors.toList());
    }


}
