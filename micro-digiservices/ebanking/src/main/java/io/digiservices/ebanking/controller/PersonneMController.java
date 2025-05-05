package io.digiservices.ebanking.controller;

import io.digiservices.ebanking.dto.OpenAccountResponse;
import io.digiservices.ebanking.dto.PersonneM;
import io.digiservices.ebanking.service.PersonneMService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ebanking/ecredit")
@AllArgsConstructor
public class PersonneMController {


    private PersonneMService personneMService;


    @PostMapping("{codPs}/createMembre_morale")
    public ResponseEntity<OpenAccountResponse> createMembreMorale(
            @RequestBody PersonneM personneM,
            @PathVariable(value = "codPs") String codPs
    )
    {
        return ResponseEntity.ok(personneMService.createMembreM(personneM,codPs));
    }

    @GetMapping("/{codPs}/getCodCliente_morale")
    public ResponseEntity<String> getCodCliente(
            @PathVariable(value = "codPs") String codPs
    )
    {
        return ResponseEntity.ok(personneMService.getCodeCliente(codPs));
    }

}
