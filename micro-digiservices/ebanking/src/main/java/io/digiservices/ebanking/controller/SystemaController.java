package io.digiservices.ebanking.controller;

import io.digiservices.ebanking.service.SystemaService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/ebanking/ecredit")
@RequiredArgsConstructor
public class SystemaController {

    private final SystemaService systemaService;

    @GetMapping("/{codSystema}/infoSystema")
    public List<Object[]> getInfoSystema(
            @PathVariable(name = "codSystema") String codSystema)
    {
        return systemaService.getInfoSystema(codSystema);
    }
}
