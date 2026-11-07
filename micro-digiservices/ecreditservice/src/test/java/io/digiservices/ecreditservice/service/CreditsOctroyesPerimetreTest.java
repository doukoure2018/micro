package io.digiservices.ecreditservice.service;

import io.digiservices.clients.UserClient;
import io.digiservices.clients.domain.User;
import io.digiservices.ecreditservice.exception.ApiException;
import io.digiservices.ecreditservice.repository.CreditsOctroyesRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * Qui voit quels credits octroyes.
 *
 * <p>C'est la garde de cet ecran : il porte les noms, les telephones et les montants de tous
 * les dossiers accordes. Le perimetre vient du compte connecte, et les identifiants de descente
 * arrivent par l'adresse de la requete — donc d'un endroit que l'utilisateur peut reecrire. Un
 * directeur d'agence qui remplacerait son identifiant d'agence par celui du voisin ne doit rien
 * obtenir, et c'est ce que ces cas verifient un par un.</p>
 */
class CreditsOctroyesPerimetreTest {

    private static final String UUID_TEST = "uuid-essai";
    private static final long MA_DELEGATION = 3L;
    private static final long MON_AGENCE = 12L;

    private CreditsOctroyesRepository depot;

    private CreditsOctroyesService service(User user) {
        UserClient userClient = mock(UserClient.class);
        when(userClient.getUserByUuid(anyString())).thenReturn(user);
        depot = mock(CreditsOctroyesRepository.class);
        // Par defaut, rien n'appartient a rien : chaque test ouvre explicitement ce qu'il teste.
        when(depot.agenceDansDelegation(anyLong(), anyLong())).thenReturn(false);
        when(depot.posDansAgence(anyLong(), anyLong())).thenReturn(false);
        when(depot.posDansDelegation(anyLong(), anyLong())).thenReturn(false);
        return new CreditsOctroyesService(userClient, depot,
                mock(io.digiservices.clients.EbankingPortefeuilleClient.class),
                mock(io.digiservices.clients.EbankingClient.class),
                mock(io.digiservices.ecreditservice.repository.ConsultationTransactionsRepository.class));
    }

    private static User compte(String role, String serviceRattachement, Long delegationId, Long agenceId) {
        User u = new User();
        u.setUserId(1L);
        u.setRole(role);
        u.setService(serviceRattachement);
        u.setDelegationId(delegationId);
        u.setAgenceId(agenceId);
        return u;
    }

    @Test
    @DisplayName("les directions du siege voient le reseau et descendent jusqu'au point de service")
    void lesDirectionsVoientLeReseau() {
        for (String[] c : new String[][]{{"DG", null}, {"SUPER_ADMIN", null}, {"MANAGER", "DE"},
                {"MANAGER", "DSIG"}, {"MANAGER", "DI"}, {"MANAGER", "DF"}, {"MANAGER", "Audit"}}) {
            var p = service(compte(c[0], c[1], null, null)).perimetreDe(UUID_TEST);
            assertTrue(p.toutReseau(), c[0] + "/" + c[1] + " doit voir le reseau");
            assertEquals(List.of("delegation", "agence", "ps"), p.niveaux());
        }
    }

    @Test
    @DisplayName("le directeur regional part de ses agences, le directeur d'agence de ses points de service")
    void lesNiveauxSuiventLaHierarchie() {
        var dr = service(compte("DR", null, MA_DELEGATION, null)).perimetreDe(UUID_TEST);
        assertEquals("DELEGATION", dr.niveau());
        assertEquals(List.of("agence", "ps"), dr.niveaux());

        var da = service(compte("DA", null, MA_DELEGATION, MON_AGENCE)).perimetreDe(UUID_TEST);
        assertEquals("AGENCE", da.niveau());
        assertEquals(List.of("ps"), da.niveaux(),
                "un DA qui verrait le niveau agence n'aurait qu'une ligne : la sienne");
    }

    @Test
    @DisplayName("un compte sans rattachement ou sans role competent est refuse, avec la raison")
    void comptesRefuses() {
        ApiException e = assertThrows(ApiException.class,
                () -> service(compte("DA", null, MA_DELEGATION, null)).perimetreDe(UUID_TEST));
        assertTrue(e.getMessage().contains("rattachement"));

        assertThrows(ApiException.class,
                () -> service(compte("DR", null, null, null)).perimetreDe(UUID_TEST));
        assertThrows(ApiException.class,
                () -> service(compte("AGENT_CREDIT", null, MA_DELEGATION, MON_AGENCE)).perimetreDe(UUID_TEST));
        assertThrows(ApiException.class,
                () -> service(compte("MANAGER", "DRH", null, null)).perimetreDe(UUID_TEST));
        assertThrows(ApiException.class, () -> service(null).perimetreDe(UUID_TEST));
    }

    @Test
    @DisplayName("la delegation d'un DR est la sienne, meme s'il en demande une autre")
    void unDrNeChangePasDeDelegation() {
        var s = service(compte("DR", null, MA_DELEGATION, null));
        var p = s.perimetreDe(UUID_TEST);

        assertEquals(MA_DELEGATION, s.filtre(p, null, null, null, null, null, null).delegationId());
        assertThrows(ApiException.class,
                () -> s.filtre(p, 99L, null, null, null, null, null),
                "demander une autre delegation doit etre refuse, pas ignore en silence");
        // Redemander la sienne est legitime : c'est ce que fait l'ecran en remontant d'un cran.
        assertEquals(MA_DELEGATION, s.filtre(p, MA_DELEGATION, null, null, null, null, null).delegationId());
    }

