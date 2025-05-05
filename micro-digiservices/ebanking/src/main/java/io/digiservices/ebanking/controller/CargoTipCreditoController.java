package io.digiservices.ebanking.controller;


import io.digiservices.ebanking.paylaod.CargoTipCreditoDto;
import io.digiservices.ebanking.service.CargoTipCreditoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/ebanking/ecredit")
public class CargoTipCreditoController {

    private CargoTipCreditoService cargoTipCreditoService;

    public CargoTipCreditoController(CargoTipCreditoService cargoTipCreditoService) {
        this.cargoTipCreditoService = cargoTipCreditoService;
    }

    @GetMapping("/{tipCredito}/cargoTipCredito")
    public ResponseEntity<List<CargoTipCreditoDto>> getAllCargoTipCredito(
            @PathVariable(name = "tipCredito") Long tipCredito)
    {
        return ResponseEntity.ok(cargoTipCreditoService.getAllCargoTipCredito(tipCredito));
    }
}
