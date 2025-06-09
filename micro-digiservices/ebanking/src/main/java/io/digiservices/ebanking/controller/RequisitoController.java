package io.digiservices.ebanking.controller;

import io.digiservices.ebanking.paylaod.RequisitoDto;
import io.digiservices.ebanking.service.RequisitoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/ebanking")
public class RequisitoController {

    private RequisitoService requisitoService;

    public RequisitoController(RequisitoService requisitoService) {
        this.requisitoService = requisitoService;
    }

    @GetMapping("/requisitos")
    public ResponseEntity<List<RequisitoDto>> getAllRequisito()
    {
        return ResponseEntity.ok(requisitoService.getAllRequisito());
    }
}
