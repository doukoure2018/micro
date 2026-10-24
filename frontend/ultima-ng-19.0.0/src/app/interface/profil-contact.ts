/**
 * Page « Mon profil » : contacts de l'utilisateur connecté et vérification par code (V172).
 *
 * Une modification n'est enregistrée qu'après la saisie d'un code reçu à la nouvelle
 * adresse ou au nouveau numéro. L'adresse étant l'identifiant de connexion, l'ancienne
 * reste acceptée trente jours.
 */
export type CanalVerification = 'EMAIL' | 'SMS';

export interface DemandeEnCours {
    canal: CanalVerification;
    destinationMasquee: string;
    expireAt: string;
    essais: number;
    essaisMax: number;
}

export interface ProfilContact {
    userId: number;
    nom: string;
    role?: string;
    service?: string;
    pointVente?: string;
    agence?: string;
    delegation?: string;

    email: string;
    emailEnEchec: boolean;
    emailVerifieAt?: string;
    telephone?: string;
    telephoneVerifieAt?: string;

    ancienEmail?: string;
    ancienEmailExpireAt?: string;

    /** Contact saisi par le directeur d'agence, en attente de confirmation. */
    emailSaisiPar?: string;
    emailSaisiAt?: string;
    telephoneSaisiPar?: string;
    telephoneSaisiAt?: string;

    demandeEmail?: DemandeEnCours;
    demandeTelephone?: DemandeEnCours;

    /** Calculé par le serveur : adresse en échec, numéro absent, ou contact à confirmer. */
    acorriger: boolean;
    /** Contact posé par le directeur d'agence, que l'agent doit encore prouver. */
    aconfirmer: boolean;
}

/** Une ligne du suivi des contacts de l'équipe (V173). */
export interface EquipeContact {
    userId: number;
    nom: string;
    role?: string;
    pointVente?: string;
    agence?: string;
    delegation?: string;

    email: string;
    emailEnEchec: boolean;
    emailVerifie: boolean;
    emailSaisiPar?: string;

    telephone?: string;
    telephoneVerifie: boolean;
    telephoneSaisiPar?: string;

    derniereConnexion?: string;
    atraiter: boolean;
}

export interface IndicateursContacts {
    libelle?: string;
    nbAgents: number;
    nbEmailEnEchec: number;
    nbSansTelephone: number;
    nbAconfirmer: number;
    nbContactsVerifies: number;
}

export interface EquipeContacts {
    niveau: 'AGENCE' | 'DELEGATION' | 'RESEAU';
    peutSaisir: boolean;
    indicateurs: IndicateursContacts;
    synthese: IndicateursContacts[];
    lignes: EquipeContact[];
}

export interface DemandeCode {
    canal: CanalVerification;
    destinationMasquee: string;
    expireAt: string;
    essaisMax: number;
    message: string;
}

export interface ConfirmationContact {
    profil: ProfilContact;
    identifiantChange: boolean;
    message: string;
}
