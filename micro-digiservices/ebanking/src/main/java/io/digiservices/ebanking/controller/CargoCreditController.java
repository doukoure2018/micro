package io.digiservices.ebanking.controller;

import io.digiservices.ebanking.paylaod.CargoCreditDto;
import io.digiservices.ebanking.service.CargoCreditService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ebanking/ecredit")
public class CargoCreditController {

    private CargoCreditService cargoCreditService;

    public CargoCreditController(CargoCreditService cargoCreditService) {
        this.cargoCreditService = cargoCreditService;
    }

    @PostMapping("/createCargoCredito")
    public ResponseEntity<CargoCreditDto> createCargoCredit(
            @RequestBody CargoCreditDto cargoCreditDto)
    {
        return new ResponseEntity<>(cargoCreditService.createCargoCredit(cargoCreditDto), HttpStatus.CREATED);
    }

    @GetMapping("/listCargoCredit")
    public ResponseEntity<List<CargoCreditDto>> getAllCargoCredito()
    {
        return ResponseEntity.ok(cargoCreditService.getAllCargoCredito());
    }
}
