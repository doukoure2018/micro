import * as Crypto from 'expo-crypto';
import { baseOuverte } from '@/db/base';
import type { EtatVisite } from '@/db/visites';

/**
 * La file locale de la collecte agricole : parcelles, passages de campagne, recoltes.
 *
 * <p>Trois files plutot qu'une, parce qu'elles ne partent pas ensemble : une parcelle doit
 * etre arrivee au serveur avant que son passage ou sa recolte puissent s'y rattacher. L'ordre
 * d'envoi suffit a le garantir, et le serveur refuse temporairement ce qui arrive trop tot.</p>
 */

export type ParcelleLocale = {
  identifiantClient: string;
  codCliente: string;
  codAgencia: string | null;
  numCredito: number | null;
  culture: string;
  surfaceHa: number | null;
  localite: string | null;
  latitude: number | null;
  longitude: number | null;
  precisionM: number | null;
  dateSemis: string | null;
  saisieAt: string;
  etat: EtatVisite;
  motifRefus: string | null;
};

export type VisiteAgriLocale = {
  identifiantClient: string;
  parcelleIdentifiant: string;
  stade: string;
  etatCulture: string;
  sinistre: string | null;
  surfaceToucheeHa: number | null;
  intrants: string | null;
  remarque: string | null;
  latitude: number | null;
  longitude: number | null;
  precisionM: number | null;
  saisieAt: string;
  etat: EtatVisite;
  motifRefus: string | null;
};

export type RecolteLocale = {
  identifiantClient: string;
  parcelleIdentifiant: string;
  quantite: number;
  unite: string;
  prixUnitaire: number | null;
  partVenduePct: number | null;
  dateRecolte: string;
  acheteur: string | null;
  remarque: string | null;
  saisieAt: string;
  etat: EtatVisite;
  motifRefus: string | null;
};

// ------------------------------------------------------------------------ l'ecriture

export async function enregistrerParcelle(
  p: Omit<ParcelleLocale, 'identifiantClient' | 'saisieAt' | 'etat' | 'motifRefus'>,
): Promise<string> {
  const identifiant = Crypto.randomUUID();
  await baseOuverte().runAsync(
    `INSERT INTO parcelle (identifiant_client, cod_cliente, cod_agencia, num_credito, culture,
                           surface_ha, localite, latitude, longitude, precision_m, date_semis,
                           saisie_at, etat)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'EN_ATTENTE')`,
    identifiant, p.codCliente, p.codAgencia, p.numCredito, p.culture, p.surfaceHa, p.localite,
    p.latitude, p.longitude, p.precisionM, p.dateSemis, new Date().toISOString());
  return identifiant;
}

export async function enregistrerVisiteAgri(
  v: Omit<VisiteAgriLocale, 'identifiantClient' | 'saisieAt' | 'etat' | 'motifRefus'>,
): Promise<string> {
  const identifiant = Crypto.randomUUID();
  await baseOuverte().runAsync(
    `INSERT INTO visite_agri (identifiant_client, parcelle_identifiant, stade, etat_culture,
                              sinistre, surface_touchee_ha, intrants, remarque, latitude,
                              longitude, precision_m, saisie_at, etat)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'EN_ATTENTE')`,
    identifiant, v.parcelleIdentifiant, v.stade, v.etatCulture, v.sinistre, v.surfaceToucheeHa,
    v.intrants, v.remarque, v.latitude, v.longitude, v.precisionM, new Date().toISOString());
  return identifiant;
}

export async function enregistrerRecolte(
  r: Omit<RecolteLocale, 'identifiantClient' | 'saisieAt' | 'etat' | 'motifRefus'>,
): Promise<string> {
  const identifiant = Crypto.randomUUID();
  await baseOuverte().runAsync(
    `INSERT INTO recolte (identifiant_client, parcelle_identifiant, quantite, unite,
                          prix_unitaire, part_vendue_pct, date_recolte, acheteur, remarque,
                          saisie_at, etat)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'EN_ATTENTE')`,
    identifiant, r.parcelleIdentifiant, r.quantite, r.unite, r.prixUnitaire, r.partVenduePct,
    r.dateRecolte, r.acheteur, r.remarque, new Date().toISOString());
  return identifiant;
}

// ------------------------------------------------------------------------- la lecture

export async function parcellesLocales(): Promise<ParcelleLocale[]> {
  const lignes = await baseOuverte().getAllAsync<Record<string, unknown>>(
    'SELECT * FROM parcelle ORDER BY saisie_at DESC');
  return lignes.map(versParcelle);
}

export async function parcellesATransmettre(): Promise<ParcelleLocale[]> {
  const lignes = await baseOuverte().getAllAsync<Record<string, unknown>>(
    "SELECT * FROM parcelle WHERE etat IN ('EN_ATTENTE','ENVOI') ORDER BY saisie_at");
  return lignes.map(versParcelle);
}

/** Les passages a transmettre : seulement ceux dont la PARCELLE est deja partie. */
export async function visitesAgriATransmettre(): Promise<VisiteAgriLocale[]> {
  const lignes = await baseOuverte().getAllAsync<Record<string, unknown>>(
    `SELECT v.* FROM visite_agri v
       JOIN parcelle p ON p.identifiant_client = v.parcelle_identifiant
      WHERE v.etat IN ('EN_ATTENTE','ENVOI') AND p.etat = 'TRANSMISE'
      ORDER BY v.saisie_at`);
  return lignes.map(versVisiteAgri);
}

