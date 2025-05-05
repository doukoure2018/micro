package io.digiservices.ebanking.service.impl;

import io.digiservices.ebanking.entity.Charges;
import io.digiservices.ebanking.paylaod.ChargesDto;
import io.digiservices.ebanking.repository.ChargesRepository;
import io.digiservices.ebanking.service.ChargesService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChargesServiceImpl implements ChargesService {

    private ChargesRepository chargesRepository;
    private ModelMapper modelMapper;

    public ChargesServiceImpl(ChargesRepository chargesRepository, ModelMapper modelMapper) {
        this.chargesRepository = chargesRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public List<ChargesDto> getllCharges() {
        List<Charges> charges=chargesRepository.findAll();

        return charges.stream().map((charges1)->modelMapper.map(charges1, ChargesDto.class))
                .collect(Collectors.toList());
    }
}
