package io.digiservices.ecreditservice.dto;

import io.digiservices.clients.portefeuille.CategorieCredit;
import io.digiservices.clients.portefeuille.PortefeuilleCreditDto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;

/**
 * DTOs de l'affectation des credits SAF aux agents de credit (V159).
 * SAF fournit les encours, digi porte uniquement qui en repond.
 */
public final class PortefeuilleAffectationDtos {

    private PortefeuilleAffectationDtos() {
    }

    /** Credit en cours confie a un agent de credit du point de service. */
    public static final String TYPE_CREDIT = "CREDIT";
    /** Dossier au contentieux confie a un agent de recouvrement de l'agence (V165). */
    public static final String TYPE_CONTENTIEUX = "CONTENTIEUX";

    /** Une ligne de portefeuille_affectation, enrichie des noms. */
    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class AffectationDto {
        private Long id;
        private String codAgencia;
        private Long numCredito;
        private String codCliente;
        private Long agentUserId;
        private String agentNom;
        private Boolean agentActif;          // users.enabled
        private String agentCodAgencia;      // code SAF du point de service actuel de l'agent (rotation)
        private Long affecteParUserId;
        private String affecteParNom;
        private OffsetDateTime dateAffectation;
        private OffsetDateTime dateFin;
        private Long finParUserId;
        private String finParNom;
        private String motif;
        private String motifFin;
        private boolean actif;
        /** CREDIT ou CONTENTIEUX : de quoi l'agent repond sur ce credit (V165). */
        private String typeAffectation;
    }

    /** Passage au contentieux declare par le DA dans digi (V166), sans effet sur SAF. */
    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class ContentieuxDto {
        private Long id;
        private String codAgencia;
        private Long numCredito;
        private String codCliente;
        private Long declareParUserId;
        private String declareParNom;
        private OffsetDateTime dateDeclaration;
        private String motif;
    }

    /** Un credit SAF et son affectation digi courante (null si non affecte). */
    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class CreditAffecteDto {
        private PortefeuilleCreditDto credit;
        private AffectationDto affectation;
        private boolean aReaffecter;         // agent desactive ou parti vers un autre point de service
        private String motifReaffectation;
        private CategorieCredit categorie;   // EN_COURS, CONTENTIEUX ou APURE (derivee d'IND_ESTADO)
        private String categorieLibelle;     // « En cours », « Contentieux », « Apuré »
        private boolean affectable;          // seuls les credits en cours peuvent etre confies
        /** Dossier au contentieux : confiable a un agent portant la fonction CONTENTIEUX (V165). */
        private boolean affectableContentieux;
        /** Le DA peut encore le passer au contentieux : ni deja contentieux, ni apure (V166). */
        private boolean declarableContentieux;
        /** Passage au contentieux declare dans digi, null sinon (V166). */
        private ContentieuxDto contentieux;
        /** Agent de recouvrement qui en repond, null sinon (affectation de type CONTENTIEUX). */
        private AffectationDto affectationContentieux;
    }

    /** Agent de credit du point de service, avec sa charge. */
    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class AgentDto {
        private Long userId;
        private String nom;
        private String email;
        private boolean disponible;          // AGENT_CREDIT actif rattache a ce point de service
        private long nbCredits;
        private BigDecimal encours;
        private long nbEnRetard;
        /** Somme des capitaux et interets impayes de ses credits en retard (demande DSIG du 16/10/2026). */
        private BigDecimal montantRetard;
    }

    /**
     * Indicateurs du point de service. Depuis le 2026-10-07 nbCredits, encours, nbAffectes,
     * nbNonAffectes et encoursNonAffecte ne portent QUE sur les credits en cours, seuls
     * affectables ; les credits apures et au contentieux sont denombres a part.
     */
    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class IndicateursDto {
        private long nbCredits;              // credits en cours
        private BigDecimal encours;          // encours des credits en cours
        private long nbAffectes;
        private long nbNonAffectes;
        private BigDecimal encoursNonAffecte;
        private long nbAReaffecter;
        private long nbApures;               // hors charge d'agent
        private BigDecimal encoursApure;
        private long nbContentieux;          // hors charge d'agent de credit
        private BigDecimal encoursContentieux;
        private long nbContentieuxAffectes;  // confies a un agent de recouvrement (V165)
        private long nbContentieuxNonAffectes;
        private long nbContentieuxDeclares;  // passes au contentieux par le DA dans digi (V166)
        private BigDecimal encoursContentieuxDeclare;
    }

