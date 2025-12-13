package io.digiservices.ecreditservice.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.List;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class DemandeIndividuel {
    // Informations de base
    private Long demandeIndividuelId;
    private String nom;
    private String prenom;
    private String telephone;
    private String numeroMembre;
    private Integer delegation;
    private Integer agence;
    private Integer pos;

    // Informations personnelles
    private String typePiece;
    private String numId;
    private LocalDate dateNaissance;
    private String lieuxNaissance;
    private String genre;
    private String situationMatrimoniale;
    private Integer nombrePersonneEnCharge;
    private Integer nombrePersonneScolarise;
    private String addresseDomicileContact;
    private String typePropriete;
    private Integer nombreAnneeHabitation;

    // Activité
    private String typeActivite;
    private String sousActivite;
    private String sousSousActivite;
    private String descriptionActivite;
    private Integer nombreAnneeActivite;
    private String adresseLieuActivite;
    private String autreActivite;
    private String lieuActivite;

    private String natureClient = "Individuel"; // Valeur par défaut
    private String nomPersonneMorale;
    // Modalités de crédit
    private BigDecimal montantDemande;
    private Integer dureeDemande;
    private String periodiciteRemboursement;
    private BigDecimal tauxInteret;
    private Integer periodeDiffere;
    private Integer nombreEcheance;
    private BigDecimal echeance;
    private String objectCredit;
    private String detailObjectCredit;
    private String statutCredit;
    private Integer rangCredit;

    // Système
    private Integer tipCredito;
    private String codUsuarios;
    private String statutDemande;
    private String validationState;
    private String currentActivite;
    private String statutSelection;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss.SSSSSS")
    private LocalDateTime createdAt;
    private Integer age;


    // Liste des garanties
    private List<GarantiePropose> garanties;

    // ========== NOUVEAUX CHAMPS POUR LE GROUPEMENT PAR DELEGATION ==========
    private String delegationLibele;
    private String agenceLibele;
    private String pointVenteLibele;
}

