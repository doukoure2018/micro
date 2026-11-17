import { baseOuverte, estOuverte } from '@/db/base';
import type { NotificationVue } from '@/api/types';

/**
 * Le journal des notifications sur le telephone.
 *
 * <p>Pourquoi une copie locale d'une chose aussi fugace ? Parce qu'une notification poussee
 * s'efface d'un balayage, n'arrive pas si le telephone etait eteint, et qu'un agent en
 * tournee lit son centre de notifications la ou il n'a pas de reseau. Le serveur tient la
 * verite ; le telephone en garde la derniere version.</p>
 *
 * <p>La lecture, elle, part du telephone : l'agent marque lu hors connexion, l'ecran le
 * montre tout de suite, et la marque remonte a la synchronisation suivante
 * (`lue_a_remonter`). Sans cette colonne, un rafraichissement effacait la lecture de l'agent
 * en reecrivant la ligne telle que le serveur l'avait encore.</p>
 */

/** Remplace la copie par ce que le serveur vient de rendre, en gardant les lectures locales. */
export async function remplacerNotifications(vues: NotificationVue[]): Promise<void> {
  const db = baseOuverte();
  await db.withTransactionAsync(async () => {
    const aRemonter = await db.getAllAsync<{ id: number }>(
      'SELECT id FROM notification WHERE lue_a_remonter = 1');
    const lues = new Set(aRemonter.map((l) => l.id));
    await db.runAsync('DELETE FROM notification');
    for (const n of vues) {
      await db.runAsync(
        `INSERT OR REPLACE INTO notification
             (id, categorie, titre, corps, ecran, creee_at, envoyee, lue, lue_a_remonter)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        n.id, n.categorie, n.titre, n.corps, n.ecran, n.creeeAt,
        n.envoyee ? 1 : 0, n.lue || lues.has(n.id) ? 1 : 0, lues.has(n.id) && !n.lue ? 1 : 0);
    }
  });
}

export async function notificationsLocales(): Promise<NotificationVue[]> {
  const lignes = await baseOuverte().getAllAsync<Record<string, unknown>>(
    'SELECT * FROM notification ORDER BY creee_at DESC');
  return lignes.map((l) => ({
    id: l.id as number,
    categorie: l.categorie as NotificationVue['categorie'],
    titre: l.titre as string,
    corps: l.corps as string,
    ecran: (l.ecran as string) ?? null,
    parametres: null,
    creeeAt: l.creee_at as string,
    envoyee: l.envoyee === 1,
    lue: l.lue === 1,
  }));
}

/**
 * Combien attendent d'etre lues. Appele par l'ecran d'ouverture a chaque passage : il rend 0
 * tant que la base n'est pas ouverte, plutot que de lever — l'accueil s'affiche avant elle.
 */
export async function compterNonLues(): Promise<number> {
  if (!estOuverte()) return 0;
  const ligne = await baseOuverte().getFirstAsync<{ n: number }>(
    'SELECT COUNT(*) AS n FROM notification WHERE lue = 0');
  return ligne?.n ?? 0;
}

/** Marque lu sur le telephone, tout de suite. La remontee suit. */
export async function marquerLuesLocalement(ids: number[] | null): Promise<void> {
  const db = baseOuverte();
  if (ids === null) {
    await db.runAsync('UPDATE notification SET lue = 1, lue_a_remonter = 1 WHERE lue = 0');
    return;
  }
  if (ids.length === 0) return;
  const trous = ids.map(() => '?').join(', ');
  await db.runAsync(
    `UPDATE notification SET lue = 1, lue_a_remonter = 1 WHERE lue = 0 AND id IN (${trous})`,
    ...ids);
}

/** Les lectures faites hors connexion, a annoncer au serveur. */
export async function lecturesARemonter(): Promise<number[]> {
  const lignes = await baseOuverte().getAllAsync<{ id: number }>(
    'SELECT id FROM notification WHERE lue_a_remonter = 1');
  return lignes.map((l) => l.id);
}

export async function lecturesRemontees(ids: number[]): Promise<void> {
  if (ids.length === 0) return;
  const trous = ids.map(() => '?').join(', ');
  await baseOuverte().runAsync(
    `UPDATE notification SET lue_a_remonter = 0 WHERE id IN (${trous})`, ...ids);
}
