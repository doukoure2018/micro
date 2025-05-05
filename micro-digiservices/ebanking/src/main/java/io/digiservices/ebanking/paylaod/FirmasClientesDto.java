package io.digiservices.ebanking.paylaod;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class FirmasClientesDto {

    private FirmasClientesPkId firmasClientesPkId;
    private String CTG_FIRMA;
    private String TIP_CLIENTE;
}
