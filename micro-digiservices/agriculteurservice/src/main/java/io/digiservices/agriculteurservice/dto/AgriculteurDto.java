package io.digiservices.agriculteurservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Agriculteur (contrat public AgriPilot).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AgriculteurDto {

    private String codeClient;
    private String nom;
    private String typePersonne;
    private String telephone;
    private LocalDate dateAdhesion;
    private String codeAgence;
    private String agence;
    private String activite;
    private String secteur;
    private long nombreCredits;
    private BigDecimal montantTotal;
    private AgriculteurPhysiqueDto detailsPhysique;
    private AgriculteurMoraleDto detailsMorale;
}
