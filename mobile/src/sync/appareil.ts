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
