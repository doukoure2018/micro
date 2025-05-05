package io.digiservices.ebanking.service.impl;

import io.digiservices.ebanking.entity.TypeCredit;
import io.digiservices.ebanking.paylaod.TypeCreditDto;
import io.digiservices.ebanking.paylaod.TypeCreditPKId;
import io.digiservices.ebanking.repository.TypeCreditRepository;
import io.digiservices.ebanking.service.TypeCreditService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TypeCreditServiceImpl implements TypeCreditService {

    private ModelMapper modelMapper;
    private TypeCreditRepository typeCreditRepository;

    public TypeCreditServiceImpl(ModelMapper modelMapper, TypeCreditRepository typeCreditRepository) {
        this.modelMapper = modelMapper;
        this.typeCreditRepository = typeCreditRepository;
    }

    @Override
    public List<TypeCreditDto> getAllTypeCredito() {
        List<TypeCredit> typeCredits=typeCreditRepository.findAll();
        return typeCredits.stream().map((typeCredit) -> modelMapper.map(typeCredit, TypeCreditDto.class))
                .collect(Collectors.toList());
    }

    @Override
    public TypeCreditDto getTypeCredito(TypeCreditPKId typeCreditPKId) {
        TypeCredit typeCredit=typeCreditRepository.getReferenceById(typeCreditPKId);
        return modelMapper.map(typeCredit,TypeCreditDto.class);
    }


}
