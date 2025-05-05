package io.digiservices.ebanking.controller;

import io.digiservices.ebanking.paylaod.ProfessionDto;
import io.digiservices.ebanking.paylaod.ProfessionPKId;
import io.digiservices.ebanking.service.ProfessionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/ebanking/ecredit")
public class ProfessionController {

    private ProfessionService professionService;

    public ProfessionController(ProfessionService professionService) {
        this.professionService = professionService;
    }

    @GetMapping("/professions")
    public ResponseEntity<List<ProfessionDto>> getAllProfession()
    {
        return ResponseEntity.ok(professionService.getAllProfession());
    }

    @GetMapping("/{COD_EMPRESA}/{COD_PROFESION}/getInfoProfession")
    public ResponseEntity<ProfessionDto> getInfoProfession(
            @PathVariable(name = "COD_EMPRESA") String COD_EMPRESA,
            @PathVariable(name = "COD_PROFESION") String COD_PROFESION
    )
    {
        return ResponseEntity.ok(professionService.getInfoProfession(new ProfessionPKId(COD_EMPRESA,COD_PROFESION)));
    }
}
