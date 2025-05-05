package io.digiservices.ebanking.service.impl;

import io.digiservices.ebanking.entity.DirClientes;
import io.digiservices.ebanking.service.DirClientesService;
import io.digiservices.ebanking.paylaod.DirClientesDto;
import io.digiservices.ebanking.paylaod.DirClientesPKId;
import io.digiservices.ebanking.repository.DirClientesRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DirClientesServiceImpl implements DirClientesService {

    private DirClientesRepository dirClientesRepository;
    private ModelMapper modelMapper;

    public DirClientesServiceImpl(DirClientesRepository dirClientesRepository, ModelMapper modelMapper) {
        this.dirClientesRepository = dirClientesRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public DirClientesDto createDirClientes(DirClientesDto dirClientesDto) {
        DirClientes dirClientes=modelMapper.map(dirClientesDto,DirClientes.class);
        DirClientes dirClientes1=dirClientesRepository.save(dirClientes);
        DirClientesDto dirClientesResponse=modelMapper.map(dirClientes1,DirClientesDto.class);
        return dirClientesResponse;
    }

    @Override
    public List<DirClientesDto> getListDirClientes() {
        List<DirClientes> dirClientes=dirClientesRepository.findAll();
        return dirClientes.stream().map((dirClientes1)->modelMapper.map(dirClientes1,DirClientesDto.class))
                .collect(Collectors.toList());
    }

    @Override
    public DirClientesDto getInfoDirClientes(String codClientes) {
        DirClientes dirClientes=dirClientesRepository.findByDirClientesPKIdCodClientes(codClientes);
        return modelMapper.map(dirClientes,DirClientesDto.class);
    }

    @Override
    public DirClientesDto updateInfoDirClientes(DirClientesDto dirClientesDto, DirClientesPKId dirClientesPKId) {
        DirClientes dirClientes=dirClientesRepository.getReferenceById(dirClientesPKId);

        dirClientes.setCOD_PROVINCIA(dirClientesDto.getCOD_PROVINCIA());
        dirClientes.setDET_DIRECCION(dirClientesDto.getDET_DIRECCION());
        dirClientes.setTIP_DIRECCION(dirClientesDto.getTIP_DIRECCION());
        dirClientes.setCOD_DISTRITO(dirClientesDto.getCOD_DISTRITO());
        dirClientes.setCodCanton(dirClientesDto.getCodCanton());
        dirClientes.setCOD_PAIS(dirClientesDto.getCOD_PAIS());

        DirClientes dirClientes1=dirClientesRepository.save(dirClientes);
        DirClientesDto responseDirClientes=modelMapper.map(dirClientes1,DirClientesDto.class);
        return responseDirClientes;
    }
}
