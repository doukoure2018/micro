package io.digiservices.ebanking.service.impl;


import io.digiservices.ebanking.entity.Personas;
import io.digiservices.ebanking.paylaod.PersonaPKId;
import io.digiservices.ebanking.paylaod.PersonasDto;
import io.digiservices.ebanking.repository.PersonasRepository;
import io.digiservices.ebanking.service.PersonasService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
public class PersonasServiceImpl implements PersonasService {

    private PersonasRepository personasRepository;
    private ModelMapper mapper;

    public PersonasServiceImpl(PersonasRepository personasRepository, ModelMapper mapper) {
        this.personasRepository = personasRepository;
        this.mapper = mapper;
    }

    @Override
    public PersonasDto createPersona(PersonasDto personasDto) {
        Personas personas=mapper.map(personasDto,Personas.class);
        Personas personas1=personasRepository.save(personas);
        PersonasDto personaResponse=mapper.map(personas1,PersonasDto.class);
        return personaResponse;
    }

    @Override
    public PersonasDto getInfoPersona(PersonaPKId personaPKId) {
        Personas personas=personasRepository.getReferenceById(personaPKId);
        return mapper.map(personas,PersonasDto.class);
    }

    @Override
    public PersonasDto getPersona(String codClientes) {
        Personas personas=personasRepository.findByPersonaPKIdCodClientes(codClientes);
        return mapper.map(personas,PersonasDto.class);
    }

    @Override
    public PersonasDto updateInfoPersona(PersonasDto personasDto, PersonaPKId personaPKId) {
        Personas personas=personasRepository.getReferenceById(personaPKId);

        personas.setCOD_PROFESION(personasDto.getCOD_PROFESION());
        personas.setCOD_ACTIVIDAD(personasDto.getCOD_ACTIVIDAD());
        personas.setCOD_SECTOR(personasDto.getCOD_SECTOR());
        personas.setNACIONALIDAD(personasDto.getNACIONALIDAD());
        personas.setIND_SEXO(personasDto.getIND_SEXO());
        personas.setLUGAR_NACIMIENTO(personasDto.getLUGAR_NACIMIENTO());
        personas.setANTIGUEDAD_PUESTO(personasDto.getANTIGUEDAD_PUESTO());
        personas.setANTIGUEDAD_RESIDENCIA(personasDto.getANTIGUEDAD_RESIDENCIA());
        personas.setNUM_HIJOS(personasDto.getNUM_HIJOS());
        personas.setPRIMER_APELLIDO(personasDto.getPRIMER_APELLIDO());
        personas.setPRIMER_NOMBRE(personasDto.getPRIMER_NOMBRE());
        personas.setTENENCIA_VIVIENDA(personasDto.getTENENCIA_VIVIENDA());
        personas.setTENENCIA_PUESTO(personasDto.getTENENCIA_PUESTO());
        personas.setEST_CIVIL(personasDto.getEST_CIVIL());
        personas.setConjoint(personasDto.getConjoint());

        Personas personas1=personasRepository.save(personas);
        PersonasDto personasDto1=mapper.map(personas1,PersonasDto.class);
        return personasDto1;
    }
}
