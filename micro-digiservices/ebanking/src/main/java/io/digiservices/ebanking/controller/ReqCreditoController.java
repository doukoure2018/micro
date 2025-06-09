package io.digiservices.ebanking.controller;

import io.digiservices.ebanking.paylaod.ReqCreditoDto;
import io.digiservices.ebanking.service.ReqCreditoService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static java.util.Collections.emptyMap;
import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.ResponseEntity.created;

@RestController
@RequestMapping("/ebanking")
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
