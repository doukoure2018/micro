package io.digiservices.ebanking.controller;

import io.digiservices.ebanking.service.ProductxService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/ebanking/ecredit")
public class ProductxController {

    private ProductxService productxService;

    public ProductxController(ProductxService productxService) {
        this.productxService = productxService;
    }

    @GetMapping("/{codSystema}/infoProducto")
    public List<Object[]> getInfoProducto(@PathVariable(name = "codSystema") String codSystema)
    {
        return productxService.getInfoProducto(codSystema);
    }

}
