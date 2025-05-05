package io.digiservices.ebanking.controller;


import io.digiservices.ebanking.paylaod.CategorieClienteDto;
import io.digiservices.ebanking.service.CategorieClienteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/ebanking/ecredit")
public class CategorieClienteController {

    private CategorieClienteService categorieClienteService;

    public CategorieClienteController(CategorieClienteService categorieClienteService) {
        this.categorieClienteService = categorieClienteService;
    }

    @GetMapping("/categorieClientes")
    public ResponseEntity<List<CategorieClienteDto>> getAllCategorieClientes()
    {
        return ResponseEntity.ok(categorieClienteService.getAllCategorieCliente());
    }
}
