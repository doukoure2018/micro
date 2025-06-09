package io.digiservices.ebanking.controller;

import io.digiservices.ebanking.paylaod.ActividaDto;
import io.digiservices.ebanking.service.ActividaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/ebanking")
public class ActividaServiceController {

    private ActividaService actividaService;

    public ActividaServiceController(ActividaService actividaService) {
        this.actividaService = actividaService;
    }

    @GetMapping("/activida")
    public ResponseEntity<List<ActividaDto>> getAllActivida()
    {
        return ResponseEntity.ok(actividaService.getAllActivida());
    }

    @GetMapping("/getInfoActivida/{Id}")
    public ResponseEntity<ActividaDto> getInfoActivida(
            @PathVariable(name = "Id") String Id
    )
    {
        return ResponseEntity.ok(actividaService.getInfoActivite(Id));
    }
}
