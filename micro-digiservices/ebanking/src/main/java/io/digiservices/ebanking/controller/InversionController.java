package io.digiservices.ebanking.controller;

import io.digiservices.ebanking.paylaod.InversionDto;
import io.digiservices.ebanking.service.InversionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/ebanking/ecredit")
public class InversionController {

    private InversionService inversionService;

    public InversionController(InversionService inversionService) {
        this.inversionService = inversionService;
    }

    @GetMapping("/inversion")
    public ResponseEntity<List<InversionDto>> getAllInversion()
    {
        return ResponseEntity.ok(inversionService.getAllInversion());
    }
}
