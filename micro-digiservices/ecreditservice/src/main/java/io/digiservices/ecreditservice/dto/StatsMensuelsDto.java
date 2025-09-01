package io.digiservices.ecreditservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StatsMensuelsDto {
    private Integer annee;
    private Integer mois;
    private String moisLibelle; // Janvier, Février...

    // Volumes
    private Long nombreDossiers;
    private Long nombreApprobations;
    private Long nombreRejets;

    // Montants
    private BigDecimal montantDemande;
    private BigDecimal montantApprouve;
    private BigDecimal montantDecaisse;

    // Indicateurs
    private BigDecimal tauxApprobation;
    private BigDecimal ticketMoyen;
}