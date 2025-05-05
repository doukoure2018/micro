package io.digiservices.ebanking.service.impl;

import io.digiservices.ebanking.entity.OrigineFond;
import io.digiservices.ebanking.paylaod.OrigineFondDto;
import io.digiservices.ebanking.repository.OrigineFondRepository;
import io.digiservices.ebanking.service.OrigineFondService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrigineFondServiceImpl implements OrigineFondService {

    private OrigineFondRepository origineFondRepository;
    private ModelMapper modelMapper;

    public OrigineFondServiceImpl(OrigineFondRepository origineFondRepository, ModelMapper modelMapper) {
        this.origineFondRepository = origineFondRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public List<OrigineFondDto> getAllOrigineFond() {
        List<OrigineFond> origineFonds=origineFondRepository.findAll();
        return origineFonds.stream().map((origineFond)->modelMapper.map(origineFond, OrigineFondDto.class))
                .collect(Collectors.toList());
    }
}
