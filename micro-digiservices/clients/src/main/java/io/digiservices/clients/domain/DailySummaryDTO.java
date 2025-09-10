package io.digiservices.clients.domain;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * DTO pour le résumé journalier dans une période
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DailySummaryDTO {
    private LocalDate date;
    private Integer nombreMiddleware;
    private Integer nombreProduction;
    private BigDecimal montantMiddleware;
    private BigDecimal montantProduction;
    private BigDecimal ecart;
    private String statut; // OK, ECART

    public boolean hasEcart() {
        return ecart != null && ecart.compareTo(BigDecimal.ZERO) != 0;
    }
}
