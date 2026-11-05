export interface EvaluationRisqueDTO {
    niveauRisque: string;
    pourcentageRisque: number | null;
    /** Nul pour un nouveau membre : aucun historique à noter (lot 0). */
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
    /** Version des règles de score, pour la traçabilité. */
    versionScore?: string;
}
