package io.digiservices.ebanking.service.impl;

import io.digiservices.ebanking.entity.Resumen;
import io.digiservices.ebanking.paylaod.ResumenDto;
import io.digiservices.ebanking.paylaod.ResumenPkId;
import io.digiservices.ebanking.repository.ResumenRepository;
import io.digiservices.ebanking.service.ResumenService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
public class ResumenServiceImpl implements ResumenService {

    private ResumenRepository resumenRepository;
    private ModelMapper mapper;

    public ResumenServiceImpl(ResumenRepository resumenRepository, ModelMapper mapper) {
        this.resumenRepository = resumenRepository;
        this.mapper = mapper;
    }

    @Override
    public ResumenDto getInfoResumen(ResumenPkId resumenPkId) {
        Resumen resumen=resumenRepository.getReferenceById(resumenPkId);
        return mapper.map(resumen,ResumenDto.class);
    }

    @Override
    public ResumenDto createResumen(ResumenDto resumenDto) {
        Resumen resumen=mapper.map(resumenDto,Resumen.class);
        Resumen resumen1=resumenRepository.save(resumen);
        ResumenDto responseResumen=mapper.map(resumen1,ResumenDto.class);
        return responseResumen;
    }

}
