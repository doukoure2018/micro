import * as Crypto from 'expo-crypto';
import { baseOuverte } from '@/db/base';
import type {
  CreditPortefeuille, DossierVue, EntreeReferentiel, ReclamationAEnvoyer, VisiteAEnvoyer,
} from '@/api/types';
import { LIMITES } from '@/config';

/** L'etat d'une saisie sur le telephone. Le serveur n'en connait que le resultat. */
export type EtatVisite = 'EN_ATTENTE' | 'ENVOI' | 'TRANSMISE' | 'REFUSEE';

export type VisiteLocale = VisiteAEnvoyer & {
  etat: EtatVisite;
  motifRefus: string | null;
  tentatives: number;
};

/**
 * Enregistre une saisie faite sur le terrain. Elle entre toujours dans la file : jamais
 * d'envoi direct, meme si le reseau est la. L'agent ferme l'ecran en sachant que c'est
 * garde, et la transmission est l'affaire du moteur de synchronisation.
 */
export async function enregistrerVisite(
  saisie: Omit<VisiteAEnvoyer, 'identifiantClient' | 'saisieAt'> & { saisieAt?: string },
): Promise<string> {
  const identifiant = Crypto.randomUUID();
  const saisieAt = saisie.saisieAt ?? new Date().toISOString();
  await baseOuverte().runAsync(
    `INSERT INTO visite (identifiant_client, cod_agencia, num_credito, cod_cliente, saisie_at,
                         type_contact, resultat, motif_retard, promesse_montant, promesse_date,
                         appreciation, remarque, latitude, longitude, precision_m,
                         corrige_identifiant_client, etat)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'EN_ATTENTE')`,
    identifiant, saisie.codAgencia, saisie.numCredito, saisie.codCliente, saisieAt,
    saisie.typeContact, saisie.resultat, saisie.motifRetard, saisie.promesseMontant,
    saisie.promesseDate, saisie.appreciation, saisie.remarque, saisie.latitude,
    saisie.longitude, saisie.precisionM, saisie.corrigeIdentifiantClient,
  );
  return identifiant;
}

/** Les saisies a transmettre, les plus anciennes d'abord, par lots. */
export async function aTransmettre(): Promise<VisiteAEnvoyer[]> {
  const lignes = await baseOuverte().getAllAsync<Record<string, unknown>>(
    `SELECT * FROM visite WHERE etat IN ('EN_ATTENTE', 'ENVOI')
      ORDER BY saisie_at LIMIT ?`, LIMITES.tailleLot);
  return lignes.map(versVisiteAEnvoyer);
}

export async function compterParEtat(): Promise<Record<EtatVisite, number>> {
  const lignes = await baseOuverte().getAllAsync<{ etat: EtatVisite; n: number }>(
    'SELECT etat, COUNT(*) AS n FROM visite GROUP BY etat');
  const compte: Record<EtatVisite, number> = {
    EN_ATTENTE: 0, ENVOI: 0, TRANSMISE: 0, REFUSEE: 0,
  };
  for (const l of lignes) {
    compte[l.etat] = l.n;
  }
  return compte;
}

export async function marquerEnvoi(identifiants: string[]): Promise<void> {
  if (identifiants.length === 0) return;
  await baseOuverte().runAsync(
    `UPDATE visite SET etat = 'ENVOI', tentatives = tentatives + 1
      WHERE identifiant_client IN (${identifiants.map(() => '?').join(',')})`,
    ...identifiants);
}

/**
 * Le sort rendu par le serveur. Un doublon se range comme une acceptation : c'est une
 * transmission que le telephone croyait perdue.
 */
export async function appliquerSort(
  identifiant: string, sort: 'ACCEPTEE' | 'DOUBLON' | 'REFUSEE', motif: string | null,
): Promise<void> {
  const etat: EtatVisite = sort === 'REFUSEE' ? 'REFUSEE' : 'TRANSMISE';
  await baseOuverte().runAsync(
    `UPDATE visite SET etat = ?, motif_refus = ?, transmise_at = ?
      WHERE identifiant_client = ?`,
    etat, motif, etat === 'TRANSMISE' ? new Date().toISOString() : null, identifiant);
}

/** Une transmission qui echoue remet la saisie en attente : elle repartira au prochain essai. */
export async function rendreALaFile(identifiants: string[]): Promise<void> {
  if (identifiants.length === 0) return;
  await baseOuverte().runAsync(
    `UPDATE visite SET etat = 'EN_ATTENTE'
      WHERE etat = 'ENVOI' AND identifiant_client IN (${identifiants.map(() => '?').join(',')})`,
    ...identifiants);
}

