package io.digiservices.ebanking.controller;

import io.digiservices.ebanking.paylaod.TypePlazoDto;
import io.digiservices.ebanking.service.TypePlazoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/ebanking/ecredit")
public class TypePlazoController {

    private TypePlazoService typePlazoService;

    public TypePlazoController(TypePlazoService typePlazoService) {
        this.typePlazoService = typePlazoService;
    }

    @GetMapping("/typePlazo")
    public ResponseEntity<List<TypePlazoDto>> getAllTypePlazo()
    {
        return ResponseEntity.ok(typePlazoService.getAllTypePlazo());
    }
}
