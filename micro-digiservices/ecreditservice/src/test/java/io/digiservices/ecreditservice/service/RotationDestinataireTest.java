package io.digiservices.ecreditservice.service;

import io.digiservices.ecreditservice.exception.ApiException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static io.digiservices.ecreditservice.service.RotationTransfertService.verifierDestinataire;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * A qui la charge d'un agent qui part peut aller.
 *
 * <p>La regle d'origine — « un agent de credit du meme point de service », et rien d'autre —
 * n'avait pas de porte de sortie pour un point de service tenu par un SEUL agent de credit. Le
 * 03/11/2026, la rotation de Loua Appolinaire, seul agent de For&eacute;cariah (103), partant pour
 * Kindia (121), etait impossible : la liste des destinataires revenait vide et l'ecran conseillait
 * de demander au directeur d'agence de reattribuer les dossiers — qui butait sur la meme absence
 * de destinataire.</p>
 *
 * <p>La charge reste donc sur son point de service tant que quelqu'un y sert, et s'elargit a
 * l'agence sinon. Jamais au-dela : hors de l'agence, plus personne ne peut reattribuer ces
 * dossiers.</p>
 */
class RotationDestinataireTest {

    private static final String PS = "Forécariah (103)";
    private static final String AGENCE = "Kindia";

    @Test
    @DisplayName("le meme point de service passe toujours")
    void memePointDeService() {
        assertDoesNotThrow(() -> verifierDestinataire(true, true, true, PS, AGENCE));
        // Meme si le destinataire etait rattache a une autre agence : c'est le point de service
        // qui compte, et ils le partagent.
        assertDoesNotThrow(() -> verifierDestinataire(true, true, false, PS, AGENCE));
    }

    @Test
    @DisplayName("tant qu'un agent sert le point de service, la charge y reste")
    void unAutreAgentSertLePs() {
        ApiException e = assertThrows(ApiException.class,
                () -> verifierDestinataire(false, true, true, PS, AGENCE));
        assertTrue(e.getMessage().contains("meme point de service"), e.getMessage());
        assertTrue(e.getMessage().contains(PS), "le message doit nommer le point de service");
    }

    @Test
    @DisplayName("sans agent sur le point de service, un agent de l'agence est accepte")
    void elargissementALAgence() {
        assertDoesNotThrow(() -> verifierDestinataire(false, false, true, PS, AGENCE));
    }

    @Test
    @DisplayName("la charge ne sort jamais de l'agence")
    void jamaisHorsDeLAgence() {
        ApiException e = assertThrows(ApiException.class,
                () -> verifierDestinataire(false, false, false, PS, AGENCE));
        assertTrue(e.getMessage().contains("meme agence"), e.getMessage());
        assertTrue(e.getMessage().contains(AGENCE), "le message doit nommer l'agence");
    }
}
