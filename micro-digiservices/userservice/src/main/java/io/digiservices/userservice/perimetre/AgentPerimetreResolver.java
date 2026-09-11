package io.digiservices.userservice.perimetre;

import io.digiservices.userservice.perimetre.PerimetreNiveau;

/**
 * Règles de correspondance rôle CRG -> rôle exposé à AgriScore -> niveau de périmètre.
 *
 * <p>Décisions validées le 2026-09-11 :</p>
 * <ul>
 *   <li>AGENT_CREDIT : point de service ;</li>
 *   <li>DA et RA : agence (même niveau) ;</li>
 *   <li>DR : délégation ;</li>
 *   <li>DE : n'est pas un rôle en base mais le rôle MANAGER avec {@code users.service = 'DE'}.
 *       Exposé à KUMY sous le rôle {@code DE}, niveau national. Les autres MANAGER
 *       (DSIG, DRH…) sont hors périmètre AgriScore ;</li>
 *   <li>DG : national ;</li>
 *   <li>tout autre rôle : hors périmètre (aucun claim métier émis).</li>
 * </ul>
 *
 * <p>Classe pure, sans dépendance Spring, dupliquée à l'identique dans userservice
 * (les deux services ne partagent pas de module commun).</p>
 */
public final class AgentPerimetreResolver {

    public static final String ROLE_AGENT_CREDIT = "AGENT_CREDIT";
    public static final String ROLE_RA = "RA";
    public static final String ROLE_DA = "DA";
    public static final String ROLE_DR = "DR";
    public static final String ROLE_DE = "DE";
    public static final String ROLE_DG = "DG";
    public static final String ROLE_MANAGER = "MANAGER";

    private AgentPerimetreResolver() {
    }

    /**
     * Rôle tel qu'exposé à AgriScore, ou {@code null} si l'agent est hors périmètre.
     * Le couple MANAGER + service DE est traduit en {@code DE}.
     */
    public static String roleAgriScore(String role, String service) {
        if (role == null) {
            return null;
        }
        return switch (role.trim().toUpperCase()) {
            case ROLE_AGENT_CREDIT, ROLE_RA, ROLE_DA, ROLE_DR, ROLE_DG -> role.trim().toUpperCase();
            case ROLE_MANAGER -> service != null && ROLE_DE.equalsIgnoreCase(service.trim()) ? ROLE_DE : null;
            default -> null;
        };
    }

    /** Niveau de périmètre d'un rôle AgriScore, ou {@code null} si le rôle est hors périmètre. */
    public static PerimetreNiveau niveau(String roleAgriScore) {
        if (roleAgriScore == null) {
            return null;
        }
        return switch (roleAgriScore) {
            case ROLE_AGENT_CREDIT -> PerimetreNiveau.POINT_DE_SERVICE;
            case ROLE_RA, ROLE_DA -> PerimetreNiveau.AGENCE;
            case ROLE_DR -> PerimetreNiveau.DELEGATION;
            case ROLE_DE, ROLE_DG -> PerimetreNiveau.NATIONAL;
            default -> null;
        };
    }
}
