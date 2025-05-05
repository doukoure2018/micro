package io.digiservices.ebanking.service.impl;


import io.digiservices.ebanking.entity.Inversion;
import io.digiservices.ebanking.paylaod.InversionDto;
import io.digiservices.ebanking.repository.InversionRepository;
import io.digiservices.ebanking.service.InversionService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class InversionServiceImpl implements InversionService {

    private InversionRepository inversionRepository;
    private ModelMapper modelMapper;

    public InversionServiceImpl(InversionRepository inversionRepository, ModelMapper modelMapper) {
        this.inversionRepository = inversionRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public List<InversionDto> getAllInversion() {
        List<Inversion> inversions=inversionRepository.findAll();

        return inversions.stream().map((inversion)->modelMapper.map(inversion,InversionDto.class))
                .collect(Collectors.toList());
    }
}
