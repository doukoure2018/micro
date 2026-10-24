package io.digiservices.ecreditservice.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/** Objets du module A « Indicateurs mensuels » (V167). */
public final class RapportMensuelDtos {

    private RapportMensuelDtos() {
    }

    public static final String MODULE = "MENSUEL";
    public static final String MODULE_ACTIVITE = "ACTIVITE";

    public static final String BROUILLON = "BROUILLON";
    public static final String SOUMIS = "SOUMIS";
    public static final String VALIDE = "VALIDE";
    public static final String RENVOYE = "RENVOYE";
    public static final String CONSOLIDE = "CONSOLIDE";

    /** Une rubrique du referentiel, telle que l'ecran l'affiche. */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RubriqueDto {
        private String code;
        private String libelle;
        private String libelleCourt;
        private int ordre;
        /** SAISIE ou CALCUL. */
        private String nature;
        /** MONTANT, NOMBRE ou TAUX. */
        private String format;
        private String formule;
        private boolean controleSaf;
        private String sourceSaf;
        private String aide;
        /** V168 : section du bloc, periodicite (MENSUEL, TRIMESTRIEL, OUVERTURE), agregat annuel, sous-groupe. */
        private String section;
        private String periodicite;
        private String agregatAnnuel;
        private String groupe;
    }

    /** Un bloc du rapport (V168) : orientation d'affichage et d'export, periodicite, ligne annuelle. */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SectionDto {
        private String code;
        private String libelle;
        private int ordre;
        /** MOIS_LIGNES, MOIS_COLONNES, TRIMESTRE ou INSTANTANE. */
        private String orientation;
        private String periodicite;
        private String libelleAnnuel;
        private String note;
    }

    /** Un exercice d'un point de service (ou le total d'une agence) : mois par mois, puis l'annuel. */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AnnuelDto {
        private String module;
        private int annee;
        /** Point de service, ou null pour un total. */
        private String codAgencia;
        private String libelle;
        private String agence;
        private String delegation;
        private int nbPointsService;
        /** mois (1..12) -> code -> valeur (saisies agregees et calculs). */
        @Builder.Default
        private Map<Integer, Map<String, BigDecimal>> parMois = new LinkedHashMap<>();
        /** code -> valeur annuelle selon l'agregat de la rubrique (et formule pour les calculs). */
        @Builder.Default
        private Map<String, BigDecimal> annuel = new LinkedHashMap<>();
        /** mois -> etat du rapport (un seul point de service) ou nombre de rapports soumis/valides (total). */
        @Builder.Default
        private Map<Integer, String> etats = new LinkedHashMap<>();
    }

    /** La valeur d'une rubrique saisie : declaration de l'agence et controle SAF en regard. */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ValeurDto {
        private BigDecimal valeur;
        private BigDecimal valeurSaf;
        private OffsetDateTime dateLectureSaf;
        private String commentaire;
        /** Ecart entre saisie et SAF au-dela des seuils parametres. */
        private boolean ecart;
        /** (saisie - SAF) / SAF, null si pas de controle ou SAF = 0. */
        private BigDecimal ecartPct;
    }

    /** Un rapport = un point de service pour un mois. */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class LigneDto {
        private Long id;
        private String module;
        private String codAgencia;
        private String pointService;
        private Long agenceId;
        private String agence;
        private Long delegationId;
        private String delegation;
        private int annee;
        private int mois;
        private String etat;
        private String commentaire;
        private String saisiPar;
        private OffsetDateTime dateSaisie;
        private String soumisPar;
        private OffsetDateTime dateSoumission;
        private String validePar;
        private OffsetDateTime dateValidation;
        private String renvoyePar;
        private OffsetDateTime dateRenvoi;
        private String motifRenvoi;
        private String consolidePar;
        private OffsetDateTime dateConsolidation;
        /** Rubriques SAISIE : code -> valeur declaree + controle. */
        @Builder.Default
        private Map<String, ValeurDto> valeurs = new LinkedHashMap<>();
        /** Rubriques CALCUL : code -> resultat de la formule (null si denominateur absent ou nul). */
        @Builder.Default
        private Map<String, BigDecimal> calcules = new LinkedHashMap<>();
        /** Valeurs declarees le mois precedent, pour comparaison. */
        @Builder.Default
        private Map<String, BigDecimal> moisPrecedent = new LinkedHashMap<>();
        private int nbSaisies;
        private int nbManquantes;
        private int nbEcarts;
        /** Toutes les rubriques SAISIE sont renseignees. */
        private boolean complet;
        /** L'utilisateur connecte peut modifier cette ligne (DA de l'agence ou agent designe, etat BROUILLON ou RENVOYE). */
        private boolean modifiable;
        /** Agents de credit designes par le DA pour saisir ce point de service (V169). */
        @Builder.Default
        private List<AgentDesigneDto> agentsDesignes = new ArrayList<>();
    }

