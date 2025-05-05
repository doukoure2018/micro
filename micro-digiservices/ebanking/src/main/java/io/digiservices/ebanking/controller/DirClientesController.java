package io.digiservices.ebanking.controller;

import io.digiservices.ebanking.paylaod.DirClientesDto;
import io.digiservices.ebanking.paylaod.DirClientesPKId;
import io.digiservices.ebanking.service.DirClientesService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ebanking/ecredit")
public class DirClientesController {

    private DirClientesService dirClientesService;

    public DirClientesController(DirClientesService dirClientesService) {
        this.dirClientesService = dirClientesService;
    }

    @PostMapping("/addDirClientes")
    public ResponseEntity<DirClientesDto> createDirClientesDto(
            @RequestBody DirClientesDto dirClientesDto)
    {
        return new ResponseEntity<>(dirClientesService.createDirClientes(dirClientesDto), HttpStatus.CREATED);
    }

    @GetMapping("/getListDirClientes")
    public ResponseEntity<List<DirClientesDto>> getListDirClientes()
    {
        return ResponseEntity.ok(dirClientesService.getListDirClientes());
    }

    @GetMapping("/{codClientes}/getInfoDirClientes")
    public ResponseEntity<DirClientesDto> getInfoDirClientes(
            @PathVariable(name="codClientes") String codClientes
    )
    {
        DirClientesDto dirClientesDto = dirClientesService.getInfoDirClientes(codClientes);
        return ResponseEntity.ok(dirClientesDto);
    }

    @PutMapping("{COD_EMPRESA}/{codClientes}/{COD_DIRECCION}/updateDirClientes")
    public ResponseEntity<DirClientesDto> updateInfoClientes(
            @RequestBody DirClientesDto dirClientesDto,
            @PathVariable(name = "COD_EMPRESA") String COD_EMPRESA,
            @PathVariable(name = "codClientes") String codClientes,
            @PathVariable(name = "COD_DIRECCION") String COD_DIRECCION
    )
    {
        return new ResponseEntity<>(dirClientesService.updateInfoDirClientes(dirClientesDto,new DirClientesPKId(COD_EMPRESA,codClientes,COD_DIRECCION)),HttpStatus.OK);
    }
}
