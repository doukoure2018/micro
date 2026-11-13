package io.digiservices.ecreditservice.mobile;

import io.digiservices.clients.EbankingPortefeuilleClient;
import io.digiservices.clients.UserClient;
import io.digiservices.clients.domain.User;
import io.digiservices.clients.portefeuille.PortefeuilleCreditDto;
import io.digiservices.ecreditservice.mobile.dto.MobileDtos.CreditPortefeuille;
import io.digiservices.ecreditservice.mobile.repository.MobileRepository;
import io.digiservices.ecreditservice.mobile.repository.MobileRepository.IdentiteMembre;
import io.digiservices.ecreditservice.mobile.repository.MobileRepository.VisiteCredit;
import io.digiservices.ecreditservice.mobile.service.MobileService;
import io.digiservices.ecreditservice.repository.PortefeuilleCreditPhotoRepository;
import io.digiservices.ecreditservice.repository.PortefeuilleCreditPhotoRepository.CreditConnu;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * Un agent en brousse ne doit jamais voir une liste de onze chiffres.
 *
 * <p>Le 13/11/2026, l'application mobile affichait le portefeuille de l'agent du 952 SANS AUCUN
 * NOM : la seule source etait SAF, et SAF n'avait pas repondu. L'agent ne pouvait donc pas
 * chercher un societaire par son nom — il n'y avait pas de nom a chercher.</p>
 *
 * <p>Trois sources repondent maintenant, dans cet ordre : SAF a l'instant, le dernier etat connu
 * de chaque credit (V210), et pour le seul nom, ce que digi porte dans ses propres fiches. Ce
 * test tient cet ordre, et tient surtout la regle qui le motive : un montant inconnu reste vide
 * et date, il ne devient jamais zero.</p>
 */
class PortefeuilleHorsSafTest {

    private static final String UUID_AGENT = "uuid-agent";
    private static final String PS = "952";
    private static final long CREDIT = 18966L;
    private static final String MEMBRE = "95240043004";
    private static final OffsetDateTime HIER = OffsetDateTime.now().minusDays(1);

    private final MobileRepository repository = mock(MobileRepository.class);
    private final UserClient userClient = mock(UserClient.class);
    private final EbankingPortefeuilleClient saf = mock(EbankingPortefeuilleClient.class);
    private final PortefeuilleCreditPhotoRepository photo = mock(PortefeuilleCreditPhotoRepository.class);

    /** Un agent, un credit affecte, et rien d'autre : chaque essai pose ensuite SA source. */
    @BeforeEach
    void unAgentUnCredit() {
        User agent = new User();
        agent.setUserId(92L);
        agent.setRole("AGENT_CREDIT");
        when(userClient.getUserByUuid(anyString())).thenReturn(agent);
        when(repository.suiviDesCreditsAffectes(anyLong())).thenReturn(List.of(
                new VisiteCredit(PS, CREDIT, MEMBRE, null, null, null, null)));
        when(repository.pointsDeServiceAffectes(anyLong())).thenReturn(Set.of(PS));
        when(repository.identitesConnues(any())).thenReturn(Map.of());
        when(photo.parCreditDeLAgent(anyLong())).thenReturn(Map.of());
    }

    private MobileService service() {
        return new MobileService(repository, userClient, saf, photo);
    }

    @Test
    @DisplayName("SAF muet : le nom et les montants viennent du dernier etat connu, date")
    void safMuetLeDernierEtatConnuRepond() {
        when(saf.getTousCredits(anyString())).thenThrow(new IllegalStateException("VPN bancaire coupe"));
        when(photo.parCreditDeLAgent(anyLong())).thenReturn(Map.of(PS + "/" + CREDIT,
                new CreditConnu(PS, CREDIT, MEMBRE, "CAMARA MAMADOU", "622000000", "AGRICOLE",
                        new BigDecimal("3500000"), new BigDecimal("250000"), 42,
                        LocalDate.now().plusDays(5), new BigDecimal("300000"), HIER)));

        CreditPortefeuille ligne = service().portefeuille(UUID_AGENT).get(0);

        assertEquals("CAMARA MAMADOU", ligne.nomClient(), "le nom du membre ne depend pas du VPN bancaire");
        assertEquals("622000000", ligne.telephone());
        assertEquals(new BigDecimal("3500000"), ligne.encours());
        assertEquals(42, ligne.joursRetard());
        assertEquals(HIER, ligne.montantsAt(), "des chiffres d'hier doivent etre dates comme tels");
        verify(repository, never()).identitesConnues(any());
    }

    @Test
    @DisplayName("SAF muet et aucun etat connu : digi donne le nom, et aucun montant n'est invente")
    void safMuetSansEtatConnuDigiDonneLeNom() {
        when(saf.getTousCredits(anyString())).thenThrow(new IllegalStateException("VPN bancaire coupe"));
        when(repository.identitesConnues(any()))
                .thenReturn(Map.of(MEMBRE, new IdentiteMembre("DIALLO SEKOUBA", "628111111")));

        CreditPortefeuille ligne = service().portefeuille(UUID_AGENT).get(0);

        assertEquals("DIALLO SEKOUBA", ligne.nomClient(), "digi porte la fiche du membre : le nom existe");
        assertEquals("628111111", ligne.telephone());
        assertNull(ligne.encours(), "un encours inconnu reste vide : zero serait un mensonge");
        assertNull(ligne.joursRetard());
        assertNull(ligne.montantsAt(), "sans mesure, aucune date de mesure");
    }

    @Test
    @DisplayName("SAF repond : ses chiffres l'emportent, et sont ranges pour la prochaine coupure")
    void safRepondEtSonEtatEstRange() {
        PortefeuilleCreditDto credit = new PortefeuilleCreditDto();
        credit.setCodAgencia(PS);
        credit.setNumCredito(CREDIT);
        credit.setCodCliente(MEMBRE);
        credit.setNomCliente("BARRY FATOUMATA");
        credit.setTelPrincipal("624222222");
        credit.setDesTipCredito("COMMERCE");
        credit.setMonSaldo(new BigDecimal("1200000"));
        credit.setMntCapImpaye(new BigDecimal("100000"));
        credit.setMntIntImpaye(new BigDecimal("20000"));
        credit.setJoursRetard(7L);
        when(saf.getTousCredits(anyString())).thenReturn(List.of(credit));
        when(photo.parCreditDeLAgent(anyLong())).thenReturn(Map.of(PS + "/" + CREDIT,
                new CreditConnu(PS, CREDIT, MEMBRE, "NOM PERIME", null, "ANCIEN PRODUIT",
                        BigDecimal.ONE, BigDecimal.ZERO, 0, null, null, HIER)));

        CreditPortefeuille ligne = service().portefeuille(UUID_AGENT).get(0);

        assertEquals("BARRY FATOUMATA", ligne.nomClient(), "SAF reste la mesure quand il repond");
        assertEquals(new BigDecimal("1200000"), ligne.encours());
        assertEquals(new BigDecimal("120000"), ligne.montantImpaye(), "l'impaye est capital + interets");
        assertNotNull(ligne.montantsAt());
        verify(photo).ranger(List.of(credit));
    }
}
