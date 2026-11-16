package io.digiservices.ecreditservice.dossier;

import java.util.Map;

/**
 * Où en est un dossier de crédit individuel, en un mot que l'agent comprend.
 *
 * <p><b>Ce référentiel est le jumeau de celui du web</b>
 * ({@code frontend/.../interface/etat-dossier.ts}, V148). Il existe parce que le téléphone ne
 * peut pas lire un fichier TypeScript, et il est tenu en phase par un test qui LIT ce fichier
 * et compare, état par état : le jour où l'un des deux change, l'essai tombe.</p>
 *
 * <p>Le libellé dit toujours CHEZ QUI le dossier se trouve, pas seulement son état. « Validée
 * DA, chez le DR » apprend à l'agent ce qu'il doit faire — attendre, ou relancer quelqu'un —
 * là où « VALIDATED_DA » ne lui apprend rien.</p>
 */
public final class EtatDossier {

    private EtatDossier() {
    }

    /** Les cinq étapes du circuit, plus les deux fins. */
    public static final String RECEPTION = "RECEPTION";
    public static final String ANALYSE = "ANALYSE";
    public static final String CORRECTION = "CORRECTION";
    public static final String APPROBATION = "APPROBATION";
    public static final String ANNULATION = "ANNULATION";
    public static final String APPROUVE = "APPROUVE";
    public static final String REJETE = "REJETE";

    private static final Map<String, String> ETAPES = Map.ofEntries(
            Map.entry("EN_ATTENTE_DA", RECEPTION),
            Map.entry("NOUVEAU", RECEPTION),
            Map.entry("AFFECTEE", ANALYSE),
            Map.entry("SELECTION", ANALYSE),
            Map.entry("VALIDATION", ANALYSE),
            Map.entry("CORRECTION_ACCUEIL", CORRECTION),
            Map.entry("CORRECTION", CORRECTION),
            Map.entry("CORRECTION_DR", CORRECTION),
            Map.entry("CORRECTION_DE", CORRECTION),
            Map.entry("RETOUR_AGENT", CORRECTION),
            Map.entry("REJETE_DG", CORRECTION),
            Map.entry("APPROVED", APPROBATION),
            Map.entry("VALIDATED_DA", APPROBATION),
            Map.entry("VALIDATED_DR", APPROBATION),
            Map.entry("PENDING_DG", APPROBATION),
            Map.entry("ANNULATION_DEMANDEE", ANNULATION));

    private static final Map<String, String> LIBELLES = Map.ofEntries(
            Map.entry("EN_ATTENTE_DA", "Reçue, à affecter par le DA"),
            Map.entry("CORRECTION_ACCUEIL", "À corriger (renvoi du DA au saisissant)"),
            Map.entry("NOUVEAU", "Nouvelle demande"),
            Map.entry("AFFECTEE", "Affectée à un agent"),
            Map.entry("SELECTION", "En analyse par l'agent"),
            Map.entry("VALIDATION", "En analyse par l'agent"),
            Map.entry("CORRECTION", "À corriger (retour DA)"),
            Map.entry("CORRECTION_DR", "À corriger (retour DR)"),
            Map.entry("CORRECTION_DE", "À corriger (retour DE)"),
            Map.entry("RETOUR_AGENT", "Renvoyée à l'agent"),
            Map.entry("REJETE_DG", "Rejet DG, confirmation DE"),
            Map.entry("APPROVED", "Approuvée par l'agent, chez le DA"),
            Map.entry("VALIDATED_DA", "Validée DA, chez le DR"),
            Map.entry("VALIDATED_DR", "Validée DR, chez le DE"),
            Map.entry("PENDING_DG", "Validée DE, visa DG"),
            Map.entry("VALIDATED_FINAL", "Approuvée (niveau final)"),
            Map.entry("ANNULATION_DEMANDEE", "Annulation demandée, décision du DA"));

    public static boolean estRejete(String statutDemande) {
        return "REJET".equals(statutDemande) || "REJECTED".equals(statutDemande);
    }

    /** V163 : désistement du client, validé par le DA. Clôturé comme un rejet. */
    public static boolean estAnnule(String statutDemande) {
        return "ANNULE".equals(statutDemande);
    }

    public static boolean estApprouveFinal(String validationState) {
        return "VALIDATED_FINAL".equals(validationState);
    }

    public static boolean estCloture(String statutDemande, String validationState) {
        return estRejete(statutDemande) || estAnnule(statutDemande)
                || estApprouveFinal(validationState);
    }

    public static String etape(String statutDemande, String validationState) {
        if (estRejete(statutDemande)) {
            return REJETE;
        }
        if (estAnnule(statutDemande)) {
            return ANNULATION;
        }
        if (estApprouveFinal(validationState)) {
            return APPROUVE;
        }
        return ETAPES.getOrDefault(etat(validationState), RECEPTION);
    }

    /**
     * Le libellé. Le cas du rejet DG confirmé par le DE (23/09/2026) est repris tel quel du web :
     * {@code CORRECTION_DE} sans motif propre au DE désigne en réalité un rejet du DG.
     */
    public static String libelle(String statutDemande, String validationState,
                                 String motifRejetDg, String motifRejetDe) {
        if (estRejete(statutDemande)) {
            return "Rejetée";
        }
        if (estAnnule(statutDemande)) {
            return "Annulée (désistement)";
        }
        if ("CORRECTION_DE".equals(validationState) && renseigne(motifRejetDg) && !renseigne(motifRejetDe)) {
            return "À corriger (rejet DG confirmé par le DE)";
        }
        String etat = etat(validationState);
        return LIBELLES.getOrDefault(etat, etat);
    }

    /** L'agent doit-il agir ? C'est la seule question qui le concerne dans une liste. */
    public static boolean attendLAgent(String statutDemande, String validationState) {
        String etape = etape(statutDemande, validationState);
        return ANALYSE.equals(etape) || CORRECTION.equals(etape);
    }

    private static String etat(String validationState) {
        return validationState == null || validationState.isBlank() ? "NOUVEAU" : validationState;
    }

    private static boolean renseigne(String s) {
        return s != null && !s.isBlank();
    }
}
