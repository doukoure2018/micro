export interface BilanPersonnel {
    bilanPersonnelId?: number;
    promoteurId: number;
    date_bilan: Date;
    epargnes: number;
    valeur_biens_durables: number;
    dateEnregistrement?: Date;
    dateModification?: Date;

    libeleGarantie?: string;
    montantGarantie?: number;
}
