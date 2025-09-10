// OperationReserveDTO.ts
export interface OperationReserveDTO {
    numero: number;
    dateOperation: number[];
    codeAgence: string;
    codeUser: string;
    montant: number;
    transactionOp: number; // 1=Retrait, 2=Dépôt
    libelleOp: string;
    compteReserve: string;
    etatOp: string;
    validerPar: string;
    dateExecution: number[];
}
