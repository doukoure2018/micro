package io.digiservices.ebanking.controller;

import io.digiservices.ebanking.domain.Response;
import io.digiservices.ebanking.paylaod.CreditoPKId;
import io.digiservices.ebanking.paylaod.CreditosDto;
import io.digiservices.ebanking.service.CreditosService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

import static java.time.LocalTime.now;
import static org.apache.logging.log4j.util.Strings.EMPTY;
import static org.springframework.http.HttpStatus.OK;
import static org.springframework.http.ResponseEntity.ok;

@RestController
@RequestMapping("/ebanking")
@AllArgsConstructor
public class CreditosController {
    private CreditosService creditosService;

    @PostMapping("/creditos")
    public ResponseEntity<CreditosDto> createCredito(
            @RequestBody CreditosDto pr_creditoDto)
    {
        return new ResponseEntity<>(creditosService.createCreditos(pr_creditoDto), HttpStatus.CREATED);
    }


    @GetMapping("/{usuarios}/credit")
    public List<CreditosDto> getAllCreditos(@PathVariable(value = "usuarios") String usuarios)
    {
        return creditosService.getAllCreditosByUsuarios(usuarios);
    }


    @GetMapping("/{codCliente}/creditos")
    public ResponseEntity<Response> getAllCreditosByCodCliente(@PathVariable(name = "codCliente") String codCliente,HttpServletRequest request)
    {
        return ok(getResponse(request, Map.of("credits",creditosService.getAllCreditosByClientes(codCliente)), "Credits retreived ", OK));
    }


    @GetMapping("/{codAgencia}/allRetard")
    public List<Object[]> getAllRetards(@PathVariable(name = "codAgencia") String codAgencia)
    {
        return creditosService.getAllRetards(codAgencia);
    }

    @GetMapping("/{codCliente}/nombreCreditos")
    public long getNombreCreditByClientes(@PathVariable(name = "codCliente") String codCliente)
    {
        return creditosService.getNombreCreditByClientes(codCliente);
    }

    @GetMapping("/{codCliente}/cumulCredito")
    public long getCumulCreditoByCodClientes(
            @PathVariable(name = "codCliente") String codCliente)
    {
        return creditosService.getCumulCreditByClientes(codCliente);
    }

    @GetMapping("/{numCredito}/{COD_EMPRESA}/{codAgencia}/credito")
    public ResponseEntity<CreditosDto> getCredito(
            @PathVariable(name = "numCredito") Long numCredito,
            @PathVariable(name = "COD_EMPRESA") String COD_EMPRESA,
            @PathVariable(name = "codAgencia") String codAgencia)
    {
        return ResponseEntity.ok(creditosService.getCreditos(new CreditoPKId(numCredito,COD_EMPRESA,codAgencia)));
    }

    @GetMapping("/{codAgencia}/{indEstado}/getListCreditoByAgence")
    public ResponseEntity<List<CreditosDto>> getListCreditoByAgence(
            @PathVariable(name = "codAgencia") String codAgencia,
            @PathVariable(name = "indEstado") String indEstado
    )
    {
        return ResponseEntity.ok(creditosService.getListCreditoByCodAgencia(codAgencia,indEstado));
    }

    @GetMapping("/{numCredito}/getCreditoByNumCredito")
    public ResponseEntity<CreditosDto> getCreditoByNumCredito(
            @PathVariable(value = "numCredito") Long numCredito
    )
    {
        return ResponseEntity.ok(creditosService.getCreditoParNum(numCredito));
    }


    @PutMapping("/{numCredito}/updateCredito")
    public ResponseEntity<CreditosDto> updateCreditos(
            @RequestBody CreditosDto pr_creditoDto,
            @PathVariable(name = "numCredito") Long numCredito
    )
    {
        return new ResponseEntity<>(creditosService.updateCredit(pr_creditoDto,numCredito),HttpStatus.OK);
    }

    @GetMapping("/{codCliente}/getOngoingCredito")
    public ResponseEntity<List<CreditosDto>> getOngoingCredito(
            @PathVariable(value = "codCliente") String codCliente
    )
    {
        return ResponseEntity.ok(creditosService.getOngoingCreditosByCodCliente(codCliente,"D"));
    }

    @PutMapping("/{numCredito}/{codAgencia}/{indEstado}/updateIndEstado")
    public ResponseEntity<CreditosDto> updateIndEstadoCredito(
            @PathVariable(value = "numCredito") Long numCredito,
            @PathVariable(value = "indEstado") String indEstado,
            @PathVariable(value = "codAgencia") String codAgencia
    )
    {
        return new ResponseEntity<>(creditosService.updateInstado(numCredito,codAgencia,indEstado),HttpStatus.OK);
    }

    public static Response getResponse(HttpServletRequest request, Map<?, ?> data, String message, HttpStatus status){
        return new Response(now().toString(), status.value(), request.getRequestURI(), status, message, EMPTY, data);
    }

}
