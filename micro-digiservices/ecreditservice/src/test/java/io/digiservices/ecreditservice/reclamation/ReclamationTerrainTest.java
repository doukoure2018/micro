package io.digiservices.ecreditservice.reclamation;

import io.digiservices.clients.UserClient;
import io.digiservices.clients.domain.User;
import io.digiservices.ecreditservice.event.Event;
import io.digiservices.ecreditservice.exception.ApiException;
import io.digiservices.ecreditservice.reclamation.dto.ReclamationDtos.ReclamationRecue;
import io.digiservices.ecreditservice.reclamation.dto.ReclamationDtos.ReclamationVue;
import io.digiservices.ecreditservice.reclamation.dto.ReclamationDtos.SortReclamation;
import io.digiservices.ecreditservice.reclamation.repository.ReclamationRepository;
import io.digiservices.ecreditservice.reclamation.repository.ReclamationRepository.Responsable;
import io.digiservices.ecreditservice.reclamation.service.ReclamationService;
import io.digiservices.ecreditservice.repository.AlerteDestinatairesRepository;
import io.digiservices.ecreditservice.repository.AlerteDestinatairesRepository.Destinataire;
import io.digiservices.ecreditservice.repository.AlerteJournalRepository;
import io.digiservices.ecreditservice.service.HabilitationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.context.ApplicationEventPublisher;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * Les reclamations du terrain : ce qui entre, ce qui part, et ce qui est refuse.
 *
 * <p>Deux choses tiennent ce service. <b>La reclamation est ecrite d'abord, acheminee
 * ensuite</b> : une panne de messagerie ne doit jamais faire disparaitre le signalement d'un
 * agent. Et <b>les destinataires viennent de la rubrique</b>, pas d'une liste dans le code —
 * ajouter une direction se fait dans la matrice d'habilitation.</p>
 */
class ReclamationTerrainTest {

    private static final String UUID_AGENT = "uuid-agent";

    private final ReclamationRepository repository = mock(ReclamationRepository.class);
    private final AlerteDestinatairesRepository destinataires = mock(AlerteDestinatairesRepository.class);
    private final AlerteJournalRepository journal = mock(AlerteJournalRepository.class);
    private final ApplicationEventPublisher publisher = mock(ApplicationEventPublisher.class);
    private final UserClient userClient = mock(UserClient.class);
    private final HabilitationService habilitations = mock(HabilitationService.class);

    private final ReclamationService service =
            new ReclamationService(repository, destinataires, journal, publisher, userClient,
                    habilitations);

    @BeforeEach
    void unAgentEtSixDirections() {
        compte(92L, "AGENT_CREDIT");
        when(repository.idReclamation(anyString())).thenReturn(Optional.empty());
        when(repository.responsable(anyString()))
                .thenReturn(Optional.of(new Responsable("DE", null, "MANAGER", "Recouvrement")));
        when(repository.enregistrer(any(), anyLong(), any(), any())).thenReturn(77L);
        when(repository.parId(77L)).thenReturn(Optional.of(vue("Caisse fermee", "Le guichet est ferme depuis lundi")));
        when(destinataires.porteursParRoleOuDepartement(ReclamationService.RUBRIQUE))
                .thenReturn(List.of(
                        new Destinataire("dg@crg.gn", "DG", List.of(), 1L, null),
                        new Destinataire("de@crg.gn", "DE", List.of(), 2L, null),
                        new Destinataire("audit@crg.gn", "Audit", List.of(), 3L, null)));
    }

    private void compte(Long id, String role) {
        User u = new User();
        u.setUserId(id);
        u.setRole(role);
        when(userClient.getUserByUuid(anyString())).thenReturn(u);
    }

    private static ReclamationVue vue(String objet, String message) {
        return new ReclamationVue(77L, "uuid-1", "RECOUVREMENT", "Recouvrement", objet, message,
                "952", 18966L, "95240043004", "CONDE ALIOUNE", "MATOTO",
                OffsetDateTime.now(), OffsetDateTime.now(), "OUVERTE",
                null, null, null, null, null, false, 0);
    }

    private static ReclamationRecue recue(String objet, String message) {
        return new ReclamationRecue("uuid-1", "RECOUVREMENT", objet, message,
                "952", 18966L, "95240043004", OffsetDateTime.now());
    }

    @Test
    @DisplayName("une reclamation est ecrite PUIS acheminee aux porteurs de la rubrique")
    void ecriteAvantDEtreAcheminee() {
        SortReclamation sort = service.recevoir(UUID_AGENT, recue("Caisse fermee",
                "Le guichet est ferme depuis lundi matin"), 5L, null);

        assertEquals(SortReclamation.ACCEPTEE, sort.sort());
        assertEquals(77L, sort.id());
        verify(publisher, times(3)).publishEvent(any(Event.class));
        verify(repository).marquerNotifiee(77L, 3);
    }

