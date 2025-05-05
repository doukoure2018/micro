package io.digiservices.ebanking.controller;

import io.digiservices.ebanking.domain.Response;
import io.digiservices.ebanking.paylaod.PlanPagosDto;
import io.digiservices.ebanking.service.PlanPagosService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Map;

import static java.time.LocalTime.now;
import static org.apache.logging.log4j.util.Strings.EMPTY;
import static org.springframework.http.HttpStatus.OK;
import static org.springframework.http.ResponseEntity.ok;

@RestController
@RequestMapping("/ebanking")
public class PlanPagosController {

    private PlanPagosService planPagosService;

    public PlanPagosController(PlanPagosService planPagosService)
    {
        this.planPagosService = planPagosService;
    }

    @GetMapping("/{numCredito}/planPagos")
    public ResponseEntity<Response> getAllPlanPagosByCreditos(@PathVariable(name = "numCredito") Long numCredito, HttpServletRequest request)
    {
        return ok(getResponse(request, Map.of("planpagos",planPagosService.getAllPlanPagosByCreditos(numCredito)), "All Plans pagos for  Credit "+numCredito, OK));
    }

    @GetMapping("/{codAgencia}/{start}/{end}/TT1")
    public List<Object[]> getAllTT1(
            @PathVariable(name = "codAgencia") String codAgencia,
            @PathVariable(name = "start") @DateTimeFormat(pattern = "dd-MM-yyyy") Date start,
            @PathVariable(name = "end") @DateTimeFormat(pattern = "dd-MM-yyyy") Date end
    )
    {
        return planPagosService.getAllTT1(codAgencia,start,end);
    }

    @GetMapping("/{numCredito}/getListEcheanceParCredit")
    public ResponseEntity<List<PlanPagosDto>> getListEcheanceParCredit(
            @PathVariable(value = "numCredito") Long numCredito
    )
    {
        return ResponseEntity.ok(planPagosService.getEcheancesParCredit(numCredito));
    }

    @GetMapping("{numCredito}/{indEstado}/getListRetardsByCredit")
    public ResponseEntity<List<PlanPagosDto>> getListRetardsByCredit(
            @PathVariable(value = "numCredito") Long numCredito,
            @PathVariable(value = "indEstado") String indEstado,
            @RequestParam(value = "fecCuota") LocalDateTime fecCuota
    )
    {
       return ResponseEntity.ok(planPagosService.getListRetardByNumCredit(numCredito,indEstado,fecCuota));
    }

    @GetMapping("/{indEstado}/getNbreAllCredits")
    public ResponseEntity<Long> getNbreAllCredit(
            @PathVariable(value = "indEstado") String indEstado,
            @RequestParam(value = "fecCuota") LocalDateTime fecCuota
    )
    {
        return ResponseEntity.ok(planPagosService.getNbreCredits(indEstado,fecCuota));
    }

    @GetMapping("/{indEstado}/getSommeRetard")
    public ResponseEntity<BigDecimal> getSommeRetard(
            @PathVariable(value = "indEstado") String indEstado,
            @RequestParam(value = "fecCuota") LocalDateTime fecCuota
    )
    {
        return ResponseEntity.ok(planPagosService.getSommeRetards(indEstado,fecCuota));
    }

    @GetMapping("/{numCredito}/{indEstado}/getLastInsertedCreditByNumCredit")
    public ResponseEntity<PlanPagosDto> getLastInsertedData(
            @PathVariable(value = "numCredito") Long numCredito,
            @PathVariable(value = "indEstado") String indEstado
    )
    {
       return ResponseEntity.ok(planPagosService.getAgeOfRetardCredit(numCredito,indEstado));
    }


    public static Response getResponse(HttpServletRequest request, Map<?, ?> data, String message, HttpStatus status){
        return new Response(now().toString(), status.value(), request.getRequestURI(), status, message, EMPTY, data);
    }
}
