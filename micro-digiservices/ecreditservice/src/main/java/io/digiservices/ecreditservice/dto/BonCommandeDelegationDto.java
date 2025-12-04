package io.digiservices.ecreditservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BonCommandeDelegationDto {
    private Long idCmd;
    private String numeroCommande;
    private String service;
    private String detailBonCommande;
    private String status;
    private LocalDateTime dateCreation;
    private LocalDateTime dateTraitement;
    private String observations;

    private Long idTraitant;
    private Long delegationId;

    // Informations géographiques
    private String delegation;
    private String agence;
    private String pointVente;
    private String codePointVente;

    // Informations utilisateur créateur
    private String nomCompletUtilisateur;
    private String prenomUtilisateur;
    private String nomUtilisateur;
    private String contactUtilisateur;
    private String emailUtilisateur;

    // Utilisateur traitant
    private String nomCompletTraitant;


    // Durée de traitement
    private Double dureeTraitementHeures;
    private Long dureeTraitementJours;
    private String dureeTraitementFormatee;
}