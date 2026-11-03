export interface PointVente {
    id?: number;
    libele?: string;
    delegation_id?: number;
    agence_id?: number;
    code?: string;
    /** Rattachement lisible, quand les destinations couvrent plusieurs agences (rotation). */
    agence?: string;
    delegation?: string;
}
