package io.digiservices.ecreditservice.mobile;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.digiservices.ecreditservice.mobile.service.ExpoPushService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * L'envoi des notifications poussees, sans reseau : ce qui part, et ce qui ne part pas.
 *
 * <p>Deux regles valent la peine d'etre tenues par un test. Un jeton qui n'a pas la forme
 * d'Expo n'est jamais envoye — un enregistrement rate cote telephone ne doit pas faire
 * grossir chaque envoi d'un destinataire impossible. Et quand le canal est coupe, rien ne
 * part : une plateforme de test qui notifie de vrais telephones serait une faute.</p>
 */
class NotificationApresSynchroTest {

    private ExpoPushService service(boolean actif) {
        ExpoPushService push = new ExpoPushService(new ObjectMapper());
        ReflectionTestUtils.setField(push, "actif", actif);
        ReflectionTestUtils.setField(push, "timeoutSecondes", 1);
        return push;
    }

    @Test
    @DisplayName("canal coupe : rien ne part, et l'appelant le sait")
    void canalCoupe() {
        ExpoPushService push = service(false);

        assertTrue(!push.estActif());
        assertEquals(0, push.envoyer(List.of("ExponentPushToken[abc]"), "T", "C", Map.of()).envoyes());
    }

    @Test
    @DisplayName("un jeton qui n'a pas la forme d'Expo n'est meme pas tente")
    void jetonMalForme() {
        ExpoPushService push = service(true);

        // Aucun appel reseau n'est fait : la liste est vide apres filtrage, on rend tout de suite.
        var resultat = push.envoyer(List.of("pas-un-jeton", "", "null"), "T", "C", Map.of());

        assertEquals(0, resultat.envoyes());
        assertTrue(resultat.jetonsMorts().isEmpty(),
                "un jeton mal forme n'est pas un jeton mort : il n'a jamais existe");
    }

    @Test
    @DisplayName("aucun appareil : aucun envoi, aucune exception")
    void aucunAppareil() {
        ExpoPushService push = service(true);

        assertEquals(0, push.envoyer(List.of(), "T", "C", Map.of()).envoyes());
        assertEquals(0, push.envoyer(null, "T", "C", Map.of()).envoyes());
    }
}
