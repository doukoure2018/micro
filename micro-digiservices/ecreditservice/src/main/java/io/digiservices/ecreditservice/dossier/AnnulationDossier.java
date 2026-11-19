package io.digiservices.ecreditservice.dossier;

import java.util.Objects;
import java.util.Set;

/**
 * La règle d'annulation d'un dossier de crédit (V216, DSIG du 2026-11-19).
 *
 * <p><b>Celui qui tient le dossier à son étape l'annule directement ; tout autre acteur du
 * dossier en demande l'annulation, et c'est le tenant qui tranche.</b> Le tenant est l'acteur
 * dont la file contient le dossier : le DA tant que le dossier n'a pas quitté l'agence
 * (accueil, agent, {@code APPROVED}), le DR à {@code VALIDATED_DA}, la DE à
 * {@code VALIDATED_DR} et sur un dossier approuvé au niveau final mais pas encore mis en
 * place, la DG à {@code PENDING_DG}. La DSIG annule partout, et c'est journalisé comme tel.</p>
 *
 * <p>Fonction pure : ni base, ni Spring. Le service lui apporte le dossier (avec la réponse
 * de SAF sur la mise en place) et l'acteur connecté ; elle rend une décision et sa raison,
 * dans les mots que l'écran affiche. C'est elle que les tests exercent étape par étape.</p>
 */
public final class AnnulationDossier {

    public static final String DA = "DA", DR = "DR", DE = "DE", DG = "DG", DSIG = "DSIG";
    public static final String AGENT_CREDIT = "AGENT_CREDIT", AGENT_ACCUEIL = "AGENT_ACCUEIL";
    public static final String ETAPE_DEMANDE = "ANNULATION_DEMANDEE";
    public static final String STATUT_VIVANT = "EN_ATTENTE";

    /** Phase accueil : le dossier n'est encore à personne d'autre qu'au DA. */
    public static final Set<String> ETAPES_ACCUEIL = Set.of("EN_ATTENTE_DA", "NOUVEAU", "CORRECTION_ACCUEIL");
    /** Chez l'agent de crédit, y compris l'ancienne étape VALIDATION (arbitrage 7). */
    public static final Set<String> ETAPES_AGENT = Set.of("AFFECTEE", "SELECTION", "VALIDATION", "CORRECTION",
            "CORRECTION_DR", "CORRECTION_DE", "RETOUR_AGENT", "REJETE_DG");
    public static final String APPROVED = "APPROVED", VALIDATED_DA = "VALIDATED_DA", VALIDATED_DR = "VALIDATED_DR",
            PENDING_DG = "PENDING_DG", VALIDATED_FINAL = "VALIDATED_FINAL";

    /** Motifs normalisés : c'est le code qui se compte, l'explication qui dit le cas. */
    public static final Set<String> MOTIFS = Set.of("DESISTEMENT_CLIENT", "CLIENT_INJOIGNABLE", "DOUBLE_SAISIE",
            "ERREUR_SAISIE", "DOSSIER_INCOMPLET_ABANDONNE", "CHANGEMENT_DE_PRODUIT", "AUTRE");

    /** Un dossier annulé peut être rouvert par son tenant pendant ce délai (arbitrage 4). */
    public static final int JOURS_REOUVERTURE = 30;

    public enum Mode { DIRECTE, DEMANDEE, REFUS }

    /** Ce que le service a lu du dossier ; {@code creditSafMisEnPlace} n'a de sens qu'au niveau final. */
    public record Dossier(Long id, String etape, String statut, Long agence, Long delegation,
                          Long agentAffecte, String codUsuarios, Long saisiePar, boolean creditSafMisEnPlace) {
        public String etapeOuNouveau() {
            return etape == null || etape.isBlank() ? "NOUVEAU" : etape;
        }
    }

    /** L'acteur connecté. La DE est un {@code MANAGER} du service DE : c'est ici qu'on le normalise. */
    public record Acteur(String role, String service, Long userId, String username, String nomComplet,
                         Long agenceId, Long delegationId) {
        public String roleNormalise() {
            if ("MANAGER".equals(role) && service != null && "DE".equalsIgnoreCase(service.trim())) return DE;
            if ("SUPER_ADMIN".equals(role)) return DSIG;
            return role;
        }
    }

    public record Decision(Mode mode, String tenant, String raison) {
        public boolean permise() {
            return mode != Mode.REFUS;
        }
    }

    private AnnulationDossier() {
    }

    /** Qui tient le dossier à cette étape, donc qui tranche son annulation. */
    public static String tenantDe(String etape) {
        String e = etape == null || etape.isBlank() ? "NOUVEAU" : etape;
        if (ETAPES_ACCUEIL.contains(e) || ETAPES_AGENT.contains(e) || APPROVED.equals(e)) return DA;
        if (VALIDATED_DA.equals(e)) return DR;
        if (VALIDATED_DR.equals(e) || VALIDATED_FINAL.equals(e)) return DE;
        if (PENDING_DG.equals(e)) return DG;
        return null;
    }

    public static String libelleTenant(String tenant) {
        if (tenant == null) return "personne";
        return switch (tenant) {
            case DA -> "le Directeur d'Agence";
            case DR -> "le Directeur Régional";
            case DE -> "la Direction de l'Exploitation";
            case DG -> "la Direction Générale";
            case DSIG -> "la DSIG";
            default -> tenant;
        };
    }

