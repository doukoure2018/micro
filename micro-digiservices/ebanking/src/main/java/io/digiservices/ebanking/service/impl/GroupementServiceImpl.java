package io.digiservices.ebanking.service.impl;

import io.digiservices.ebanking.entity.Groupement;
import io.digiservices.ebanking.paylaod.GroupementDto;
import io.digiservices.ebanking.repository.GroupementRepository;
import io.digiservices.ebanking.service.GroupementService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class GroupementServiceImpl implements GroupementService {

    private GroupementRepository groupementRepository;
    private ModelMapper modelMapper;

    public GroupementServiceImpl(GroupementRepository groupementRepository, ModelMapper modelMapper) {
        this.groupementRepository = groupementRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public GroupementDto createGroupement(GroupementDto groupementDto) {
        Groupement groupement=mapToEntity(groupementDto);
        Groupement groupement1=groupementRepository.save(groupement);
        GroupementDto groupementResponse=mapToDto(groupement1);
        return groupementResponse;
    }

    @Override
    public List<GroupementDto> getAllMembreByCodCliente(String codCliente) {
        List<Groupement> groupements=groupementRepository.findByGroupementPKIdCodCliente(codCliente);
        return groupements.stream().map(groupement -> modelMapper.map(groupement,GroupementDto.class))
                .collect(Collectors.toList());
    }


    //Convert Entity into Dto
    private GroupementDto mapToDto(Groupement groupement){
        GroupementDto groupementDto =modelMapper.map(groupement, GroupementDto.class);
        return groupementDto;
    }

    // Convert Dto into Entity
    private Groupement mapToEntity(GroupementDto groupementDto)
    {
        Groupement groupement =modelMapper.map(groupementDto, Groupement.class);
        return groupement;
    }
}
