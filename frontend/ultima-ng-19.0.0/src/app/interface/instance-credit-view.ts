export interface InstanceCreditView {
    // Credit table fields
    creditId: number;
    referenceCredit: string;
    // Add other credit fields as needed

    // Petit_credit table fields
    moyenPerson?: string;
    bien?: string;
    capital?: number;
    creance?: number;
    dette?: number;
    statutActivite?: string;
    experience?: string;
    lieuxAct?: string;
    personEmp?: string;
    lien?: string;
    nombre?: string;
    cumulCredit?: number;
    nbreCredit?: number;

    // Frequence table fields
    frequence?: number;
    frequenceCreatedAt?: Date;

    // GarantieMat table fields
    garantieLibele?: string;
    garantieMontant?: number;
    garantieCreatedAt?: Date;

    // Localisation table fields
    itAss?: string;
    itPc?: string;

    // Occurence_credit table fields
    stateCredit?: string;
    stateNote?: string;
    noteProfile?: string;
    noteAnalyse?: string;
    noteGarantie?: string;
    occurenceStatut?: string;
}
