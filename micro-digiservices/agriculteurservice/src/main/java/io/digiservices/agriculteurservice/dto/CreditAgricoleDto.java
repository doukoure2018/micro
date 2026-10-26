package io.digiservices.agriculteurservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Credit agricole (contrat public AgriPilot).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreditAgricoleDto {

    private String codeAgence;
    private Long numeroCredit;
    private String codeClient;
    private String nomClient;
    private String typePersonne;
    private Integer typeCredit;
    private String libelleTypeCredit;
    private String codeActivite;
    private BigDecimal montant;
    private BigDecimal solde;
    private LocalDate dateOuverture;
    private LocalDate dateEcheance;
    private String statut;
    private BigDecimal hectares;
    private String planInvestissement;
    private String codeGroupeSollicitant;
    private String groupeSollicitant;
    private String codeAssociation;
    private String association;

    // ---- Tableau de bord DE (KUMY, lot 1 du 26/10/2026) ----
    /** Jours depuis la plus ancienne echeance impayee ; 0 si a jour. */
    private Integer joursRetard;
    /** Total des echeances echues non reglees, capital et interets, GNF. */
    private BigDecimal montantImpaye;
    /** true quand joursRetard > 0 : derive, pas un etat SAF. */
    private Boolean enRetard;
    private EcheanceDto prochaineEcheance;
    private BigDecimal montantAttenduMois;
    private BigDecimal montantPayeMois;
    /** Gestionnaire SAF du credit. */
    private String codeAgent;
    private String nomAgent;

    @lombok.Data
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class EcheanceDto {
        private LocalDate date;
        private BigDecimal montant;
    }
}