export async function visitesRefusees(): Promise<VisiteLocale[]> {
  const lignes = await baseOuverte().getAllAsync<Record<string, unknown>>(
    "SELECT * FROM visite WHERE etat = 'REFUSEE' ORDER BY saisie_at DESC");
  return lignes.map((l) => ({
    ...versVisiteAEnvoyer(l),
    etat: 'REFUSEE' as const,
    motifRefus: (l.motif_refus as string) ?? null,
    tentatives: (l.tentatives as number) ?? 0,
  }));
}

/** Les saisies transmises depuis plus de N jours ne servent plus : la file se vide seule. */
export async function purger(): Promise<number> {
  const limite = new Date(Date.now() - LIMITES.joursFileLocale * 86_400_000).toISOString();
  const r = await baseOuverte().runAsync(
    "DELETE FROM visite WHERE etat = 'TRANSMISE' AND transmise_at < ?", limite);
  return r.changes;
}

function versVisiteAEnvoyer(l: Record<string, unknown>): VisiteAEnvoyer {
  return {
    identifiantClient: l.identifiant_client as string,
    codAgencia: l.cod_agencia as string,
    numCredito: l.num_credito as number,
    codCliente: (l.cod_cliente as string) ?? null,
    saisieAt: l.saisie_at as string,
    typeContact: l.type_contact as string,
    resultat: l.resultat as string,
    motifRetard: (l.motif_retard as string) ?? null,
    promesseMontant: (l.promesse_montant as number) ?? null,
    promesseDate: (l.promesse_date as string) ?? null,
    appreciation: (l.appreciation as string) ?? null,
    remarque: (l.remarque as string) ?? null,
    latitude: (l.latitude as number) ?? null,
    longitude: (l.longitude as number) ?? null,
    precisionM: (l.precision_m as number) ?? null,
    corrigeIdentifiantClient: (l.corrige_identifiant_client as string) ?? null,
  };
}

// ------------------------------------------------------------------------ les photos

export type PhotoLocale = {
  identifiantClient: string;
  visiteIdentifiant: string;
  chemin: string;
  priseAt: string | null;
  etat: EtatVisite;
};

/**
 * Attache une photo a une visite DEJA enregistree : la file locale exige la visite (cle
 * etrangere), et c'est voulu — une photo sans visite ne veut rien dire, et la suppression
 * d'une saisie emporte ses photos.
 */
export async function ajouterPhoto(
  visiteIdentifiant: string, chemin: string, priseAt?: string,
): Promise<string> {
  const identifiant = Crypto.randomUUID();
  await baseOuverte().runAsync(
    `INSERT INTO photo (identifiant_client, visite_identifiant, chemin, prise_at, etat)
     VALUES (?, ?, ?, ?, 'EN_ATTENTE')`,
    identifiant, visiteIdentifiant, chemin, priseAt ?? new Date().toISOString());
  return identifiant;
}

/**
 * Les photos a envoyer : seulement celles dont la VISITE est deja transmise. Le serveur
 * refuse une photo dont il ne connait pas encore la visite — autant ne pas la lui proposer,
 * et economiser la donnee de l'agent.
 */
export async function photosATransmettre(): Promise<PhotoLocale[]> {
  const lignes = await baseOuverte().getAllAsync<Record<string, unknown>>(
    `SELECT p.* FROM photo p
       JOIN visite v ON v.identifiant_client = p.visite_identifiant
      WHERE p.etat = 'EN_ATTENTE' AND v.etat = 'TRANSMISE'
      ORDER BY p.prise_at LIMIT ?`, LIMITES.tailleLot);
  return lignes.map(versPhoto);
}

export async function photosDeLaVisite(visiteIdentifiant: string): Promise<PhotoLocale[]> {
  const lignes = await baseOuverte().getAllAsync<Record<string, unknown>>(
    'SELECT * FROM photo WHERE visite_identifiant = ? ORDER BY prise_at', visiteIdentifiant);
  return lignes.map(versPhoto);
}

export async function marquerPhoto(identifiant: string, etat: EtatVisite): Promise<void> {
  await baseOuverte().runAsync('UPDATE photo SET etat = ? WHERE identifiant_client = ?',
    etat, identifiant);
}

export async function compterPhotosEnAttente(): Promise<number> {
  const ligne = await baseOuverte().getFirstAsync<{ n: number }>(
    "SELECT COUNT(*) AS n FROM photo WHERE etat = 'EN_ATTENTE'");
  return ligne?.n ?? 0;
}

function versPhoto(l: Record<string, unknown>): PhotoLocale {
  return {
    identifiantClient: l.identifiant_client as string,
    visiteIdentifiant: l.visite_identifiant as string,
    chemin: l.chemin as string,
    priseAt: (l.prise_at as string) ?? null,
    etat: (l.etat as EtatVisite) ?? 'EN_ATTENTE',
  };
}

// --------------------------------------------------------------- la copie du portefeuille

