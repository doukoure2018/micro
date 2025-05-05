package io.digiservices.ebanking.paylaod;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ProductoDto {

    private ProductoPkId productoPkId;
    private String COD_MONEDA;
    private String NOM_PRODUCTO;
    private String DES_PRODUCTO;
    private String REQUISITOS;
    private String COD_COLUMNA_REPORTE;
}

