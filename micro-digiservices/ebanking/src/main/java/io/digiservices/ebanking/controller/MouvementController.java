package io.digiservices.ebanking.controller;

import io.digiservices.ebanking.paylaod.MouvementDto;
import io.digiservices.ebanking.paylaod.MouvementPkId;
import io.digiservices.ebanking.service.MouvementService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/digi/ebanking")
@AllArgsConstructor
public class MouvementController {

    private MouvementService mouvementService;

    @PostMapping("/addMovimto")
    public ResponseEntity<MouvementDto> createMouvement(@RequestBody MouvementDto mouvementDto)
    {
        return new ResponseEntity<>(mouvementService.createMouvement(mouvementDto), HttpStatus.CREATED);
    }

    @GetMapping("/{codEmpresa}/{numMovimiento}/getInfoMovimiento")
    public ResponseEntity<MouvementDto> getInfoMouvement(
            @PathVariable(name = "codEmpresa") String codEmpresa,
            @PathVariable(name = "numMovimiento") Long numMovimiento)
    {
        return ResponseEntity.ok(mouvementService.getInfoMouvement(new MouvementPkId(codEmpresa,numMovimiento)));
    }

}
