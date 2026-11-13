import * as SQLite from 'expo-sqlite';

/**
 * La base locale du telephone : la copie du portefeuille, les listes fermees, et la file
 * des saisies qui attendent le reseau.
 *
 * <p>Chiffree : un telephone se perd, et il porte ici des noms de membres, des montants et
 * des positions. La cle n'est pas dans le code — elle vient du trousseau du systeme
 * (expo-secure-store), ou seul ce telephone peut la lire.</p>
 *
 * <p>Une base par compte : si deux agents se succedent sur le meme appareil, le second ne
 * voit rien du premier, et la deconnexion efface la base plutot que de la vider table par
 * table.</p>
 */

let base: SQLite.SQLiteDatabase | null = null;
let compteOuvert: string | null = null;

export function nomBase(userId: number | string): string {
  return `digicrg-${userId}.db`;
}

export async function ouvrir(userId: number | string, cle: string): Promise<SQLite.SQLiteDatabase> {
  const nom = nomBase(userId);
  if (base && compteOuvert === nom) {
    return base;
  }
  if (base) {
    await base.closeAsync();
  }
  base = await SQLite.openDatabaseAsync(nom);
  await deverrouiller(base, cle);
  compteOuvert = nom;
  await creerSchema(base);
  return base;
}

/**
 * Pose la cle de chiffrement. SQLCipher l'exige AVANT toute autre instruction : une seule
 * lecture faite avant, et la base reste illisible pour le reste de la session.
 *
 * <p>La cle est verifiee avant d'etre posee. Elle vient du trousseau, donc d'une source sure,
 * mais elle entre dans une instruction SQL : la seule forme acceptee est celle que nous
 * produisons, soixante-quatre caracteres hexadecimaux, posee en cle brute (la forme `x'...'`,
 * qui evite la derivation et ne laisse pas passer autre chose qu'un nombre).</p>
 */
async function deverrouiller(db: SQLite.SQLiteDatabase, cle: string): Promise<void> {
  if (!/^[0-9a-f]{64}$/.test(cle)) {
    throw new Error('Cle de base locale invalide');
  }
  await db.execAsync(`PRAGMA key = "x'${cle}'"`);
}

/**
 * La base est-elle ouverte ? Les ecrans s'en servent pour ne pas lire pendant l'ouverture :
 * au demarrage, l'ossature ouvre la base de maniere asynchrone, et un ecran monte avant la
 * fin lisait une base absente — une promesse rejetee, et l'ecran restait vide.
 */
export function estOuverte(): boolean {
  return base !== null;
}

export function baseOuverte(): SQLite.SQLiteDatabase {
  if (!base) {
    throw new Error("La base locale n'est pas ouverte : connexion requise");
  }
  return base;
}

export async function fermerEtEffacer(userId: number | string): Promise<void> {
  if (base) {
    await base.closeAsync();
    base = null;
    compteOuvert = null;
  }
  await SQLite.deleteDatabaseAsync(nomBase(userId));
}

/**
 * Le schema local. Deliberement proche de celui du serveur pour que les deux se lisent
 * ensemble, mais pas identique : le telephone garde en plus l'etat d'envoi de chaque saisie,
 * qui n'existe que chez lui.
 */
async function creerSchema(db: SQLite.SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    -- Le portefeuille tel que la derniere synchronisation l'a rendu. Remplace a chaque fois :
    -- c'est une copie, pas une source.
    CREATE TABLE IF NOT EXISTS credit (
      cod_agencia TEXT NOT NULL,
      num_credito INTEGER NOT NULL,
      cod_cliente TEXT,
      nom_client TEXT,
      produit TEXT,
      encours REAL,
      montant_impaye REAL,
      jours_retard INTEGER,
      prochaine_echeance TEXT,
      prochaine_echeance_montant REAL,
      derniere_appreciation TEXT,
      derniere_visite_at TEXT,
      promesse_date TEXT,
      promesse_montant REAL,
      PRIMARY KEY (cod_agencia, num_credito)
    );

    CREATE TABLE IF NOT EXISTS referentiel (
      liste TEXT NOT NULL,
      code TEXT NOT NULL,
      libelle TEXT NOT NULL,
      ordre INTEGER NOT NULL DEFAULT 0,
      actif INTEGER NOT NULL DEFAULT 1,
      PRIMARY KEY (liste, code)
    );

    -- La file d'attente. « etat » est la seule colonne qui n'existe pas cote serveur :
    -- EN_ATTENTE, ENVOI, TRANSMISE, REFUSEE.
    CREATE TABLE IF NOT EXISTS visite (
      identifiant_client TEXT PRIMARY KEY,
      cod_agencia TEXT NOT NULL,
      num_credito INTEGER NOT NULL,
      cod_cliente TEXT,
      saisie_at TEXT NOT NULL,
      type_contact TEXT NOT NULL,
      resultat TEXT NOT NULL,
      motif_retard TEXT,
      promesse_montant REAL,
      promesse_date TEXT,
      appreciation TEXT,
      remarque TEXT,
      latitude REAL,
      longitude REAL,
      precision_m INTEGER,
      corrige_identifiant_client TEXT,
      etat TEXT NOT NULL DEFAULT 'EN_ATTENTE',
      motif_refus TEXT,
      tentatives INTEGER NOT NULL DEFAULT 0,
      transmise_at TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_visite_etat ON visite (etat, saisie_at);

    CREATE TABLE IF NOT EXISTS photo (
      identifiant_client TEXT PRIMARY KEY,
      visite_identifiant TEXT NOT NULL REFERENCES visite (identifiant_client) ON DELETE CASCADE,
      chemin TEXT NOT NULL,
      prise_at TEXT,
      etat TEXT NOT NULL DEFAULT 'EN_ATTENTE'
    );

    -- Une seule ligne : ce que l'application doit retenir d'une synchronisation a l'autre.
    CREATE TABLE IF NOT EXISTS etat_local (
      cle TEXT PRIMARY KEY,
      valeur TEXT
    );
  `);
}

export async function lireEtat(cle: string): Promise<string | null> {
  const ligne = await baseOuverte().getFirstAsync<{ valeur: string | null }>(
    'SELECT valeur FROM etat_local WHERE cle = ?', cle);
  return ligne?.valeur ?? null;
}

export async function ecrireEtat(cle: string, valeur: string | null): Promise<void> {
  await baseOuverte().runAsync(
    'INSERT INTO etat_local (cle, valeur) VALUES (?, ?) ON CONFLICT (cle) DO UPDATE SET valeur = excluded.valeur',
    cle, valeur);
}

export const CLES = {
  derniereSyncReferentiels: 'referentiels.depuis',
  dernierePhotoPortefeuille: 'portefeuille.date',
  derniereSyncReussie: 'sync.derniere',
} as const;
