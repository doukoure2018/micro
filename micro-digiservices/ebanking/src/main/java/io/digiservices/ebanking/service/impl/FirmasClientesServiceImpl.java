package io.digiservices.ebanking.service.impl;


import io.digiservices.ebanking.service.FirmasClientesService;
import io.digiservices.ebanking.entity.FirmasClientes;
import io.digiservices.ebanking.paylaod.FirmasClientesDto;
import io.digiservices.ebanking.paylaod.FirmasClientesPkId;
import io.digiservices.ebanking.repository.FirmasClientesRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
public class FirmasClientesServiceImpl implements FirmasClientesService {

    private FirmasClientesRepository firmasClientesRepository;

    private ModelMapper mapper;


    public FirmasClientesServiceImpl(FirmasClientesRepository firmasClientesRepository, ModelMapper mapper) {
        this.firmasClientesRepository = firmasClientesRepository;
        this.mapper = mapper;
    }

    @Override
    public FirmasClientesDto createFirmaClientes(FirmasClientesDto firmasClientesDto) {
        FirmasClientes firmasClientes=mapToEntity(firmasClientesDto);
        FirmasClientes f1=firmasClientesRepository.save(firmasClientes);
        FirmasClientesDto firmasResponse=mapToDTO(f1);
        return firmasResponse;
    }

    @Override
    public FirmasClientesDto getInfoFirmaClientes(FirmasClientesPkId firmasClientesPkId) {
        FirmasClientes firmasClientes=firmasClientesRepository.getReferenceById(firmasClientesPkId);
        return mapToDTO(firmasClientes);
    }

    // convert Entity into DTO
    private FirmasClientesDto mapToDTO(FirmasClientes firmasClientes){
        FirmasClientesDto firmasClientesDto = mapper.map(firmasClientes,FirmasClientesDto.class);
        return firmasClientesDto;
    }

    // convert DTO to entity
    private FirmasClientes mapToEntity(FirmasClientesDto firmasClientesDto){
        FirmasClientes firmasClientes = mapper.map(firmasClientesDto, FirmasClientes.class);
        return firmasClientes;
    }

}

