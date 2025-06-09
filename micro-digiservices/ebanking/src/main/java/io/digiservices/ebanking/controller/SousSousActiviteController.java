package io.digiservices.ebanking.controller;

import io.digiservices.ebanking.paylaod.SousSousActiviteDto;
import io.digiservices.ebanking.service.SousSousActiviteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/ebanking")
public class SousSousActiviteController {
    private SousSousActiviteService sousSousActiviteService;

    public SousSousActiviteController(SousSousActiviteService sousSousActiviteService) {
        this.sousSousActiviteService = sousSousActiviteService;
    }

    @GetMapping("/{codSousActivite}/sousSousActivite")
    public ResponseEntity<List<SousSousActiviteDto>> getAllSousSousActiviteByCod(@PathVariable(name = "codSousActivite") String codSousActivite)
    {
        return ResponseEntity.ok(sousSousActiviteService.getAllSousSousActiviteByCod(codSousActivite));
    }

    @GetMapping("/sousSousActivite")
    public ResponseEntity<List<SousSousActiviteDto>> getAllSousSousActivite()
    {
        return ResponseEntity.ok(sousSousActiviteService.getAllSousSousActivite());
    }
}
