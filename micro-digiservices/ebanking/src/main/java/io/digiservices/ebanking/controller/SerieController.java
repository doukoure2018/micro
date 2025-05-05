package io.digiservices.ebanking.controller;


import io.digiservices.ebanking.paylaod.SerieDto;
import io.digiservices.ebanking.paylaod.SeriePKId;
import io.digiservices.ebanking.service.SerieService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ebanking/ecredit")
public class SerieController {

    private SerieService serieService;

    public SerieController(SerieService serieService) {
        this.serieService = serieService;
    }

    @GetMapping("/{codEmpresa}/{codSistema}/{codSerie}/getCurrentSerie")
    public ResponseEntity<SerieDto> getCurrentSerie(
            @PathVariable(name = "codEmpresa") String codEmpresa,
            @PathVariable(name = "codSistema") String codSistema,
            @PathVariable(name = "codSerie") String codSerie)
    {
        return ResponseEntity.ok(serieService.getCurrentSerie(new SeriePKId(codEmpresa,codSistema,codSerie)));
    }

    @PutMapping("/{codEmpresa}/{codSistema}/{codSerie}/updateSerie")
    public ResponseEntity<SerieDto> updateSerie(
            @RequestBody SerieDto serieDto,
            @PathVariable(name = "codEmpresa") String codEmpresa,
            @PathVariable(name = "codSistema") String codSistema,
            @PathVariable(name = "codSerie") String codSerie)
    {
        SerieDto serieResponse=serieService.updateCurrentSerie(serieDto,new SeriePKId(codEmpresa,codSistema,codSerie));
        return new ResponseEntity<>(serieResponse, HttpStatus.CREATED);
    }


    @GetMapping("/cf-sp-serie-agencia")
    public Long executeCF_SP_SERIE_AGENCIA(
            @RequestParam String codEmpresa,
            @RequestParam String codAgencia,
            @RequestParam String codSistema,
            @RequestParam String codSerie
    ) {
        return serieService.callCF_SP_SERIE_AGENCIA(codEmpresa, codAgencia, codSistema, codSerie);
    }

    @GetMapping("/cf-sp-serie-empresa")
    public Long executeCF_SP_SERIE_EMPRESA(
            @RequestParam String codEmpresa,
            @RequestParam String codSistema,
            @RequestParam String codSerie
    ) {
        return serieService.callCF_SP_SERIE_EMPRESA(codEmpresa, codSistema, codSerie);
    }
}
