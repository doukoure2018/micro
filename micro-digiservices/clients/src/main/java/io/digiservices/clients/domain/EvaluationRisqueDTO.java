package io.digiservices.clients.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

/**
 * Evaluation de confiance d'un membre, rendue aux ecrans de consultation et de decision.
 *
 * <p>Le score v2 se lit par composantes : quatre notes qui s'additionnent a 100, une classe
 * A-E (N pour un nouveau membre) et les lignes d'explication que le decideur doit pouvoir
 * relire. Le bareme est unique : {@code io.digiservices.clients.score.BaremeScoreConfiance}.</p>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EvaluationRisqueDTO {
    /** Libelle de la classe : EXCELLENT, BON, A SURVEILLER, FRAGILE, DEFAILLANT, NOUVEAU MEMBRE. */
    private String niveauRisque;
    private BigDecimal pourcentageRisque;
    /** Total sur 100. Nul pour un nouveau membre : aucun historique a noter. */
    private BigDecimal scoreConfiance;
    private Integer creditsAnalyses;
    private Integer echeancesAnalysees;
    private Integer echeancesRespectees;
    private Integer echeancesEnRetard;
    private Integer retardMoyenJours;
    private String historiqueRemboursement;
    /** Vrai quand le membre n'a aucun historique exploitable : un etat, pas un zero. */
    private Boolean nouveauMembre;
    /** Base de calcul : ECHEANCES (reference) ou CREDITS (sauvegarde SAF). */
    private String basePourScore;
    /** Version des regles de score, pour la tracabilite. */
    private String versionScore;

    // ---------------------------------------------------------------- composantes (v2)
    /** Ponctualite des remboursements, sur 60. */
    private BigDecimal ponctualite;
    /** Profondeur de la relation, sur 15. */
    private BigDecimal profondeur;
    /** Situation des credits en cours, sur 15. */
    private BigDecimal situation;
    /** Signaux connus de digi seul, sur 10. Neutre quand la base digi n'a pas ete lue. */
    private BigDecimal signauxDigi;
    /** Faux quand les signaux digi n'ont pas pu etre lus : la note vaut alors 10 par defaut. */
    private Boolean signauxDigiDisponibles;

    // ---------------------------------------------------------------- classe et regles dures
    /** A, B, C, D, E, ou N pour un nouveau membre. */
    private String classe;
    private String classeLibelle;
    private String classeConduite;
    private Boolean analyseRenforcee;
    /** Un credit solde a la date d'ouverture d'un autre : le remboursement n'a pas eu lieu. */
    private Boolean restructurationDetectee;
    /** Contentieux declare dans digi : classe E quel que soit le total. */
    private Boolean contentieux;

    /** Les lignes que le decideur doit pouvoir relire, dans l'ordre d'importance. */
    private List<String> explications;
    /** Ce que chaque credit a pese : le decideur doit pouvoir voir lequel a fait baisser la note. */
    private List<DetailRisqueCreditDTO> detailsParCredit;
}