    /** L'acteur est-il le tenant de cette étape pour ce dossier (ou la DSIG) ? Sert à annuler
     *  directement, à valider ou refuser une demande, et à rouvrir. */
    public static boolean peutDecider(Acteur a, String tenant, Dossier d) {
        if (a == null || tenant == null) return false;
        String role = a.roleNormalise();
        if (DSIG.equals(role)) return true;
        if (!tenant.equals(role)) return false;
        return switch (tenant) {
            case DA -> memeValeur(a.agenceId(), d.agence());
            case DR -> memeValeur(a.delegationId(), d.delegation());
            default -> true;      // DE et DG : tout le réseau
        };
    }

    /** L'agent de crédit affecté au dossier, selon les trois écritures que la base connaît. */
    public static boolean estAgentAffecte(Acteur a, Dossier d) {
        if (a == null || d == null) return false;
        if (memeValeur(a.userId(), d.agentAffecte())) return true;
        String cod = d.codUsuarios() == null ? "" : d.codUsuarios().trim();
        if (cod.isEmpty()) return false;
        return cod.equals(a.username()) || cod.equals(a.nomComplet());
    }

    /** La décision, dans les mots que l'écran affiche. */
    public static Decision decider(Acteur a, Dossier d) {
        if (d == null) return new Decision(Mode.REFUS, null, "Dossier introuvable");
        String etape = d.etapeOuNouveau();
        if (!STATUT_VIVANT.equals(d.statut())) {
            return new Decision(Mode.REFUS, null, "ANNULE".equals(d.statut())
                    ? "Ce dossier est déjà annulé"
                    : "Ce dossier est déjà clôturé (statut " + d.statut() + ")");
        }
        if (ETAPE_DEMANDE.equals(etape)) {
            return new Decision(Mode.REFUS, tenantDe(d.etape()),
                    "Une demande d'annulation est déjà en attente de décision sur ce dossier");
        }
        String tenant = tenantDe(etape);
        if (tenant == null) {
            return new Decision(Mode.REFUS, null, "Étape « " + etape + " » inconnue : annulation impossible");
        }
        if (VALIDATED_FINAL.equals(etape) && d.creditSafMisEnPlace()) {
            return new Decision(Mode.REFUS, tenant,
                    "Ce crédit est déjà mis en place dans SAF : l'annulation se fait dans SAF, pas ici");
        }
        if (a == null) return new Decision(Mode.REFUS, tenant, "Utilisateur inconnu");
        if (peutDecider(a, tenant, d)) {
            return new Decision(Mode.DIRECTE, tenant, "Le dossier sera annulé immédiatement");
        }
        String role = a.roleNormalise();
        String attente = "Votre demande sera soumise à " + libelleTenant(tenant)
                + " ; le dossier est figé jusqu'à sa décision";
        String seul = "Seul " + libelleTenant(tenant) + " peut annuler ce dossier à cette étape";
        switch (role == null ? "" : role) {
            case AGENT_CREDIT -> {
                if (!estAgentAffecte(a, d)) return new Decision(Mode.REFUS, tenant, "Ce dossier ne vous est pas affecté");
                if (ETAPES_ACCUEIL.contains(etape)) {
                    return new Decision(Mode.REFUS, tenant, "Dossier encore à l'accueil : " + seul.toLowerCase());
                }
                return new Decision(Mode.DEMANDEE, tenant, attente);
            }
            case AGENT_ACCUEIL -> {
                if (!ETAPES_ACCUEIL.contains(etape)) {
                    return new Decision(Mode.REFUS, tenant, "Le dossier a quitté l'accueil : " + seul.toLowerCase());
                }
                if (!memeValeur(a.userId(), d.saisiePar())) {
                    return new Decision(Mode.REFUS, tenant, "Vous n'avez pas saisi ce dossier");
                }
                return new Decision(Mode.DEMANDEE, tenant, attente);
            }
            case DA -> {
                if (!memeValeur(a.agenceId(), d.agence())) {
                    return new Decision(Mode.REFUS, tenant, "Ce dossier n'est pas dans votre agence");
                }
                // Le tenant est forcément au-dessus (DR, DE ou DG), sinon peutDecider aurait répondu.
                return new Decision(Mode.DEMANDEE, tenant, attente);
            }
            case DR -> {
                if (!memeValeur(a.delegationId(), d.delegation())) {
                    return new Decision(Mode.REFUS, tenant, "Ce dossier n'est pas dans votre délégation");
                }
                if (DA.equals(tenant)) return new Decision(Mode.REFUS, tenant, seul);
                return new Decision(Mode.DEMANDEE, tenant, attente);
            }
            case DE -> {
                if (DG.equals(tenant)) return new Decision(Mode.DEMANDEE, tenant, attente);
                return new Decision(Mode.REFUS, tenant, seul);
            }
            default -> {
                return new Decision(Mode.REFUS, tenant, seul);
            }
        }
    }

    private static boolean memeValeur(Long a, Long b) {
        return a != null && b != null && Objects.equals(a, b);
    }
}
