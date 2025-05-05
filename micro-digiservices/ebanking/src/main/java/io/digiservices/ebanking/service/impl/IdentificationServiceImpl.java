package io.digiservices.ebanking.service.impl;

import io.digiservices.ebanking.entity.Identification;
import io.digiservices.ebanking.paylaod.IdentificationDto;
import io.digiservices.ebanking.paylaod.IdentificationPKId;
import io.digiservices.ebanking.repository.IdentificationRepository;
import io.digiservices.ebanking.service.IdentificationService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
public class IdentificationServiceImpl implements IdentificationService {

    private IdentificationRepository identificationRepository;
    private ModelMapper modelMapper;

    public IdentificationServiceImpl(IdentificationRepository identificationRepository, ModelMapper modelMapper) {
        this.identificationRepository = identificationRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public IdentificationDto getIdentification(IdentificationPKId identificationPKId) {
        Identification identification =identificationRepository.getReferenceById(identificationPKId);
        return modelMapper.map(identification,IdentificationDto.class);
    }

    @Override
    public IdentificationDto createDatos(IdentificationDto identificationDto) {
        Identification identification=modelMapper.map(identificationDto,Identification.class);
        Identification identification1=identificationRepository.save(identification);
        IdentificationDto identificationResponse=modelMapper.map(identification1,IdentificationDto.class);
        return identificationResponse;
    }

    @Override
    public IdentificationDto updateIdentificationClientes(IdentificationDto identificationDto, IdentificationPKId identificationPKId)
    {
        Identification id=identificationRepository.getReferenceById(identificationPKId);
        id.setFECH_NACIMIENTO(identificationDto.getFECH_NACIMIENTO());
        id.setNOM_BENEFICIARIO(identificationDto.getNOM_BENEFICIARIO());
        id.setRELAC_BENEFICIARIO(identificationDto.getRELAC_BENEFICIARIO());
        Identification id1=identificationRepository.save(id);
        IdentificationDto responseId=modelMapper.map(id1,IdentificationDto.class);
        return responseId;
    }
}
