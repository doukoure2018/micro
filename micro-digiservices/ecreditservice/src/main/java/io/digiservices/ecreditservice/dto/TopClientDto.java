package io.digiservices.ecreditservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TopClientDto {
    private Long clientId;
    private String nomComplet;
    private String typeActivite;
    private Integer nombreDossiers;
    private BigDecimal montantTotal;
    private BigDecimal montantRembourse;
    private BigDecimal tauxRemboursement;
    private String categorieClient; // EXCELLENT, BON, MOYEN
    private Integer rang;
}