    @Test
    @DisplayName("une agence hors de la delegation du DR est refusee")
    void uneAgenceEtrangereEstRefusee() {
        var s = service(compte("DR", null, MA_DELEGATION, null));
        var p = s.perimetreDe(UUID_TEST);
        assertThrows(ApiException.class, () -> s.filtre(p, null, 77L, null, null, null, null));

        when(depot.agenceDansDelegation(MON_AGENCE, MA_DELEGATION)).thenReturn(true);
        assertEquals(MON_AGENCE, s.filtre(p, null, MON_AGENCE, null, null, null, null).agenceId());
    }

    @Test
    @DisplayName("un DA reste dans son agence, et dans ses points de service")
    void unDaResteChezLui() {
        var s = service(compte("DA", null, MA_DELEGATION, MON_AGENCE));
        var p = s.perimetreDe(UUID_TEST);

        assertEquals(MON_AGENCE, s.filtre(p, null, null, null, null, null, null).agenceId(),
                "sans rien demander, un DA voit son agence");
        assertThrows(ApiException.class, () -> s.filtre(p, null, 77L, null, null, null, null));
        assertThrows(ApiException.class, () -> s.filtre(p, null, null, 500L, null, null, null),
                "un point de service d'une autre agence doit etre refuse");

        when(depot.posDansAgence(44L, MON_AGENCE)).thenReturn(true);
        assertEquals(44L, s.filtre(p, null, null, 44L, null, null, null).posId());
    }

    @Test
    @DisplayName("le reseau descend sans garde-fou de rattachement, mais le PS doit tenir dans l'agence demandee")
    void leReseauDescendLibrement() {
        var s = service(compte("MANAGER", "DSIG", null, null));
        var p = s.perimetreDe(UUID_TEST);

        var f = s.filtre(p, 5L, null, null, null, null, null);
        assertEquals(5L, f.delegationId());
        assertNull(f.agenceId());

        // Agence seule : elle porte deja sa delegation, inutile de filtrer deux fois.
        var fa = s.filtre(p, 5L, 9L, null, null, null, null);
        assertEquals(9L, fa.agenceId());
        assertNull(fa.delegationId());

        assertThrows(ApiException.class, () -> s.filtre(p, null, 9L, 101L, null, null, null),
                "un PS annonce sous une agence qui ne le porte pas est une incoherence, pas un filtre");
        when(depot.posDansAgence(101L, 9L)).thenReturn(true);
        assertEquals(101L, s.filtre(p, null, 9L, 101L, null, null, null).posId());
    }

    @Test
    @DisplayName("un niveau plus large que son perimetre est refuse")
    void niveauTropLarge() {
        var da = service(compte("DA", null, MA_DELEGATION, MON_AGENCE));
        assertThrows(ApiException.class,
                () -> da.synthese(UUID_TEST, "delegation", null, null, null, null, null, null));
        var dr = service(compte("DR", null, MA_DELEGATION, null));
        assertThrows(ApiException.class,
                () -> dr.synthese(UUID_TEST, "delegation", null, null, null, null, null, null));
    }

    @Test
    @DisplayName("la situation financiere est bornee au dossier, pas au client")
    void laSituationFinanciereEstBorneeAuDossier() {
        var s = service(compte("DA", null, MA_DELEGATION, MON_AGENCE));
        // La garde est posee en base avec le rattachement du compte : le service ne doit jamais
        // appeler SAF avant d'avoir obtenu le numero de membre par ce chemin.
        when(depot.membreDuDossierDansPerimetre(any(), any(), any())).thenReturn(java.util.Optional.empty());
        ApiException e = assertThrows(ApiException.class, () -> s.situationFinanciere(UUID_TEST, 7425L));
        assertTrue(e.getMessage().contains("votre reseau"),
                "un dossier d'une autre agence doit etre refuse sans dire qu'il existe");
        verify(depot).membreDuDossierDansPerimetre(7425L, MA_DELEGATION, MON_AGENCE);
    }

    @Test
    @DisplayName("les directions interrogent sans borne geographique, mais toujours par dossier")
    void lesDirectionsInterrogentParDossier() {
        var s = service(compte("MANAGER", "DSIG", null, null));
        when(depot.membreDuDossierDansPerimetre(any(), any(), any())).thenReturn(java.util.Optional.empty());
        assertThrows(ApiException.class, () -> s.situationFinanciere(UUID_TEST, 7425L));
        verify(depot).membreDuDossierDansPerimetre(eq(7425L), eq(null), eq(null));
    }

    @Test
    @DisplayName("un motif de recherche devient un ILIKE, et le vide reste vide")
    void motifDeRecherche() {
        var s = service(compte("MANAGER", "DSIG", null, null));
        var p = s.perimetreDe(UUID_TEST);
        assertEquals("%Diallo%", s.filtre(p, null, null, null, null, null, "  Diallo  ").motif());
        assertNull(s.filtre(p, null, null, null, null, null, "   ").motif(),
                "une recherche vide ne doit pas filtrer sur une chaine vide");
        assertNull(s.filtre(p, null, null, null, null, null, null).motif());
    }
}
