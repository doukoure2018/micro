package io.digiservices.ebanking.paylaod;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ResumenDto {

    private ResumenPkId resumenPkId;
    private String TIP_TRANSACCION;
    private String SUBTIP_TRANSAC;
    private String COD_SISTEMA;
    private LocalDateTime FEC_MOVIMIENTO;
    private String DES_ASIENTO;
    private String EST_ASIENTO;
    private LocalDateTime FEC_ASIENTO;
    private LocalDateTime FEC_REGISTRO;
    private String COD_USUARIO;
    private String IND_LIQUIDACION;
    private String IND_POST_CIERRE;
}

