package io.digiservices.ebanking.controller;

import io.digiservices.ebanking.paylaod.PersonaPKId;
import io.digiservices.ebanking.paylaod.PersonasDto;
import io.digiservices.ebanking.service.PersonasService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ebanking/ecredit")
public class PersonasController {

    private PersonasService personasService;

    public PersonasController(PersonasService personasService) {
        this.personasService = personasService;
    }
    @PostMapping("/personasInfo")
    public ResponseEntity<PersonasDto> createInfoPersonas(
            @RequestBody PersonasDto personasDto)
    {
        return new ResponseEntity<>(personasService.createPersona(personasDto), HttpStatus.CREATED);
    }

    @GetMapping("/{COD_EMPRESA}/{COD_CLIENTE}/personInfo")
    public ResponseEntity<PersonasDto> getInfoPersonas(
            @PathVariable(name = "COD_EMPRESA") String COD_EMPRESA,
            @PathVariable(name = "COD_CLIENTE") String COD_CLIENTE)
    {
        return ResponseEntity.ok(personasService.getInfoPersona(new PersonaPKId(COD_EMPRESA,COD_CLIENTE)));
    }

    @GetMapping("{codClientes}/getPersona")
    public ResponseEntity<PersonasDto> getPersona(
            @PathVariable(name = "codClientes") String codClientes
    )
    {
        PersonasDto personasDto=personasService.getPersona(codClientes);
        return ResponseEntity.ok(personasDto);
    }

    @PutMapping("/{COD_EMPRESA}/{codClientes}/updateInfoClientes")
    public ResponseEntity<PersonasDto> updateInfoPersona(
            @RequestBody PersonasDto personasDto,
            @PathVariable(name = "COD_EMPRESA") String COD_EMPRESA,
            @PathVariable(name = "codClientes") String codClientes
    )
    {
        return new ResponseEntity<>(personasService.updateInfoPersona(personasDto,new PersonaPKId(COD_EMPRESA,codClientes)),HttpStatus.OK);
    }
}
