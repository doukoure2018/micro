package io.digiservices.ecreditservice.mobile;

import io.digiservices.clients.EbankingPortefeuilleClient;
import io.digiservices.clients.UserClient;
import io.digiservices.clients.domain.User;
import io.digiservices.ecreditservice.exception.ApiException;
import io.digiservices.ecreditservice.mobile.repository.MobileRepository;
import io.digiservices.ecreditservice.mobile.service.MobileService;
import io.digiservices.ecreditservice.repository.PortefeuilleCreditPhotoRepository;
import io.digiservices.ecreditservice.service.FileStorageService;
import io.digiservices.ecreditservice.service.PerimetreSafService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * Un telephone qui se declare : ce que la base accepte de recevoir.
 *
 * <p>Ce test existe a cause d'une panne du 17/11/2026, la premiere fois qu'un vrai telephone
 * a tente de se declarer. React Native dit {@code android} en minuscules ; la table, elle,
 * n'accepte que {@code ANDROID} (V209). L'appareil avait bien obtenu son jeton Expo, le
 * serveur l'a bien recu — et la ligne a ete refusee par la contrainte. Resultat : aucun
 * appareil enregistre, aucune notification possible, et rien de visible nulle part sauf une
 * table restee vide.</p>
 *
 * <p>La normalisation est faite cote SERVEUR et non dans l'application : un telephone deja
 * installe ne se corrige pas a distance.</p>
 */
class DeclarationAppareilTest {

    private static final String UUID_AGENT = "uuid-agent";
    private static final long AGENT = 724L;
    private static final String JETON = "ExponentPushToken[9d2YQTI8zVFmGaLWoS0zxZ]";

    private final MobileRepository repository = mock(MobileRepository.class);
    private final UserClient userClient = mock(UserClient.class);

    @BeforeEach
    void unAgentDeCredit() {
        User agent = new User();
        agent.setUserId(AGENT);
        agent.setRole("AGENT_CREDIT");
        when(userClient.getUserByUuid(anyString())).thenReturn(agent);
        when(repository.declarerAppareil(anyLong(), anyString(), anyString(), any(), any()))
                .thenReturn(1L);
    }

    private MobileService service() {
        return new MobileService(repository, userClient, mock(EbankingPortefeuilleClient.class),
                mock(PortefeuilleCreditPhotoRepository.class), mock(FileStorageService.class),
                mock(PerimetreSafService.class),
                mock(io.digiservices.ecreditservice.notification.NotificationMobileService.class),
                mock(io.digiservices.ecreditservice.dossier.DossierAgentRepository.class));
    }

    @Test
    @DisplayName("« android » est range en ANDROID : c'est ce que la contrainte exige")
    void androidEnMajuscules() {
        service().declarerAppareil(UUID_AGENT, JETON, "android", "SM-A175F", "1.0.0");

        verify(repository).declarerAppareil(eq(AGENT), eq(JETON), eq("ANDROID"),
                eq("SM-A175F"), eq("1.0.0"));
    }

    @Test
    @DisplayName("« ios » est range en IOS, et un iPhone reste un IOS")
    void iosEnMajuscules() {
        service().declarerAppareil(UUID_AGENT, JETON, "ios", null, null);
        service().declarerAppareil(UUID_AGENT, JETON, "iPhone", null, null);

        verify(repository, org.mockito.Mockito.times(2))
                .declarerAppareil(anyLong(), anyString(), eq("IOS"), any(), any());
    }

    @Test
    @DisplayName("une plateforme inconnue est refusee tout de suite, pas par la base")
    void plateformeInconnueRefusee() {
        assertEquals("Plateforme d'appareil inconnue : windows",
                assertThrows(ApiException.class, () ->
                        service().declarerAppareil(UUID_AGENT, JETON, "windows", null, null))
                        .getMessage());

        verify(repository, never()).declarerAppareil(anyLong(), anyString(), anyString(),
                any(), any());
    }

    @Test
    @DisplayName("un jeton entoure d'espaces est range sans elles : il sert de cle unique")
    void leJetonEstEbarbe() {
        service().declarerAppareil(UUID_AGENT, "  " + JETON + "  ", "android", null, null);

        verify(repository).declarerAppareil(anyLong(), eq(JETON), anyString(), any(), any());
    }

    @Test
    @DisplayName("sans jeton, rien n'est range")
    void sansJetonRienNEstRange() {
        assertThrows(ApiException.class, () ->
                service().declarerAppareil(UUID_AGENT, "   ", "android", null, null));

        verify(repository, never()).declarerAppareil(anyLong(), anyString(), anyString(),
                any(), any());
    }
}
