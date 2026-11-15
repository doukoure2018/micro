package io.digiservices.ecreditservice.mobile;

import io.digiservices.clients.EbankingPortefeuilleClient;
import io.digiservices.clients.UserClient;
import io.digiservices.clients.domain.User;
import io.digiservices.ecreditservice.exception.ApiException;
import io.digiservices.ecreditservice.mobile.dto.MobileDtos.EquipeVue;
import io.digiservices.ecreditservice.mobile.repository.MobileRepository;
import io.digiservices.ecreditservice.mobile.repository.MobileRepository.AgentDuDirecteur;
import io.digiservices.ecreditservice.mobile.service.MobileService;
import io.digiservices.ecreditservice.repository.PortefeuilleCreditPhotoRepository;
import io.digiservices.ecreditservice.service.FileStorageService;
import io.digiservices.ecreditservice.service.PerimetreSafService;
import io.digiservices.ecreditservice.service.PerimetreSafService.Perimetre;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

/**
 * Le directeur d'agence LIT son equipe, et seulement la sienne.
 *
 * <p>Deux choses se jouent ici. Le perimetre vient du service de la plateforme, celui qui
 * borne deja l'ecran web : un directeur ne reconstitue pas sa liste d'agents, il recoit celle
 * de son agence. Et le silence d'un agent est calcule par le SERVEUR, pas a l'ecran : le seuil
 * appartient a la regle, pas a l'affichage.</p>
 */
class VueDuDirecteurTest {

    private static final String UUID_DIRECTEUR = "uuid-da";

    private final MobileRepository repository = mock(MobileRepository.class);
    private final UserClient userClient = mock(UserClient.class);
    private final EbankingPortefeuilleClient saf = mock(EbankingPortefeuilleClient.class);
    private final PortefeuilleCreditPhotoRepository photoCredit = mock(PortefeuilleCreditPhotoRepository.class);
    private final FileStorageService stockage = mock(FileStorageService.class);
    private final PerimetreSafService perimetres = mock(PerimetreSafService.class);

    @BeforeEach
    void unDirecteurEtSonAgence() {
        compteAvecRole("DA");
        when(perimetres.perimetreDe(anyString()))
                .thenReturn(new Perimetre(false, Set.of("952"), "AGENCE", null));
        when(repository.visitesDeLEquipe(any(), anyInt())).thenReturn(List.of());
    }

    private void compteAvecRole(String role) {
        User u = new User();
        u.setUserId(5L);
        u.setRole(role);
        when(userClient.getUserByUuid(anyString())).thenReturn(u);
    }

    private MobileService service() {
        return new MobileService(repository, userClient, saf, photoCredit, stockage, perimetres,
                mock(io.digiservices.ecreditservice.mobile.service.ExpoPushService.class));
    }

    private static AgentDuDirecteur agent(String nom, OffsetDateTime derniereVisite, int a, int d) {
        return new AgentDuDirecteur(1L, nom, "952", "MATOTO", 90, a + d, derniereVisite, a, 0, 0, d);
    }

    @Test
    @DisplayName("l'agent qui s'est tu est designe par le serveur, pas devine a l'ecran")
    void leSilenceEstCalculeParLeServeur() {
        when(repository.equipe(any(), anyInt())).thenReturn(List.of(
                agent("TRAVAILLE", OffsetDateTime.now().minusDays(1), 4, 1),
                agent("MUET DEPUIS UN MOIS", OffsetDateTime.now().minusDays(30), 1, 0),
                agent("JAMAIS RIEN TRANSMIS", null, 0, 0)));

        EquipeVue vue = service().equipe(UUID_DIRECTEUR);

        assertEquals(3, vue.agents().size());
        assertEquals(2, vue.silencieux().size(), "un mois de silence et aucune visite comptent tous deux");
        assertTrue(vue.silencieux().stream().anyMatch(a -> a.derniereVisiteAt() == null),
                "l'agent qui n'a JAMAIS transmis doit sortir, et en premier");
        assertEquals(7, vue.joursSilence());
    }

    @Test
    @DisplayName("la repartition A-D remonte telle quelle : elle montre celui qui note tout en A")
    void laRepartitionRemonteTelleQuelle() {
        when(repository.equipe(any(), anyInt())).thenReturn(List.of(
                agent("TOUT EN A", OffsetDateTime.now(), 40, 0)));

        var vu = service().equipe(UUID_DIRECTEUR).agents().get(0);

        assertEquals(40, vu.nbA());
        assertEquals(0, vu.nbD());
    }

    @Test
    @DisplayName("un agent de credit n'a pas cette vue, et un rattachement vide la refuse")
    void lesDeuxRefus() {
        compteAvecRole("AGENT_CREDIT");
        assertThrows(ApiException.class, () -> service().equipe(UUID_DIRECTEUR));

        compteAvecRole("DA");
        when(perimetres.perimetreDe(anyString()))
                .thenReturn(new Perimetre(false, Set.of(), "AGENCE", null));
        assertThrows(ApiException.class, () -> service().equipe(UUID_DIRECTEUR));
    }
}
