export interface ValidationErrorDto {
    ligne: number;
    champ: string;
    valeur: string;
    message: string;
}

export interface ImportResultDto {
    success: boolean;
    totalLignes: number;
    lignesImportees: number;
    lignesEnErreur: number;
    erreurs: string[];
    erreursValidation: ValidationErrorDto[];
}
