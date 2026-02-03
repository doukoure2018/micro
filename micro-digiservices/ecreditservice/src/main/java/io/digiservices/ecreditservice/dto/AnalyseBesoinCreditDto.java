package io.digiservices.ecreditservice.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class AnalyseBesoinCreditDto {
    private Long besoinCreditId;
    private Long analyseId;

    // Investment section
    private BigDecimal coutEquipement;
    private BigDecimal depensesRattachees;
    private BigDecimal apportPersonnel;

    // Investment adjustments
    private BigDecimal ajustCoutEquipement;
    private BigDecimal ajustDepensesRattachees;
    private BigDecimal ajustApportPersonnel;

    // Exploitation section
    private BigDecimal coutAchatCycle;
    private Integer nbreCycleFinancer;
    private BigDecimal tresorerieDisponible;
    private BigDecimal stockActuel;
    private BigDecimal comptesRecevoir;
    private BigDecimal dettesFournisseurs;
    private BigDecimal creditFournisseur;

    // Exploitation adjustments
    private BigDecimal ajustCoutAchatCycle;
    private BigDecimal ajustTresorerieDispo;
    private BigDecimal ajustStockActuel;
    private BigDecimal ajustComptesRecevoir;
    private BigDecimal ajustDettesFournisseurs;
    private BigDecimal ajustCreditFournisseur;

    // CALCULATED FIELDS (from view v_besoin_credit_complet)
    private BigDecimal effCoutEquipement;
    private BigDecimal effDepensesRattachees;
    private BigDecimal effApportPersonnel;
    private BigDecimal effCoutAchatCycle;
    private BigDecimal effTresorerieDispo;
    private BigDecimal effStockActuel;
    private BigDecimal effComptesRecevoir;
    private BigDecimal effDettesFournisseurs;
    private BigDecimal effCreditFournisseur;
    private BigDecimal besoinReelInvestissement;
    private BigDecimal besoinReelExploitation;
}
