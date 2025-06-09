package io.digiservices.ebanking.controller;

import io.digiservices.ebanking.paylaod.SousActiviteDto;
import io.digiservices.ebanking.service.SousActiviteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/ebanking")
public class SousActiviteController {

    private SousActiviteService sousActiviteService;

    public SousActiviteController(SousActiviteService sousActiviteService) {
        this.sousActiviteService = sousActiviteService;
    }

    @GetMapping("/sousActivite")
    public ResponseEntity<List<SousActiviteDto>> getAllSousActivite()
    {
        return ResponseEntity.ok(sousActiviteService.getAllSousActivite());
    }

    @GetMapping("/sousActivite/{codActividad}")
    public ResponseEntity<List<SousActiviteDto>> getAllSousActiviteByActivite(@PathVariable(name = "codActividad")
                                                                              String codActividad)
    {
        return ResponseEntity.ok(sousActiviteService.getAllSousActiviteByActivite(codActividad));
    }
}
