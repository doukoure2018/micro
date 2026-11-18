/** Ce que le serveur echange avec l'application (miroir de MobileDtos, cote Java). */

export type Profil = {
  userId: number;
  nom: string;
  role: string;
  codAgencia: string | null;
  pointVente: string | null;
  agence: string | null;
  delegation: string | null;
  note: number | null;
  classe: string | null;
};

export type CreditPortefeuille = {
  codAgencia: string;
  numCredito: number;
  codCliente: string | null;
  nomClient: string | null;
  telephone: string | null;
  /**
   * Ce que SAF ne porte pas, et que seul digi connait : le second numero et les adresses du
   * dossier de credit. Ils voyagent avec le portefeuille parce qu'une adresse sert justement
   * la ou il n'y a pas de reseau — devant la maison du membre.
   */
  telephoneAutre: string | null;
  adresseDomicile: string | null;
  lieuActivite: string | null;
  produit: string | null;
  encours: number | null;
  montantImpaye: number | null;
  joursRetard: number | null;
  prochaineEcheance: string | null;
  prochaineEcheanceMontant: number | null;
  derniereAppreciation: string | null;
  derniereVisiteAt: string | null;
  promesseDate: string | null;
  promesseMontant: number | null;
  /** Date des montants : SAF a l'instant, ou la derniere lecture SAF reussie. Vide = inconnus. */
  montantsAt: string | null;
  /** SAF a repondu pour ce point de service et ne porte PAS ce credit : solde, pas une panne. */
  horsCreditsVivants: boolean;
};

export type EntreeReferentiel = {
  liste: string;
  code: string;
  libelle: string;
  ordre: number;
  actif: boolean;
};

/** Une saisie telle qu'elle part du telephone. */
export type VisiteAEnvoyer = {
  identifiantClient: string;
  codAgencia: string;
  numCredito: number;
  codCliente: string | null;
  saisieAt: string;
  typeContact: string;
  resultat: string;
  motifRetard: string | null;
  promesseMontant: number | null;
  promesseDate: string | null;
  appreciation: string | null;
  remarque: string | null;
  latitude: number | null;
  longitude: number | null;
  precisionM: number | null;
  corrigeIdentifiantClient: string | null;
};

export type SortSaisie = {
  identifiantClient: string;
  sort: 'ACCEPTEE' | 'DOUBLON' | 'REFUSEE';
  motif: string | null;
  id: number | null;
};

export type LotTraite = {
  lotId: number;
  recues: number;
  acceptees: number;
  refusees: number;
  doublons: number;
  sorts: SortSaisie[];
};

/** Un agent de l'equipe, vu du directeur d'agence. */
export type AgentVu = {
  userId: number;
  nom: string;
  codAgencia: string | null;
  pointVente: string | null;
  nbCredits: number;
  nbVisites: number;
  derniereVisiteAt: string | null;
  nbA: number;
  nbB: number;
  nbC: number;
  nbD: number;
};

/** Une visite deja enregistree, telle que le directeur la lit. */
export type VisiteEnregistree = {
  id: number;
  codAgencia: string;
  numCredito: number;
  saisieAt: string;
  typeContact: string;
  resultat: string;
  motifRetard: string | null;
  promesseMontant: number | null;
  promesseDate: string | null;
  appreciation: string | null;
  remarque: string | null;
  agent: string | null;
  horsPortefeuille: boolean;
  nbPhotos: number;
};

export type EquipeVue = {
  joursObserves: number;
  joursSilence: number;
  agents: AgentVu[];
  silencieux: AgentVu[];
  visites: VisiteEnregistree[];
};

/** Une categorie de reclamation, gardee hors ligne par le telephone. */
export type CategorieReclamation = {
  code: string;
  libelle: string;
  ordre: number;
};

/** Une reclamation telle que l'agent la relit, avec la reponse recue. */
export type ReclamationVue = {
  id: number;
  identifiantClient: string;
  categorie: string;
  categorieLibelle: string;
  objet: string;
  message: string;
  codAgencia: string | null;
  numCredito: number | null;
  codCliente: string | null;
  auteur: string | null;
  auteurPointVente: string | null;
  saisieAt: string;
  recueAt: string;
  statut: 'OUVERTE' | 'EN_COURS' | 'TRAITEE';
  priseEnChargePar: string | null;
  priseEnChargeAt: string | null;
  reponse: string | null;
  reponduPar: string | null;
  reponduAt: string | null;
  notifiee: boolean;
  nbPieces: number;
};

/** Une reclamation telle qu'elle part du telephone. */
export type ReclamationAEnvoyer = {
  identifiantClient: string;
  categorie: string;
  objet: string;
  message: string;
  codAgencia: string | null;
  numCredito: number | null;
  codCliente: string | null;
  saisieAt: string;
};

/** Un dossier de credit de l'agent, et ou il en est dans le circuit. */
export type DossierVue = {
  id: number;
  nom: string | null;
  prenom: string | null;
  numeroMembre: string | null;
  telephone: string | null;
  montantDemande: number | null;
  montantPropose: number | null;
  objetCredit: string | null;
  createdAt: string | null;
  statutDemande: string;
  validationState: string;
  etape: 'RECEPTION' | 'ANALYSE' | 'CORRECTION' | 'APPROBATION' | 'ANNULATION' | 'APPROUVE' | 'REJETE';
  libelleEtat: string;
  /** L'agent doit agir : analyser ou corriger. Le reste, il l'attend. */
  attendLAgent: boolean;
  aCorriger: string | null;
  motifRenvoi: string | null;
  derniereDecisionAt: string | null;
  joursDansLEtape: number;
};

/** Une ligne de l'echeancier SAF. */
export type EcheanceVue = {
  numero: number | null;
  date: string | null;
  montant: number | null;
  capitalRestant: number | null;
  interetsRestants: number | null;
  payeeLe: string | null;
};

export type Caution = {
  nom: string | null;
  prenom: string | null;
  telephone: string | null;
  profession: string | null;
  adresse: string | null;
};

/** Les cautions d'UN dossier digi du membre : c'est au dossier qu'elles sont attachees. */
export type DossierCautions = {
  demandeindividuelId: number;
  deposeLe: string | null;
  montantDemande: number | null;
  etat: string | null;
  personnes: Caution[];
};

export type PositionVue = {
  latitude: number;
  longitude: number;
  precisionM: number | null;
  saisieAt: string | null;
  agent: string | null;
};

export type FicheCredit = {
  echeancier: EcheanceVue[];
  cautions: DossierCautions[];
  dernierePosition: PositionVue | null;
  /** Toutes les lignes sont soldees alors que le credit court : il echappe aux relances. */
  echeancierIncomplet: boolean;
};

/**
 * Une notification du journal. `envoyee` vaut faux quand le push n'est pas parti — aucun
 * appareil declare, projet Expo non rattache, reseau absent : la notification existe quand
 * meme, et c'est tout l'interet du journal.
 */
export type NotificationVue = {
  id: number;
  categorie: 'PORTEFEUILLE' | 'RECOUVREMENT' | 'SYNCHRONISATION' | 'RECLAMATION' | 'DOSSIER';
  titre: string;
  corps: string;
  ecran: string | null;
  parametres: Record<string, unknown> | null;
  creeeAt: string;
  envoyee: boolean;
  lue: boolean;
};

export type JournalNotifications = {
  nonLues: number;
  notifications: NotificationVue[];
};
