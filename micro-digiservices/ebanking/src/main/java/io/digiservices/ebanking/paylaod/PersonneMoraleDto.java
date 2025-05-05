package io.digiservices.ebanking.paylaod;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class PersonneMoraleDto {

    private PersonneMoralePKId personneMoralePKId;
    private String COD_SECTOR;
    private String CLASE_SOCIEDAD;
    private String COD_ACTIVIDAD;
    private String NOM_COMERCIAL;
    private String RAZON_SOCIAL;
}
