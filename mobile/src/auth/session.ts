import * as AuthSession from 'expo-auth-session';
import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';
import { config, OAUTH } from '@/config';
import { api } from '@/api/client';
import type { Profil } from '@/api/types';

/**
 * La session de l'agent : code d'autorisation avec PKCE, jetons dans le trousseau du systeme,
 * et renouvellement silencieux.
 *
 * <p>Aucun mot de passe ne passe ni ne reste ici : l'agent tape le sien sur la page du serveur
 * d'autorisation, dans le navigateur du telephone, et l'application ne voit que le code de
 * retour. C'est ce que le client public enregistre cote serveur exige (PKCE obligatoire).</p>
 */

const CLE_JETONS = 'digicrg.jetons';
const CLE_BASE = 'digicrg.cle-base';
const CLE_PROFIL = 'digicrg.profil';

export type Jetons = {
  acces: string;
  rafraichissement: string | null;
  expireA: number;
};

const decouverte: AuthSession.DiscoveryDocument = {
  authorizationEndpoint: `${config.auth}/oauth2/authorize`,
  tokenEndpoint: `${config.auth}/oauth2/token`,
  revocationEndpoint: `${config.auth}/oauth2/revoke`,
};

export function documentDecouverte(): AuthSession.DiscoveryDocument {
  return decouverte;
}

export async function lireJetons(): Promise<Jetons | null> {
  const brut = await SecureStore.getItemAsync(CLE_JETONS);
  return brut ? (JSON.parse(brut) as Jetons) : null;
}

export async function ecrireJetons(jetons: Jetons): Promise<void> {
  await SecureStore.setItemAsync(CLE_JETONS, JSON.stringify(jetons), {
    keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK,
  });
}

export async function effacerSession(): Promise<void> {
  await SecureStore.deleteItemAsync(CLE_JETONS);
  await SecureStore.deleteItemAsync(CLE_PROFIL);
}

/**
 * La cle de la base locale, creee une fois sur ce telephone et jamais transmise. Elle vit
 * dans le trousseau : meme avec le fichier de la base, elle ne se lit pas ailleurs.
 */
export async function cleDeLaBase(): Promise<string> {
  const existante = await SecureStore.getItemAsync(CLE_BASE);
  if (existante) {
    return existante;
  }
  const octets = await Crypto.getRandomBytesAsync(32);
  const cle = Array.from(octets, (o) => o.toString(16).padStart(2, '0')).join('');
  await SecureStore.setItemAsync(CLE_BASE, cle, {
    keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK,
  });
  return cle;
}

/** La cle de la base disparait avec la session : la base devient illisible, puis effacee. */
export async function oublierCleDeLaBase(): Promise<void> {
  await SecureStore.deleteItemAsync(CLE_BASE);
}

export async function profilGarde(): Promise<Profil | null> {
  const brut = await SecureStore.getItemAsync(CLE_PROFIL);
  return brut ? (JSON.parse(brut) as Profil) : null;
}

export async function garderProfil(profil: Profil): Promise<void> {
  await SecureStore.setItemAsync(CLE_PROFIL, JSON.stringify(profil));
}

/** Marge avant l'expiration : on renouvelle avant que le serveur ne refuse. */
const MARGE_MS = 60_000;

/**
 * Rend un jeton d'acces utilisable, en le renouvelant si besoin.
 *
 * <p>Si le renouvellement echoue parce que le serveur refuse (compte bloque, jeton revoque),
 * la session est effacee : c'est le chemin par lequel un blocage de compte coupe l'application
 * en quelques minutes. Si le renouvellement echoue faute de reseau, les jetons sont gardes :
 * l'agent hors connexion ne doit pas etre deconnecte parce qu'il est en brousse.</p>
 */
export async function jetonValide(): Promise<string | null> {
  const jetons = await lireJetons();
  if (!jetons) {
    return null;
  }
  if (jetons.expireA - MARGE_MS > Date.now()) {
    return jetons.acces;
  }
  if (!jetons.rafraichissement) {
    return null;
  }
  try {
    const renouvele = await AuthSession.refreshAsync(
      { clientId: OAUTH.clientId, refreshToken: jetons.rafraichissement },
      decouverte,
    );
    const frais: Jetons = {
      acces: renouvele.accessToken,
      rafraichissement: renouvele.refreshToken ?? jetons.rafraichissement,
      expireA: Date.now() + (renouvele.expiresIn ?? 3600) * 1000,
    };
    await ecrireJetons(frais);
    return frais.acces;
  } catch (e) {
    const message = e instanceof Error ? e.message : '';
    // « invalid_grant » : le serveur a dit non. Tout le reste ressemble a une panne de reseau.
    if (message.includes('invalid_grant') || message.includes('invalid_token')) {
      await effacerSession();
      return null;
    }
    return jetons.acces;
  }
}

/** Le profil de l'agent, rafraichi quand le reseau le permet, garde sinon. */
export async function profil(): Promise<Profil | null> {
  const jeton = await jetonValide();
  if (!jeton) {
    return profilGarde();
  }
  try {
    const data = await api.get<{ profil: Profil }>('/ecredit/mobile/moi', jeton);
    if (data?.profil) {
      await garderProfil(data.profil);
      return data.profil;
    }
  } catch {
    // Hors connexion : le profil garde suffit a ouvrir l'application.
  }
  return profilGarde();
}
