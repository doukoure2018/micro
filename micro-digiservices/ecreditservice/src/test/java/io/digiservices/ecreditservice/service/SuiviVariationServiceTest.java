package io.digiservices.ecreditservice.service;

import io.digiservices.clients.domain.User;
import io.digiservices.ecreditservice.dto.PhotoEcartDtos.SuiviChangement;
import io.digiservices.ecreditservice.dto.PhotoEcartDtos.SuiviCreation;
import io.digiservices.ecreditservice.dto.PhotoEcartDtos.SuiviDto;
import io.digiservices.ecreditservice.exception.ApiException;
import io.digiservices.ecreditservice.repository.SuiviVariationRepository;
import io.digiservices.ecreditservice.service.PerimetreSafService.Perimetre;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static io.digiservices.ecreditservice.service.SuiviVariationService.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * Le suivi de correction (V220) : qui ecrit, quels etats se posent a la main, et comment la
 * photo confirme ou renvoie une correction.
 */
class SuiviVariationServiceTest {

    private final SuiviVariationRepository repository = Mockito.mock(SuiviVariationRepository.class);
    private final PerimetreSafService perimetreService = Mockito.mock(PerimetreSafService.class);
    private final HabilitationService habilitations = Mockito.mock(HabilitationService.class);
    private final SuiviVariationService service = new SuiviVariationService(repository, perimetreService, habilitations);

    private static User user(String role, String service) {
        User u = new User();
        u.setUserId(42L);
        u.setFirstName("Aminata");
        u.setLastName("Camara");
        u.setRole(role);
        u.setService(service);
        return u;
    }

    private void connecte(User u, boolean peutEcrire) {
        when(perimetreService.perimetreDe(anyString())).thenReturn(new Perimetre(true, Set.of(), "RESEAU", u));
        when(habilitations.peut(anyString(), eq(HabilitationService.SUIVI_ECARTS))).thenReturn(peutEcrire);
    }

    private static SuiviCreation creation(String etat) {
        return new SuiviCreation("COMPTES", "612", "CAISSE DE BOFFA", "24100000004",
                LocalDate.of(2026, 11, 24), LocalDate.of(2026, 11, 23),
                new BigDecimal("-61399500"), new BigDecimal("-75000000"), new BigDecimal("-13600500"),
                etat, "frais automatiques sans ecriture", "35/03", null, null);
    }

    private static SuiviDto fiche(long id, String etat, String ecartRef, LocalDateTime corrigeeLe, LocalDate jourDernier, int sansEffet) {
        return new SuiviDto(id, "COMPTES", "612", "CAISSE DE BOFFA", "24100000004",
                LocalDate.of(2026, 11, 24), LocalDate.of(2026, 11, 23),
                new BigDecimal(ecartRef), new BigDecimal("-75000000"), new BigDecimal("-13600500"),
                etat, null, null, "ASI-1234", "Aminata Camara", null, null, null, corrigeeLe, jourDernier, null,
                sansEffet, null, null, null);
    }

    @Test
    @DisplayName("sans la rubrique SUIVI_ECARTS, on lit mais on n'ecrit pas")
    void rubriqueExigee() {
        connecte(user("MANAGER", "DE"), false);
        assertThrows(ApiException.class, () -> service.ouvrir("uuid", creation(null)));
        verify(repository, never()).creer(any(), anyString(), anyLong());
    }

    @Test
    @DisplayName("ouvrir une fiche : A_INSTRUIRE par defaut, journal « fiche ouverte »")
    void ouvrir() {
        connecte(user("MANAGER", "DSIG"), true);
        when(repository.vivante("COMPTES", "612", "24100000004")).thenReturn(Optional.empty());
        when(repository.creer(any(), eq(A_INSTRUIRE), eq(42L))).thenReturn(7L);
        when(repository.parId(7L)).thenReturn(Optional.of(fiche(7, A_INSTRUIRE, "-61399500", null, null, 0)));
        SuiviDto f = service.ouvrir("uuid", creation(null));
        assertEquals(7L, f.id());
        verify(repository).journaliser(eq(7L), eq(A_INSTRUIRE), eq("fiche ouverte"), eq(42L), eq("Aminata Camara"));
    }

    @Test
    @DisplayName("une fiche vivante existe : la nouvelle variation la rafraichit, aucune seconde fiche")
    void uneFicheVivanteParCouple() {
        connecte(user("MANAGER", "DSIG"), true);
        when(repository.vivante("COMPTES", "612", "24100000004"))
                .thenReturn(Optional.of(fiche(3, EXPLIQUEE, "-61399500", null, null, 0)));
        when(repository.parId(3L)).thenReturn(Optional.of(fiche(3, EXPLIQUEE, "-61399500", null, null, 0)));
        service.ouvrir("uuid", creation("EXPLIQUEE"));
        verify(repository, never()).creer(any(), anyString(), anyLong());
        verify(repository).rafraichirConstat(eq(3L), any(), eq(42L));
    }

