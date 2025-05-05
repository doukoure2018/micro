package io.digiservices.ebanking.controller;


import io.digiservices.ebanking.paylaod.PersonneMoraleDto;
import io.digiservices.ebanking.paylaod.PersonneMoralePKId;
import io.digiservices.ebanking.service.PersonneMoraleService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ebanking/ecredit")
public class PersonneMoraleController {

    private PersonneMoraleService personneMoraleService;

    public PersonneMoraleController(PersonneMoraleService personneMoraleService) {
        this.personneMoraleService = personneMoraleService;
    }

    @GetMapping("/{COD_EMPRESA}/{COD_CLIENTE}/personneMorale")
    public ResponseEntity<PersonneMoraleDto> getPersonneMorale(
            @PathVariable(name = "COD_EMPRESA") String COD_EMPRESA,
            @PathVariable(name = "COD_CLIENTE") String COD_CLIENTE)
    {
        return ResponseEntity.ok(personneMoraleService.getListPersonneMorale(new PersonneMoralePKId(COD_EMPRESA,COD_CLIENTE)));
    }

    @PostMapping("/createPersonneMorale")
    public ResponseEntity<PersonneMoraleDto> createPersonneMorale(
            @RequestBody PersonneMoraleDto personneMoraleDto)
    {
        return new ResponseEntity<>(personneMoraleService.createPersonneMorale(personneMoraleDto), HttpStatus.CREATED);
    }

    @PutMapping("/{COD_EMPRESA}/{COD_CLIENTE}/updateInfoPersonneMorale")
    public ResponseEntity<PersonneMoraleDto> updateInfoPersonneMorale(
            @RequestBody PersonneMoraleDto personneMoraleDto,
            @PathVariable(name = "COD_EMPRESA") String COD_EMPRESA,
            @PathVariable(name = "COD_CLIENTE") String COD_CLIENTE
    )
    {
        return new ResponseEntity<>(personneMoraleService.updatePersonneMorale(personneMoraleDto,new PersonneMoralePKId(COD_EMPRESA,COD_CLIENTE)),HttpStatus.OK);
    }
}
