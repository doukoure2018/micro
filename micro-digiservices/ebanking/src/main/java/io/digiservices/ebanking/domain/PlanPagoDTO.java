package io.digiservices.ebanking.domain;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlanPagoDTO {
    private String codEmpresa;
    private String codAgencia;
    private Long numCredito;
    private Integer numCuota;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime fecCuota;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime fecRealCuota;

    private String tipCuota;
    private BigDecimal monCuota;
    private BigDecimal monPrincipal;
    private BigDecimal monInt;
    private BigDecimal monComision;
    private BigDecimal salPrincipal;
    private BigDecimal salInt;
    private BigDecimal salCredito;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime fecCancelacion;

    private String indEstado;
    private BigDecimal tasInt;
    private Integer diaInt;
    private Integer diaPendientesInt;
    private String perCuota;
}