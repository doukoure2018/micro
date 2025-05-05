package io.digiservices.ebanking.controller;

import io.digiservices.ebanking.paylaod.ReqCreditoDto;
import io.digiservices.ebanking.service.ReqCreditoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ebanking/ecredit")
public class ReqCreditoController {

    private ReqCreditoService reqCreditoService;

    public ReqCreditoController(ReqCreditoService reqCreditoService) {
        this.reqCreditoService = reqCreditoService;
    }

    @PostMapping("/req_credito")
    public ResponseEntity<ReqCreditoDto> createReqCredito(
            @RequestBody ReqCreditoDto reqCreditoDto)
    {
        return new ResponseEntity<>(reqCreditoService.createReqCredit(reqCreditoDto), HttpStatus.CREATED);
    }

    @GetMapping("/getAllReqCredito")
    public ResponseEntity<List<ReqCreditoDto>> getAllReqCredito()
    {
        return ResponseEntity.ok(reqCreditoService.getAllReqCredito());
    }
}
