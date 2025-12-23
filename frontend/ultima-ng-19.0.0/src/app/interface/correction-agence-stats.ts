export interface CorrectionAgenceStats {
    agenceId: number | null;
    agenceLibele: string;
    agenceCode: string;
    enAttente: number;
    rejete: number;
    valide: number;
    total: number;
}
