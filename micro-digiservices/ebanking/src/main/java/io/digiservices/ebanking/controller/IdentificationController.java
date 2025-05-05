package io.digiservices.ebanking.controller;

import io.digiservices.ebanking.paylaod.IdentificationDto;
import io.digiservices.ebanking.paylaod.IdentificationPKId;
import io.digiservices.ebanking.service.IdentificationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ebanking/ecredit")
public class IdentificationController {

    private IdentificationService identificationService;

    public IdentificationController(IdentificationService identificationService) {
        this.identificationService = identificationService;
    }

    @PostMapping("/createDatos")
    public ResponseEntity<IdentificationDto> createDatos(@RequestBody IdentificationDto identificationDto)
    {
        return new ResponseEntity<>(identificationService.createDatos(identificationDto), HttpStatus.CREATED);
    }

    @GetMapping("/{COD_EMPRESA}/{COD_CLIENTE}/identification")
    public ResponseEntity<IdentificationDto> getIdentification(
            @PathVariable(name = "COD_EMPRESA") String COD_EMPRESA,
            @PathVariable(name = "COD_CLIENTE") String COD_CLIENTE
    )
    {
        return ResponseEntity.ok(identificationService.getIdentification(new IdentificationPKId(COD_EMPRESA,COD_CLIENTE)));
    }

    @PutMapping("{COD_EMPRESA}/{COD_CLIENTE}/upateInfoIdentification")
    public ResponseEntity<IdentificationDto> updateIdentificationClientes(
            @RequestBody IdentificationDto identificationDto,
            @PathVariable(name = "COD_EMPRESA") String COD_EMPRESA,
            @PathVariable(name = "COD_CLIENTE") String COD_CLIENTE
    )
    {
        return new ResponseEntity<>(identificationService.updateIdentificationClientes(identificationDto,new IdentificationPKId(COD_EMPRESA,COD_CLIENTE)),HttpStatus.OK);
    }
}
