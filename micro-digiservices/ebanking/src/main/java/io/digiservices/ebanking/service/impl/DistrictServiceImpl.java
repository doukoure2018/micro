package io.digiservices.ebanking.service.impl;

import io.digiservices.ebanking.entity.District;
import io.digiservices.ebanking.paylaod.DistrictDto;
import io.digiservices.ebanking.repository.DistrictRepository;
import io.digiservices.ebanking.service.DistrictService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DistrictServiceImpl implements DistrictService {

    private DistrictRepository districtRepository;
    private ModelMapper modelMapper;

    public DistrictServiceImpl(DistrictRepository districtRepository, ModelMapper modelMapper) {
        this.districtRepository = districtRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public List<DistrictDto> getListDistrict() {
        List<District> districts=districtRepository.findAll();
        return districts.stream().map((district)->modelMapper.map(district, DistrictDto.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<DistrictDto> getListDistrictByCodCanton(String codCanton,String codProvincia) {
        List<District> districts=districtRepository.findAllByCodCantonAndCodProvincia(codCanton,codProvincia);
        return districts.stream().map((district)->modelMapper.map(district,DistrictDto.class))
                .collect(Collectors.toList());
    }

    @Override
    public DistrictDto getInfoDistricto(String codCanton, String codProvincia, String codDistrito) {
        District district=districtRepository.findByCodCantonAndCodProvinciaAndCodDistrito(codCanton,codProvincia,codDistrito);

        return modelMapper.map(district,DistrictDto.class);
    }

}
