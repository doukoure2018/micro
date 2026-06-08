package io.digiservices.ebanking.utils;

import org.springframework.stereotype.Component;

/**
 * Traduction des codes techniques SAF2000 en libelles lisibles (FR).
 *
 * <p><b>NB :</b> les correspondances ci-dessous sont les conventions SAF usuelles
 * et restent a confirmer contre la BDCRG de production. En cas de code inconnu,
 * le code brut est renvoye (aucune perte d'information).</p>
 */
@Component
public class SafTranslator {

    /**
     * Statut d'un credit (PR.PR_CREDITOS.IND_ESTADO).
     */
    public String translateCreditStatus(String indEstado) {
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

    /**
     * Statut d'une echeance (PR.PR_PLAN_PAGOS.IND_ESTADO).
     */
    public String translateInstallmentStatus(String indEstado) {
        if (indEstado == null) {
            return null;
        }
        return switch (indEstado.trim().toUpperCase()) {
            case "P" -> "Payee";
            case "A" -> "Non echue";
            case "V" -> "En retard";
            case "R" -> "Prorogee";
            case "C" -> "Annulee";
            default -> indEstado;
        };
    }

    /**
     * Type de personne (IND_PERSONA) -> PHYSICAL / LEGAL.
     */
    public String translatePersonType(String indPersona) {
        if (indPersona == null) {
            return null;
        }
        return switch (indPersona.trim().toUpperCase()) {
            case "F" -> "PHYSICAL";
            case "J", "M" -> "LEGAL";
            default -> indPersona;
        };
    }

    /**
     * Role d'un membre dans un groupe (CL.CL_GRUPOS_X_CLIENTE.IND_GRADO).
     * Mapping generique en attendant la table de reference SAF.
     */
    public String translateGroupRole(String indGrado) {
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
