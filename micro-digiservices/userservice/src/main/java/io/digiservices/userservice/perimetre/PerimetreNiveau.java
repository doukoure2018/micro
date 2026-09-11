package io.digiservices.userservice.perimetre;

/**
 * Niveau du périmètre géographique qu'un agent CRG a le droit de voir dans AgriScore.
 * L'ordre des constantes va du plus fin au plus large ; il est utilisé pour décider
 * quels claims de rattachement sont émis (un DA n'a pas de point de service, etc.).
 */
public enum PerimetreNiveau {
    /** Un seul point de service (AGENT_CREDIT). */
    POINT_DE_SERVICE,
    /** Une agence et tous ses points de service (DA, RA). */
    AGENCE,
    /** Une délégation, ses agences et leurs points de service (DR). */
    DELEGATION,
    /** Tout le réseau (DE, DG). */
    NATIONAL
}
