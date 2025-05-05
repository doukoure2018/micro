package io.digiservices.ebanking.service;


import io.digiservices.ebanking.paylaod.CompteDto;
import io.digiservices.ebanking.paylaod.ComptePKId;

import java.util.List;

public interface CompteService {

    CompteDto getInfoClientes(ComptePKId comptePKId);

    List<CompteDto> getComptesByClient(String codClientes);

    CompteDto getCompte(String codClientes,String codCategoria,String codProducto);

    CompteDto createCompte(CompteDto compteDto);

    CompteDto getInfoCompteByNumCompte(ComptePKId comptePKId);

//    List<Object> getInstanceCompte(String codEmpresa,String numCuenta);

    CompteDto updateCompte(CompteDto compteDto,ComptePKId comptePKId);

    CompteDto getInfoSoldeDisponibleByProd(String codClientes,String codProducto);

    CompteDto getInfoNumCompte(String numCuenta);


}

