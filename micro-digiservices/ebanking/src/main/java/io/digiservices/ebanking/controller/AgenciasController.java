package io.digiservices.ebanking.controller;

import io.digiservices.ebanking.paylaod.AgenciasDto;
import io.digiservices.ebanking.paylaod.AgenciasPkId;
import io.digiservices.ebanking.service.AgenciasService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("*")
@RestController
@RequestMapping("/ebanking/ecredit")
public class AgenciasController {

    private AgenciasService agenciasService;

    public AgenciasController(AgenciasService agenciasService) {
        this.agenciasService = agenciasService;
    }

    @GetMapping("/{COD_EMPRESA}/{codAgencia}/getInfoAgencias")
    public ResponseEntity<AgenciasDto> getInfoAgencias(
            @PathVariable(name = "COD_EMPRESA") String COD_EMPRESA,
            @PathVariable(name = "codAgencia") String codAgencia
    )
    {
        return ResponseEntity.ok(agenciasService.getInfoAgencias(new AgenciasPkId(COD_EMPRESA,codAgencia)));
    }


}

