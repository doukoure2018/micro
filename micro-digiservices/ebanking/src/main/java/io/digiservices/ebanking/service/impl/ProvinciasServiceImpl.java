package io.digiservices.ebanking.service.impl;

import io.digiservices.ebanking.entity.Provincias;
import io.digiservices.ebanking.paylaod.ProvinciasDto;
import io.digiservices.ebanking.paylaod.ProvinciasPKId;
import io.digiservices.ebanking.repository.ProvinciasRepository;
import io.digiservices.ebanking.service.ProvinciasService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProvinciasServiceImpl implements ProvinciasService {

    private ProvinciasRepository provinciasRepository;
    private ModelMapper mapper;

    public ProvinciasServiceImpl(ProvinciasRepository provinciasRepository, ModelMapper mapper) {
        this.provinciasRepository = provinciasRepository;
        this.mapper = mapper;
    }

    @Override
    public List<ProvinciasDto> getListProvincias() {
        List<Provincias> provincias=provinciasRepository.findAll();
        return provincias.stream().map((provincias1)->mapper.map(provincias1,ProvinciasDto.class))
                .collect(Collectors.toList());
    }

    @Override
    public ProvinciasDto getInfoProvincia(ProvinciasPKId provinciasPKId) {
        Provincias provincias=provinciasRepository.getReferenceById(provinciasPKId);
        return mapper.map(provincias,ProvinciasDto.class);
    }
}
