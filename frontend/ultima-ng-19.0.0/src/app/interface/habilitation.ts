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
