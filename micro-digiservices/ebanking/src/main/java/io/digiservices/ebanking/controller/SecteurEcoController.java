package io.digiservices.ebanking.controller;


import io.digiservices.ebanking.paylaod.SecteurEcoDto;
import io.digiservices.ebanking.paylaod.SectorEconomicoPKId;
import io.digiservices.ebanking.service.SecteurEcoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/ebanking/ecredit")
public class SecteurEcoController {

    private SecteurEcoService secteurEcoService;

    public SecteurEcoController(SecteurEcoService secteurEcoService) {
        this.secteurEcoService = secteurEcoService;
    }

    @GetMapping("/sector")
    public ResponseEntity<List<SecteurEcoDto>> getAllSector()
    {
        return ResponseEntity.ok(secteurEcoService.getAllSector());
    }

    @GetMapping("/{COD_EMPRESA}/{COD_SECTOR}/getInfoSector")
    public ResponseEntity<SecteurEcoDto> getInfoSector(
            @PathVariable(name = "COD_EMPRESA") String COD_EMPRESA,
            @PathVariable(name = "COD_SECTOR") String COD_SECTOR
    )
    {
        return ResponseEntity.ok(secteurEcoService.getInfoSector(new SectorEconomicoPKId(COD_EMPRESA,COD_SECTOR)));
    }
}

