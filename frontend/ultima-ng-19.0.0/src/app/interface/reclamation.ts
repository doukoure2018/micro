/**
 * Réclamations du terrain (V211, lot 2 de l'application mobile).
 *
 * Un agent signale depuis son téléphone ; la réclamation part par courriel aux six directions
 * porteuses de la rubrique RECLAMATIONS (V207), et se traite ici. Trois états seulement :
 * ouverte, prise en charge, traitée. La réponse saisie ici revient à l'agent sur son téléphone.
 */

export type StatutReclamation = 'OUVERTE' | 'EN_COURS' | 'TRAITEE';

export interface ReclamationVue {
    id: number;
    identifiantClient: string;
    categorie: string;
    categorieLibelle: string;
    objet: string;
    message: string;
    codAgencia: string | null;
    numCredito: number | null;
    codCliente: string | null;
    auteur: string | null;
    auteurPointVente: string | null;
    saisieAt: string;
    recueAt: string;
    statut: StatutReclamation;
    priseEnChargePar: string | null;
    priseEnChargeAt: string | null;
    reponse: string | null;
    reponduPar: string | null;
    reponduAt: string | null;
    /** Faux = la réclamation est en base mais personne n'a été prévenu : c'est une anomalie. */
    notifiee: boolean;
    nbPieces: number;
}

export interface FileReclamations {
    ouvertes: number;
    enCours: number;
    traitees: number;
    reclamations: ReclamationVue[];
}

export interface CategorieReclamation {
    code: string;
    libelle: string;
    ordre: number;
}

/** Ce que l'écran affiche d'un statut : un mot, une couleur PrimeNG. */
export const LIBELLES_STATUT: Record<StatutReclamation, string> = {
    OUVERTE: 'Ouverte',
    EN_COURS: 'Prise en charge',
    TRAITEE: 'Traitée'
};

export const SEVERITES_STATUT: Record<StatutReclamation, 'danger' | 'warn' | 'success'> = {
    OUVERTE: 'danger',
    EN_COURS: 'warn',
    TRAITEE: 'success'
};
