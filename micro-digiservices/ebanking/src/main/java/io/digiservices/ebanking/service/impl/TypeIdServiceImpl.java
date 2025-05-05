package io.digiservices.ebanking.service.impl;


import io.digiservices.ebanking.entity.TypeId;
import io.digiservices.ebanking.paylaod.TypeIdDto;
import io.digiservices.ebanking.repository.TypeIdRepository;
import io.digiservices.ebanking.service.TypeIdService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TypeIdServiceImpl implements TypeIdService {

    private TypeIdRepository typeIdRepository;
    private ModelMapper modelMapper;

    public TypeIdServiceImpl(TypeIdRepository typeIdRepository, ModelMapper modelMapper) {
        this.typeIdRepository = typeIdRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public List<TypeIdDto> getAllTypeId() {
        List<TypeId> typeIds=typeIdRepository.findAll();
        return typeIds.stream().map((typeId)->modelMapper.map(typeId,TypeIdDto.class))
                .collect(Collectors.toList());
    }
}
