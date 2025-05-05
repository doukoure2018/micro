package io.digiservices.ebanking.controller;

import io.digiservices.ebanking.dto.OpenAccount;
import io.digiservices.ebanking.dto.OpenAccountResponse;
import io.digiservices.ebanking.service.OpenAccountService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ebanking/ecredit")
@AllArgsConstructor
public class OpenAccountController {

    private OpenAccountService openAccountService;

    @PostMapping("{codCliente}/{codPs}/{codProducto}/ouvrirCompteClient")
    public ResponseEntity<OpenAccountResponse> ouvrirCompteClient(
            @RequestBody OpenAccount openAccount,
            @PathVariable(value = "codCliente") String codCliente,
            @PathVariable(value = "codPs") String codPs,
            @PathVariable(value = "codProducto") String codProducto
    )
    {
         return ResponseEntity.ok(openAccountService.ouvertureCompte(openAccount,codCliente,codPs,codProducto));
    }
}
