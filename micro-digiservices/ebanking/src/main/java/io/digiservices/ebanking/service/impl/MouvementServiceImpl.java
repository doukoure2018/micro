package io.digiservices.ebanking.service.impl;

import io.digiservices.ebanking.entity.Mouvement;
import io.digiservices.ebanking.paylaod.MouvementDto;
import io.digiservices.ebanking.paylaod.MouvementPkId;
import io.digiservices.ebanking.repository.MouvementRepository;
import io.digiservices.ebanking.service.MouvementService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
public class MouvementServiceImpl implements MouvementService {


    private MouvementRepository mouvementRepository;
    private ModelMapper modelMapper;

    public MouvementServiceImpl(MouvementRepository mouvementRepository, ModelMapper modelMapper) {
        this.mouvementRepository = mouvementRepository;
        this.modelMapper = modelMapper;
    }


    @Override
    public MouvementDto createMouvement(MouvementDto mouvementDto) {
        Mouvement mouvement=mapToEntity(mouvementDto);
        Mouvement mouvement1=mouvementRepository.save(mouvement);
        MouvementDto mouvementResponse=mapToDTO(mouvement1);
        return mouvementResponse;
    }

    @Override
    public MouvementDto getInfoMouvement(MouvementPkId mouvementPkId) {
        Mouvement mouvement=mouvementRepository.getReferenceById(mouvementPkId);
        return mapToDTO(mouvement);
    }


    // convert Entity into DTO
    private MouvementDto mapToDTO(Mouvement mouvement){
        MouvementDto mouvementDto = modelMapper.map(mouvement,MouvementDto.class);
        return mouvementDto;
    }

    // convert DTO to entity
    private Mouvement mapToEntity(MouvementDto mouvementDto){
        Mouvement mouvement  = modelMapper.map(mouvementDto, Mouvement.class);
        return mouvement;
    }
}
