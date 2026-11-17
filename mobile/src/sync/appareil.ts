/**
 * Le jeton de notification de CE telephone, garde en memoire pour la duree de la session.
 *
 * <p>Il voyage avec chaque lot de saisies : le serveur sait ainsi quel appareil a transmis, et
 * a qui annoncer que c'est parti. Il n'est pas range dans la base locale — il change a chaque
 * reinstallation, et le redemander a l'ouverture coute moins qu'un jeton perime garde.</p>
 */

let jeton: string | null = null;

export function memoriserLeJetonDeLAppareil(valeur: string | null): void {
  jeton = valeur;
}

export function jetonDeLAppareil(): string | null {
  return jeton;
}

/**
 * Pourquoi ce telephone ne recoit pas de notification poussee.
 *
 * <p>Il y a trois raisons de ne rien recevoir, et elles n'appellent pas la meme action : le
 * projet n'est pas rattache a un compte Expo (c'est a la DSIG de le faire), l'agent a refuse
 * les notifications (c'est a lui de les rouvrir), ou l'appareil n'en est pas capable (Expo Go,
 * emulateur sans services Google). Sans cette distinction, l'ecran ne peut que se taire — et
 * un ecran muet se lit comme « tout va bien ».</p>
 */
export type EtatDuPush = 'OK' | 'PROJET_ABSENT' | 'REFUSE' | 'INDISPONIBLE';

let etat: EtatDuPush = 'INDISPONIBLE';

export function memoriserLEtatDuPush(valeur: EtatDuPush): void {
  etat = valeur;
}

export function etatDuPush(): EtatDuPush {
  return etat;
}
