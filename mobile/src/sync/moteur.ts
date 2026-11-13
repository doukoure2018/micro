import NetInfo from '@react-native-community/netinfo';
import { api, ErreurReseau, ErreurServeur } from '@/api/client';
import { jetonValide } from '@/auth/session';
import type { CreditPortefeuille, EntreeReferentiel, LotTraite } from '@/api/types';
import {
  aTransmettre, appliquerSort, compterParEtat, majReferentiels, marquerEnvoi,
  purger, remplacerPortefeuille, rendreALaFile,
} from '@/db/visites';
import { CLES, ecrireEtat, lireEtat } from '@/db/base';

/**
 * Le moteur de synchronisation : il vide la file, puis rafraichit la copie locale.
 *
 * <p>Deux principes, et tout le reste en decoule.</p>
 *
 * <p><b>On envoie avant de recevoir.</b> Le travail de l'agent part en premier ; si la
 * connexion casse en route, c'est la mise a jour du portefeuille qui attend, jamais une
 * visite.</p>
 *
 * <p><b>Un echec ne perd rien.</b> Une saisie partie mais sans reponse revient dans la file
 * et repart au prochain essai : le serveur la reconnaitra a son identifiant et repondra
 * « doublon » plutot que de l'ecrire deux fois.</p>
 */

export type ResultatSync = {
  transmises: number;
  refusees: number;
  doublons: number;
  creditsRecus: number;
  horsConnexion: boolean;
  erreur: string | null;
};

let enCours = false;

export async function synchroniser(): Promise<ResultatSync> {
  const vide: ResultatSync = {
    transmises: 0, refusees: 0, doublons: 0, creditsRecus: 0,
    horsConnexion: false, erreur: null,
  };
  if (enCours) {
    return vide;
  }
  const reseau = await NetInfo.fetch();
  if (!reseau.isConnected) {
    return { ...vide, horsConnexion: true };
  }
  const jeton = await jetonValide();
  if (!jeton) {
    return { ...vide, erreur: 'Session expiree' };
  }

  enCours = true;
  try {
    const envoi = await envoyerLesSaisies(jeton);
    const recu = await rafraichirLaCopie(jeton);
    await purger();
    await ecrireEtat(CLES.derniereSyncReussie, new Date().toISOString());
    return { ...envoi, creditsRecus: recu, horsConnexion: false, erreur: null };
  } catch (e) {
    if (e instanceof ErreurReseau) {
      return { ...vide, horsConnexion: true };
    }
    return { ...vide, erreur: e instanceof Error ? e.message : 'Erreur inconnue' };
  } finally {
    enCours = false;
  }
}

async function envoyerLesSaisies(jeton: string) {
  let transmises = 0;
  let refusees = 0;
  let doublons = 0;

  // Par lots, tant qu'il en reste : une file de cent saisies part en cinq envois plutot
  // qu'en un seul que la moindre coupure ferait recommencer.
  for (;;) {
    const lot = await aTransmettre();
    if (lot.length === 0) {
      break;
    }
    const identifiants = lot.map((v) => v.identifiantClient);
    await marquerEnvoi(identifiants);
    try {
      const data = await api.post<{ lot: LotTraite }>(
        '/ecredit/mobile/sync', jeton, { jetonAppareil: null, visites: lot });
      const sorts = data?.lot?.sorts ?? [];
      for (const s of sorts) {
        await appliquerSort(s.identifiantClient, s.sort, s.motif);
        if (s.sort === 'ACCEPTEE') transmises += 1;
        else if (s.sort === 'DOUBLON') doublons += 1;
        else refusees += 1;
      }
      // Le serveur n'a rien dit de certaines : elles retournent dans la file.
      const repondues = new Set(sorts.map((s) => s.identifiantClient));
      await rendreALaFile(identifiants.filter((i) => !repondues.has(i)));
      if (sorts.length === 0) {
        break;
      }
    } catch (e) {
      // Parti sans reponse : la saisie revient dans la file. Le serveur l'a peut-etre
      // ecrite ; au prochain essai il repondra « doublon », et rien ne sera ecrit deux fois.
      await rendreALaFile(identifiants);
      throw e;
    }
  }
  return { transmises, refusees, doublons };
}

async function rafraichirLaCopie(jeton: string): Promise<number> {
  const depuis = await lireEtat(CLES.derniereSyncReferentiels);
  const refs = await api.get<{ referentiels: EntreeReferentiel[] }>(
    `/ecredit/mobile/referentiels${depuis ? `?depuis=${encodeURIComponent(depuis)}` : ''}`, jeton);
  if (refs?.referentiels?.length) {
    await majReferentiels(refs.referentiels);
  }
  await ecrireEtat(CLES.derniereSyncReferentiels, new Date().toISOString());

  const portefeuille = await api.get<{ credits: CreditPortefeuille[] }>(
    '/ecredit/mobile/portefeuille', jeton);
  const credits = portefeuille?.credits ?? [];
  await remplacerPortefeuille(credits);
  await ecrireEtat(CLES.dernierePhotoPortefeuille, new Date().toISOString());
  return credits.length;
}

/** Ce que l'ecran de synchronisation affiche sans rien envoyer. */
export async function etatDeLaFile() {
  const [compte, derniere] = await Promise.all([
    compterParEtat(),
    lireEtat(CLES.derniereSyncReussie),
  ]);
  return { compte, derniere };
}

export { ErreurServeur };
