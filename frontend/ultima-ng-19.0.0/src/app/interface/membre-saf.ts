/**
 * Résultat de la vérification d'un numéro de membre dans SAF production
 * (GET /ecredit/membres/{numero}/verification).
 * TROUVE affiche le client ; INCONNU et FORME_INVALIDE bloquent la saisie ;
 * SAF_INDISPONIBLE laisse passer avec un avertissement, le serveur marquera le dossier.
 */
export interface VerificationMembre {
    numero: string;
    etat: 'TROUVE' | 'INCONNU' | 'FORME_INVALIDE' | 'SAF_INDISPONIBLE';
    message: string;
    nomClient: string | null;
    codAgencia: string | null;
    agence: string | null;
    typePersonne: string | null;
    dateAdhesion: string | null;
    telephone: string | null;
}

export function verificationBloquante(v: VerificationMembre | null | undefined): boolean {
    return !!v && (v.etat === 'INCONNU' || v.etat === 'FORME_INVALIDE');
}

/** Un dossier en cours dont SAF a confirmé que le numéro de membre n'existe pas. */
export interface DossierInconnu {
    id: number;
    numeroMembre: string;
    client: string;
    pointVente: string | null;
    agence: string | null;
    delegation: string | null;
    etat: string;
    montant: number | null;
    agent: string | null;
    creeLe: string;
    signaleLe: string | null;
    reverifieLe: string | null;
}

export interface MembresInconnus {
    perimetre: string;
    trouves: number;
    inconnus: number;
    aVerifier: number;
    dossiers: DossierInconnu[];
}
