package io.digiservices.clients.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResumenPlanPagoDTO {
    private Long numCredito;
    private Integer totalEcheances;
    private BigDecimal totalAPagar;
    private BigDecimal totalPrincipal;
    private BigDecimal totalIntereses;
    private BigDecimal totalPagado;
    private BigDecimal totalRestant;
    private Integer echeancesPagadas;
    private Integer echeancesRestantes;
}

