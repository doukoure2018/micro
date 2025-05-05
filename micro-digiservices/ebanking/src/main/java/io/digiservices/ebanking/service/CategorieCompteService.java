package io.digiservices.ebanking.service;

import io.digiservices.ebanking.paylaod.CategorieCompteDto;
import io.digiservices.ebanking.paylaod.CategorieComptePKId;

import java.util.List;

public interface CategorieCompteService {

    CategorieCompteDto getCategorieCompte(CategorieComptePKId categorieComptePKId);

    List<Object[]> getListCategorieProduct();



}