    /** Reponse complete pour un point de service. */
    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class PortefeuilleAffectationDto {
        private String codAgencia;
        private String desAgencia;
        private boolean peutAffecter;        // DA de l'agence (ou SUPER_ADMIN)
        private Long utilisateurId;
        private String role;
        private IndicateursDto indicateurs;
        private List<AgentDto> agents;
        /** Agents de l'agence portant la fonction CONTENTIEUX, avec leur charge (V165). */
        private List<AgentDto> agentsContentieux;
        private List<CreditAffecteDto> credits;
    }

    /** Une ligne de la liste des dossiers au contentieux du perimetre (V166). */
    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class ContentieuxLigneDto {
        private String codAgencia;
        private String pointVente;
        private String agence;
        private Long numCredito;
        private String codCliente;
        private String nomCliente;
        private String telephone;
        private String typeCredit;
        private BigDecimal encours;
        private Long joursRetard;
        private BigDecimal montantRetard;
        /** SAF (passe au judiciaire par la banque) ou AGENCE (declare par le DA dans digi). */
        private String origine;
        private java.time.OffsetDateTime dateDeclaration;
        private String declareParNom;
        private String motif;
        private Long agentRecouvrementId;
        private String agentRecouvrementNom;
        private String agentCreditNom;      // l'agent de credit qui porte encore le dossier
    }

    /** La liste du contentieux d'un perimetre, avec les agents a qui confier les dossiers. */
    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class ContentieuxListeDto {
        private List<ContentieuxLigneDto> lignes;
        private List<AgentDto> agents;      // agents de recouvrement de l'agence
        private boolean peutAffecter;       // DA de l'agence (ou SUPER_ADMIN)
    }

    /** Une ligne de la synthese par point de service (DA, DR, DE, DG) : SAF + affectations digi. */
    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class SynthesePointServiceDto {
        private String codAgencia;
        private String pointVente;
        private Long agenceId;
        private String agence;
        private Long delegationId;
        private String delegation;
        private long nbCredits;              // SAF : credits EN COURS (seuls affectables)
        private BigDecimal encours;
        private long nbEnRetard;
        private BigDecimal encoursPar30;
        private BigDecimal encoursPar90;
        private long nbAffectes;             // digi : affectations actives
        private long nbNonAffectes;
        private long nbAReaffecter;          // agent desactive ou parti
        private long nbAgents;               // AGENT_CREDIT actifs rattaches au PS
        private double tauxAffectation;      // nbAffectes / nbCredits
        private long nbApures;               // credits apures, hors charge d'agent
        private BigDecimal encoursApure;
        private long nbContentieux;          // credits au judiciaire, hors charge d'agent
        private BigDecimal encoursContentieux;
    }

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class AffectationRequest {
        @NotBlank private String codAgencia;
        @NotEmpty private List<Long> numCreditos;
        @NotNull private Long agentUserId;
        private String motif;
        /** CREDIT (defaut) ou CONTENTIEUX : voir {@code TYPE_CREDIT} / {@code TYPE_CONTENTIEUX}. */
        private String typeAffectation;
    }

    /** Passage au contentieux (ou levee) d'une liste de credits, par le DA (V166). */
    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class ContentieuxRequest {
        @NotBlank private String codAgencia;
        @NotEmpty private List<Long> numCreditos;
        private String motif;
        /** Agent de recouvrement, facultatif : le DA peut declarer sans designer personne. */
        private Long agentUserId;
    }

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class DesaffectationRequest {
        @NotBlank private String codAgencia;
        @NotEmpty private List<Long> numCreditos;
        private String motif;
        /** CREDIT (defaut) ou CONTENTIEUX : de quel responsable on retire le dossier. */
        private String typeAffectation;
    }
}
