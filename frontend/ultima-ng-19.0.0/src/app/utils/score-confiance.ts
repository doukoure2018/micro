/**
 * Règles d'affichage UNIQUES du score de confiance d'un membre.
 *
 * Les seuils sont ceux du serveur — `ScoreConfiance.java`, 90 / 75 / 60 / 40 — et nulle
 * part ailleurs. Avant le lot 0, trois écrans recoloraient le même nombre avec trois
 * règles différentes (la page d'analyse comparait des libellés sans accents, le détail du
 * dossier recoupait à 70/40, la synthèse DE avait la sienne), et un membre sans historique
 * s'affichait « 0 % » en rouge comme un défaillant.
 */

export const NIVEAU_NOUVEAU = 'NOUVEAU';

export type SeveriteScore = 'success' | 'info' | 'warn' | 'danger' | 'secondary';

/** Le sous-ensemble de l'évaluation dont dépend l'affichage. */
export interface EvaluationScore {
    niveauRisque?: string;
    scoreConfiance?: number | null;
    pourcentageRisque?: number | null;
    nouveauMembre?: boolean;
    historiqueRemboursement?: string;
    basePourScore?: string | null;
    creditsAnalyses?: number;
    echeancesAnalysees?: number;
    echeancesRespectees?: number;
}

/**
 * Membre sans historique exploitable. C'est un état, pas une mauvaise note : il ne doit
 * jamais s'afficher en rouge ni porter de pourcentage.
 */
export function estNouveauMembre(evaluation?: EvaluationScore | null): boolean {
    if (!evaluation) return false;
    if (evaluation.nouveauMembre === true) return true;
    if (evaluation.niveauRisque === NIVEAU_NOUVEAU) return true;
    return evaluation.scoreConfiance === null || evaluation.scoreConfiance === undefined;
}

/** Score sur 100, ou null quand il n'y a rien à noter. */
export function scoreNumerique(evaluation?: EvaluationScore | null): number | null {
    if (!evaluation || estNouveauMembre(evaluation)) return null;
    const brut = Number(evaluation.scoreConfiance);
    return Number.isFinite(brut) ? brut : null;
}

/** Sévérité PrimeNG (pastilles, étiquettes). Gris pour un nouveau membre. */
export function severiteScore(evaluation?: EvaluationScore | null): SeveriteScore {
    const score = scoreNumerique(evaluation);
    if (score === null) return 'secondary';
    if (score >= 90) return 'success';
    if (score >= 75) return 'info';
    if (score >= 60) return 'warn';
    return 'danger';
}

/** Classe de couleur du texte, sur les cinq niveaux du serveur. */
export function classeTexteScore(evaluation?: EvaluationScore | null): string {
    const score = scoreNumerique(evaluation);
    if (score === null) return 'text-gray-500';
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-blue-600';
    if (score >= 60) return 'text-amber-500';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
}

/** Niveau de risque tel qu'il doit être lu à l'écran. */
export function libelleNiveau(evaluation?: EvaluationScore | null): string {
    if (!evaluation) return '—';
    if (estNouveauMembre(evaluation)) return 'NOUVEAU MEMBRE';
    return evaluation.niveauRisque ?? '—';
}

/** Score affichable, arrondi à l'entier. Tiret quand il n'y a pas de score. */
export function valeurScore(evaluation?: EvaluationScore | null): string {
    const score = scoreNumerique(evaluation);
    return score === null ? '—' : String(Math.round(score));
}

/** Étiquette compacte : « Score 61/100 — MODÉRÉ » ou « Nouveau membre ». */
export function etiquetteScore(evaluation?: EvaluationScore | null): string {
    if (!evaluation) return 'Score indisponible';
    if (estNouveauMembre(evaluation)) return 'Nouveau membre — premier crédit';
    return `Score ${valeurScore(evaluation)}/100 — ${libelleNiveau(evaluation)}`;
}

/** Ce qu'il faut dire au décideur devant un nouveau membre. */
export const MENTION_NOUVEAU_MEMBRE = 'Premier crédit : aucun historique SAF à juger. Analyse sur pièces et visite — ce n’est pas un défaut de paiement.';

/** Base de calcul utilisée, pour que le lecteur sache ce qu'il regarde. */
export function libelleBase(evaluation?: EvaluationScore | null): string {
    switch (evaluation?.basePourScore) {
        case 'ECHEANCES':
            return 'Calculé échéance par échéance';
        case 'CREDITS':
            return 'Calculé crédit par crédit (base de sauvegarde SAF)';
        default:
            return '';
    }
}
