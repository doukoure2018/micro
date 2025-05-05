package io.digiservices.ebanking.paylaod;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class DistrictDto {

    private String codDistrito;
    private String COD_PAIS;
    private String codProvincia;
    private String codCanton;
    private String DES_DISTRITO;
}

