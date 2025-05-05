package io.digiservices.ebanking.service.impl;

import io.digiservices.ebanking.entity.Requisito;
import io.digiservices.ebanking.paylaod.RequisitoDto;
import io.digiservices.ebanking.repository.RequisitoRepository;
import io.digiservices.ebanking.service.RequisitoService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RequisitoServiceImpl implements RequisitoService {

    private RequisitoRepository requisitoRepository;
    private ModelMapper modelMapper;

    public RequisitoServiceImpl(RequisitoRepository requisitoRepository, ModelMapper modelMapper) {
        this.requisitoRepository = requisitoRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public RequisitoDto createRequisito(RequisitoDto requisitoDto) {
        // map to entity
        Requisito requisito=modelMapper.map(requisitoDto,Requisito.class);
        Requisito requisito1=requisitoRepository.save(requisito);
        RequisitoDto requistoResponse=modelMapper.map(requisito1,RequisitoDto.class);
        return requistoResponse;
    }

    @Override
    public List<RequisitoDto> getAllRequisito() {
        List<Requisito> requisitos=requisitoRepository.findAll();
        return requisitos.stream().map((requisito)->modelMapper.map(requisito,RequisitoDto.class))
                .collect(Collectors.toList());
    }

}
