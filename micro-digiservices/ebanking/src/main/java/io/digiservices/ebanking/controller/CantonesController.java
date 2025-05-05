package io.digiservices.ebanking.controller;

import io.digiservices.ebanking.paylaod.CantonesDto;
import io.digiservices.ebanking.paylaod.CantonesPKId;
import io.digiservices.ebanking.service.CantonesService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/ebanking/ecredit")
public class CantonesController {

    private CantonesService cantonesService;

    public CantonesController(CantonesService cantonesService) {
        this.cantonesService = cantonesService;
    }

    @GetMapping("/listCantones")
    public ResponseEntity<List<CantonesDto>> getListeCantone()
    {
        return ResponseEntity.ok(cantonesService.listCantones());
    }

    @GetMapping("/{codProvincia}/list")
    public ResponseEntity<List<CantonesDto>> getListeByCodProvincia(
            @PathVariable(name = "codProvincia") String codProvincia)
    {
        return ResponseEntity.ok(cantonesService.getListeByCodProvincia(codProvincia));
    }

    @GetMapping("/{codCanton}/{codPais}/{codProvincia}/getInfoCommune")
    public ResponseEntity<CantonesDto> getInfoCommune(
            @PathVariable(name = "codCanton") String codCanton,
            @PathVariable(name = "codPais") String codPais,
            @PathVariable(name = "codProvincia") String codProvincia)
    {
        return ResponseEntity.ok(cantonesService.getInfoCommune(new CantonesPKId(codCanton,codPais,codProvincia)));
    }


}
