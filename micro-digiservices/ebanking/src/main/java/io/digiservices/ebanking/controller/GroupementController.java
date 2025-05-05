package io.digiservices.ebanking.controller;

import io.digiservices.ebanking.paylaod.GroupementDto;
import io.digiservices.ebanking.service.GroupementService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ebanking/ecredit")
public class GroupementController {

    private GroupementService groupementService;

    public GroupementController(GroupementService groupementService) {
        this.groupementService = groupementService;
    }


    @PostMapping("/relierMembre")
    public ResponseEntity<GroupementDto> relierMembre(
            @RequestBody GroupementDto groupementDto)
    {
        return new ResponseEntity<>(groupementService.createGroupement(groupementDto), HttpStatus.CREATED);
    }

    @GetMapping("/{codCliente}/groupe")
    public ResponseEntity<List<GroupementDto>> getAllMembre(
            @PathVariable(name = "codCliente") String codCliente)
    {
        return ResponseEntity.ok(groupementService.getAllMembreByCodCliente(codCliente));
    }
}
