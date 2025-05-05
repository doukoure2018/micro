package io.digiservices.ebanking.entity;

import io.digiservices.ebanking.paylaod.AstoDetailPkId;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "CG_ASTO_DETALLE",schema = "CG")
public class AstoDetail {

    @EmbeddedId
    private AstoDetailPkId astoDetailPkId;
    private String CUENTA_CONTABLE;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS")
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
