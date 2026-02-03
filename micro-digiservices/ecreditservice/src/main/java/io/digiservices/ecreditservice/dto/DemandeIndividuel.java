package io.digiservices.ecreditservice.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;


@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class DemandeIndividuel {

    // ==================== IDENTIFIANT ====================
    private Long demandeIndividuelId;

    // ==================== INFORMATIONS DE BASE ====================
    private String nom;
    private String prenom;
    private String sernom; // Surnom du demandeur
    private String telephone;
    private String email; // NOUVEAU V80: Email du demandeur
    private String numeroMembre;

    // ==================== LOCALISATION ADMINISTRATIVE ====================
    private Integer delegation;
    private Integer agence;
    private Integer pos;
    private String prefecture; // Préfecture de résidence
    private String sousPrefecture; // Sous-préfecture de résidence

    // ==================== NATURE DU CLIENT ====================
    /**
     * Nature du client - Valeurs possibles:
     * - "Demande credit Pour Particulier" (par défaut)
     * - "Demande de Credit Pour PME/PMI"
     * - "Demande de credit Pour Professionnels"
     */
    private String natureClient = "Demande credit Pour Particulier";
    private String nomPersonneMorale; // Nom de l'entreprise (obligatoire si PME/PMI)
    private String sigle; // NOUVEAU V80: Sigle de l'entreprise (pour PME/PMI)

    // ==================== INFORMATIONS PERSONNELLES ====================
    private String typePiece;
    private String numId;
    private LocalDate dateNaissance;
    private String lieuxNaissance;
    private String genre;
    private String situationMatrimoniale;
    private Integer nombrePersonneEnCharge;
    private Integer nombrePersonneScolarise;
    private String nomPere; // Nom du père
    private String nomMere; // Nom de la mère
    private String nomConjoint; // Nom du conjoint
    private String addresseDomicileContact;
    private String typePropriete;
    private Integer nombreAnneeHabitation;

    // ==================== ACTIVITÉ ====================
    private String categorie; // Catégorie du demandeur
    private String typeActivite;
    private String sousActivite;
    private String sousSousActivite;
    private String descriptionActivite;
    private Integer nombreAnneeActivite;
    private String adresseLieuActivite;
    private String autreActivite;
    private String lieuActivite;
    private String natureActivite; // Nature de l'activité

    // ==================== MODALITÉS DE CRÉDIT ====================
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

    // ==================== CHAMPS SYSTÈME ====================
    private Integer tipCredito;
    private String codUsuarios;
    private String statutDemande;
    private String validationState;
    private String currentActivite;
    private String statutSelection;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss.SSSSSS")
    private LocalDateTime createdAt;

    private Integer age;

    // ==================== GARANTIES ====================
    private List<GarantiePropose> garanties;

    // ==================== CHAMPS POUR AFFICHAGE (libellés) ====================
    private String delegationLibele;
    private String agenceLibele;
    private String pointVenteLibele;
}