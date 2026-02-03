export interface DemandeCredit {
    demandeCreditId: number;
    entrepriseId: number;
    date_demande: string;
    montant_demande: number;
    duree_mois: number;
    tauxInteret: number;
    objet_financement: string;
    statut: string;
    dateEnregistrement: string;
    dateModification: string;
    mensualite_estimee?: number;
    ratio_credit_ca?: number;

    delegation_id?: number;
    agence_id?: number;
    point_vente_id?: number;
    user_id?: number;
    demandeIndividuelId?: number;

    // Demande sollicitée
    echeance?: number;
    nombre_echeance?: number;
    periodicite_remboursement?: string;

    // Proposition de l'analyste
    montant_propose?: number;
    duree_proposee?: number;
    nombre_echeance_propose?: number;
    echeance_proposee?: number;
}
