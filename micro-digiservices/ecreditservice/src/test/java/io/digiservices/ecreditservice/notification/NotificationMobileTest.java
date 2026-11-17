package io.digiservices.ecreditservice.notification;

import io.digiservices.ecreditservice.mobile.repository.MobileRepository;
import io.digiservices.ecreditservice.mobile.service.ExpoPushService;
import io.digiservices.ecreditservice.notification.NotificationMobile.APublier;
import io.digiservices.ecreditservice.notification.NotificationMobileRepository.PromessesDues;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * Le journal des notifications : ce qui est range, ce qui est pousse, et ce qui survit a un echec.
 *
 * <p>Une notification poussee s'efface d'un balayage, n'arrive pas si le telephone est eteint
 * et disparait a la reinstallation. Le centre de notifications de la maquette du 12/11 suppose
 * donc qu'elle soit RANGEE : le push annonce, le journal conserve. Ces essais tiennent cette
 * promesse — et surtout le cas qui compte, celui ou l'envoi echoue.</p>
 */
class NotificationMobileTest {

    private static final long AGENT = 92L;

    private final NotificationMobileRepository repository = mock(NotificationMobileRepository.class);
    private final MobileRepository mobile = mock(MobileRepository.class);
    private final ExpoPushService push = mock(ExpoPushService.class);

    private final NotificationMobileService service =
            new NotificationMobileService(repository, mobile, push);

    @BeforeEach
    void unAgentAvecUnTelephone() {
        when(repository.ranger(anyLong(), anyString(), anyString(), anyString(), any(), any()))
                .thenReturn(7L);
        when(mobile.jetonsActifs(AGENT)).thenReturn(List.of("ExponentPushToken[abc]"));
        when(push.estActif()).thenReturn(true);
        when(push.envoyer(any(), anyString(), anyString(), any()))
                .thenReturn(new ExpoPushService.Resultat(1, List.of()));
    }

    private static APublier alerte() {
        return APublier.de(AGENT, NotificationMobile.PORTEFEUILLE, "Alertes du jour",
                "7 echeances dans 3 jours · 2 nouveaux impayes", "portefeuille");
    }

    @Test
    @DisplayName("on range d'abord, on pousse ensuite, et l'envoi est date")
    void rangeePuisPoussee() {
        assertEquals(7L, service.publier(alerte()));

        verify(repository).ranger(eq(AGENT), eq("PORTEFEUILLE"), eq("Alertes du jour"),
                anyString(), eq("portefeuille"), any());
        verify(push).envoyer(any(), eq("Alertes du jour"), anyString(), any());
        verify(repository).marquerEnvoyee(7L, 1);
    }

    @Test
    @DisplayName("aucun appareil declare : la notification existe quand meme, sans date d'envoi")
    void sansAppareilLaNotificationExisteQuandMeme() {
        when(mobile.jetonsActifs(AGENT)).thenReturn(List.of());

        assertNotNull(service.publier(alerte()), "l'agent doit la retrouver a sa prochaine ouverture");

        verify(repository).ranger(anyLong(), anyString(), anyString(), anyString(), any(), any());
        verify(repository, never()).marquerEnvoyee(anyLong(), anyInt());
    }

    @Test
    @DisplayName("un envoi qui echoue n'efface pas la notification et n'emporte rien")
    void unEnvoiQuiEchoueNEmporteRien() {
        when(push.envoyer(any(), anyString(), anyString(), any()))
                .thenThrow(new IllegalStateException("Expo injoignable"));

        assertEquals(7L, service.publier(alerte()), "le metier est deja fait : rien ne remonte");

        verify(repository, never()).marquerEnvoyee(anyLong(), anyInt());
    }

    @Test
    @DisplayName("un jeton mort est eteint : garde, il ferait grossir chaque envoi indefiniment")
    void leJetonMortEstEteint() {
        when(push.envoyer(any(), anyString(), anyString(), any()))
                .thenReturn(new ExpoPushService.Resultat(0, List.of("ExponentPushToken[abc]")));

        service.publier(alerte());

        verify(mobile).desactiverAppareil("ExponentPushToken[abc]", "JETON_PERIME");
        verify(repository, never()).marquerEnvoyee(anyLong(), anyInt());
    }

    @Test
    @DisplayName("l'ecran a ouvrir voyage avec la notification, pour que le toucher mene quelque part")
    void lEcranVoyageAvecLaNotification() {
        service.publier(alerte());

        ArgumentCaptor<Map<String, Object>> capture = ArgumentCaptor.captor();
        verify(push).envoyer(any(), anyString(), anyString(), capture.capture());
        assertEquals("portefeuille", capture.getValue().get("ecran"));
        assertEquals(7L, capture.getValue().get("notificationId"));
    }

    @Test
    @DisplayName("sans agent, rien n'est range : une notification sans destinataire n'existe pas")
    void sansAgentRienNEstRange() {
        assertNull(service.publier(APublier.de(null, NotificationMobile.DOSSIER, "t", "c", "accueil")));
        assertNull(service.publier((APublier) null));
        verify(repository, never()).ranger(anyLong(), anyString(), anyString(), anyString(), any(), any());
    }

    // ------------------------------------------------------- les promesses à vérifier

    @Test
    @DisplayName("une promesse echue se dit au singulier, deux au pluriel")
    void leCompteSeLitDansLeTitre() {
        when(repository.promessesEchues(30)).thenReturn(List.of(
                new PromessesDues(AGENT, 1), new PromessesDues(44L, 2)));
        when(mobile.jetonsActifs(44L)).thenReturn(List.of("ExponentPushToken[def]"));

        assertEquals(2, service.annoncerLesPromessesAVerifier(30));

        verify(repository).ranger(eq(AGENT), eq("RECOUVREMENT"), eq("1 promesse à vérifier"),
                anyString(), eq("recouvrement"), any());
        verify(repository).ranger(eq(44L), eq("RECOUVREMENT"), eq("2 promesses à vérifier"),
                anyString(), eq("recouvrement"), any());
    }

    @Test
    @DisplayName("deja recu ce matin : la tache rejouee ne notifie pas deux fois")
    void laTacheRejoueeNeNotifiePasDeuxFois() {
        when(repository.promessesEchues(30)).thenReturn(List.of(new PromessesDues(AGENT, 3)));
        when(repository.dejaRecuAujourdhui(AGENT, "RECOUVREMENT")).thenReturn(true);

        assertEquals(0, service.annoncerLesPromessesAVerifier(30));

        verify(repository, never()).ranger(anyLong(), anyString(), anyString(), anyString(),
                any(), any());
    }

    @Test
    @DisplayName("aucune promesse echue : personne n'est derange")
    void aucunePromesseAucuneNotification() {
        when(repository.promessesEchues(30)).thenReturn(List.of());

        assertEquals(0, service.annoncerLesPromessesAVerifier(30));

        verify(push, never()).envoyer(any(), anyString(), anyString(), any());
    }
}
