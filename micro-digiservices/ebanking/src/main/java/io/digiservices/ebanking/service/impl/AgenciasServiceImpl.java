package io.digiservices.ebanking.service.impl;


import io.digiservices.ebanking.entity.Agencias;
import io.digiservices.ebanking.paylaod.AgenciasDto;
import io.digiservices.ebanking.paylaod.AgenciasPkId;
import io.digiservices.ebanking.repository.AgenciasRepository;
import io.digiservices.ebanking.service.AgenciasService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
public class AgenciasServiceImpl implements AgenciasService {

    private AgenciasRepository agenciasRepository;
    private ModelMapper mapper;

    public AgenciasServiceImpl(AgenciasRepository agenciasRepository, ModelMapper mapper) {
        this.agenciasRepository = agenciasRepository;
        this.mapper = mapper;
    }

    @Override
    public AgenciasDto getInfoAgencias(AgenciasPkId agenciasPkId) {
        Agencias agencias=agenciasRepository.getReferenceById(agenciasPkId);
        return mapper.map(agencias,AgenciasDto.class);

    }
}

