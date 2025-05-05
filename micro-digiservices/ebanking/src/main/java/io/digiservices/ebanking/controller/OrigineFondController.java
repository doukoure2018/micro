package io.digiservices.ebanking.controller;

import io.digiservices.ebanking.paylaod.OrigineFondDto;
import io.digiservices.ebanking.service.OrigineFondService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/ebanking/ecredit")
public class OrigineFondController {
    private OrigineFondService origineFondService;

    public OrigineFondController(OrigineFondService origineFondService) {
        this.origineFondService = origineFondService;
    }

    @GetMapping("/origineFond")
    public ResponseEntity<List<OrigineFondDto>> getAllOrigineFond()
    {
        return ResponseEntity.ok(origineFondService.getAllOrigineFond());
    }
}
