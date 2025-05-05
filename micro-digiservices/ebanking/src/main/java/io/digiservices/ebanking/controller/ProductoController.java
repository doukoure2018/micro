package io.digiservices.ebanking.controller;

import io.digiservices.ebanking.paylaod.ProductoDto;
import io.digiservices.ebanking.paylaod.ProductoPkId;
import io.digiservices.ebanking.service.ProductoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/ebanking/ecredit")
public class ProductoController {

    private ProductoService productoService;

    public ProductoController(ProductoService productoService) {
        this.productoService = productoService;
    }

    @GetMapping("/{COD_EMPRESA}/{codSystema}/{COD_PRODUCTO}/getDescriptionProd")
    public ResponseEntity<ProductoDto> getInfoProducto(
            @PathVariable(name = "COD_EMPRESA") String COD_EMPRESA,
            @PathVariable(name = "codSystema") String codSystema,
            @PathVariable(name = "COD_PRODUCTO") String COD_PRODUCTO
    )
    {
        return ResponseEntity.ok(productoService.getDescriptionProd(new ProductoPkId(COD_EMPRESA,codSystema,COD_PRODUCTO)));
    }
}
