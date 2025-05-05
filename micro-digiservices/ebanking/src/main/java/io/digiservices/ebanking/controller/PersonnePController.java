package io.digiservices.ebanking.controller;


import io.digiservices.ebanking.dto.PersonneP;
import io.digiservices.ebanking.service.PersonnePService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ebanking/ecredit")
@AllArgsConstructor
public class PersonnePController {

    private PersonnePService personnePService;


    @PostMapping("{codPs}/createMembre")
    public ResponseEntity<String> createMembre(
            @Valid @RequestBody PersonneP personneP,
            @PathVariable(value = "codPs") String codPs
    )
    {
        return ResponseEntity.ok(personnePService.createMembreP(personneP,codPs));
    }

    @GetMapping("/{codPs}/getCodCliente")
    public ResponseEntity<String> getCodCliente(
            @PathVariable(value = "codPs") String codPs
    )
    {
        return ResponseEntity.ok(personnePService.getCodeCliente(codPs));
    }

}
