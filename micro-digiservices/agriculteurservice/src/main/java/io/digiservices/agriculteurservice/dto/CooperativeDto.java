package io.digiservices.agriculteurservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * Cooperative / groupement agricole (contrat public AgriPilot).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CooperativeDto {

    private String codeGroupe;
    private String nom;
    private String activite;
    private long nombreMembres;
    private long nombreCredits;
    private BigDecimal montantTotal;
}
