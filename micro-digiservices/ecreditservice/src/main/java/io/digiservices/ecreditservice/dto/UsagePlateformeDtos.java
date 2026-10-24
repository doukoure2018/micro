package io.digiservices.ecreditservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * Barometre d'usage de digi (V174, lot 1) : ce que la plateforme compte d'elle-meme sur une
 * semaine, en sept familles. Aucune saisie supplementaire, aucune declaration : tout vient des
 * traces du travail quotidien.
 */
public final class UsagePlateformeDtos {

    private UsagePlateformeDtos() {
    }

    /** Une journee : connexions et utilisateurs distincts. */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class JourDto {
        private LocalDate jour;
        private String libelle;          // « Lun 19 »
        private int connexions;
        private int utilisateurs;
        private int dossiersIndividuels;
        private int dossiersGroupe;
        private int dossiersFonctionnaire;
        private int agentsNotes;
    }

    /** Adoption par role. */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RoleDto {
        private String role;
        private String libelle;
        private int comptes;
        private int actifs;
        private int connexions;
    }

    /** Une delegation : adoption, production, portefeuille. */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class DelegationDto {
        private Long id;
        private String libelle;
        private int comptes;
        private int actifs;
        private int connexions;
        private int dossiersCrees;
        private int dossiersValides;
        private int psProducteurs;
        private int psTotal;
        private int affectations;
        /** Part de comptes actifs, en pourcentage entier. */
        private int partActifs;
    }

    /** Un passage du planificateur d'alertes. */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ExecutionDto {
        private String job;
        private LocalDate jour;
        private String heure;
        private String statut;
        private int tentative;
        private Integer nbEcheances;
        private Integer nbImpayes;
        private Integer nbAgents;
        private Integer nbDa;
        private Integer nbDr;
        private Integer nbDe;
        private String message;
    }

    /** Les quelques chiffres d'une semaine, pour la mettre en regard de la precedente. */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ResumeDto {
        private LocalDate debut;
        private LocalDate fin;
        private int connexions;
        private int utilisateursActifs;
        private int agentsActifs;
        private int dossiersCrees;
        private int dossiersValides;
        private int psProducteurs;
        private int affectations;
        private int alertesEnvoyees;
    }

    /** Le barometre d'une semaine. */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UsageSemaineDto {
        private LocalDate debut;
        private LocalDate fin;                  // dernier jour inclus
        private String libellePeriode;          // « semaine du 19 au 24 octobre 2026 »
        private String perimetre;               // « Réseau » ou « DR Conakry »
        private boolean toutReseau;
        private boolean montants;               // la version du DR ne porte pas les montants

        // 1. Adoption
        private int comptesActifs;
        private int utilisateursActifs;
        private int connexions;
        private int jamaisConnectes;
        private int agentsComptes;
        private int agentsActifs;
        @Builder.Default
        private List<RoleDto> roles = new ArrayList<>();

        // 2. Couverture
        private int psProducteurs;
        private int psTotal;

        // 3. Activite credit
        private int dossiersCrees;
        private int dossiersGroupe;
        private int dossiersFonctionnaire;
        private int dossiersValides;
        private BigDecimal montantValide;       // GNF ; null si la version ne porte pas les montants

        // 4. Fluidite du circuit
        private int evenements;
        private int acteurs;
        private int rejets;
        private int annulations;
        private int reattributions;
        private BigDecimal delaiMedianJours;
        private BigDecimal delaiMoyenJours;

        // 5. Suivi du portefeuille
        private int affectations;
        private int daAyantAffecte;
        private int affectationsCloses;
        private int affectationsActives;
        private int agentsPorteurs;
        private int agentsNotes;

        // 6. Alertes du portefeuille
        private int alertesAgents;
        private int alertesDa;
        private int alertesDr;
        private int alertesDe;
        private int alertesTechniques;
        private int alertesEnvoyees;
        private int joursAvecDigest;
        @Builder.Default
        private List<ExecutionDto> executions = new ArrayList<>();

        // 7. Qualite des donnees
        private int fichesCorrigees;
        private int correctionsAnnulees;
        private int telephonesDemandes;
        private int signalements;

        // Series et repartitions
        @Builder.Default
        private List<JourDto> jours = new ArrayList<>();
        @Builder.Default
        private List<DelegationDto> delegations = new ArrayList<>();

        /** La semaine precedente, pour la mise en regard. */
        private ResumeDto precedente;

        /** Message affiche quand une famille n'a pas encore d'historique. */
        private String avertissement;
    }
}
