/**
 * Évaluation de confiance d'un membre (score v2).
 *
 * Quatre composantes qui s'additionnent à 100, une classe A-E (N pour un nouveau membre) et
 * les lignes d'explication que le décideur doit pouvoir relire. Le barème vit côté serveur
 * (`BaremeScoreConfiance.java`) et ses règles d'affichage dans `@/utils/score-confiance`.
 */
export interface EvaluationRisqueDTO {
    /** Libellé de la classe : EXCELLENT, BON, À SURVEILLER, FRAGILE, DÉFAILLANT, NOUVEAU MEMBRE. */
    niveauRisque: string;
    pourcentageRisque: number | null;
    /** Total sur 100. Nul pour un nouveau membre : aucun historique à noter. */
    scoreConfiance: number | null;
    creditsAnalyses: number;
    echeancesAnalysees: number;
    echeancesRespectees: number;
    echeancesEnRetard?: number;
    retardMoyenJours?: number;
    historiqueRemboursement: string;
    /** Vrai quand le membre n'a aucun historique exploitable : un état, pas un zéro. */
    nouveauMembre?: boolean;
    /** Base de calcul : ECHEANCES (référence) ou CREDITS (sauvegarde SAF). */
    basePourScore?: string | null;
    versionScore?: string;

    /** Ponctualité des remboursements, sur 60. */
    ponctualite?: number | null;
    /** Profondeur de la relation, sur 15. */
    profondeur?: number | null;
    /** Situation des crédits en cours, sur 15. */
    situation?: number | null;
    /** Signaux connus de digi seul, sur 10. */
    signauxDigi?: number | null;
    /** Faux quand la base digi n'a pas été lue : la note vaut alors 10 par défaut. */
    signauxDigiDisponibles?: boolean;

    classe?: string;
    classeLibelle?: string;
    classeConduite?: string;
    analyseRenforcee?: boolean;
    restructurationDetectee?: boolean;
    contentieux?: boolean;
    explications?: string[];
    detailsParCredit?: DetailRisqueCreditDTO[];
}

/** Ce qu'un crédit a pesé dans le score du membre. */
export interface DetailRisqueCreditDTO {
    numCredito: number;
    tipCredito?: number;
    fecApertura?: string;
    fecVencimiento?: string;
    monCredito?: number;
    monSaldo?: number;
    totalEcheances?: number;
    echeancesRespectees?: number;
    echeancesEnRetard?: number;
    tauxRespectPercent?: number;
    retardMaxJours?: number;
    montantEnRetard?: number;
    solde?: boolean;
    restructuration?: boolean;
}