export async function remplacerPortefeuille(credits: CreditPortefeuille[]): Promise<void> {
  const db = baseOuverte();
  await db.withTransactionAsync(async () => {
    await db.runAsync('DELETE FROM credit');
    for (const c of credits) {
      await db.runAsync(
        `INSERT INTO credit (cod_agencia, num_credito, cod_cliente, nom_client, telephone, produit,
                             encours, montant_impaye, jours_retard, prochaine_echeance,
                             prochaine_echeance_montant, derniere_appreciation,
                             derniere_visite_at, promesse_date, promesse_montant, montants_at,
                             hors_credits_vivants)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        c.codAgencia, c.numCredito, c.codCliente, c.nomClient, c.telephone, c.produit,
        c.encours, c.montantImpaye, c.joursRetard, c.prochaineEcheance,
        c.prochaineEcheanceMontant, c.derniereAppreciation, c.derniereVisiteAt,
        c.promesseDate, c.promesseMontant, c.montantsAt, c.horsCreditsVivants ? 1 : 0);
    }
  });
}

export async function portefeuilleLocal(): Promise<CreditPortefeuille[]> {
  const lignes = await baseOuverte().getAllAsync<Record<string, unknown>>(
    'SELECT * FROM credit ORDER BY jours_retard DESC, num_credito');
  return lignes.map((l) => ({
    codAgencia: l.cod_agencia as string,
    numCredito: l.num_credito as number,
    codCliente: (l.cod_cliente as string) ?? null,
    nomClient: (l.nom_client as string) ?? null,
    telephone: (l.telephone as string) ?? null,
    produit: (l.produit as string) ?? null,
    encours: (l.encours as number) ?? null,
    montantImpaye: (l.montant_impaye as number) ?? null,
    joursRetard: (l.jours_retard as number) ?? null,
    prochaineEcheance: (l.prochaine_echeance as string) ?? null,
    prochaineEcheanceMontant: (l.prochaine_echeance_montant as number) ?? null,
    derniereAppreciation: (l.derniere_appreciation as string) ?? null,
    derniereVisiteAt: (l.derniere_visite_at as string) ?? null,
    promesseDate: (l.promesse_date as string) ?? null,
    promesseMontant: (l.promesse_montant as number) ?? null,
    montantsAt: (l.montants_at as string) ?? null,
    horsCreditsVivants: l.hors_credits_vivants === 1,
  }));
}

// --------------------------------------------------------------- les reclamations

export type ReclamationLocale = ReclamationAEnvoyer & {
  etat: EtatVisite;
  motifRefus: string | null;
};

/**
 * Enregistre une reclamation. Elle entre dans la file comme une visite : l'agent la signale
 * depuis le terrain, sans reseau, et la transmission est l'affaire du moteur.
 */
export async function enregistrerReclamation(
  saisie: Omit<ReclamationAEnvoyer, 'identifiantClient' | 'saisieAt'>,
): Promise<string> {
  const identifiant = Crypto.randomUUID();
  await baseOuverte().runAsync(
    `INSERT INTO reclamation (identifiant_client, categorie, objet, message, cod_agencia,
                              num_credito, cod_cliente, saisie_at, etat)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'EN_ATTENTE')`,
    identifiant, saisie.categorie, saisie.objet, saisie.message, saisie.codAgencia,
    saisie.numCredito, saisie.codCliente, new Date().toISOString());
  return identifiant;
}

export async function reclamationsATransmettre(): Promise<ReclamationAEnvoyer[]> {
  const lignes = await baseOuverte().getAllAsync<Record<string, unknown>>(
    `SELECT * FROM reclamation WHERE etat IN ('EN_ATTENTE', 'ENVOI')
      ORDER BY saisie_at LIMIT ?`, LIMITES.tailleLot);
  return lignes.map(versReclamation);
}

/** Ce que l'agent a signale et qui n'est pas encore parti : affiche avec les reponses recues. */
export async function reclamationsLocales(): Promise<ReclamationLocale[]> {
  const lignes = await baseOuverte().getAllAsync<Record<string, unknown>>(
    "SELECT * FROM reclamation WHERE etat <> 'TRANSMISE' ORDER BY saisie_at DESC");
  return lignes.map((l) => ({
    ...versReclamation(l),
    etat: (l.etat as EtatVisite) ?? 'EN_ATTENTE',
    motifRefus: (l.motif_refus as string) ?? null,
  }));
}

export async function appliquerSortReclamation(
  identifiant: string, sort: 'ACCEPTEE' | 'DOUBLON' | 'REFUSEE', motif: string | null,
): Promise<void> {
  const etat: EtatVisite = sort === 'REFUSEE' ? 'REFUSEE' : 'TRANSMISE';
  await baseOuverte().runAsync(
    `UPDATE reclamation SET etat = ?, motif_refus = ?, transmise_at = ?
      WHERE identifiant_client = ?`,
    etat, motif, etat === 'TRANSMISE' ? new Date().toISOString() : null, identifiant);
}

export async function compterReclamationsEnAttente(): Promise<number> {
  const ligne = await baseOuverte().getFirstAsync<{ n: number }>(
    "SELECT COUNT(*) AS n FROM reclamation WHERE etat IN ('EN_ATTENTE', 'ENVOI')");
  return ligne?.n ?? 0;
}

function versReclamation(l: Record<string, unknown>): ReclamationAEnvoyer {
  return {
    identifiantClient: l.identifiant_client as string,
    categorie: l.categorie as string,
    objet: l.objet as string,
    message: l.message as string,
    codAgencia: (l.cod_agencia as string) ?? null,
    numCredito: (l.num_credito as number) ?? null,
    codCliente: (l.cod_cliente as string) ?? null,
    saisieAt: l.saisie_at as string,
  };
}

// ------------------------------------------------------------------ mes dossiers

/**
 * Remplace la copie des dossiers. Les deux perimetres — en cours et clotures — sont rangés
 * ensemble et distingues par une colonne : l'agent bascule de l'un a l'autre sans reseau.
 */
export async function remplacerDossiers(
  dossiers: DossierVue[], clotures: boolean,
): Promise<void> {
  const db = baseOuverte();
  await db.withTransactionAsync(async () => {
    await db.runAsync('DELETE FROM dossier WHERE cloture = ?', clotures ? 1 : 0);
    for (const d of dossiers) {
      await db.runAsync(
        `INSERT OR REPLACE INTO dossier (id, nom, prenom, numero_membre, telephone,
             montant_demande, montant_propose, objet_credit, created_at, statut_demande,
             validation_state, etape, libelle_etat, attend_l_agent, a_corriger, motif_renvoi,
             derniere_decision_at, jours_dans_l_etape, cloture)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        d.id, d.nom, d.prenom, d.numeroMembre, d.telephone, d.montantDemande, d.montantPropose,
        d.objetCredit, d.createdAt, d.statutDemande, d.validationState, d.etape, d.libelleEtat,
        d.attendLAgent ? 1 : 0, d.aCorriger, d.motifRenvoi, d.derniereDecisionAt,
        d.joursDansLEtape, clotures ? 1 : 0);
    }
  });
}

