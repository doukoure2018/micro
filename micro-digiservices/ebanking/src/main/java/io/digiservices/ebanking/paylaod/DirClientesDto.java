package io.digiservices.ebanking.paylaod;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class DirClientesDto {

    private DirClientesPKId dirClientesPKId;
    private String COD_PAIS;
    private String COD_PROVINCIA;
    private String codCanton;
    private String COD_DISTRITO;
    private String TIP_DIRECCION;
    private String DET_DIRECCION;
}