    /** Un agent de credit designe pour la saisie d'un point de service (V169). */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AgentDesigneDto {
        private Long userId;
        private String nom;
        private String email;
        private OffsetDateTime dateDesignation;
        private String designePar;
    }

    /** Pour le DA : un point de service, ses agents de credit, et qui parmi eux est designe. */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class DesignationPsDto {
        private String codAgencia;
        private String pointService;
        @Builder.Default
        private List<AgentDesigneDto> agents = new ArrayList<>();
        @Builder.Default
        private List<Long> designes = new ArrayList<>();
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DesignationRequest {
        @NotNull
        private String codAgencia;
        @NotNull
        private Long agentUserId;
    }

    /** Total d'une agence, d'une delegation ou du reseau : sommes des saisies, taux en rapport de sommes. */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AgregatDto {
        /** AGENCE, DELEGATION ou RESEAU. */
        private String niveau;
        private Long id;
        private String libelle;
        private Long parentId;
        private int nbPointsService;
        private int nbComplets;
        private int nbSoumis;
        private int nbValides;
        private int nbRenvoyes;
        private int nbConsolides;
        private int nbEcarts;
        /** Points de service du perimetre sans aucun rapport pour le mois (jamais ouvert, ni importe). */
        private int nbSansRapport;
        /** code -> somme (MONTANT, NOMBRE) ou taux (TAUX ; TAUX_REMB = moyenne simple, comme le fichier). */
        @Builder.Default
        private Map<String, BigDecimal> valeurs = new LinkedHashMap<>();
        /** code -> somme des controles SAF connus. */
        @Builder.Default
        private Map<String, BigDecimal> valeursSaf = new LinkedHashMap<>();
    }

    /** Le mois tel que l'ecran le recoit : rubriques, lignes du perimetre, totaux, droits. */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RapportMensuelDto {
        private String module;
        private int annee;
        private int mois;
        @Builder.Default
        private List<SectionDto> sections = new ArrayList<>();
        /** PS, AGENCE, DELEGATION ou RESEAU. */
        private String niveau;
        private String role;
        @Builder.Default
        private List<RubriqueDto> rubriques = new ArrayList<>();
        @Builder.Default
        private List<LigneDto> lignes = new ArrayList<>();
        @Builder.Default
        private List<AgregatDto> agences = new ArrayList<>();
        @Builder.Default
        private List<AgregatDto> delegations = new ArrayList<>();
        private AgregatDto total;
        private boolean peutSaisir;
        private boolean peutValider;
        private boolean peutConsolider;
        /** DA : peut designer les agents saisissants de ses points de service. */
        private boolean peutDesigner;
        /** Agent de credit non designe : consultation seule, l'ecran le dit. */
        private boolean lectureSeule;
        private BigDecimal seuilEcartPct;
        private BigDecimal seuilEcartMontant;
        /** Message si SAF n'a pas pu etre lu a l'ouverture du mois. */
        private String avertissementSaf;
    }

    /** Enregistrement d'un brouillon : seules les rubriques presentes sont touchees. */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BrouillonRequest {
        /** code -> valeur (null efface la saisie). Les taux arrivent en fraction (0,97). */
        private Map<String, BigDecimal> valeurs;
        /** code -> commentaire d'ecart. */
        private Map<String, String> commentaires;
        private String commentaire;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PeriodeRequest {
        /** MENSUEL par defaut (compatibilite avec l'ecran des indicateurs). */
        private String module;
        @NotNull
        private Integer annee;
        @NotNull
        private Integer mois;
        /** Codes SAF des points de service vises ; vide = tout le perimetre. */
        private List<String> codes;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DecisionRequest {
        @NotEmpty
        private List<Long> ids;
        private String motif;
    }
}
