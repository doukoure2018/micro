export interface Avis {
    avisId?: number;
    libele: string;
    demandeIndividuelId: number;
    idUser?: number;
    dateCreation?: Date | string;
    updatedDate?: Date | string;
    username?: string;
    userFullName?: string;
}
