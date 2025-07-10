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
public class DetailRisqueCreditDTO {
    private Long numCredito;
    private Integer totalEcheances;
    private Integer echeancesRespectees;
    private Integer echeancesEnRetard;
    private BigDecimal tauxRespectPercent;
}
