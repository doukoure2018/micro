export interface BilanPersonnel {
    bilanPersonnelId?: number;
    promoteurId: number;
    dateBilan: Date;
    epargnes: number;
    valeurBiensDurables: number;
    dateEnregistrement?: Date;
    dateModification?: Date;
}
