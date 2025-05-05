package io.digiservices.ebanking.service.impl;

import io.digiservices.ebanking.entity.PersonneMorale;
import io.digiservices.ebanking.paylaod.PersonneMoraleDto;
import io.digiservices.ebanking.paylaod.PersonneMoralePKId;
import io.digiservices.ebanking.repository.PersonneMoraleRepository;
import io.digiservices.ebanking.service.PersonneMoraleService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
public class PersonneMoraleServiceImpl implements PersonneMoraleService {

    private PersonneMoraleRepository personneMoraleRepository;
    private ModelMapper mapper;

    public PersonneMoraleServiceImpl(PersonneMoraleRepository personneMoraleRepository, ModelMapper mapper) {
        this.personneMoraleRepository = personneMoraleRepository;
        this.mapper = mapper;
    }


    @Override
    public PersonneMoraleDto getListPersonneMorale(PersonneMoralePKId personneMoralePKId) {
        PersonneMorale personneMorale=personneMoraleRepository.getReferenceById(personneMoralePKId);
        return mapper.map(personneMorale,PersonneMoraleDto.class);
    }

    @Override
    public PersonneMoraleDto createPersonneMorale(PersonneMoraleDto personneMoraleDto) {
        PersonneMorale personneMorale=mapper.map(personneMoraleDto,PersonneMorale.class);
        PersonneMorale personneMorale1=personneMoraleRepository.save(personneMorale);

        PersonneMoraleDto personneMoraleResponse=mapper.map(personneMorale1,PersonneMoraleDto.class);

        return personneMoraleResponse;
    }

    @Override
    public PersonneMoraleDto updatePersonneMorale(PersonneMoraleDto personneMoraleDto, PersonneMoralePKId personneMoralePKId) {
        PersonneMorale personneMorale=personneMoraleRepository.getReferenceById(personneMoralePKId);
        personneMorale.setCOD_SECTOR(personneMoraleDto.getCOD_SECTOR());
        personneMorale.setCOD_ACTIVIDAD(personneMoraleDto.getCOD_ACTIVIDAD());
        personneMorale.setRAZON_SOCIAL(personneMoraleDto.getRAZON_SOCIAL());
        personneMorale.setNOM_COMERCIAL(personneMoraleDto.getNOM_COMERCIAL());
        PersonneMorale personneMorale1=personneMoraleRepository.save(personneMorale);
        PersonneMoraleDto responsePersonneMorale=mapper.map(personneMorale1,PersonneMoraleDto.class);
        return responsePersonneMorale;
    }
}
