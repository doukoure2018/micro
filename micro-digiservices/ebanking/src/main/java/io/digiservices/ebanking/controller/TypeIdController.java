package io.digiservices.ebanking.controller;

import io.digiservices.ebanking.paylaod.TypeIdDto;
import io.digiservices.ebanking.service.TypeIdService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/ebanking/ecredit")
public class TypeIdController {

    private TypeIdService typeIdService;

    public TypeIdController(TypeIdService typeIdService) {
        this.typeIdService = typeIdService;
    }

    @GetMapping("/typo_id")
    public ResponseEntity<List<TypeIdDto>> getAllTypeId()
    {
        return ResponseEntity.ok(typeIdService.getAllTypeId());
    }
}
