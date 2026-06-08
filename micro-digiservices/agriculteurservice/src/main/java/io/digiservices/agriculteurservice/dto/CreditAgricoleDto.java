package io.digiservices.agriculteurservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Credit agricole (contrat public AgriPilot).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreditAgricoleDto {

    private String codeAgence;
    private Long numeroCredit;
    private String codeClient;
    private String nomClient;
    private String typePersonne;
    private Integer typeCredit;
    private String libelleTypeCredit;
    private String codeActivite;
    private BigDecimal montant;
    private BigDecimal solde;
    private LocalDate dateOuverture;
    private LocalDate dateEcheance;
    private String statut;
    private BigDecimal hectares;
    private String planInvestissement;
    private String codeGroupeSollicitant;
    private String groupeSollicitant;
    private String codeAssociation;
    private String association;
}
