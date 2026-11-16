import * as BackgroundTask from 'expo-background-task';
import * as TaskManager from 'expo-task-manager';
import { LIMITES } from '@/config';
import { synchroniser } from '@/sync/moteur';

/**
 * La transmission en arriere-plan : l'agent n'a pas a ouvrir l'application pour que ses
 * visites partent.
 *
 * <p>Le systeme decide quand reveiller l'application, et ne promet rien : sur Android il
 * respecte a peu pres l'intervalle demande, sur iPhone il le fait quand il veut. C'est
 * pourquoi l'ouverture de l'application et le retour du reseau declenchent eux aussi une
 * synchronisation : trois chemins pour le meme travail, et le plus rapide gagne.</p>
 */

export const TACHE_SYNC = 'digicrg-synchronisation';

TaskManager.defineTask(TACHE_SYNC, async () => {
  try {
    const r = await synchroniser();
    // Rien a envoyer et rien recu : inutile de dire au systeme que le reveil a servi.
    const aServi = r.transmises > 0 || r.refusees > 0 || r.creditsRecus > 0;
    return aServi ? BackgroundTask.BackgroundTaskResult.Success
                  : BackgroundTask.BackgroundTaskResult.Success;
  } catch {
    return BackgroundTask.BackgroundTaskResult.Failed;
  }
});

/**
 * Enregistre la tache, ou renonce sans bruit.
 *
 * <p>Expo Go ne porte pas les taches de fond, et un telephone peut les refuser. Ce n'est pas
 * une panne : les deux autres declencheurs — le retour du reseau et l'ouverture de
 * l'application — suffisent a transmettre. Laisser l'erreur remonter arrete l'application
 * au demarrage pour une fonction qui n'est qu'un confort.</p>
 */
export async function enregistrerTacheDeFond(): Promise<boolean> {
  try {
    if (await TaskManager.isTaskRegisteredAsync(TACHE_SYNC)) {
      return true;
    }
    await BackgroundTask.registerTaskAsync(TACHE_SYNC, {
      minimumInterval: LIMITES.minutesTacheDeFond,
    });
    return true;
  } catch (e) {
    console.warn('[sync] transmission en arriere-plan indisponible :',
      e instanceof Error ? e.message : e);
    return false;
  }
}

export async function retirerTacheDeFond(): Promise<void> {
  try {
    if (await TaskManager.isTaskRegisteredAsync(TACHE_SYNC)) {
      await BackgroundTask.unregisterTaskAsync(TACHE_SYNC);
    }
  } catch {
    // Jamais enregistree : rien a retirer.
  }
}
