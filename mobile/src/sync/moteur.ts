import NetInfo from '@react-native-community/netinfo';
import { api, ErreurReseau, ErreurServeur } from '@/api/client';
import { jetonValide } from '@/auth/session';
import type { CreditPortefeuille, EntreeReferentiel, LotTraite } from '@/api/types';
import {
  aTransmettre, appliquerSort, compterParEtat, majReferentiels, marquerEnvoi, marquerPhoto,
  photosATransmettre, purger, remplacerPortefeuille, rendreALaFile,
} from '@/db/visites';
import { ajouterPhotoAuFormulaire } from '@/sync/fichier';
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
  photos: number;
  creditsRecus: number;
  horsConnexion: boolean;
  erreur: string | null;
};

let enCours = false;
let dernierEssai = 0;

/**
 * Intervalle minimal entre deux synchronisations AUTOMATIQUES.
 *
 * <p>Trois declencheurs mènent ici — le reveil du systeme, le retour du reseau, l'ouverture de
 * l'application — et ils se suivent de pres : au premier essai sur un telephone, le serveur a
 * recu dix demandes de portefeuille en deux minutes. Chacune interroge SAF. Sur un forfait de
 * terrain, c'est de la donnee payee pour rien.</p>
 *
 * <p>Le bouton « Synchroniser maintenant » n'est pas concerne : quand l'agent demande, on y va.</p>
 */
const INTERVALLE_MIN_MS = 120_000;

export async function synchroniser(options: { force?: boolean } = {}): Promise<ResultatSync> {
  const vide: ResultatSync = {
    transmises: 0, refusees: 0, doublons: 0, photos: 0, creditsRecus: 0,
    horsConnexion: false, erreur: null,
  };
  if (enCours) {
    return vide;
  }
  if (!options.force && Date.now() - dernierEssai < INTERVALLE_MIN_MS) {
    return vide;
  }
  dernierEssai = Date.now();
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
    // Les photos suivent les saisies, jamais l'inverse : le serveur refuse une photo dont il
    // ne connait pas encore la visite.
    const photos = await envoyerLesPhotos(jeton);
    const recu = await rafraichirLaCopie(jeton);
    await purger();
    await ecrireEtat(CLES.derniereSyncReussie, new Date().toISOString());
    return { ...envoi, photos, creditsRecus: recu, horsConnexion: false, erreur: null };
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

/**
 * Les photos, une par une. Un fichier est lourd : groupees, la moindre coupure ferait tout
 * recommencer. Chacune porte son identifiant, donc un renvoi est repondu « doublon ».
 *
 * <p>Une photo refusee pour de bon est rangee REFUSEE et ne repart plus ; une photo dont la
 * visite n'est pas encore arrivee reste simplement en attente. Une coupure arrete l'envoi
 * sans rien perdre : le reste repartira.</p>
 */
async function envoyerLesPhotos(jeton: string): Promise<number> {
  let envoyees = 0;
  for (const photo of await photosATransmettre()) {
    const formulaire = new FormData();
    formulaire.append('identifiant', photo.identifiantClient);
    formulaire.append('visite', photo.visiteIdentifiant);
    if (photo.priseAt) {
      formulaire.append('priseAt', photo.priseAt);
    }
    ajouterPhotoAuFormulaire(formulaire, photo.chemin, photo.identifiantClient);
    try {
      const data = await api.envoiFichier<{ sort: { sort: string; motif: string | null } }>(
        '/ecredit/mobile/photos', jeton, formulaire);
      const sort = data?.sort?.sort;
      if (sort === 'ACCEPTEE' || sort === 'DOUBLON') {
        await marquerPhoto(photo.identifiantClient, 'TRANSMISE');
        envoyees += 1;
      } else if (data?.sort?.motif === 'Visite pas encore transmise') {
        // Refus temporaire : on la laisse en attente, elle repartira.
        continue;
      } else {
        await marquerPhoto(photo.identifiantClient, 'REFUSEE');
      }
    } catch (e) {
      if (e instanceof ErreurReseau) {
        // La connexion est tombee : les photos restantes attendront, rien n'est perdu.
        break;
      }
      throw e;
    }
  }
  return envoyees;
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
