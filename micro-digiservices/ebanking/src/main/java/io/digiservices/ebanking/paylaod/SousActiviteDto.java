package io.digiservices.ebanking.paylaod;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class SousActiviteDto{

    private String id;
    private String codActividad;
    private String DES_SUBACTIV;
}
