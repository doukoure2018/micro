export interface CorrectionEvolutionStats {
    date?: string;
    periode: string;
    enAttente: number;
    rejete: number;
    valide: number;
    total: number;
    // Données période précédente
    enAttentePrev?: number;
    rejetePrev?: number;
    validePrev?: number;
    totalPrev?: number;
    // Variations en %
    enAttenteVariation?: number;
    rejeteVariation?: number;
    valideVariation?: number;
    totalVariation?: number;
    // Métadonnées
    weekNumber?: number;
    dayOfWeek?: number;
    year?: number;
}
