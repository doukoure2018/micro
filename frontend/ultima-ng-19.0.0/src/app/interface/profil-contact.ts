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

    demandeEmail?: DemandeEnCours;
    demandeTelephone?: DemandeEnCours;

    /** Calculé par le serveur : adresse en échec, ou numéro absent. */
    acorriger: boolean;
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