    @Test
    @DisplayName("CONFIRMEE ne se pose pas a la main ; STRUCTUREL revient a la Direction financiere")
    void etatsReserves() {
        assertThrows(ApiException.class, () -> etatSaisi("CONFIRMEE", user("MANAGER", "DF")));
        assertThrows(ApiException.class, () -> etatSaisi("STRUCTUREL", user("MANAGER", "DSIG")));
        assertEquals(STRUCTUREL, etatSaisi("structurel", user("MANAGER", "DF")));
        assertEquals(STRUCTUREL, etatSaisi("STRUCTUREL", user("SUPER_ADMIN", "DSIG")));
        assertEquals(A_INSTRUIRE, etatSaisi(null, user("MANAGER", "DSIG")));
        assertThrows(ApiException.class, () -> etatSaisi("FERMEE", user("MANAGER", "DSIG")));
    }

    @Test
    @DisplayName("« corrigee dans SAF » exige la reference de l'ecriture")
    void corrigeeExigeReference() {
        connecte(user("MANAGER", "DF"), true);
        SuiviDto sansReference = new SuiviDto(5L, "COMPTES", "612", null, "24100000004", LocalDate.now(), LocalDate.now(),
                BigDecimal.ZERO, BigDecimal.ONE, BigDecimal.ONE, EXPLIQUEE, null, null, null,
                null, null, null, null, null, null, null, 0, null, null, null);
        when(repository.parId(5L)).thenReturn(Optional.of(sansReference));
        assertThrows(ApiException.class, () -> service.changer("uuid", 5L,
                new SuiviChangement(CORRIGEE_SAF, null, null, "  ", null)));
        when(repository.parId(5L)).thenReturn(Optional.of(sansReference), Optional.of(sansReference));
        assertDoesNotThrow(() -> service.changer("uuid", 5L,
                new SuiviChangement(CORRIGEE_SAF, null, null, "ASI-2026-118", "regularisation passee")));
    }

    @Test
    @DisplayName("une fiche confirmee ne se modifie plus")
    void confirmeeFigee() {
        connecte(user("MANAGER", "DSIG"), true);
        when(repository.parId(9L)).thenReturn(Optional.of(fiche(9, CONFIRMEE, "0", null, null, 0)));
        assertThrows(ApiException.class, () -> service.changer("uuid", 9L, new SuiviChangement(EXPLIQUEE, null, null, null, null)));
    }

    @Test
    @DisplayName("revenue : a zero, ou au niveau d'avant la variation, en valeur absolue")
    void revenue() {
        assertTrue(SuiviVariationService.revenue(BigDecimal.ZERO, new BigDecimal("-61399500")));
        assertTrue(SuiviVariationService.revenue(new BigDecimal("-61399500"), new BigDecimal("-61399500")));
        assertTrue(SuiviVariationService.revenue(new BigDecimal("61000000"), new BigDecimal("-61399500")));
        assertFalse(SuiviVariationService.revenue(new BigDecimal("-75000000"), new BigDecimal("-61399500")));
        assertFalse(SuiviVariationService.revenue(new BigDecimal("1"), BigDecimal.ZERO));
    }

    @Test
    @DisplayName("la photo du lendemain confirme ; deux photos sans effet renvoient a « a instruire »")
    void verificationParLaPhoto() {
        LocalDateTime corrigee = LocalDateTime.of(2026, 11, 24, 10, 0);
        when(repository.aVerifier("COMPTES")).thenReturn(List.of(
                fiche(1, CORRIGEE_SAF, "-61399500", corrigee, null, 0),       // revenue : confirmee
                fiche(2, CORRIGEE_SAF, "-61399500", corrigee, null, 1),       // toujours la : 2e photo sans effet
                fiche(3, CORRIGEE_SAF, "-61399500", corrigee, null, 0),       // PS non lu : rien
                fiche(4, CORRIGEE_SAF, "-61399500", LocalDateTime.of(2026, 11, 25, 9, 0), null, 0))); // corrigee le jour meme : trop tot
        LocalDate jour = LocalDate.of(2026, 11, 25);
        when(repository.ecartDansPhoto("COMPTES", jour, "612", "24100000004"))
                .thenReturn(Optional.of(new BigDecimal("-61399500")))
                .thenReturn(Optional.of(new BigDecimal("-75000000")))
                .thenReturn(Optional.empty());

        assertEquals(2, service.verifierApresPhoto("COMPTES", jour));
        verify(repository).noterVerification(1L, jour, new BigDecimal("-61399500"), true, false);
        verify(repository).journaliser(eq(1L), eq(CONFIRMEE), anyString(), isNull(), eq("photo du 2026-11-25"));
        verify(repository).noterVerification(2L, jour, new BigDecimal("-75000000"), false, true);
        verify(repository).journaliser(eq(2L), eq(A_INSTRUIRE), contains("sans effet"), isNull(), eq("photo du 2026-11-25"));
        verify(repository, never()).noterVerification(eq(3L), any(), any(), anyBoolean(), anyBoolean());
        verify(repository, never()).noterVerification(eq(4L), any(), any(), anyBoolean(), anyBoolean());
    }

    @Test
    @DisplayName("une erreur de verification ne refuse jamais la photo")
    void verificationNeLevePas() {
        when(repository.aVerifier("DAT")).thenThrow(new IllegalStateException("base indisponible"));
        assertEquals(0, service.verifierApresPhoto("DAT", LocalDate.now()));
    }
}
