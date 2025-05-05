package io.digiservices.ebanking.paylaod;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class MouvementDto {

    private MouvementPkId mouvementPkId;
    private String NUM_CUENTA;
    private String COD_PRODUCTO;
    private String TIP_TRANSACCION;
    private String SUBTIP_TRANSAC;
    private String COD_SISTEMA;

    private LocalDateTime FEC_MOVIMIENTO;
    private Long NUM_DOCUMENTO;
    private String EST_MOVIMIENTO;
    private String IND_APL_CARGO;
    private BigDecimal MON_MOVIMIENTO;
    private String DES_MOVIMIENTO;
    private String SISTEMA_FUENTE;
    private Long NUM_MOV_FUENTE;

    private String COD_AGENCIA;
    private String COD_USUARIO;
    private String DES_REFERENCIA;
}

