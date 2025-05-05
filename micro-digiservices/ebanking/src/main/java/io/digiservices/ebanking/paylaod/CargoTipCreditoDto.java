package io.digiservices.ebanking.paylaod;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class CargoTipCreditoDto {

    private String COD_CARGO;
    private String COD_EMPRESA;
    private Long tipCredito;
    private String TIP_CARGO;
    private BigDecimal MON_CARGO;
    private BigDecimal MON_MIN;
    private BigDecimal MON_MAX;
    private String CUENTA_CONTABLE;
    private String TIP_COBRO;
    private String TIP_TRANSACCION;
    private String SUB_TIP_TRANSACCION;
    private String PER_COBRO;
    private Long POR_PRORRATEO;
    private String IND_CARGO_MORA;
}
