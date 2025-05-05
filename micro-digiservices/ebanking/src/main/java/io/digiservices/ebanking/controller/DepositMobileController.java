package io.digiservices.ebanking.controller;

import io.digiservices.ebanking.dto.DepositMobile;
import io.digiservices.ebanking.dto.DepositResponse;
import io.digiservices.ebanking.service.DepositMobileService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/digi/ebanking")
@AllArgsConstructor
public class DepositMobileController {

    private DepositMobileService depositMobileService;

    @PostMapping("/{codCliente}/depotEnCompteMobile")
    public ResponseEntity<DepositResponse> addDepositAccountMoible(
            @RequestBody DepositMobile depositMobile,
            @PathVariable(value = "codCliente") String codCliente
    )
    {
        return ResponseEntity.ok(depositMobileService.depositAccountMobile(depositMobile,codCliente));
    }


}
