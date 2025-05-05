package io.digiservices.ebanking.controller;

import io.digiservices.ebanking.paylaod.ChargesDto;
import io.digiservices.ebanking.service.ChargesService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/ebanking/ecredit")
public class ChargesController {

    private ChargesService chargesService;

    public ChargesController(ChargesService chargesService) {
        this.chargesService = chargesService;
    }

    @GetMapping("/charges")
    public ResponseEntity<List<ChargesDto>> getllCharges()
    {
        return ResponseEntity.ok(chargesService.getllCharges());
    }
}
