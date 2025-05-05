package io.digiservices.ebanking.service.impl;

import io.digiservices.ebanking.entity.CategorieCliente;
import io.digiservices.ebanking.paylaod.CategorieClienteDto;
import io.digiservices.ebanking.repository.CategorieClienteRepository;
import io.digiservices.ebanking.service.CategorieClienteService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategorieClienteServiceImpl implements CategorieClienteService {

    private CategorieClienteRepository categorieClienteRepository;
    private ModelMapper mapper;

    public CategorieClienteServiceImpl(CategorieClienteRepository categorieClienteRepository, ModelMapper mapper) {
        this.categorieClienteRepository = categorieClienteRepository;
        this.mapper = mapper;
    }

    @Override
    public List<CategorieClienteDto> getAllCategorieCliente() {
        List<CategorieCliente> categorieClientes=categorieClienteRepository.findAll();
        return categorieClientes.stream().map((categorieCliente)->mapper.map(categorieCliente,CategorieClienteDto.class))
                .collect(Collectors.toList());
    }
}

