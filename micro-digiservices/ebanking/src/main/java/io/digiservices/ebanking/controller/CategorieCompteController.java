package io.digiservices.ebanking.controller;

import io.digiservices.ebanking.paylaod.CategorieCompteDto;
import io.digiservices.ebanking.paylaod.CategorieComptePKId;
import io.digiservices.ebanking.service.CategorieCompteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/ebanking/ecredit")
@RequiredArgsConstructor
public class CategorieCompteController {

    private final CategorieCompteService categorieCompteService;

    @GetMapping("/{codEmpresa}/{codCategoria}/categorieCompte")
    public ResponseEntity<CategorieCompteDto> getCategorieCompte(
            @PathVariable(name = "codEmpresa") String codEmpresa,
            @PathVariable(name = "codCategoria") String codCategoria)
    {
        return ResponseEntity.ok(categorieCompteService.getCategorieCompte(new CategorieComptePKId(codEmpresa,codCategoria)));
    }

    @GetMapping("/listProductCategorie")
    public List<Object[]> getListCategorieProduct()
    {
        return categorieCompteService.getListCategorieProduct();
    }

}
