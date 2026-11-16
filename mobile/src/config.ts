/**
 * L'environnement vise, choisi a la construction et jamais devine.
 *
 * `test` par defaut : une application lancee sans rien preciser ne touche donc jamais aux
 * vraies donnees. C'est le reglage le plus sur, et c'est celui que les profils EAS
 * `development` et `test` posent explicitement.
 */
const ENV = (process.env.EXPO_PUBLIC_ENV ?? 'test') as 'test' | 'prod';

type Environnement = {
  readonly nom: 'test' | 'prod';
  readonly base: string;
  readonly auth: string;
  readonly estProduction: boolean;
};

const ENVIRONNEMENTS: Record<'test' | 'prod', Environnement> = {
  test: {
    nom: 'test',
    base: 'https://test.digi-creditrural-io.com',
    auth: 'https://test.digi-creditrural-io.com/auth',
    estProduction: false,
  },
  prod: {
    nom: 'prod',
    base: 'https://digi-creditrural-io.com',
    auth: 'https://digi-creditrural-io.com/auth',
    estProduction: true,
  },
};

export const config = ENVIRONNEMENTS[ENV] ?? ENVIRONNEMENTS.test;

/**
 * Le client OIDC public de l'application, enregistre cote serveur (PKCE obligatoire).
 *
 * La redirection n'est pas ecrite en dur : dans une construction native c'est le schema de
 * l'application, mais dans Expo Go c'est une adresse `exp://` qui porte l'adresse du poste de
 * developpement. Les deux doivent etre declarees cote serveur, sans quoi le navigateur ne sait
 * pas ou revenir et la connexion s'arrete sans message. L'ecran de connexion affiche l'adresse
 * reellement utilisee quand l'environnement est le test, pour qu'on puisse la declarer.
 */
export const OAUTH = {
  clientId: 'mobile-app-client',
  schema: 'com.digiservices.digicrg',
  chemin: 'oauth2redirect',
  scopes: ['openid', 'profile', 'email', 'agent_profile'],
} as const;

/**
 * Ce que l'application s'autorise a garder et a envoyer. Ces nombres sont ici, ensemble,
 * parce qu'ils decrivent tous la meme chose : ce qu'un telephone d'entree de gamme sur un
 * reseau intermittent peut porter.
 */
export const LIMITES = {
  /** Saisies envoyees d'un coup. Au-dela, une coupure fait tout recommencer. */
  tailleLot: 20,
  /** Au-dela, une saisie en attente est perdue : l'application previent avant. */
  joursFileLocale: 30,
  /** Largeur maximale d'une photo avant envoi : environ 200 Ko. */
  largeurPhoto: 1280,
  /** Intervalle minimal de la tache de fond, en minutes (Android ne descend pas plus bas). */
  minutesTacheDeFond: 15,
} as const;
