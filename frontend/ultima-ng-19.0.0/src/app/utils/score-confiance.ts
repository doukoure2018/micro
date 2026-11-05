/**
 * Règles d'affichage UNIQUES du score de confiance d'un membre (v2).
 *
 * Les bornes sont celles du serveur — `BaremeScoreConfiance.java` : classes A 85-100,
 * B 70-84, C 55-69, D 40-54, E < 40, et N pour un membre sans historique. Elles ne sont
 * recopiées nulle part ailleurs dans le front : avant le lot 0, trois écrans recoloraient le
 * même nombre avec trois règles différentes, et un premier emprunteur s'affichait « 0 % » en
 * rouge comme un défaillant.
 */

export const CLASSE_NOUVEAU = 'N';

export type SeveriteScore = 'success' | 'info' | 'warn' | 'danger' | 'secondary';

/** Ce qu'un crédit a pesé dans le score. */
export interface DetailRisqueCredit {
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

/** Le sous-ensemble de l'évaluation dont dépend l'affichage. */
export interface EvaluationScore {
    niveauRisque?: string;
    scoreConfiance?: number | null;
    pourcentageRisque?: number | null;
    nouveauMembre?: boolean;
    historiqueRemboursement?: string;
    basePourScore?: string | null;
    versionScore?: string;
    creditsAnalyses?: number;
    echeancesAnalysees?: number;
    echeancesRespectees?: number;
    echeancesEnRetard?: number;
    retardMoyenJours?: number;
    ponctualite?: number | null;
    profondeur?: number | null;
    situation?: number | null;
    signauxDigi?: number | null;
    signauxDigiDisponibles?: boolean;
    classe?: string;
    classeLibelle?: string;
    classeConduite?: string;
    analyseRenforcee?: boolean;
    restructurationDetectee?: boolean;
    contentieux?: boolean;
    explications?: string[];
    detailsParCredit?: DetailRisqueCredit[];
}

/**
 * Membre sans historique exploitable. C'est un état, pas une mauvaise note : il ne s'affiche
 * jamais en rouge et ne porte aucun pourcentage.
 */
export function estNouveauMembre(evaluation?: EvaluationScore | null): boolean {
    if (!evaluation) return false;
    if (evaluation.nouveauMembre === true) return true;
    if (evaluation.classe === CLASSE_NOUVEAU) return true;
    return evaluation.scoreConfiance === null || evaluation.scoreConfiance === undefined;
}

/** Score sur 100, ou null quand il n'y a rien à noter. */
export function scoreNumerique(evaluation?: EvaluationScore | null): number | null {
    if (!evaluation || estNouveauMembre(evaluation)) return null;
    const brut = Number(evaluation.scoreConfiance);
    return Number.isFinite(brut) ? brut : null;
}

/** Classe du membre, telle que le serveur l'a arrêtée. */
export function classeScore(evaluation?: EvaluationScore | null): string {
    if (!evaluation) return '';
    if (estNouveauMembre(evaluation)) return CLASSE_NOUVEAU;
    return evaluation.classe ?? '';
}

/** Sévérité PrimeNG. Gris pour un nouveau membre : ni bon ni mauvais, inconnu. */
export function severiteScore(evaluation?: EvaluationScore | null): SeveriteScore {
    switch (classeScore(evaluation)) {
        case 'A':
            return 'success';
        case 'B':
            return 'info';
        case 'C':
            return 'warn';
        case 'D':
        case 'E':
            return 'danger';
        default:
            return 'secondary';
    }
}

/** Classe de couleur du texte, une par classe de score. */
export function classeTexteScore(evaluation?: EvaluationScore | null): string {
    switch (classeScore(evaluation)) {
        case 'A':
            return 'text-green-600';
        case 'B':
            return 'text-blue-600';
        case 'C':
            return 'text-amber-500';
        case 'D':
            return 'text-orange-600';
        case 'E':
            return 'text-red-600';
        default:
            return 'text-gray-500';
    }
}

/** Fond discret assorti à la classe, pour les blocs. */
export function fondScore(evaluation?: EvaluationScore | null): string {
    switch (classeScore(evaluation)) {
        case 'A':
            return 'bg-green-50 border-green-200';
        case 'B':
            return 'bg-blue-50 border-blue-200';
        case 'C':
            return 'bg-amber-50 border-amber-200';
        case 'D':
            return 'bg-orange-50 border-orange-200';
        case 'E':
            return 'bg-red-50 border-red-200';
        default:
            return 'bg-gray-50 border-gray-200';
    }
}

/** Libellé de la classe : EXCELLENT, BON, À SURVEILLER, FRAGILE, DÉFAILLANT, NOUVEAU MEMBRE. */
export function libelleNiveau(evaluation?: EvaluationScore | null): string {
    if (!evaluation) return '—';
    if (estNouveauMembre(evaluation)) return 'NOUVEAU MEMBRE';
    return evaluation.classeLibelle ?? evaluation.niveauRisque ?? '—';
}

/** Score affichable, arrondi à l'entier. Tiret quand il n'y a pas de score. */
export function valeurScore(evaluation?: EvaluationScore | null): string {
    const score = scoreNumerique(evaluation);
    return score === null ? '—' : String(Math.round(score));
}

/** Étiquette compacte : « Classe C · 61/100 » ou « Nouveau membre ». */
export function etiquetteScore(evaluation?: EvaluationScore | null): string {
    if (!evaluation) return 'Score indisponible';
    if (estNouveauMembre(evaluation)) return 'Nouveau membre — premier crédit';
    return `Classe ${classeScore(evaluation)} · ${valeurScore(evaluation)}/100 — ${libelleNiveau(evaluation)}`;
}

/** La conduite à tenir, telle que le serveur la formule. Jamais un blocage. */
export function conduiteScore(evaluation?: EvaluationScore | null): string {
    if (!evaluation) return '';
    return evaluation.classeConduite ?? '';
}

/** Les lignes que le décideur doit pouvoir relire. */
export function explicationsScore(evaluation?: EvaluationScore | null): string[] {
    return evaluation?.explications ?? [];
}

/** Vrai quand la classe appelle une analyse renforcée (C, D, E et N). */
export function analyseRenforcee(evaluation?: EvaluationScore | null): boolean {
    if (!evaluation) return false;
    if (evaluation.analyseRenforcee !== undefined) return evaluation.analyseRenforcee;
    const classe = classeScore(evaluation);
    return classe === 'C' || classe === 'D' || classe === 'E' || classe === CLASSE_NOUVEAU;
}

/** Les quatre composantes, prêtes à afficher : libellé, note, maximum. */
export function composantes(evaluation?: EvaluationScore | null): { libelle: string; note: number | null; max: number; aide: string }[] {
    if (!evaluation || estNouveauMembre(evaluation)) return [];
    // Un serveur qui ne rend pas encore les composantes (le temps d'un déploiement) ne doit pas
    // produire quatre barres vides : on n'affiche que ce qui est réellement là.
    if (nombre(evaluation.ponctualite) === null) return [];
    return [
        { libelle: 'Ponctualité', note: nombre(evaluation.ponctualite), max: 60, aide: 'Chaque échéance échue, notée selon son retard et pondérée par son montant' },
        { libelle: 'Profondeur', note: nombre(evaluation.profondeur), max: 15, aide: 'Ce que la relation a déjà prouvé : crédits soldés, ancienneté' },
        { libelle: 'Situation', note: nombre(evaluation.situation), max: 15, aide: 'État des crédits en cours aujourd’hui' },
        { libelle: 'Signaux digi', note: nombre(evaluation.signauxDigi), max: 10, aide: 'Ce que la plateforme sait et que SAF ignore : annulation, rejet, membre non vérifié, contentieux' }
    ];
}

/** Part d'une composante, pour une barre de progression. */
export function partComposante(note: number | null, max: number): number {
    if (note === null || !max) return 0;
    return Math.max(0, Math.min(100, (note / max) * 100));
}

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

/** Ce qu'il faut dire au décideur devant un nouveau membre. */
export const MENTION_NOUVEAU_MEMBRE =
    'Premier crédit : aucun historique SAF à juger. Analyse sur pièces et visite — ce n’est pas un défaut de paiement.';

// ---------------------------------------------------------------- frise des échéances

export type EtatEcheance = 'A_LHEURE' | 'LEGER' | 'SERIEUX' | 'IMPAYEE' | 'NON_ECHUE';

export interface PastilleEcheance {
    numCuota: number;
    etat: EtatEcheance;
    retardJours: number;
    infobulle: string;
}

/**
 * Une pastille par échéance, teintée par le retard : la trajectoire d'un crédit se lit d'un
 * coup d'œil, ce qu'un tableau d'échéances ne montre pas. Mêmes paliers que le score.
 */
export function frise(echeances: any[], aujourdhui: Date = new Date()): PastilleEcheance[] {
    return (echeances ?? [])
        .filter((e) => e && e.numCuota !== 0)
        .slice()
        .sort((a, b) => Number(a.numCuota) - Number(b.numCuota))
        .map((e) => {
            const due = e.fecCuota ? new Date(e.fecCuota) : null;
            const payee = e.indEstado === 'C' && !!e.fecCancelacion;
            if (!due) {
                return pastille(e.numCuota, 'NON_ECHUE', 0, 'Échéance sans date');
            }
            if (!payee && due > aujourdhui) {
                return pastille(e.numCuota, 'NON_ECHUE', 0, `Échéance ${e.numCuota} — non échue`);
            }
            const fin = payee ? new Date(e.fecCancelacion) : aujourdhui;
            const retard = Math.max(0, Math.round((fin.getTime() - due.getTime()) / 86400000));
            const etat: EtatEcheance = retard <= 5 ? 'A_LHEURE' : retard <= 30 ? 'LEGER' : retard <= 90 ? 'SERIEUX' : payee ? 'SERIEUX' : 'IMPAYEE';
            const suffixe = payee ? (retard <= 5 ? 'payée à l’heure' : `payée avec ${retard} j de retard`) : `impayée depuis ${retard} j`;
            return pastille(e.numCuota, payee ? etat : retard > 90 ? 'IMPAYEE' : etat, retard, `Échéance ${e.numCuota} — ${suffixe}`);
        });
}

export function classePastille(etat: EtatEcheance): string {
    switch (etat) {
        case 'A_LHEURE':
            return 'frise-ok';
        case 'LEGER':
            return 'frise-leger';
        case 'SERIEUX':
            return 'frise-serieux';
        case 'IMPAYEE':
            return 'frise-impayee';
        default:
            return 'frise-avenir';
    }
}

function pastille(numCuota: number, etat: EtatEcheance, retardJours: number, infobulle: string): PastilleEcheance {
    return { numCuota: Number(numCuota), etat, retardJours, infobulle };
}

function nombre(valeur: number | null | undefined): number | null {
    if (valeur === null || valeur === undefined) return null;
    const n = Number(valeur);
    return Number.isFinite(n) ? n : null;
}
