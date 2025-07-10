package io.digiservices.ecreditservice.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class DemandeCreditCompleteDTO {

    // Données du promoteur
    private String nomPromoteur;
    private String prenomPromoteur;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dateNaissancePromoteur;

    private String numeroIdentitePromoteur;
    private String adressePromoteur;
    private String telephonePromoteur;
    private String emailPromoteur;

    // Données de l'entreprise
    private String nomEntreprise;
    private String formeJuridique;
    private String secteurActivite;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dateCreationEntreprise;

    private String numeroRegistre;
    private String adresseEntreprise;
    private String telephoneEntreprise;
    private String emailEntreprise;

    // Bilan de l'entreprise
    private BigDecimal liquidites;
    private BigDecimal creancesClients;
    private BigDecimal valeurStocks;
    private BigDecimal valeurEquipements;
    private BigDecimal dettesFournisseurs;
    private BigDecimal emprunts;
    private BigDecimal capitalPropre;

    // Bilan personnel
    private BigDecimal epargnes;
    private BigDecimal valeurBiensDurables;

    // Compte d'exploitation actuel
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dateDebutPeriodeActuel;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dateFinPeriodeActuel;

    private BigDecimal chiffreAffairesActuel;
    private BigDecimal autresRevenusActuel;
    private BigDecimal coutMarchandisesActuel;
    private BigDecimal coutTransportProductionActuel;
    private BigDecimal fraisTransportPersonnelActuel;
    private BigDecimal fraisManutentionActuel;
    private BigDecimal montantAideExterneActuel;
    private BigDecimal fraisHebergementRestaurationActuel;
    private BigDecimal impotsActuel;
    private BigDecimal loyersActuel;

    // Compte d'exploitation prévisionnel
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dateDebutPeriodePrevisionnel;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dateFinPeriodePrevisionnel;

    private BigDecimal chiffreAffairesPrevisionnel;
    private BigDecimal autresRevenusPrevisionnel;
    private BigDecimal coutMarchandisesPrevisionnel;
    private BigDecimal coutTransportProductionPrevisionnel;
    private BigDecimal fraisTransportPersonnelPrevisionnel;
    private BigDecimal fraisManutentionPrevisionnel;
    private BigDecimal montantAideExternePrevisionnel;
    private BigDecimal fraisHebergementRestaurationPrevisionnel;
    private BigDecimal impotsPrevisionnel;
    private BigDecimal loyersPrevisionnel;

    // Demande de crédit
    private BigDecimal montantDemande;
    private Integer dureeMois;
    private String objetFinancement;

    // Garantie
    private String libeleGarantie;
    private BigDecimal montantGarantie;

    // CHANGED: Replace individual caution fields with array
    private List<Personnecaution> personnecautions = new ArrayList<>();

    // Location and user
    private Long delegationId;
    private Long agenceId;
    private Long pointVenteId;
    private Long userId;

    // Helper method to add a personnecaution
    public void addPersonnecaution(Personnecaution caution) {
        if (this.personnecautions == null) {
            this.personnecautions = new ArrayList<>();
        }
        this.personnecautions.add(caution);
    }
}