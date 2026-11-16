import { Directory, File, Paths } from 'expo-file-system';

/**
 * Les photos sur le telephone : ou elles vivent, et comment elles partent.
 *
 * <p>Une photo prise sur le terrain atterrit dans le CACHE du systeme, que le telephone vide
 * des qu'il manque de place. Une file d'attente qui patiente plusieurs jours sans reseau ne
 * peut pas vivre la : la photo est recopiee dans le dossier de documents de l'application, que
 * le systeme ne touche pas, et c'est ce chemin-la que la file retient.</p>
 */

const DOSSIER = 'photos';

/** Recopie la photo a un endroit sur, et rend son chemin definitif. */
export function rangerLaPhoto(uriTemporaire: string, nom: string): string {
  const dossier = new Directory(Paths.document, DOSSIER);
  if (!dossier.exists) {
    dossier.create({ intermediates: true });
  }
  const cible = new File(dossier, `${nom}.jpg`);
  if (cible.exists) {
    cible.delete();
  }
  new File(uriTemporaire).copy(cible);
  return cible.uri;
}

/** Efface une photo que l'agent retire avant d'enregistrer sa visite. */
export function oublierLaPhoto(uri: string): void {
  try {
    const fichier = new File(uri);
    if (fichier.exists) {
      fichier.delete();
    }
  } catch {
    // Un fichier deja disparu n'est pas une erreur : il n'y a plus rien a faire.
  }
}

/**
 * Pose la photo dans un envoi multipart. React Native ne lit pas le fichier en memoire : il
 * prend {uri, name, type} et le streame lui-meme — d'ou la conversion, que TypeScript ne peut
 * pas exprimer autrement puisque la signature standard attend un Blob.
 */
export function ajouterPhotoAuFormulaire(formulaire: FormData, uri: string, nom: string): void {
  formulaire.append('fichier', {
    uri,
    name: `${nom}.jpg`,
    type: 'image/jpeg',
  } as unknown as Blob);
}
