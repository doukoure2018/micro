package io.digiservices.ecreditservice.dto;

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
    }

    /** Un credit SAF et son affectation digi courante (null si non affecte). */
    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class CreditAffecteDto {
        private PortefeuilleCreditDto credit;
        private AffectationDto affectation;
        private boolean aReaffecter;         // agent desactive ou parti vers un autre point de service
        private String motifReaffectation;
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
    }

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class IndicateursDto {
        private long nbCredits;
        private BigDecimal encours;
        private long nbAffectes;
        private long nbNonAffectes;
        private BigDecimal encoursNonAffecte;
        private long nbAReaffecter;
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
        private List<CreditAffecteDto> credits;
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
        private long nbCredits;              // SAF : credits vivants
        private BigDecimal encours;
        private long nbEnRetard;
        private BigDecimal encoursPar30;
        private BigDecimal encoursPar90;
        private long nbAffectes;             // digi : affectations actives
        private long nbNonAffectes;
        private long nbAReaffecter;          // agent desactive ou parti
        private long nbAgents;               // AGENT_CREDIT actifs rattaches au PS
        private double tauxAffectation;      // nbAffectes / nbCredits
    }

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class AffectationRequest {
        @NotBlank private String codAgencia;
        @NotEmpty private List<Long> numCreditos;
        @NotNull private Long agentUserId;
        private String motif;
    }

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class DesaffectationRequest {
        @NotBlank private String codAgencia;
        @NotEmpty private List<Long> numCreditos;
        private String motif;
    }
}
