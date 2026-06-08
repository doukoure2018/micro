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
            default -> indEstado;
        };
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
