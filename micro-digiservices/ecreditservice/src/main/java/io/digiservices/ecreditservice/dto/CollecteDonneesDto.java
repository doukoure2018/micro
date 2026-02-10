package io.digiservices.ecreditservice.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class CollecteDonneesDto {
    private Long collecteId;
    private Long demandeindividuelId;

    private LocalDate dateEvaluation;
    private String agentCollecteCod;
    private String agentCollecteNom;

    // Section 1
    private String activiteDescription;
    private String secteurActivite;
    private String sousSecteurActivite;
    private String sousSousSecteur;

    private String statut;
    private Integer pourcentageCompletion;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Nested sections
    private ConditionCreditDto conditionCredit;
    private ChiffreAffairesDto chiffreAffaires;
    private MargeBruteDto margeBrute;
    private ActifPassifDto actifPassif;
    private ChargeEntrepriseDto chargeEntreprise;
    private ChargePersonnelleDto chargePersonnelle;
    private AutreRevenuDto autreRevenu;
    private BienPersonnelDto bienPersonnel;
    private List<AmortissementDto> amortissements;
}
