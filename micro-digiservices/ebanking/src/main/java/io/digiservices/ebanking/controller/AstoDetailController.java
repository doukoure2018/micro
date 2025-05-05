package io.digiservices.ebanking.controller;

import io.digiservices.ebanking.paylaod.AstoDetailDto;
import io.digiservices.ebanking.paylaod.AstoDetailPkId;
import io.digiservices.ebanking.service.AstoDetailService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/digi/v1/intercaisse")
public class AstoDetailController {

    private AstoDetailService astoDetailService;

    public AstoDetailController(AstoDetailService astoDetailService) {
        this.astoDetailService = astoDetailService;
    }

    @PostMapping("/createAstoDetail")
    public ResponseEntity<AstoDetailDto> createAstoDetail(@RequestBody AstoDetailDto astoDetailDto)
    {
        return new ResponseEntity<>(astoDetailService.createAstoDetail(astoDetailDto), HttpStatus.CREATED);
    }

    @GetMapping("/{COD_EMPRESA}/{COD_AGENCIA}/{NUM_ASIENTO}/{NUM_LINEA}/getInfoAstoDetail")
    public ResponseEntity<AstoDetailDto> getInfoAstoDetailById(
            @PathVariable(name = "COD_EMPRESA") String COD_EMPRESA,
            @PathVariable(name = "COD_AGENCIA") String COD_AGENCIA,
            @PathVariable(name = "NUM_ASIENTO") Long NUM_ASIENTO,
            @PathVariable(name = "NUM_LINEA") Long NUM_LINEA
    )
    {
        return ResponseEntity.ok(astoDetailService.getInfoAstoDetailById(new AstoDetailPkId(COD_EMPRESA,COD_AGENCIA,NUM_ASIENTO,NUM_LINEA)));
    }

    @PutMapping("/{COD_EMPRESA}/{COD_AGENCIA}/{NUM_ASIENTO}/{NUM_LINEA}/updateAstoDetailFacMov")
    public ResponseEntity<AstoDetailDto> updateAstoDetail(
            @RequestBody AstoDetailDto astoDetailDto,
            @PathVariable(name = "COD_EMPRESA") String COD_EMPRESA,
            @PathVariable(name = "COD_AGENCIA") String COD_AGENCIA,
            @PathVariable(name = "NUM_ASIENTO") Long NUM_ASIENTO,
            @PathVariable(name = "NUM_LINEA") Long NUM_LINEA)
    {
        return new ResponseEntity<>(astoDetailService.updateAstoDetail(astoDetailDto,new AstoDetailPkId(COD_EMPRESA,COD_AGENCIA,NUM_ASIENTO,NUM_LINEA)),HttpStatus.OK);
    }

    @PutMapping("/{COD_EMPRESA}/{COD_AGENCIA}/{NUM_ASIENTO}/{NUM_LINEA}/updateAstoDetailReferencia")
    public ResponseEntity<AstoDetailDto> updateAstoDetailReferencia(
            @RequestBody AstoDetailDto astoDetailDto,
            @PathVariable(name = "COD_EMPRESA") String COD_EMPRESA,
            @PathVariable(name = "COD_AGENCIA") String COD_AGENCIA,
            @PathVariable(name = "NUM_ASIENTO") Long NUM_ASIENTO,
            @PathVariable(name = "NUM_LINEA") Long NUM_LINEA
    )
    {
        return new ResponseEntity<>(astoDetailService.updateAstoDetailReferencia(astoDetailDto,new AstoDetailPkId(COD_EMPRESA,COD_AGENCIA,NUM_ASIENTO,NUM_LINEA)),HttpStatus.OK);
    }
}
