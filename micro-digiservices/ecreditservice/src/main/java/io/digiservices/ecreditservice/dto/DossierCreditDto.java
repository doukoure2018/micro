package io.digiservices.ecreditservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DossierCreditDto {
    private Long id;
    private Long clientId;
    private Long demandeindividuelId; // ✅ NOUVEAU CHAMP
    private String clientNomComplet;
    private BigDecimal montantDemande;
    private Integer dureeMois;
    private BigDecimal tauxInteret;
    private LocalDate dateDemande;
    private String statut;
    private String agentId;
    private LocalDateTime dateCreation;
    private LocalDateTime dateDerniereModification;

    // Champs additionnels
    private ClientDto client;

    // Données calculées
    private BigDecimal mensualite;
    private BigDecimal totalInterets;
    private BigDecimal montantTotalAPayer;
}