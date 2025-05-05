package io.digiservices.ebanking.controller;

import io.digiservices.ebanking.paylaod.FirmasClientesDto;
import io.digiservices.ebanking.paylaod.FirmasClientesPkId;
import io.digiservices.ebanking.service.FirmasClientesService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ebanking/ecredit")
public class FirmasClientesController {

    private FirmasClientesService firmasClientesService;

    public FirmasClientesController(FirmasClientesService firmasClientesService) {
        this.firmasClientesService = firmasClientesService;
    }

    @PostMapping("/addFirmaClientes")
    public ResponseEntity<FirmasClientesDto> createFirmaClientes(
            @RequestBody FirmasClientesDto firmasClientesDto)
    {
        return new ResponseEntity<>(firmasClientesService.createFirmaClientes(firmasClientesDto), HttpStatus.CREATED);
    }

    @GetMapping("/{codEmpresa}/{codClientes}/{numCuenta}/getInfoFirmasClientes")
    public ResponseEntity<FirmasClientesDto> getInfoFirmasClientes(
            @PathVariable(name ="codEmpresa") String codEmpresa,
            @PathVariable(name = "codClientes") String codClientes,
            @PathVariable(name = "numCuenta") String numCuenta)
    {
        return ResponseEntity.ok(firmasClientesService.getInfoFirmaClientes(new FirmasClientesPkId(codEmpresa,codClientes,numCuenta)));
    }
}
