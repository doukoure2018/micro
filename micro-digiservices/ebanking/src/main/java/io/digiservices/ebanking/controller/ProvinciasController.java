package io.digiservices.ebanking.controller;

import io.digiservices.ebanking.paylaod.ProvinciasDto;
import io.digiservices.ebanking.paylaod.ProvinciasPKId;
import io.digiservices.ebanking.service.ProvinciasService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/ebanking/ecredit")
public class ProvinciasController {

    private ProvinciasService provinciasService;

    public ProvinciasController(ProvinciasService provinciasService) {
        this.provinciasService = provinciasService;
    }

    @GetMapping("/listProvincias")
    public ResponseEntity<List<ProvinciasDto>> getListProvincias()
    {
        return ResponseEntity.ok(provinciasService.getListProvincias());
    }

    @GetMapping("/{COD_PAIS}/{COD_PROVINCIA}/getInfoProvincia")
    public ResponseEntity<ProvinciasDto> getInfoProvincia(
            @PathVariable(name = "COD_PAIS") String COD_PAIS,
            @PathVariable(name = "COD_PROVINCIA") String COD_PROVINCIA
    )
    {
        return ResponseEntity.ok(provinciasService.getInfoProvincia(new ProvinciasPKId(COD_PAIS,COD_PROVINCIA)));
    }
}

