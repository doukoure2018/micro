/** Un mouvement d'un compte, ramené à la même forme côté Production (SAF) et Middleware. */
export interface TransactionCompte {
    source: 'PRODUCTION' | 'MIDDLEWARE';
    numero?: number;
    date?: string;
    sens: 'DEPOT' | 'RETRAIT' | 'INCONNU';
    montant?: number;
    libelle?: string;
    /** Connu côté middleware seulement. */
    soldeApres?: number;
    /** EST_MOVIMIENTO brut (production) ; 'C' = confirmé. */
    etat?: string;
    utilisateur?: string;
    reference?: string;
    indicateurBrut?: string;
}

/** Les derniers mouvements d'un compte, Production et Middleware côte à côte. */
export interface DernieresTransactionsCompte {
    codCliente: string;
    numCuenta: string;
    limite: number;
    production: TransactionCompte[];
    middleware: TransactionCompte[];
    middlewareDisponible: boolean;
    genereLe?: string;
}
