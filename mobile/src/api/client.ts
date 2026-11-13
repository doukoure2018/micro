import { config } from '@/config';

/**
 * Le client HTTP de l'application. Une seule porte vers le serveur, pour que la gestion du
 * jeton, des delais et des pannes soit ecrite une fois.
 */

/** Ce que le serveur renvoie toujours : l'enveloppe commune de la plateforme. */
type Enveloppe<T> = {
  readonly time: string;
  readonly code: number;
  readonly path: string;
  readonly status: string;
  readonly message: string;
  readonly data?: T;
  readonly exception?: string;
};

export class ErreurReseau extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ErreurReseau';
  }
}

export class ErreurServeur extends Error {
  readonly code: number;

  constructor(code: number, message: string) {
    super(message);
    this.name = 'ErreurServeur';
    this.code = code;
  }

  /** Le jeton n'est plus valable : il faut le renouveler, puis reessayer une fois. */
  get jetonPerime(): boolean {
    return this.code === 401;
  }
}

/** Au-dela, on considere que le reseau ne repondra pas : mieux vaut rendre la main. */
const DELAI_MS = 30_000;

async function appeler<T>(
  chemin: string,
  jeton: string | null,
  options: { methode?: string; corps?: unknown; delaiMs?: number } = {},
): Promise<T | undefined> {
  const controleur = new AbortController();
  const minuteur = setTimeout(() => controleur.abort(), options.delaiMs ?? DELAI_MS);
  let reponse: Response;
  try {
    reponse = await fetch(`${config.base}${chemin}`, {
      method: options.methode ?? 'GET',
      headers: {
        Accept: 'application/json',
        ...(options.corps ? { 'Content-Type': 'application/json' } : {}),
        ...(jeton ? { Authorization: `Bearer ${jeton}` } : {}),
      },
      body: options.corps ? JSON.stringify(options.corps) : undefined,
      signal: controleur.signal,
    });
  } catch (e) {
    // Pas de reseau, DNS muet, delai depasse : tout cela se ressemble pour l'agent, et
    // l'application doit en faire la meme chose — garder la saisie et reessayer plus tard.
    throw new ErreurReseau(e instanceof Error ? e.message : 'Reseau indisponible');
  } finally {
    clearTimeout(minuteur);
  }

  const texte = await reponse.text();
  let enveloppe: Enveloppe<T> | undefined;
  try {
    enveloppe = texte ? (JSON.parse(texte) as Enveloppe<T>) : undefined;
  } catch {
    enveloppe = undefined;
  }

  if (!reponse.ok) {
    throw new ErreurServeur(reponse.status, enveloppe?.message ?? `Erreur ${reponse.status}`);
  }
  return enveloppe?.data;
}

export const api = {
  get: <T>(chemin: string, jeton: string | null) => appeler<T>(chemin, jeton),
  post: <T>(chemin: string, jeton: string | null, corps?: unknown, delaiMs?: number) =>
    appeler<T>(chemin, jeton, { methode: 'POST', corps, delaiMs }),
  delete: <T>(chemin: string, jeton: string | null) =>
    appeler<T>(chemin, jeton, { methode: 'DELETE' }),
};
