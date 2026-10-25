/**
 * Porte-cles d'habilitations (V178). Le menu et les gardes de route n'interrogent plus le role
 * mais cette liste de codes, calculee une fois par le serveur a partir du departement du compte.
 */
export interface Habilitations {
    role: string | null;
    service: string | null;
    departementId: number | null;
    departementCode: string | null;
    departement: string | null;
    responsableDuService: boolean;
    accueil: string | null;
    parDepartementActif: boolean;
    rubriques: string[];
    /** Compte d'un service a departements qui n'est pas encore rattache. */
    aPlacer: boolean;
    /** Responsable du service, ou administrateur : peut regler la matrice. */
    peutReglerLaMatrice: boolean;
}

/** Un departement propose a l'administrateur sur la fiche du compte. */
export interface DepartementHabilitation {
    id: number;
    service: string;
    code: string;
    libelle: string;
    accueilRoute: string | null;
    toutVoir: boolean;
    ordre: number;
}

/** Une rubrique, en colonne de l'écran de réglage. */
export interface RubriqueHabilitation {
    code: string;
    libelle: string;
    famille: string;
    ordre: number;
}

/** Une ligne de la matrice : un département et les rubriques qui lui sont accordées. */
export interface LigneDepartement {
    id: number;
    service: string;
    code: string;
    libelle: string;
    toutVoir: boolean;
    accueilRoute: string | null;
    comptesActifs: number;
    comptes: number;
    noms: string[];
    rubriques: string[];
}

/** Une ligne du journal des réglages. */
export interface TraceHabilitation {
    id: number;
    action: string;
    service: string | null;
    departement: string | null;
    rubriqueCode: string | null;
    valeurAvant: string | null;
    valeurApres: string | null;
    parNom: string | null;
    dateAction: string;
}

export interface MatriceHabilitation {
    rubriques: RubriqueHabilitation[];
    departements: LigneDepartement[];
    parDepartementActif: boolean;
    nonPlaces: string[];
    journal: TraceHabilitation[];
}
