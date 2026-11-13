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

export async function enregistrerTacheDeFond(): Promise<void> {
  const deja = await TaskManager.isTaskRegisteredAsync(TACHE_SYNC);
  if (deja) {
    return;
  }
  await BackgroundTask.registerTaskAsync(TACHE_SYNC, {
    minimumInterval: LIMITES.minutesTacheDeFond,
  });
}

export async function retirerTacheDeFond(): Promise<void> {
  if (await TaskManager.isTaskRegisteredAsync(TACHE_SYNC)) {
    await BackgroundTask.unregisterTaskAsync(TACHE_SYNC);
  }
}
