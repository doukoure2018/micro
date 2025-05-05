package io.digiservices.ebanking.controller;

import io.digiservices.ebanking.paylaod.PrestataireDto;
import io.digiservices.ebanking.service.PrestataireService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/ebanking/ecredit")
@RequiredArgsConstructor
public class PrestataireController {

    private final PrestataireService prestataireService;


    @GetMapping("/listPrestataire")
    public ResponseEntity<List<PrestataireDto>> getListPrestataire()
    {
        return ResponseEntity.ok(prestataireService.getListPrestataire());
    }
}
