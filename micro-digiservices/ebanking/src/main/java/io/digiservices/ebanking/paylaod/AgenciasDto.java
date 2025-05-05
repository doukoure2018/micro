package io.digiservices.ebanking.paylaod;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class AgenciasDto {

    private AgenciasPkId agenciasPkId;
    private String DES_AGENCIA;
    private String IND_ESTADO;
    private String APDO_POSTAL;
    private String DIR_FISICA;
    private String IND_TRA_SABADO;
    private String IND_TRA_DOMINGO;
    private String ABR_AGENCIA;
    private String IND_CENTRAL;
    private String TIPO_AGENCIA;
}
