package io.digiservices.ecreditservice.agri;

import io.digiservices.clients.UserClient;
import io.digiservices.clients.domain.User;
import io.digiservices.ecreditservice.agri.dto.AgriDtos.ParcelleRecue;
import io.digiservices.ecreditservice.agri.dto.AgriDtos.RecolteRecue;
import io.digiservices.ecreditservice.agri.dto.AgriDtos.VisiteCampagneRecue;
import io.digiservices.ecreditservice.agri.repository.AgriRepository;
import io.digiservices.ecreditservice.agri.service.AgriCollecteService;
import io.digiservices.ecreditservice.agri.service.RapprochementAgricole;
import io.digiservices.ecreditservice.mobile.dto.MobileDtos.SortSaisie;
import io.digiservices.ecreditservice.mobile.repository.MobileRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * La collecte agricole : les conversions, la campagne, et les refus qui comptent.
 *
 * <p>Ce lot n'a d'interet que si ses chiffres sont comparables. Trois choses le garantissent,
 * et chacune a son essai : les sacs deviennent des kilogrammes une seule fois et au meme
 * endroit ; une recolte de fevrier appartient a la campagne ouverte l'annee d'avant ; et un
 * ecart ne se calcule JAMAIS contre une prevision absente — un chiffre faux entrerait un jour
 * dans une decision de credit.</p>
 */
class CollecteAgricoleTest {

    private static final String UUID_AGENT = "uuid-agent";

    private final AgriRepository repository = mock(AgriRepository.class);
    private final MobileRepository mobile = mock(MobileRepository.class);
    private final UserClient userClient = mock(UserClient.class);

    private final AgriCollecteService service = new AgriCollecteService(repository, mobile, userClient);

    @BeforeEach
    void unAgentEtSesListes() {
        User agent = new User();
        agent.setUserId(92L);
        agent.setRole("AGENT_CREDIT");
        when(userClient.getUserByUuid(anyString())).thenReturn(agent);
        when(mobile.codesActifs("CULTURE")).thenReturn(Set.of("RIZ", "MAIS"));
        when(mobile.codesActifs("STADE_CAMPAGNE")).thenReturn(Set.of("SEMIS", "RECOLTE"));
        when(mobile.codesActifs("ETAT_CULTURE")).thenReturn(Set.of("BON", "FAIBLE", "PERDU"));
        when(mobile.codesActifs("SINISTRE")).thenReturn(Set.of("INONDATION", "MALADIE"));
        when(repository.idParcelle(anyString())).thenReturn(Optional.empty());
        when(repository.idVisiteCampagne(anyString())).thenReturn(Optional.empty());
        when(repository.idRecolte(anyString())).thenReturn(Optional.empty());
        when(repository.recolteDeLaParcelle(anyLong())).thenReturn(Optional.empty());
        when(repository.enregistrerParcelle(any(), anyString(), anyLong(), any(), any())).thenReturn(1L);
        when(repository.enregistrerVisite(any(), anyLong(), anyLong(), any(), any())).thenReturn(2L);
        when(repository.enregistrerRecolte(any(), anyLong(), any(), anyLong(), any(), any())).thenReturn(3L);
    }

    private static ParcelleRecue parcelle(String culture, BigDecimal surface) {
        return new ParcelleRecue("p-1", "95240043004", "952", 18966L, 4242L, culture, surface,
                "Kipe", null, null, null, LocalDate.of(2026, 6, 15), OffsetDateTime.now());
    }

    @Test
    @DisplayName("les sacs deviennent des kilogrammes, une seule fois et au meme endroit")
    void lesSacsDeviennentDesKilos() {
        assertEquals(0, AgriCollecteService.enKilos(new BigDecimal("12"), "SAC_50")
                .compareTo(new BigDecimal("600")));
        assertEquals(0, AgriCollecteService.enKilos(new BigDecimal("3"), "SAC_100")
                .compareTo(new BigDecimal("300")));
        assertEquals(0, AgriCollecteService.enKilos(new BigDecimal("1.5"), "TONNE")
                .compareTo(new BigDecimal("1500.0")));
        assertNull(AgriCollecteService.enKilos(new BigDecimal("5"), "CHARRETTE"),
                "une unite inconnue ne doit pas produire un poids invente");
    }