export async function recoltesATransmettre(): Promise<RecolteLocale[]> {
  const lignes = await baseOuverte().getAllAsync<Record<string, unknown>>(
    `SELECT r.* FROM recolte r
       JOIN parcelle p ON p.identifiant_client = r.parcelle_identifiant
      WHERE r.etat IN ('EN_ATTENTE','ENVOI') AND p.etat = 'TRANSMISE'
      ORDER BY r.saisie_at`);
  return lignes.map(versRecolte);
}

export async function visitesAgriDeLaParcelle(parcelle: string): Promise<VisiteAgriLocale[]> {
  const lignes = await baseOuverte().getAllAsync<Record<string, unknown>>(
    'SELECT * FROM visite_agri WHERE parcelle_identifiant = ? ORDER BY saisie_at DESC', parcelle);
  return lignes.map(versVisiteAgri);
}

export async function recolteDeLaParcelle(parcelle: string): Promise<RecolteLocale | null> {
  const ligne = await baseOuverte().getFirstAsync<Record<string, unknown>>(
    'SELECT * FROM recolte WHERE parcelle_identifiant = ?', parcelle);
  return ligne ? versRecolte(ligne) : null;
}

export async function compterAgriEnAttente(): Promise<number> {
  const ligne = await baseOuverte().getFirstAsync<{ n: number }>(
    `SELECT (SELECT COUNT(*) FROM parcelle WHERE etat IN ('EN_ATTENTE','ENVOI'))
          + (SELECT COUNT(*) FROM visite_agri WHERE etat IN ('EN_ATTENTE','ENVOI'))
          + (SELECT COUNT(*) FROM recolte WHERE etat IN ('EN_ATTENTE','ENVOI')) AS n`);
  return ligne?.n ?? 0;
}

// ------------------------------------------------------------------------ les sorts

export async function appliquerSortAgri(
  table: 'parcelle' | 'visite_agri' | 'recolte',
  identifiant: string,
  sort: 'ACCEPTEE' | 'DOUBLON' | 'REFUSEE',
  motif: string | null,
): Promise<void> {
  const etat: EtatVisite = sort === 'REFUSEE' ? 'REFUSEE' : 'TRANSMISE';
  await baseOuverte().runAsync(
    `UPDATE ${table} SET etat = ?, motif_refus = ?, transmise_at = ?
      WHERE identifiant_client = ?`,
    etat, motif, etat === 'TRANSMISE' ? new Date().toISOString() : null, identifiant);
}

// ------------------------------------------------------------------------ le commun

function versParcelle(l: Record<string, unknown>): ParcelleLocale {
  return {
    identifiantClient: l.identifiant_client as string,
    codCliente: l.cod_cliente as string,
    codAgencia: (l.cod_agencia as string) ?? null,
    numCredito: (l.num_credito as number) ?? null,
    culture: l.culture as string,
    surfaceHa: (l.surface_ha as number) ?? null,
    localite: (l.localite as string) ?? null,
    latitude: (l.latitude as number) ?? null,
    longitude: (l.longitude as number) ?? null,
    precisionM: (l.precision_m as number) ?? null,
    dateSemis: (l.date_semis as string) ?? null,
    saisieAt: l.saisie_at as string,
    etat: (l.etat as EtatVisite) ?? 'EN_ATTENTE',
    motifRefus: (l.motif_refus as string) ?? null,
  };
}

function versVisiteAgri(l: Record<string, unknown>): VisiteAgriLocale {
  return {
    identifiantClient: l.identifiant_client as string,
    parcelleIdentifiant: l.parcelle_identifiant as string,
    stade: l.stade as string,
    etatCulture: l.etat_culture as string,
    sinistre: (l.sinistre as string) ?? null,
    surfaceToucheeHa: (l.surface_touchee_ha as number) ?? null,
    intrants: (l.intrants as string) ?? null,
    remarque: (l.remarque as string) ?? null,
    latitude: (l.latitude as number) ?? null,
    longitude: (l.longitude as number) ?? null,
    precisionM: (l.precision_m as number) ?? null,
    saisieAt: l.saisie_at as string,
    etat: (l.etat as EtatVisite) ?? 'EN_ATTENTE',
    motifRefus: (l.motif_refus as string) ?? null,
  };
}

function versRecolte(l: Record<string, unknown>): RecolteLocale {
  return {
    identifiantClient: l.identifiant_client as string,
    parcelleIdentifiant: l.parcelle_identifiant as string,
    quantite: l.quantite as number,
    unite: l.unite as string,
    prixUnitaire: (l.prix_unitaire as number) ?? null,
    partVenduePct: (l.part_vendue_pct as number) ?? null,
    dateRecolte: l.date_recolte as string,
    acheteur: (l.acheteur as string) ?? null,
    remarque: (l.remarque as string) ?? null,
    saisieAt: l.saisie_at as string,
    etat: (l.etat as EtatVisite) ?? 'EN_ATTENTE',
    motifRefus: (l.motif_refus as string) ?? null,
  };
}
