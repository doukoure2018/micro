package io.digiservices.ecreditservice.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DemandeUpdateRequest {

    @NotNull(message = "L'ID de la demande est obligatoire")
    private Long demandeCreditId;

    // Promoteur
    @NotBlank(message = "Le nom du promoteur est obligatoire")
    private String nomPromoteur;

    @NotBlank(message = "Le prénom du promoteur est obligatoire")
    private String prenomPromoteur;

    @NotNull(message = "La date de naissance est obligatoire")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dateNaissancePromoteur;

    @NotBlank(message = "Le numéro d'identité est obligatoire")
    private String numeroIdentitePromoteur;

    private String adressePromoteur;
    private String telephonePromoteur;
    private String emailPromoteur;

    // Entreprise
    @NotBlank(message = "Le nom de l'entreprise est obligatoire")
    private String nomEntreprise;

    private String formeJuridique;
    private String secteurActivite;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dateCreationEntreprise;

    private String numeroRegistre;
    private String adresseEntreprise;
    private String telephoneEntreprise;
    private String emailEntreprise;

    // Bilan entreprise
    @DecimalMin(value = "0.0", message = "Les liquidités doivent être positives")
    private BigDecimal liquidites;

    @DecimalMin(value = "0.0", message = "Les créances clients doivent être positives")
    private BigDecimal creancesClients;

    @DecimalMin(value = "0.0", message = "La valeur des stocks doit être positive")
    private BigDecimal valeurStocks;

    @DecimalMin(value = "0.0", message = "La valeur des équipements doit être positive")
    private BigDecimal valeurEquipements;

    @DecimalMin(value = "0.0", message = "Les dettes fournisseurs doivent être positives")
    private BigDecimal dettesFournisseurs;

    @DecimalMin(value = "0.0", message = "Les emprunts doivent être positifs")
    private BigDecimal emprunts;

    @DecimalMin(value = "0.0", message = "Le capital propre doit être positif")
    private BigDecimal capitalPropre;

    // Bilan personnel
    @DecimalMin(value = "0.0", message = "Les épargnes doivent être positives")
    private BigDecimal epargnes;

    @DecimalMin(value = "0.0", message = "La valeur des biens durables doit être positive")
    private BigDecimal valeurBiensDurables;

    // Compte exploitation actuel
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dateDebutPeriodeActuel;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dateFinPeriodeActuel;

    @DecimalMin(value = "0.0", message = "Le chiffre d'affaires actuel doit être positif")
    private BigDecimal chiffreAffairesActuel;

    private BigDecimal coutMarchandisesActuel;
    private BigDecimal coutTransportProductionActuel;
    private BigDecimal fraisTransportPersonnelActuel;
    private BigDecimal fraisManutentionActuel;
    private BigDecimal montantAideExterneActuel;
    private BigDecimal fraisHebergementRestaurationActuel;
    private BigDecimal impotsActuel;
    private BigDecimal loyersActuel;

    // Compte exploitation prévisionnel
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dateDebutPeriodePrevisionnel;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dateFinPeriodePrevisionnel;

    @DecimalMin(value = "0.0", message = "Le chiffre d'affaires prévisionnel doit être positif")
    private BigDecimal chiffreAffairesPrevisionnel;

    private BigDecimal coutMarchandisesPrevisionnel;
    private BigDecimal coutTransportProductionPrevisionnel;
    private BigDecimal fraisTransportPersonnelPrevisionnel;
    private BigDecimal fraisManutentionPrevisionnel;
    private BigDecimal montantAideExternePrevisionnel;
    private BigDecimal fraisHebergementRestaurationPrevisionnel;
    private BigDecimal impotsPrevisionnel;
    private BigDecimal loyersPrevisionnel;

    // Demande crédit
    @NotNull(message = "Le montant de la demande est obligatoire")
    @DecimalMin(value = "1.0", message = "Le montant de la demande doit être supérieur à 0")
    private BigDecimal montantDemande;

    @NotNull(message = "La durée en mois est obligatoire")
    @Min(value = 1, message = "La durée doit être d'au moins 1 mois")
    @Max(value = 240, message = "La durée ne peut pas dépasser 240 mois")
    private Integer dureeMois;

    @NotBlank(message = "L'objet du financement est obligatoire")
    private String objetFinancement;

    // Paramètres optionnels
    private BigDecimal autresRevenusActuel = BigDecimal.ZERO;
    private BigDecimal autresRevenusPrevisionnel = BigDecimal.ZERO;
    private String libeleGarantie;
    private BigDecimal montantGarantie = BigDecimal.ZERO;

    // Cautions
    private List<Personnecaution> cautions;

    // Localisation
    private Long delegationId;
    private Long agenceId;
    private Long pointVenteId;
    private Long userId;
}