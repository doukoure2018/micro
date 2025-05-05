package io.digiservices.ebanking.controller;

import io.digiservices.ebanking.paylaod.CalendariosDto;
import io.digiservices.ebanking.paylaod.CalendariosPKId;
import io.digiservices.ebanking.service.CalendariosService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/digi/ebanking")
public class CalendariosController {

    private CalendariosService calendariosService;

    public CalendariosController(CalendariosService calendariosService) {
        this.calendariosService = calendariosService;
    }

    @GetMapping("/{codSystema}/{codEmpresa}/{codAgencia}/getCurrentInfo")
    public ResponseEntity<CalendariosDto> getCurrentDate(
            @PathVariable(name = "codSystema") String codSystema,
            @PathVariable(name = "codEmpresa") String codEmpresa,
            @PathVariable(name = "codAgencia") String codAgencia
    )
    {
        return ResponseEntity.ok(calendariosService.getCurrenteDate(new CalendariosPKId(codSystema,codEmpresa,codAgencia)));
    }

    @GetMapping("/{codAgencia}/{codSystema}/getCurrentInfoCalendarios")
    public ResponseEntity<CalendariosDto> getCurrentInfoCalendarios(
            @PathVariable(name = "codAgencia") String codAgencia,
            @PathVariable(name = "codSystema") String codSystema)
    {
        return ResponseEntity.ok(calendariosService.getInfoCalendarios(codAgencia,codSystema));
    }

    @GetMapping("/{codAgencia}/{codSystema}/getCurrenteDate")
    public Object getInfoCurrenteDate(
            @PathVariable(name = "codAgencia") String codAgencia,
            @PathVariable(name = "codSystema") String codSystema)
    {
        return calendariosService.getCurrenteDate(codAgencia,codSystema);
    }
}
