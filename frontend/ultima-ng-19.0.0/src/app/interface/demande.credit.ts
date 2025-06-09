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
}
