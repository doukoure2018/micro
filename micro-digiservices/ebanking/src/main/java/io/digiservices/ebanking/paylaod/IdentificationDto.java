package io.digiservices.ebanking.paylaod;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class IdentificationDto {

    private IdentificationPKId identificationPKId;
    private String IND_ESTADO;
    private LocalDateTime FECH_INGRESO;
    private String TIP_ASOCIADO;
    private String NOM_BENEFICIARIO;
    private String RELAC_BENEFICIARIO;
    private LocalDateTime FECH_NACIMIENTO;
}
