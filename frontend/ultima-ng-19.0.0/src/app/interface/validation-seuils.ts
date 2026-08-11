/**
 * Échelle de délégation de pouvoirs du circuit crédit (décision 2026-08-11).
 * Le circuit s'arrête au niveau compétent pour le montant demandé :
 *   1 à 25 000 000            → validation finale DA
 *   25 000 001 à 50 000 000   → validation finale DR
 *   50 000 001 à 100 000 000  → validation finale DE
 *   100 000 001 et plus       → visa final DG
 * Miroir des CASE sur montant_demande de WorkflowQuery.java (backend, source de vérité).
 */
export const PLAFOND_VALIDATION_DA_GNF = 25_000_000;
export const PLAFOND_VALIDATION_DR_GNF = 50_000_000;
export const PLAFOND_VALIDATION_DE_GNF = 100_000_000;

export type NiveauValidationFinale = 'DA' | 'DR' | 'DE' | 'DG';

/** Niveau hiérarchique dont la validation est finale pour ce montant. */
export function niveauValidationFinale(montant: number | null | undefined): NiveauValidationFinale {
    const m = Number(montant) || 0;
    if (m <= PLAFOND_VALIDATION_DA_GNF) return 'DA';
    if (m <= PLAFOND_VALIDATION_DR_GNF) return 'DR';
    if (m <= PLAFOND_VALIDATION_DE_GNF) return 'DE';
    return 'DG';
}

export function libelleNiveauValidation(niveau: NiveauValidationFinale): string {
    switch (niveau) {
        case 'DA':
            return "Directeur d'Agence";
        case 'DR':
            return 'Délégué Régional';
        case 'DE':
            return "Direction de l'Exploitation";
        case 'DG':
            return 'Directeur Général';
    }
}
