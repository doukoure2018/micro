export interface CreditDataResponse {
    // Données de petit_credit
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
    referenceCredit?: string;
    cumulCredit?: number;
    nbreCredit?: number;

    // Données de frequence
    frequenceValue?: number;
    frequenceCreatedAt?: string; // ISO string format: "2024-12-27T10:30:00"

    // Données de garantieMat
    garantieLibele?: string;
    garantieMontant?: number;
    garantieCreatedAt?: string; // ISO string format: "2024-12-27T10:30:00"

    // Données de localisation
    itAss?: string;
    itPc?: string;

    // Données agrégées en JSON
    produitsData?: string; // JSON string
    chargesData?: string; // JSON string
    cautionsData?: string; // JSON string
}
