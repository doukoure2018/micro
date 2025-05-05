package io.digiservices.ebanking.controller;

import io.digiservices.ebanking.paylaod.IdClientesDto;
import io.digiservices.ebanking.service.IdClientesService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ebanking/ecredit")
public class IdClientesController {

    private IdClientesService idClientesService;

    public IdClientesController(IdClientesService idClientesService) {
        this.idClientesService = idClientesService;
    }

    @PostMapping("/addClientesId")
    public ResponseEntity<IdClientesDto> createClientesId(
            @RequestBody IdClientesDto idClientesDto)
    {
        return new ResponseEntity<>(idClientesService.createIdClientesId(idClientesDto), HttpStatus.CREATED);
    }

    @GetMapping("/listIdClientes")
    public ResponseEntity<List<IdClientesDto>> getListIdClientes()
    {
        return ResponseEntity.ok(idClientesService.getAllIdClientes());
    }
    @GetMapping("{codClientes}/getInfoIdClientes")
    public ResponseEntity<IdClientesDto> getInfoIdClientes(
            @PathVariable(name = "codClientes") String codClientes
    )
    {
        IdClientesDto idClientesDto=idClientesService.getInfoIdClientes(codClientes);
        return ResponseEntity.ok(idClientesDto);
    }

    @PutMapping("{codClientes}/updateIdClientes")
    public ResponseEntity<IdClientesDto> updateIdClientes(
            @RequestBody IdClientesDto idClientesDto,
            @PathVariable(name = "codClientes") String codClientes
    )
    {
        return new ResponseEntity<>(idClientesService.updateIdClientes(idClientesDto,codClientes),HttpStatus.OK);
    }

    @GetMapping("{codClient}/getInfoIdClient")
    public ResponseEntity<IdClientesDto> getInfoDetailIdClientes(
            @PathVariable(name = "codClient") String codClient
    )
    {
        return ResponseEntity.ok(idClientesService.getInfoIdClientesByCodClient(codClient));
    }
}
