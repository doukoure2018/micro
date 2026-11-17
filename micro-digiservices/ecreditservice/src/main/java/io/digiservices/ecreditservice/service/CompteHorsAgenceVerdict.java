package io.digiservices.ecreditservice.service;

import io.digiservices.clients.portefeuille.CompteHorsAgenceDto;

/**
 * Le classement d'un compte ouvert hors de l'agence du client, d'apres les trois agences en
 * presence : celle de l'agent qui l'a ouvert, celle du compte, celle du client.
 *
 * <p>Reprise fidele des quatre situations du script DSIG du 17/11/2026, plus une regle qui n'y
 * etait pas : quand l'agence portee par la FICHE client est celle du compte, le client a ete
 * transfere et le compte est a sa place. Ce n'est pas une anomalie, et la ligne se ferme avec
 * le motif TRANSFERT.</p>
 *
 * <p>Classe pure : aucune base, aucun Spring, aucune date. C'est elle que les tests exercent,
 * et c'est la meme regle que l'ecran rejouera a l'unite (lot 3) : les deux doivent dire la meme
 * chose, sans quoi un compte paraitrait regularise a l'unite et fautif au passage horaire.</p>
 */
public final class CompteHorsAgenceVerdict {

    /** L'agent a ouvert le compte dans son propre point de service, pour un client d'une autre agence. */
    public static final String AGENT_CHEZ_LUI = "AGENT_CHEZ_LUI";
    /** L'agent est de l'agence du client, mais le compte a ete ouvert dans un autre point de service. */
    public static final String AGENT_DU_CLIENT = "AGENT_DU_CLIENT";
    /** Agent, compte et client dans trois agences differentes. */
    public static final String TROIS_AGENCES = "TROIS_AGENCES";
    /** L'usager n'a pas d'agence : administrateur, siege, code sans agence. */
    public static final String AGENT_SANS_AGENCE = "AGENT_SANS_AGENCE";

    private CompteHorsAgenceVerdict() {
    }

    private static String net(String valeur) {
        return valeur == null ? "" : valeur.trim();
    }

    /**
     * Le compte est-il reellement hors de l'agence du client ? Non quand la fiche client porte
     * l'agence du compte : le client a ete transfere, le compte est a sa place.
     */
    public static boolean estAnomalie(CompteHorsAgenceDto c) {
        String compte = net(c.getAgenceCompte());
        if (compte.isEmpty()) {
            return false;
        }
        if (compte.equals(net(c.getAgenceClient()))) {
            return false;
        }
        String fiche = net(c.getAgenceClientFiche());
        return fiche.isEmpty() || !fiche.equals(compte);
    }

    /** La situation d'un compte, dans l'ordre de priorite du script. */
    public static String situation(CompteHorsAgenceDto c) {
        return situation(c.getAgenceAgent(), c.getAgenceCompte(), c.getAgenceClient());
    }

    /**
     * @param agenceAgent  l'agence de l'usager, ou {@code null} si inconnue
     * @param agenceCompte l'agence ou le compte est ouvert
     * @param agenceClient l'agence d'origine du client (3 premiers chiffres du numero de membre)
     */
    public static String situation(String agenceAgent, String agenceCompte, String agenceClient) {
        String agent = net(agenceAgent);
        if (agent.isEmpty()) {
            return AGENT_SANS_AGENCE;
        }
        if (agent.equals(net(agenceCompte))) {
            return AGENT_CHEZ_LUI;
        }
        if (agent.equals(net(agenceClient))) {
            return AGENT_DU_CLIENT;
        }
        return TROIS_AGENCES;
    }

    /** Le libelle d'une situation, pour le courriel et l'ecran. */
    public static String libelle(String situation) {
        return switch (net(situation)) {
            case AGENT_CHEZ_LUI -> "Agent dans son agence, client d'une autre agence";
            case AGENT_DU_CLIENT -> "Agent de l'agence du client, compte ouvert dans une autre agence";
            case TROIS_AGENCES -> "Agent, compte et client dans trois agences différentes";
            case AGENT_SANS_AGENCE -> "Agence de l'agent inconnue (administrateur, siège)";
            default -> situation == null ? "" : situation;
        };
    }
}
