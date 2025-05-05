package io.digiservices.ebanking.service.impl;

import io.digiservices.ebanking.service.IdClientesService;
import io.digiservices.ebanking.entity.IdClientes;
import io.digiservices.ebanking.paylaod.IdClientesDto;
import io.digiservices.ebanking.paylaod.IdClientesPKId;
import io.digiservices.ebanking.repository.IdClientesRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class IdClientesServiceImpl implements IdClientesService {

    private IdClientesRepository idClientesRepository;
    private ModelMapper modelMapper;

    public IdClientesServiceImpl(IdClientesRepository idClientesRepository, ModelMapper modelMapper) {
        this.idClientesRepository = idClientesRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public IdClientesDto createIdClientesId(IdClientesDto idClientesDto) {
        IdClientes idClientes=modelMapper.map(idClientesDto,IdClientes.class);
        IdClientes idClientes1=idClientesRepository.save(idClientes);
        IdClientesDto idClientesResponse=modelMapper.map(idClientes1,IdClientesDto.class);

        return idClientesResponse;
    }

    @Override
    public List<IdClientesDto> getAllIdClientes() {
        List<IdClientes> idClientes=idClientesRepository.findAll();
        return idClientes.stream().map((idClientes1)->modelMapper.map(idClientes1,IdClientesDto.class))
                .collect(Collectors.toList());
    }

    @Override
    public IdClientesDto getInfoIdClientes(String codClientes) {
        IdClientes idClientes=idClientesRepository.findByIdClientesPKId_CodClientes(codClientes);
        return modelMapper.map(idClientes,IdClientesDto.class);
    }

    @Override
    public IdClientesDto updateIdClientes(IdClientesDto idClientesDto, String codClientes) {
        IdClientes idClientes=idClientesRepository.findByIdClientesPKId_CodClientes(codClientes);

        idClientes.setIdClientesPKId(new IdClientesPKId("00000",codClientes,idClientes.getIdClientesPKId().getCOD_TIPO_ID(),idClientes.getIdClientesPKId().getNUM_ID()));

        idClientes.setFEC_VENCIM(idClientesDto.getFEC_VENCIM());
        IdClientes idClientes1=idClientesRepository.save(idClientes);
        IdClientesDto responseIdClientes=modelMapper.map(idClientes1,IdClientesDto.class);
        return responseIdClientes;
    }

    @Override
    public IdClientesDto getInfoIdClientesByCodClient(String codClient) {
        IdClientes idClientes = idClientesRepository.findByIdClientesPKId_CodClientes(codClient);
        System.out.println(idClientes.getIdClientesPKId().getCOD_TIPO_ID());
        return modelMapper.map(idClientes,IdClientesDto.class);
    }
}
