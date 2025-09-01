package io.digiservices.ecreditservice.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class DemandeCredit {
    private Long demandeCreditId;        // corresponds to id in the table
    private Long entrepriseId;           // corresponds to entreprise_id
    private LocalDate dateDemande;       // corresponds to date_demande
    private BigDecimal montantDemande;   // corresponds to montant_demande
    private Integer dureeMois;           // corresponds to duree_mois
    private BigDecimal tauxInteret;      // corresponds to taux_interet
    private String objetFinancement;     // corresponds to objet_financement
    private String statut;               // corresponds to statut
    private LocalDateTime dateEnregistrement; // corresponds to date_enregistrement
    private LocalDateTime dateModification;   // corresponds to date_modification

    private Long delegationId;
    private Long agenceId;
    private Long pointVenteId;
    private Long userId;
    private Long demandeIndividuelId;

}
