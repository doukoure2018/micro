package io.digiservices.ecreditservice.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class CreateBesoinCreditRequest {
    @NotNull(message = "L'ID de l'analyse est obligatoire")
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
}
