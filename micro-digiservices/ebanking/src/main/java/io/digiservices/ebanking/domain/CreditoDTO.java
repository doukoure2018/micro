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
public class CreditoDTO {
    private String codEmpresa;
    private String codAgencia;
    private Long numCredito;
    private Integer tipCredito;
    private String codCliente;
    private BigDecimal monCredito;
    private BigDecimal monSaldo;
    private BigDecimal monDesembolsado;
    private BigDecimal monPagadoPrincipal;
    private BigDecimal monPagadoIntereses;
    private BigDecimal tasaInteres;
    private Integer plazoCredito;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime fecApertura;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime fecVencimiento;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime fecCancelacion;

    private String indEstado;
    private Integer cantCuotas;
    private BigDecimal monCuota;
}