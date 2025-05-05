package io.digiservices.ebanking.service.impl;

import io.digiservices.ebanking.entity.ReqCredito;
import io.digiservices.ebanking.paylaod.ReqCreditoDto;
import io.digiservices.ebanking.repository.ReqCreditoRepository;
import io.digiservices.ebanking.service.ReqCreditoService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReqCreditoServiceImpl implements ReqCreditoService {

    private ReqCreditoRepository reqCreditoRepository;
    private ModelMapper mapper;

    public ReqCreditoServiceImpl(ReqCreditoRepository reqCreditoRepository, ModelMapper modelMapper) {
        this.reqCreditoRepository = reqCreditoRepository;
        this.mapper = modelMapper;
    }

    @Override
    public ReqCreditoDto createReqCredit(ReqCreditoDto reqCreditoDto) {
        ReqCredito reqCredito=mapToEntity(reqCreditoDto);
        ReqCredito reqCredito1=reqCreditoRepository.save(reqCredito);
        ReqCreditoDto reqCreditoResponse=mapToDto(reqCredito1);
        return reqCreditoResponse;
    }

    @Override
    public List<ReqCreditoDto> getAllReqCredito() {
        List<ReqCredito> reqCreditos=reqCreditoRepository.findAll();

        return reqCreditos.stream().map((reqCredito)->mapper.map(reqCredito,ReqCreditoDto.class))
                .collect(Collectors.toList());
    }

    //Convert Entity into Dto
    private ReqCreditoDto mapToDto(ReqCredito reqCredito){
        ReqCreditoDto reqCreditoDto =mapper.map(reqCredito, ReqCreditoDto.class);
        return reqCreditoDto;
    }

    // Convert Dto into Entity
    private ReqCredito mapToEntity(ReqCreditoDto reqCreditoDto)
    {
        ReqCredito reqCredito =mapper.map(reqCreditoDto, ReqCredito.class);
        return reqCredito;
    }


}
