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
    private Integer echeancesEnRetard;
    private Integer retardMoyenJours;
    private String historiqueRemboursement;
    /** Vrai quand le membre n'a aucun historique exploitable : etat, pas score de zero (lot 0). */
    private Boolean nouveauMembre;
    /** Base de calcul utilisee : ECHEANCES (reference) ou CREDITS (lecture sauvegarde SAF). */
    private String basePourScore;
    /** Version des regles de score, pour la tracabilite. */
    private String versionScore;
    //private List<DetailRisqueCreditDTO> detailsParCredit;
}
