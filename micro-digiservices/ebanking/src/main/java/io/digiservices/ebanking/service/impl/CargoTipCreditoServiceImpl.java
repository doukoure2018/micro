package io.digiservices.ebanking.service.impl;

import io.digiservices.ebanking.entity.CargoTipCredito;
import io.digiservices.ebanking.paylaod.CargoTipCreditoDto;
import io.digiservices.ebanking.repository.CargoTipCreditoRepository;
import io.digiservices.ebanking.service.CargoTipCreditoService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CargoTipCreditoServiceImpl implements CargoTipCreditoService {

    private CargoTipCreditoRepository cargoTipCreditoRepository;
    private ModelMapper modelMapper;

    public CargoTipCreditoServiceImpl(CargoTipCreditoRepository cargoTipCreditoRepository, ModelMapper modelMapper) {
        this.cargoTipCreditoRepository = cargoTipCreditoRepository;
        this.modelMapper = modelMapper;
    }


    @Override
    public List<CargoTipCreditoDto> getAllCargoTipCredito(Long tipCredito) {
        // je recupere toutes les donnees de la base de donnees
        List<CargoTipCredito> cargoTipCreditos=cargoTipCreditoRepository.findAllByTipCredito(tipCredito);
        return cargoTipCreditos.stream().map((cargoTipCredito)->modelMapper.map(cargoTipCredito,CargoTipCreditoDto.class))
                .collect(Collectors.toList());
    }
}
