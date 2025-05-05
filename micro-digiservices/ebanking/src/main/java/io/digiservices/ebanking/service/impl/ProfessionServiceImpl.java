package io.digiservices.ebanking.service.impl;

import io.digiservices.ebanking.service.ProfessionService;
import io.digiservices.ebanking.entity.Profession;
import io.digiservices.ebanking.paylaod.ProfessionDto;
import io.digiservices.ebanking.paylaod.ProfessionPKId;
import io.digiservices.ebanking.repository.ProfessionRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProfessionServiceImpl implements ProfessionService {

    private ProfessionRepository professionRepository;
    private ModelMapper modelMapper;

    public ProfessionServiceImpl(ProfessionRepository professionRepository, ModelMapper modelMapper) {
        this.professionRepository = professionRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public List<ProfessionDto> getAllProfession() {
        List<Profession> professions=professionRepository.findAll();
        return professions.stream().map((profession)->modelMapper.map(profession,ProfessionDto.class))
                .collect(Collectors.toList());
    }

    @Override
    public ProfessionDto getInfoProfession(ProfessionPKId professionPKId) {
        Profession profession=professionRepository.getReferenceById(professionPKId);
        return modelMapper.map(profession,ProfessionDto.class);
    }
}
