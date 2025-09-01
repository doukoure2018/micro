package io.digiservices.ecreditservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalyseCreditDto {
    private Long id;
    private Long dossierId;

    // Indicateurs financiers
    private BigDecimal capaciteRemboursement;
    private BigDecimal ratioEndettement;
    private Integer scoreCredit; // 0-100

    // Décision
    private String recommandation; // APPROUVE, REJETE, APPROUVE_AVEC_CONDITIONS
    private String commentaires;

    // Risques identifiés
    private String niveauRisque; // FAIBLE, MOYEN, ELEVE
    private String risquesIdentifies;

    // Métadonnées
    private LocalDateTime dateAnalyse;
    private String analysteId;

    // Détails supplémentaires
    private RatiosFinanciersDto ratiosDetailles;
    private CapaciteRemboursementDto capaciteDetaille;
}