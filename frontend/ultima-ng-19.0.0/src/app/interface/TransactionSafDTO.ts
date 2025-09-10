export interface TransactionSafDTO {
    numTransaction: number;
    dateOperation: number[] | string; // [year, month, day, hour, minute] ou ISO string
    faitPar: string;
    numEcritureComptable: number;
    montant: number;
    soldeAvantOperation: number | null;
    soldeApresOperation: number | null;
    soldeCaisseAvant: number | null;
    soldeCaisseApres: number | null;
    typeOperation: string;
    typeTransaction: number;
    sousTypeTransaction: number;
    numCompte: string;
    serialCaisse: number;
    codeAgence: string;
    etatSaf: string;
    codeClient: string;
    motifs: string;
    codeProduit: string;
    dateExecution: number[] | string;
    errors: string | null;
    nbre: number;
}
