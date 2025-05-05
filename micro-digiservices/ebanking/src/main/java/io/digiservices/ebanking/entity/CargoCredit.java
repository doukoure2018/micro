package io.digiservices.ebanking.entity;

import io.digiservices.ebanking.paylaod.CargoCreditoPKId;
import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Entity
@Table(name = "PR_CARGOS_CREDITOS",schema = "PR")
public class CargoCredit {

    @EmbeddedId
    private CargoCreditoPKId cargoCreditoPKId;
    private String TIP_CARGO;

    @Column(precision =16,scale = 2)
    private BigDecimal VAL_CARGO;
    @Column(precision =16,scale = 2)
    private BigDecimal MON_MIN;
    @Column(precision =16,scale = 2)
    private BigDecimal MON_MAX;

    private String TIP_COBRO;
    private String TIP_TRANSACCION;
    private String SUB_TIP_TRANSACCION;
    private String PER_COBRO;
    private Date FEC_APLICACION;
    private Long POR_PRORRATEO;
    private Long NUM_PAGOS_DIFER;
}
