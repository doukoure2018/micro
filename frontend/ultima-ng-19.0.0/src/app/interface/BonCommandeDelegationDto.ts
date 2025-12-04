export interface BonCommandeDelegationDto {
    idCmd: number;
    numeroCommande: string;
    service: string;
    detailBonCommande: string;
    status: string;
    dateCreation: string | number[];
    dateTraitement: string | number[];
    observations: string | null;
    delegation: string;
    agence: string;
    pointVente: string;
    codePointVente: string;
    nomCompletUtilisateur: string;
    prenomUtilisateur: string;
    nomUtilisateur: string;
    contactUtilisateur: string;
    emailUtilisateur: string;
    nomCompletTraitant: string;
    dureeTraitementHeures: number;
    dureeTraitementJours: number;
    dureeTraitementFormatee: string;
}
