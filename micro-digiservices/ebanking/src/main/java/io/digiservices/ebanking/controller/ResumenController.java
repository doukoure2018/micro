package io.digiservices.ebanking.controller;

import io.digiservices.ebanking.paylaod.ResumenDto;
import io.digiservices.ebanking.paylaod.ResumenPkId;
import io.digiservices.ebanking.service.ResumenService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/digi/ebanking")
public class ResumenController {

    ResumenService resumenService;

    public ResumenController(ResumenService resumenService) {
        this.resumenService = resumenService;
    }

    @GetMapping("/{COD_EMPRESA}/{COD_AGENCIA}/{NUM_ASIENTO}/getInfoResumenById")
    public ResponseEntity<ResumenDto> getInfoResumen(
            @PathVariable(name = "COD_EMPRESA") String codEmpresa,
            @PathVariable(name = "COD_AGENCIA") String codAgencia,
            @PathVariable(name = "NUM_ASIENTO") Long numAsiento
    )
    {
        return ResponseEntity.ok(resumenService.getInfoResumen(new ResumenPkId(codEmpresa,codAgencia,numAsiento)));
    }

    @PostMapping("/createResumen")
    public ResponseEntity<ResumenDto> createResumen(@RequestBody ResumenDto resumenDto)
    {
        return new ResponseEntity<>(resumenService.createResumen(resumenDto), HttpStatus.CREATED);
    }

}
