package io.digiservices.ecreditservice.service;

import io.digiservices.clients.portefeuille.CompteHorsAgenceDto;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static io.digiservices.ecreditservice.service.CompteHorsAgenceVerdict.AGENT_CHEZ_LUI;
import static io.digiservices.ecreditservice.service.CompteHorsAgenceVerdict.AGENT_DU_CLIENT;
import static io.digiservices.ecreditservice.service.CompteHorsAgenceVerdict.AGENT_SANS_AGENCE;
import static io.digiservices.ecreditservice.service.CompteHorsAgenceVerdict.TROIS_AGENCES;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * Les quatre situations du script DSIG du 17/11/2026, dans son ordre de priorite, plus le cas
 * qui n'en est pas une : le client transfere dont la fiche porte l'agence du compte.
 */
class CompteHorsAgenceVerdictTest {

    private static CompteHorsAgenceDto compte(String agenceAgent, String agenceCompte, String agenceClient,
                                              String agenceFiche) {
        CompteHorsAgenceDto c = new CompteHorsAgenceDto();
        c.setNumCuenta(agenceCompte + "0140000001");
        c.setAgenceAgent(agenceAgent);
        c.setAgenceCompte(agenceCompte);
        c.setAgenceClient(agenceClient);
        c.setAgenceClientFiche(agenceFiche);
        return c;
    }

    @Test
    @DisplayName("l'agent ouvre chez lui pour un client d'ailleurs")
    void agentChezLui() {
        assertEquals(AGENT_CHEZ_LUI, CompteHorsAgenceVerdict.situation("334", "334", "336"));
    }

    @Test
    @DisplayName("l'agent est de l'agence du client mais ouvre ailleurs")
    void agentDuClient() {
        assertEquals(AGENT_DU_CLIENT, CompteHorsAgenceVerdict.situation("336", "334", "336"));
    }

    @Test
    @DisplayName("agent, compte et client dans trois agences")
    void troisAgences() {
        assertEquals(TROIS_AGENCES, CompteHorsAgenceVerdict.situation("101", "334", "336"));
    }

    @Test
    @DisplayName("un usager sans agence, meme quand son code finit par des chiffres")
    void agentSansAgence() {
        // ebanking ne remonte l'agence que si elle existe dans CF_AGENCIAS : ADMIN001 arrive null
        assertEquals(AGENT_SANS_AGENCE, CompteHorsAgenceVerdict.situation(null, "334", "336"));
        assertEquals(AGENT_SANS_AGENCE, CompteHorsAgenceVerdict.situation("  ", "334", "336"));
    }

    @Test
    @DisplayName("la priorite du script est respectee : chez lui avant du client")
    void prioriteChezLuiAvantDuClient() {
        // Si l'agent est a la fois de l'agence du compte et du client, les agences sont egales
        // et il n'y aurait pas d'anomalie ; mais le CASE du script tranche « chez lui » d'abord.
        assertEquals(AGENT_CHEZ_LUI, CompteHorsAgenceVerdict.situation("334", "334", "334"));
    }

    @Test
    @DisplayName("la fiche client qui porte l'agence du compte signe un transfert, pas une anomalie")
    void transfertNEstPasUneAnomalie() {
        assertFalse(CompteHorsAgenceVerdict.estAnomalie(compte("334", "334", "336", "334")),
                "client transfere dans l'agence du compte : rien a corriger");
        assertTrue(CompteHorsAgenceVerdict.estAnomalie(compte("334", "334", "336", "336")),
                "la fiche confirme l'agence d'origine : l'anomalie tient");
        assertTrue(CompteHorsAgenceVerdict.estAnomalie(compte("334", "334", "336", null)),
                "sans agence sur la fiche, la regle des trois chiffres s'applique seule");
        assertFalse(CompteHorsAgenceVerdict.estAnomalie(compte("334", "336", "336", null)),
                "compte et client dans la meme agence : jamais une anomalie");
    }

    @Test
    @DisplayName("chaque situation a un libelle lisible")
    void libelles() {
        for (String s : new String[]{AGENT_CHEZ_LUI, AGENT_DU_CLIENT, TROIS_AGENCES, AGENT_SANS_AGENCE}) {
            assertFalse(CompteHorsAgenceVerdict.libelle(s).isBlank(), s);
            assertFalse(CompteHorsAgenceVerdict.libelle(s).equals(s), s + " doit etre traduit");
        }
    }
}
