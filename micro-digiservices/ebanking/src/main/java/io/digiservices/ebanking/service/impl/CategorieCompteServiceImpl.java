package io.digiservices.ebanking.service.impl;


import io.digiservices.ebanking.entity.CategorieCompte;
import io.digiservices.ebanking.paylaod.CategorieCompteDto;
import io.digiservices.ebanking.paylaod.CategorieComptePKId;
import io.digiservices.ebanking.repository.CategorieCompteRepository;
import io.digiservices.ebanking.service.CategorieCompteService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategorieCompteServiceImpl implements CategorieCompteService {

    private CategorieCompteRepository categorieCompteRepository;
    private ModelMapper mapper;

    public CategorieCompteServiceImpl(CategorieCompteRepository categorieCompteRepository, ModelMapper mapper) {
        this.categorieCompteRepository = categorieCompteRepository;
        this.mapper = mapper;
    }

    @Override
    public CategorieCompteDto getCategorieCompte(CategorieComptePKId categorieComptePKId) {
        CategorieCompte categorieCompte=categorieCompteRepository.getReferenceById(categorieComptePKId);

        return mapper.map(categorieCompte,CategorieCompteDto.class);
    }

    @Override
    public List<Object[]> getListCategorieProduct() {

        List<Object[]> objects=categorieCompteRepository.getListCategorieProduct();
        return objects.stream().toList();
    }



}
