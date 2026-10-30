package io.digiservices.ecreditservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.List;

/**
 * Les journaux du service Audit (lot 2 de la proposition du 30/10/2026).
 *
 * <p>Rien n'est calcule ni recopie ici : ces quatre ecrans affichent des traces que la base
 * tient deja, et que personne n'avait jamais pu lire. Le journal des decisions porte 21 775
 * evenements, les sorties de dossiers sans motif 237 lignes, les blocages de comptes et les
 * reglages d'habilitations leurs propres journaux.</p>
 */
public final class AuditDtos {

    private AuditDtos() {
    }

    /** Une page de resultats, pour le seul journal assez volumineux pour en avoir besoin. */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PageAuditDto<T> {
        private List<T> contenu;
        private int page;
        private int taille;
        private long total;
        private int pages;
    }

    // ==================== Journal des decisions ====================

    /**
     * Un evenement du circuit d'un dossier. {@code delaiHeures} est le temps ecoule depuis
     * l'evenement precedent DU MEME dossier : c'est lui qui montre ou un dossier a attendu.
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DecisionDto {
        private Long historiqueId;
        private Long demandeId;
        private String client;
        private String numeroMembre;
        private BigDecimal montant;
        private String pointVente;
        private String agence;
        private String delegation;
        private String evenement;        // ETAT, CREATION, AFFECTATION, REATTRIBUTION
        private String ancienEtat;
        private String nouvelEtat;
        private String ancienStatut;
        private String nouveauStatut;
        private String acteur;           // le login ou le nom, tel que le declencheur l'a inscrit
        private String motif;
        private LocalDateTime dateEvenement;
        private Long delaiHeures;        // depuis l'evenement precedent du meme dossier
    }

    /** Ce que l'ecran affiche au-dessus du journal : les volumes par evenement et par acteur. */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DecisionsSyntheseDto {
        private long total;
        private LocalDateTime premier;
        private LocalDateTime dernier;
        private List<CompteurDto> parEvenement;
        private List<CompteurDto> parEtatArrivee;
        private List<CompteurDto> parActeur;     // les vingt plus actifs
        private List<CompteurDto> plusLents;     // etats d'arrivee par delai moyen
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CompteurDto {
        private String cle;
        private long nombre;
        private Long moyenneHeures;   // renseigne seulement pour les delais
    }

    // ==================== Annulations et sorties sans motif ====================

    /**
     * Un dossier sorti du circuit. {@code tracee} dit si la sortie porte un motif et un auteur :
     * c'est la ligne de partage entre une annulation en regle et une sortie par la voie
     * technique non gardee, qui a produit 237 dossiers dont on ne sait ni qui ni pourquoi.
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SortieDossierDto {
        private Long demandeId;
        private String client;
        private String numeroMembre;
        private BigDecimal montant;
        private String pointVente;
        private String agence;
        private String delegation;
        private String statutDemande;        // ANNULE, REJET
        private String validationState;      // l'etape ou le dossier s'est arrete
        private String etatAvantAnnulation;
        private String motifCode;
        private String motif;
        private String demandeePar;
        private LocalDateTime dateDemande;
        private String decideePar;
        private LocalDateTime dateDecision;
        private String motifRefus;
        private LocalDate dateCreation;
        private boolean tracee;              // motif ET auteur presents
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AnnulationsDto {
        private long nbAnnulees;
        private long nbEnAttente;
        private long nbSansMotif;
        private BigDecimal montantSansMotif;
        private List<SortieDossierDto> annulees;
        private List<SortieDossierDto> enAttente;
        private List<SortieDossierDto> sansMotif;
    }

    // ==================== Corrections de numero de membre ====================

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CorrectionNumeroDto {
        private Long id;
        private Long demandeId;
        private String client;
        private String pointVente;
        private String agence;
        private String ancienNumero;
        private String nouveauNumero;
        private String nomSaf;
        private String agenceSaf;
        private String motif;
        private String parNom;
        private String parRole;
        private OffsetDateTime dateCorrection;
    }

    // ==================== Comptes, blocages et habilitations ====================

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CompteAuditDto {
        private Long userId;
        private String nom;
        private String email;
        private String telephone;
        private String role;
        private String service;
        private String departement;
        private String pointVente;
        private String agence;
        private String delegation;
        private boolean actif;
        private LocalDate derniereConnexion;
        private Long joursSansConnexion;
        private LocalDate creeLe;
        private boolean emailVerifie;
        private boolean telephoneVerifie;
        private boolean contactsACorriger;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TraceCompteDto {
        private Long id;
        private Long userId;
        private String compte;
        private String action;        // BLOQUER, DEBLOQUER, ACTIVER, DESACTIVER
        private String motif;
        private String parNom;
        private OffsetDateTime dateAction;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TraceHabilitationDto {
        private Long id;
        private String action;        // ACCORDER, RETIRER, BASCULE, RATTACHEMENT, ACCUEIL
        private String service;
        private String departement;
        private String rubriqueCode;
        private String rubriqueLibelle;
        private String valeurAvant;
        private String valeurApres;
        private String parNom;
        private OffsetDateTime dateAction;
    }

    /** La matrice telle qu'elle est, en lecture : un departement, ses rubriques, ses comptes. */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MatriceLectureDto {
        private Long departementId;
        private String service;
        private String code;
        private String libelle;
        private boolean toutVoir;
        private long nbComptes;
        private List<String> rubriques;
    }

    // ==================== Journal unifie des actions sensibles (lot 3) ====================

    /**
     * Une action sensible, d'ou qu'elle vienne. Huit journaux sont ramenes a ces six colonnes :
     * les decisions de credit, les corrections de numero, les blocages de comptes, les reglages
     * d'habilitations, les affectations de portefeuille, les signalements de telephone, les
     * episodes de credits negatifs, et les consultations de l'Audit lui-meme.
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ActionSensibleDto {
        private OffsetDateTime quand;
        private String type;        // DECISION, CORRECTION_NUMERO, COMPTE, HABILITATION, AFFECTATION, SIGNALEMENT, CREDIT_NEGATIF, CONSULTATION
        private String compte;      // qui a agi, tel que le journal d'origine l'a inscrit
        private String objet;       // sur quoi
        private String detail;      // ce qui a change
        private String origine;     // la table d'ou vient la ligne, pour remonter a la source
    }

    // ==================== Delais et derogations (lot 3) ====================

    /**
     * Un dossier valide par un niveau dont le plafond de delegation est inferieur au montant.
     * L'echelle en vigueur depuis aout 2026 : DA jusqu'a 25 M, DR 50 M, DE 100 M, DG au-dela.
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DerogationDto {
        private Long demandeId;
        private String client;
        private BigDecimal montant;
        private String niveau;          // le plus haut niveau qui a valide
        private BigDecimal plafond;     // le plafond de ce niveau
        private BigDecimal depassement; // montant - plafond
        private String valideur;
        private LocalDateTime dateValidation;
        private String pointVente;
        private String agence;
        private String delegation;
    }

    /** Le temps d'attente moyen avant d'atteindre une etape, et le pire cas observe. */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DelaiEtapeDto {
        private String etape;
        private long passages;
        private Long moyenneHeures;
        private Long maxHeures;
    }

    /** Le meme temps d'attente, vu par agence : ou les dossiers avancent vite, ou ils trainent. */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DelaiAgenceDto {
        private String delegation;
        private String agence;
        private long evenements;
        private Long moyenneHeures;
    }

    /** Un dossier vivant que plus rien n'a fait bouger depuis longtemps. */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DossierDormantDto {
        private Long demandeId;
        private String client;
        private BigDecimal montant;
        private String etat;
        private LocalDateTime dernierEvenement;
        private Long joursSansMouvement;
        private String pointVente;
        private String agence;
        private String delegation;
    }

    /** Un dossier renvoye plus d'une fois en correction : le circuit a tourne en rond. */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ResoumissionDto {
        private Long demandeId;
        private String client;
        private BigDecimal montant;
        private long nbCorrections;
        private String etats;
        private String etatActuel;
        private LocalDateTime derniereCorrection;
        private String pointVente;
        private String agence;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DelaisDerogationsDto {
        private long nbDerogations;
        private BigDecimal montantDerogations;
        private long nbDormants;
        private long nbResoumis;
        private List<DerogationDto> derogations;
        private List<DelaiEtapeDto> parEtape;
        private List<DelaiAgenceDto> parAgence;
        private List<DossierDormantDto> dormants;
        private List<ResoumissionDto> resoumissions;
        private int seuilDormantJours;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ComptesAuditDto {
        private long nbComptes;
        private long nbActifs;
        private long nbBloques;
        private long nbJamaisConnectes;
        private long nbSansConnexionDepuis90Jours;
        private boolean parDepartementActif;
        private List<CompteAuditDto> comptes;
        private List<TraceCompteDto> journalComptes;
        private List<TraceHabilitationDto> journalHabilitations;
        private List<MatriceLectureDto> matrice;
    }
}
