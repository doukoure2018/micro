package io.digiservices.ebanking.service.impl;

import io.digiservices.ebanking.entity.AstoDetail;
import io.digiservices.ebanking.paylaod.AstoDetailDto;
import io.digiservices.ebanking.paylaod.AstoDetailPkId;
import io.digiservices.ebanking.repository.AstoDetailRepository;
import io.digiservices.ebanking.service.AstoDetailService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
public class AstoDetailServiceImpl implements AstoDetailService {

    private AstoDetailRepository astoDetailRepository;
    private ModelMapper mapper;

    public AstoDetailServiceImpl(AstoDetailRepository astoDetailRepository, ModelMapper mapper) {
        this.astoDetailRepository = astoDetailRepository;
        this.mapper = mapper;
    }

    @Override
    public AstoDetailDto getInfoAstoDetailById(AstoDetailPkId astoDetailPkId) {
        AstoDetail astoDetail=astoDetailRepository.getReferenceById(astoDetailPkId);
        return mapToDto(astoDetail);
    }

    @Override
    public AstoDetailDto createAstoDetail(AstoDetailDto astoDetailDto)
    {
        AstoDetail astoDetail=mapToEntity(astoDetailDto);
        AstoDetail astoDetail1=astoDetailRepository.save(astoDetail);
        AstoDetailDto responseAstDetail=mapToDto(astoDetail1);
        return responseAstDetail;
    }

    @Override
    public AstoDetailDto updateAstoDetail(AstoDetailDto astoDetailDto, AstoDetailPkId astoDetailPkId) {
        AstoDetail astoDetail=astoDetailRepository.getReferenceById(astoDetailPkId);
        astoDetail.setFEC_MOVIMIENTO(astoDetailDto.getFEC_MOVIMIENTO());
        AstoDetail astoDetail1=astoDetailRepository.save(astoDetail);
        return mapper.map(astoDetail1,AstoDetailDto.class);
    }

    @Override
    public AstoDetailDto updateAstoDetailReferencia(AstoDetailDto astoDetailDto, AstoDetailPkId astoDetailPkId) {
        AstoDetail astoDetail=astoDetailRepository.getReferenceById(astoDetailPkId);
        astoDetail.setREFERENCIA(astoDetailDto.getREFERENCIA());
        AstoDetail astoDetail1=astoDetailRepository.save(astoDetail);
        return mapper.map(astoDetail1,AstoDetailDto.class);
    }

    //Convert Entity into Dto
    private AstoDetailDto mapToDto(AstoDetail astoDetail)
    {
        AstoDetailDto astoDetailDto =mapper.map(astoDetail, AstoDetailDto.class);
        return astoDetailDto;
    }

    // Convert Dto into Entity
    private AstoDetail mapToEntity(AstoDetailDto astoDetailDto)
    {
        AstoDetail astoDetail =mapper.map(astoDetailDto, AstoDetail.class);
        return astoDetail;
    }


}
