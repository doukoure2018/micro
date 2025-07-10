package io.digiservices.ebanking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EvaluationRisqueDTO {
    private String niveauRisque;
    private BigDecimal pourcentageRisque;
    private BigDecimal scoreConfiance;
    private Integer creditsAnalyses;
    private Integer echeancesAnalysees;
    private Integer echeancesRespectees;
    private String historiqueRemboursement;
    //private List<DetailRisqueCreditDTO> detailsParCredit;
}