    @Test
    @DisplayName("une recolte de fevrier appartient a la campagne ouverte l'annee d'avant")
    void laCampagneBasculeEnAvril() {
        assertEquals("2026-2027", AgriCollecteService.campagneDe(LocalDate.of(2027, 2, 10)));
        assertEquals("2026-2027", AgriCollecteService.campagneDe(LocalDate.of(2026, 6, 15)));
        assertEquals("2027-2028", AgriCollecteService.campagneDe(LocalDate.of(2027, 4, 1)));
        assertEquals("2025-2026", AgriCollecteService.campagneDe(LocalDate.of(2026, 3, 31)));
    }

    @Test
    @DisplayName("un ecart ne se calcule jamais contre une prevision absente ou nulle")
    void lEcartExigeLesDeuxTermes() {
        assertEquals(0, RapprochementAgricole.ecartPct(new BigDecimal("1000"), new BigDecimal("800"))
                .compareTo(new BigDecimal("-20.0")));
        assertNull(RapprochementAgricole.ecartPct(null, new BigDecimal("800")));
        assertNull(RapprochementAgricole.ecartPct(new BigDecimal("1000"), null));
        assertNull(RapprochementAgricole.ecartPct(BigDecimal.ZERO, new BigDecimal("800")),
                "diviser par une prevision nulle donnerait un chiffre sans sens");
        assertNull(RapprochementAgricole.de(null, null, null, null),
                "sans aucun terme, il n'y a pas de rapprochement a montrer");
    }

    @Test
    @DisplayName("une culture faible ou perdue sans cause nommee est refusee")
    void uneCultureDegradeeExigeSaCause() {
        when(repository.idParcelle("p-1")).thenReturn(Optional.of(1L));
        VisiteCampagneRecue sansCause = new VisiteCampagneRecue("v-1", "p-1", "SEMIS", "PERDU",
                null, null, null, null, null, null, null, OffsetDateTime.now());

        SortSaisie sort = service.enregistrerVisite(UUID_AGENT, sansCause, null, null);

        assertEquals(SortSaisie.REFUSEE, sort.sort());
        assertEquals("Une culture faible ou perdue demande sa cause", sort.motif());
    }

    @Test
    @DisplayName("une visite dont la parcelle n'est pas arrivee est un refus TEMPORAIRE")
    void parcellePasEncoreTransmise() {
        VisiteCampagneRecue v = new VisiteCampagneRecue("v-2", "p-inconnue", "SEMIS", "BON",
                null, null, null, null, null, null, null, OffsetDateTime.now());

        SortSaisie sort = service.enregistrerVisite(UUID_AGENT, v, null, null);

        assertEquals("Parcelle pas encore transmise", sort.motif(),
                "le telephone reconnait ce motif et garde la saisie");
        verify(repository, never()).enregistrerVisite(any(), anyLong(), anyLong(), any(), any());
    }

    @Test
    @DisplayName("une seconde recolte sur la meme parcelle est refusee, et ce n'est pas un doublon")
    void uneSeuleRecolteParParcelle() {
        when(repository.idParcelle("p-1")).thenReturn(Optional.of(1L));
        when(repository.recolteDeLaParcelle(1L)).thenReturn(Optional.of(9L));
        RecolteRecue r = new RecolteRecue("r-1", "p-1", new BigDecimal("10"), "SAC_50",
                new BigDecimal("300000"), 80, LocalDate.now(), "Marche de Matoto", null,
                OffsetDateTime.now());

        SortSaisie sort = service.enregistrerRecolte(UUID_AGENT, r, null, null);

        assertEquals(SortSaisie.REFUSEE, sort.sort(),
                "un doublon de transmission se range tout seul ; une seconde recolte est une erreur de saisie");
        assertEquals("Cette parcelle porte deja une recolte", sort.motif());
    }

    @Test
    @DisplayName("culture inconnue et surface aberrante sont refusees en clair")
    void lesRefusDeLaParcelle() {
        assertEquals("Culture inconnue",
                service.declarerParcelle(UUID_AGENT, parcelle("QUINOA", BigDecimal.ONE), null, null).motif());
        assertEquals("Surface hors des bornes (0 a 500 ha)",
                service.declarerParcelle(UUID_AGENT, parcelle("RIZ", new BigDecimal("900")), null, null).motif());
        assertEquals(SortSaisie.ACCEPTEE,
                service.declarerParcelle(UUID_AGENT, parcelle("RIZ", new BigDecimal("2.5")), null, null).sort());
    }
}
