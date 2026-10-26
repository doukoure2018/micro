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
