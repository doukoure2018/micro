package io.digiservices.ecreditservice.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class BilanEntreprise {
    private Long bilanEntrepriseId;   // corresponds to id in the table
    private Long entrepriseId;        // corresponds to entreprise_id
    private LocalDate dateBilan;      // corresponds to date_bilan
    private BigDecimal liquidites;    // corresponds to liquidites
    private BigDecimal creancesClients; // corresponds to creances_clients
    private BigDecimal valeurStocks;  // corresponds to valeur_stocks
    private BigDecimal valeurEquipements; // corresponds to valeur_equipements
    private BigDecimal dettesFournisseurs; // corresponds to dettes_fournisseurs
    private BigDecimal emprunts;      // corresponds to emprunts
    private BigDecimal capitalPropre; // corresponds to capital_propre
    private Boolean estPrevisionnel;  // corresponds to est_previsionnel
    private LocalDateTime dateEnregistrement; // corresponds to date_enregistrement
    private LocalDateTime dateModification; // corresponds to date_modification
}
