package io.digiservices.ebanking.paylaod;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class CargoCreditDto {

    private CargoCreditoPKId cargoCreditoPKId;
    private String TIP_CARGO;
    private BigDecimal VAL_CARGO;
    private BigDecimal MON_MIN;
    private BigDecimal MON_MAX;
    private String TIP_COBRO;
    private String TIP_TRANSACCION;
    private String SUB_TIP_TRANSACCION;
    private String PER_COBRO;
    private Date FEC_APLICACION;
    private Long POR_PRORRATEO;
    private Long NUM_PAGOS_DIFER;
}
