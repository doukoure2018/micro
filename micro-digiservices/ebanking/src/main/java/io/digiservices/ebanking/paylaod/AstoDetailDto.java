package io.digiservices.ebanking.paylaod;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class AstoDetailDto {

    private AstoDetailPkId astoDetailPkId;
    private String CUENTA_CONTABLE;
    private LocalDateTime FEC_MOVIMIENTO;
    @Column(precision = 16,scale = 2)
    private BigDecimal DEBITO;
    @Column(precision = 16,scale = 2)
    private BigDecimal CREDITO;
    @Column(precision = 16,scale = 2)
    private BigDecimal DEBITO_CTA;
    @Column(precision = 16,scale = 2)
    private BigDecimal CREDITO_CTA;
    private String DETALLE;
    @Column(precision = 6,scale = 2)
    private BigDecimal TIP_CAM_BASE;
    @Column(precision = 6,scale = 2)
    private BigDecimal TIP_CAM_CTA;
    private String REFERENCIA;
    private String COD_UNIDAD;
}

