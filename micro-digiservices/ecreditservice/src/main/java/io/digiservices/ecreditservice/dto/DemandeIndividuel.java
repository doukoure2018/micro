package io.digiservices.ecreditservice.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class DemandeIndividuel {

    private Long demandeindividuel_id;
    private String nom;
    private String prenom;
    private String telephone;
    private Integer age;
    private String numeroMembre;
    private Integer delegation;
    private Integer agence;
    private Integer pos;
    private String quartier;
    private String fonction;
    private OffsetDateTime createdAt;
    private BigDecimal montant;
    private String activite;
    private String statutDemande;
    private String communeResidence;
    private String validationState;
    private String typeApport;
    private String statutSelection;
    private String currentActivite;
    private String raison;
    private String object;
    private Integer tipCredito;
    private String codUsuarios;
}
