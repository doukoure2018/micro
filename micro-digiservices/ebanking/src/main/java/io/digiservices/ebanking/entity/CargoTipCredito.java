package io.digiservices.ebanking.entity;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "PR_CARGOS_TIPO_CREDITO",schema = "PR")
public class CargoTipCredito {

    @Id
    private String COD_CARGO;
    private String COD_EMPRESA;
    @Column(name = "TIP_CREDITO")
    private Long tipCredito;
    private String TIP_CARGO;
    @Column(precision =16,scale = 2)
    private BigDecimal MON_CARGO;
    @Column(precision =16,scale = 2)
    private BigDecimal MON_MIN;
    @Column(precision =16,scale = 2)
    private BigDecimal MON_MAX;
    private String CUENTA_CONTABLE;
    private String TIP_COBRO;
    private String TIP_TRANSACCION;
    private String SUB_TIP_TRANSACCION;
    private String PER_COBRO;
    private Long POR_PRORRATEO;
    private String IND_CARGO_MORA;
}
