package io.digiservices.ebanking.controller;


import io.digiservices.ebanking.paylaod.DistrictDto;
import io.digiservices.ebanking.service.DistrictService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/ebanking/ecredit")
public class DistrictController {

    private DistrictService districtService;

    public DistrictController(DistrictService districtService) {
        this.districtService = districtService;
    }

    @GetMapping("/listDistrict")
    public ResponseEntity<List<DistrictDto>> getListDistrict()
    {
        return ResponseEntity.ok(districtService.getListDistrict());
    }

    @GetMapping("/{codCanton}/{codProvincia}/getListDistrict")
    public ResponseEntity<List<DistrictDto>> getListDistrictByCodCanton(
            @PathVariable(name = "codCanton") String codCanton,
            @PathVariable(name = "codProvincia") String codProvincia
    )
    {
        return ResponseEntity.ok(districtService.getListDistrictByCodCanton(codCanton,codProvincia));
    }

    @GetMapping("/{codCanton}/{codProvincia}/{codDistrito}/getInfoDistrict")
    public ResponseEntity<DistrictDto>getInfoDistrict(
            @PathVariable(name = "codCanton") String codCanton,
            @PathVariable(name = "codProvincia") String codProvincia,
            @PathVariable(name = "codDistrito") String codDistrito
    )
    {
        return ResponseEntity.ok(districtService.getInfoDistricto(codCanton,codProvincia,codDistrito));
    }


}

