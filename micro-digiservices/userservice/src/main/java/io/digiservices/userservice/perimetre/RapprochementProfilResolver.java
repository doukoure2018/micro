package io.digiservices.userservice.perimetre;


/**
 * Profils de l'outil « Rapprochement des encours » (comptes clients et credits), et niveau
 * de perimetre de chacun. Proposition DSIG du 2026-10-18, implementee le 2026-10-18.
 *
 * <p>Distinct de {@link AgentPerimetreResolver}, qui sert la federation KUMY/AgriScore :
 * l'inspection et la DSIG ouvrent l'outil de rapprochement mais restent hors perimetre
 * AgriScore. Les deux resolveurs lisent les memes colonnes (role de connexion + service).</p>
 *
 * <ul>
 *   <li>AGENT_CREDIT : son point de service ;</li>
 *   <li>RA (responsable d'agence) : son agence ;</li>
 *   <li>AGENT_DELEGATION : sa delegation, sans les droits de validation du DR ;</li>
 *   <li>DR : sa delegation ;</li>
 *   <li>DE (MANAGER + service DE), INSPECTION (MANAGER + service DI), DIRECTION (DG)
 *       et DSIG (SUPER_ADMIN, ou MANAGER + service DSIG) : tout le reseau ;</li>
 *   <li>tout autre role ou service : hors perimetre, l'outil ne s'ouvre pas.</li>
 * </ul>
 *
 * <p>Classe pure, sans dependance Spring, dupliquee a l'identique dans userservice
 * (les deux services ne partagent pas de module commun).</p>
 */
public final class RapprochementProfilResolver {

    // Roles de connexion lus dans digi
    public static final String ROLE_AGENT_CREDIT = "AGENT_CREDIT";
    public static final String ROLE_RA = "RA";
    public static final String ROLE_AGENT_DELEGATION = "AGENT_DELEGATION";
    public static final String ROLE_DR = "DR";
    public static final String ROLE_DG = "DG";
    public static final String ROLE_MANAGER = "MANAGER";
    public static final String ROLE_SUPER_ADMIN = "SUPER_ADMIN";

    // Services (users.service) qui qualifient un MANAGER
    public static final String SERVICE_DE = "DE";
    public static final String SERVICE_DI = "DI";
    public static final String SERVICE_DSIG = "DSIG";

    // Profils exposes a l'outil
    public static final String PROFIL_AGENT_CREDIT = "AGENT_CREDIT";
    public static final String PROFIL_RA = "RA";
    public static final String PROFIL_DELEGATION = "DELEGATION";
    public static final String PROFIL_DR = "DR";
    public static final String PROFIL_DE = "DE";
    public static final String PROFIL_INSPECTION = "INSPECTION";
    public static final String PROFIL_DIRECTION = "DIRECTION";
    public static final String PROFIL_DSIG = "DSIG";

    private RapprochementProfilResolver() {
    }

    /** Profil de l'outil, ou {@code null} si l'utilisateur n'est pas habilite. */
    public static String profil(String role, String service) {
        if (role == null) {
            return null;
        }
        String r = role.trim().toUpperCase();
        String s = service == null ? "" : service.trim().toUpperCase();
        return switch (r) {
            case ROLE_AGENT_CREDIT -> PROFIL_AGENT_CREDIT;
            case ROLE_RA -> PROFIL_RA;
            case ROLE_AGENT_DELEGATION -> PROFIL_DELEGATION;
            case ROLE_DR -> PROFIL_DR;
            case ROLE_DG -> PROFIL_DIRECTION;
            case ROLE_SUPER_ADMIN -> PROFIL_DSIG;
            case ROLE_MANAGER -> switch (s) {
                case SERVICE_DE -> PROFIL_DE;
                case SERVICE_DI -> PROFIL_INSPECTION;
                case SERVICE_DSIG -> PROFIL_DSIG;
                default -> null;     // DRH, DF, Audit, Societariat : hors outil
            };
            default -> null;         // DA, CAISSE, AGENT_ACCUEIL, AGENT_CORRECTEUR, USER...
        };
    }

    /** Niveau de perimetre d'un profil, ou {@code null} si le profil est hors perimetre. */
    public static PerimetreNiveau niveau(String profil) {
        if (profil == null) {
            return null;
        }
        return switch (profil) {
            case PROFIL_AGENT_CREDIT -> PerimetreNiveau.POINT_DE_SERVICE;
            case PROFIL_RA -> PerimetreNiveau.AGENCE;
            case PROFIL_DELEGATION, PROFIL_DR -> PerimetreNiveau.DELEGATION;
            case PROFIL_DE, PROFIL_INSPECTION, PROFIL_DIRECTION, PROFIL_DSIG -> PerimetreNiveau.NATIONAL;
            default -> null;
        };
    }

    /**
     * Le recalcul de l'etat consolide du reseau lit {@code CG_SALDOS_X_AGENCIA} en entier
     * (plusieurs minutes de charge sur BDCRG) : reserve a la DE et a la DSIG. L'inspection
     * et la direction lisent l'etat calcule le matin (arbitrage DSIG du 2026-10-18).
     */
    public static boolean peutRecalculerLeReseau(String profil) {
        return PROFIL_DE.equals(profil) || PROFIL_DSIG.equals(profil);
    }
}
