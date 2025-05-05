package io.digiservices.ebanking.controller;

import io.digiservices.ebanking.domain.Response;
import io.digiservices.ebanking.paylaod.TypeCreditDto;
import io.digiservices.ebanking.paylaod.TypeCreditPKId;
import io.digiservices.ebanking.service.TypeCreditService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

import static io.digiservices.ebanking.controller.CreditosController.getResponse;
import static org.springframework.http.HttpStatus.OK;
import static org.springframework.http.ResponseEntity.ok;

@RestController
@RequestMapping("/ebanking")
public class TypeCreditController {

    private TypeCreditService typeCreditService;

    public TypeCreditController(TypeCreditService typeCreditService) {
        this.typeCreditService = typeCreditService;
    }

    @GetMapping("/typeCredit")
    public ResponseEntity<Response> getCategories(HttpServletRequest request){
        return ok(getResponse(request, Map.of("typeCreditos",typeCreditService.getAllTypeCredito()), "Liste de Credit", OK));
    }

    @GetMapping("/{COD_EMPRESA}/{TIP_CREDITO}/typeCredito")
    public ResponseEntity<TypeCreditDto> getTypeCredito(
            @PathVariable(name = "COD_EMPRESA") String COD_EMPRESA,
            @PathVariable(name = "TIP_CREDITO") Long TIP_CREDITO
    ){
        return ResponseEntity.ok(typeCreditService.getTypeCredito(new TypeCreditPKId(COD_EMPRESA,TIP_CREDITO)));
    }




}
