package io.digiservices.ecreditservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/** Appreciation des agents de credit a partir de leur portefeuille (V164, lot 1). */
public final class PortefeuilleScoreDtos {

    private PortefeuilleScoreDtos() {
    }

    /** Le score d'un agent a une date de calcul, tel qu'il est enregistre et affiche. */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ScoreAgentDto {
        private LocalDate dateCalcul;
        private Long agentUserId;
        private String agentNom;
        private Boolean agentActif;
        private String codAgencia;
        private String pointVente;
        private Long agenceId;
        private String agence;
        private Long delegationId;
        private String delegation;
        private LocalDate datePremiereAffectation;
        private int nbCredits;
        private BigDecimal encours;
        private int nbEnRetard;
        private BigDecimal montantRetard;
        private int nbHerites;
        private BigDecimal par30;
        private BigDecimal regularite;
        private BigDecimal tauxRetard;
        private BigDecimal poidsRetard;
        private BigDecimal charge;
        private BigDecimal tendance;
        private BigDecimal ptsPar30;
        private BigDecimal ptsRegularite;
        private BigDecimal ptsTauxRetard;
        private BigDecimal ptsPoidsRetard;
        private BigDecimal ptsCharge;
        private BigDecimal ptsTendance;
        private int pointsDisponibles;
        private Integer score;
        private String classe;          // A, B, C, D, NN
        private String motifNonNote;
        private Integer medianeReseau;
    }

    /** Repartition des classes sur un groupe (delegation, reseau). */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SyntheseScoreDto {
        private Long delegationId;
        private String delegation;
        private long nbAgents;
        private long nbNotes;
        private long nbA;
        private long nbB;
        private long nbC;
        private long nbD;
        private long nbNonNotes;
        private Integer scoreMoyen;
        private BigDecimal par30Moyen;
    }

    /** Reponse de l'ecran : date du calcul, synthese par delegation, un score par agent. */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ScoresDto {
        private LocalDate dateCalcul;
        private boolean peutRecalculer;
        private SyntheseScoreDto reseau;
        private List<SyntheseScoreDto> delegations;
        private List<ScoreAgentDto> agents;
        private BornesDto bornes;
    }

    /** Les bornes en vigueur, affichees dans l'ecran pour que le score soit verifiable. */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BornesDto {
        private double par30Mauvais;
        private double regulariteMauvais;
        private double tauxRetardMauvais;
        private double poidsRetardMauvais;
        private int minCredits;
        private int minJoursAffectation;
        private int joursFranchiseHerite;
    }

    /** Un credit en retard de l'agent, pour la fiche. */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreditRetardDto {
        private String codAgencia;
        private Long numCredito;
        private String codCliente;
        private String nomCliente;
        private String telephone;
        private String typeCredit;
        private BigDecimal encours;
        private Long joursRetard;
        private LocalDate datePremiereImpayee;
        private BigDecimal montantRetard;
        private boolean herite;
    }

    /** Fiche d'un agent : son score du jour, le score moyen de son point de service, ses credits en retard. */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FicheAgentDto {
        private ScoreAgentDto score;
        private Integer scoreMoyenPointService;
        private List<ScoreAgentDto> historique;      // scores precedents, du plus recent au plus ancien
        private List<CreditRetardDto> creditsEnRetard;
    }
}
