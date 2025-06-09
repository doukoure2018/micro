export interface ProcessCreditInd {
    numeroMembre: string;
    referenceCredit: string;
    moyenPerson: string;
    bien: string;
    capital: number;
    creance: number;
    dette: number;
    statutActivite: string;
    experience: string;
    lieuxAct: string;
    personEmp: string;
    lien: string;
    nombre: string;
    cumulCredit: number;
    nbreCredit: number;
    frequence: number;
    garantieLibele: string;
    garantieMontant: number;
    itAss: string;
    itPc: string;

    // Arrays for multiple products
    produitsLibele: string[];
    produitsPrixUnit: number[];
    produitsQte: number[];
    produitsObservation: string[];

    // Arrays for multiple charges
    chargesLibele: string[];
    chargesPrixUnit: number[];
    chargesQte: number[];

    // Arrays for multiple guarantors
    cautionsNom: string[];
    cautionsPrenom: string[];
    cautionsTelephone: string[];
    cautionsActivite: string[];
    cautionsAge: number[];
    cautionsProfession: string[];
}