export async function dossiersLocaux(clotures: boolean): Promise<DossierVue[]> {
  const lignes = await baseOuverte().getAllAsync<Record<string, unknown>>(
    `SELECT * FROM dossier WHERE cloture = ?
      ORDER BY attend_l_agent DESC, jours_dans_l_etape DESC`, clotures ? 1 : 0);
  return lignes.map((l) => ({
    id: l.id as number,
    nom: (l.nom as string) ?? null,
    prenom: (l.prenom as string) ?? null,
    numeroMembre: (l.numero_membre as string) ?? null,
    telephone: (l.telephone as string) ?? null,
    montantDemande: (l.montant_demande as number) ?? null,
    montantPropose: (l.montant_propose as number) ?? null,
    objetCredit: (l.objet_credit as string) ?? null,
    createdAt: (l.created_at as string) ?? null,
    statutDemande: l.statut_demande as string,
    validationState: l.validation_state as string,
    etape: l.etape as DossierVue['etape'],
    libelleEtat: l.libelle_etat as string,
    attendLAgent: l.attend_l_agent === 1,
    aCorriger: (l.a_corriger as string) ?? null,
    motifRenvoi: (l.motif_renvoi as string) ?? null,
    derniereDecisionAt: (l.derniere_decision_at as string) ?? null,
    joursDansLEtape: (l.jours_dans_l_etape as number) ?? 0,
  }));
}

// ------------------------------------------------------------------- les listes fermees

export async function majReferentiels(entrees: EntreeReferentiel[]): Promise<void> {
  const db = baseOuverte();
  await db.withTransactionAsync(async () => {
    for (const e of entrees) {
      await db.runAsync(
        `INSERT INTO referentiel (liste, code, libelle, ordre, actif) VALUES (?, ?, ?, ?, ?)
         ON CONFLICT (liste, code) DO UPDATE SET libelle = excluded.libelle,
             ordre = excluded.ordre, actif = excluded.actif`,
        e.liste, e.code, e.libelle, e.ordre, e.actif ? 1 : 0);
    }
  });
}

export async function liste(nom: string): Promise<EntreeReferentiel[]> {
  const lignes = await baseOuverte().getAllAsync<Record<string, unknown>>(
    'SELECT * FROM referentiel WHERE liste = ? AND actif = 1 ORDER BY ordre, code', nom);
  return lignes.map((l) => ({
    liste: l.liste as string,
    code: l.code as string,
    libelle: l.libelle as string,
    ordre: l.ordre as number,
    actif: true,
  }));
}
