package io.digiservices.ecreditservice.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import java.math.BigDecimal;

/**
 * Membre d'une demande de crédit groupe solidaire.
 * Contrainte métier : la somme des montants à percevoir = montant demandé du groupe.
 * Les champs PE (Plan Épargne) ne concernent que le type CFE.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class MembreGroupe {
    private Long membreGroupeId;
    private Long demandeindividuelId;

    private String numeroMembre;
    private String nomPrenom;
    private BigDecimal montantPercevoir;

    // CFE uniquement (Plan Épargne)
    private BigDecimal montantSollicite;
    private BigDecimal montantBasePe;
    private BigDecimal versementMensuelPe;
    private BigDecimal salaireNetMensuel; // CFE : base de la quotité cumulée du groupe
}