    @Test
    @DisplayName("aucun porteur : la reclamation existe quand meme, et n'est pas datee comme acheminee")
    void aucunDestinataireNePerdPasLaReclamation() {
        when(destinataires.porteursParRoleOuDepartement(anyString())).thenReturn(List.of());

        SortReclamation sort = service.recevoir(UUID_AGENT,
                recue("Objet", "Un message assez long pour passer"), null, null);

        assertEquals(SortReclamation.ACCEPTEE, sort.sort(),
                "une panne de destinataires ne doit pas faire disparaitre le signalement");
        verify(repository, never()).marquerNotifiee(anyLong(), anyInt());
        verify(publisher, never()).publishEvent(any(Event.class));
    }

    @Test
    @DisplayName("un renvoi est un doublon, et rien n'est ecrit ni reexpedie")
    void unRenvoiEstUnDoublon() {
        when(repository.idReclamation("uuid-1")).thenReturn(Optional.of(77L));

        SortReclamation sort = service.recevoir(UUID_AGENT, recue("Objet", "Message assez long"), null, null);

        assertEquals(SortReclamation.DOUBLON, sort.sort());
        verify(repository, never()).enregistrer(any(), anyLong(), any(), any());
        verify(publisher, never()).publishEvent(any(Event.class));
    }

    @Test
    @DisplayName("message trop court, categorie inconnue, date dans le futur : refus en clair")
    void lesTroisRefus() {
        assertEquals("Le message doit faire au moins 10 caracteres",
                service.recevoir(UUID_AGENT, recue("Objet", "court"), null, null).motif());

        when(repository.responsable("INCONNUE")).thenReturn(Optional.empty());
        ReclamationRecue mauvaise = new ReclamationRecue("uuid-2", "INCONNUE", "Objet",
                "Un message assez long pour passer", null, null, null, OffsetDateTime.now());
        assertEquals("Categorie inconnue", service.recevoir(UUID_AGENT, mauvaise, null, null).motif());

        ReclamationRecue futur = new ReclamationRecue("uuid-3", "RECOUVREMENT", "Objet",
                "Un message assez long pour passer", null, null, null,
                OffsetDateTime.now().plusDays(2));
        assertEquals("Date de saisie dans le futur",
                service.recevoir(UUID_AGENT, futur, null, null).motif());
    }

    @Test
    @DisplayName("le texte venu du terrain est echappe : il entre dans un courriel HTML")
    void leTexteDuTerrainEstEchappe() {
        when(repository.parId(77L)).thenReturn(Optional.of(
                vue("<script>alerte()</script>", "Le membre a dit « c'est <b>faux</b> »")));

        service.recevoir(UUID_AGENT, recue("Objet", "Un message assez long pour passer"), null, null);

        ArgumentCaptor<Event> capture = ArgumentCaptor.forClass(Event.class);
        verify(publisher, times(3)).publishEvent(capture.capture());
        String corps = String.valueOf(capture.getValue().getData().get("corpsHtml"));
        assertFalse(corps.contains("<script>"), "un objet venu du terrain ne doit pas devenir du HTML");
        assertTrue(corps.contains("&lt;script&gt;"));
        assertTrue(corps.contains("&lt;b&gt;faux&lt;/b&gt;"));
    }

    @Test
    @DisplayName("qui ne porte pas la rubrique ne traite pas, quel que soit son role")
    void seulsLesPorteursTraitent() {
        // La matrice d'habilitation decide, et elle seule : c'est la barriere serveur habituelle.
        doThrow(new ApiException("Vous n'avez pas accès à cet écran"))
                .when(habilitations).exiger(anyString(), eq(ReclamationService.RUBRIQUE));

        assertThrows(ApiException.class, () -> service.prendreEnCharge(UUID_AGENT, 77L));
        assertThrows(ApiException.class, () -> service.repondre(UUID_AGENT, 77L, "C'est regle"));
        assertThrows(ApiException.class, () -> service.file(UUID_AGENT, null, null, 10));
    }

    @Test
    @DisplayName("un porteur SANS adresse e-mail peut repondre : il ne recoit pas, il traite")
    void unPorteurSansAdresseRepond() {
        compte(2L, "MANAGER");
        // Volontairement absent de la liste des destinataires (elle exige une adresse) :
        // l'autorisation ne doit PAS en dependre.
        when(destinataires.porteursParRoleOuDepartement(anyString())).thenReturn(List.of());
        when(repository.repondre(anyLong(), anyLong(), anyString())).thenReturn(1);

        service.repondre(UUID_AGENT, 77L, "Le guichet a rouvert mardi");

        verify(repository).repondre(eq(77L), eq(2L), anyString());
    }

    @Test
    @DisplayName("une reponse vide est refusee : l'agent doit savoir ce qui lui est repondu")
    void uneReponseVideEstRefusee() {
        compte(2L, "MANAGER");

        assertThrows(ApiException.class, () -> service.repondre(UUID_AGENT, 77L, "  "));
        verify(repository, never()).repondre(anyLong(), anyLong(), anyString());
    }
}
