package io.digiservices.agriculteurservice.utils;

import org.springframework.stereotype.Component;

/**
 * Traduction des codes techniques SAF2000 en libelles francais pour AgriPilot.
 *
 * <p>Les DTOs Feign ({@code clients.agri}) transportent encore les codes bruts
 * (indPersona, indEstado, indGrado) : agriculteurservice produit ici sa propre
 * traduction francaise, independante de celle d'ebanking, pour maitriser le
 * contrat public. Code inconnu -&gt; code brut renvoye.</p>
 */
@Component
public class SafTranslator {

    /** IND_PERSONA -&gt; PHYSIQUE / MORALE. */
    public String translateTypePersonne(String indPersona) {
        if (indPersona == null) {
            return null;
        }
        return switch (indPersona.trim().toUpperCase()) {
            case "F" -> "PHYSIQUE";
            case "J", "M" -> "MORALE";
            default -> indPersona;
        };
    }

    /** PR_CREDITOS.IND_ESTADO -&gt; statut francais. */
    public String translateStatutCredit(String indEstado) {
        if (indEstado == null) {
            return null;
        }
        return switch (indEstado.trim().toUpperCase()) {
            case "A" -> "Actif";
            case "D" -> "Decaisse";
            case "C" -> "Cloture";
            case "T" -> "Termine";
            case "V" -> "Echu";
            case "J" -> "Judiciaire";
            case "X" -> "Annule";
            case "I" -> "Apure";
            default -> indEstado;
        };
    }

    /**
     * Dictionnaire des statuts de credit (KUMY, lot 1) : le code SAF, sa traduction, son sens, et
     * le classement que la plateforme en fait. N et R n'ont pas de sens documente : leur
     * signification est demandee a l'exploitation SAF.
     */
    public java.util.List<java.util.Map<String, String>> dictionnaireStatuts() {
        java.util.List<java.util.Map<String, String>> l = new java.util.ArrayList<>();
        l.add(statut("D", "Decaisse", "Credit en cours, decaisse, en remboursement", "sain ou en retard selon joursRetard"));
        l.add(statut("A", "Actif", "Credit actif, non encore decaisse ou en cours", "en cours"));
        l.add(statut("J", "Judiciaire", "Credit au contentieux", "contentieux"));
        l.add(statut("I", "Apure", "Credit radie ou passe en perte, solde non recouvre", "passe en perte"));
        l.add(statut("C", "Cloture", "Credit solde et clos", "solde"));
        l.add(statut("T", "Termine", "Credit transfere ou termine", "sorti"));
        l.add(statut("V", "Echu", "Credit echu", "echu"));
        l.add(statut("X", "Annule", "Credit annule avant decaissement", "annule"));
        l.add(statut("N", "N", "Sens non documente : question posee a l'exploitation SAF", "a classer"));
        l.add(statut("R", "R", "Sens non documente : question posee a l'exploitation SAF", "a classer"));
        return l;
    }

    private static java.util.Map<String, String> statut(String code, String libelle, String sens, String classement) {
        java.util.Map<String, String> m = new java.util.LinkedHashMap<>();
        m.put("code", code);
        m.put("libelle", libelle);
        m.put("sens", sens);
        m.put("classement", classement);
        return m;
    }

    /** CL_GRUPOS_X_CLIENTE.IND_GRADO -&gt; role francais. */
    public String translateRoleMembre(String indGrado) {
        if (indGrado == null) {
            return null;
        }
        return switch (indGrado.trim().toUpperCase()) {
            case "P" -> "President";
            case "S" -> "Secretaire";
            case "T" -> "Tresorier";
            case "M" -> "Membre";
            default -> indGrado;
        };
    }
}
