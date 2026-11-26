package io.digiservices.ecreditservice.service;

import io.digiservices.ecreditservice.dto.PhotoEcartDtos.LigneRecue;
import io.digiservices.ecreditservice.dto.PhotoEcartDtos.PhotoRecue;
import io.digiservices.ecreditservice.dto.PhotoEcartDtos.PointJour;
import io.digiservices.ecreditservice.exception.ApiException;
import io.digiservices.ecreditservice.repository.PhotoEcartRepository;
import io.digiservices.ecreditservice.service.PerimetreSafService.Perimetre;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mockito;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

/**
 * La photo quotidienne des ecarts (V217) : ce qui est accepte, ce qui est refuse, et ce que
 * chacun a le droit de lire.
 *
 * <p>Ce qui est protege ici : une photo sans jour, sans module connu ou sans ecart ne rentre
 * pas ; une photo datee du futur non plus, parce qu'elle viendrait d'une horloge deréglée et
 * fausserait la courbe. Un point de service hors perimetre ne se lit pas, et la fenetre de la
 * courbe est bornee pour que personne ne demande dix ans de jours.</p>
 */
class PhotoEcartServiceTest {

    private final PhotoEcartRepository repository = Mockito.mock(PhotoEcartRepository.class);
    private final PerimetreSafService perimetreService = Mockito.mock(PerimetreSafService.class);
    private final HabilitationService habilitations = Mockito.mock(HabilitationService.class);
    private final SuiviVariationService suivi = Mockito.mock(SuiviVariationService.class);
    private final PhotoEcartService service =
            new PhotoEcartService(repository, perimetreService, habilitations, suivi);

    private static final String UUID_DSIG = "uuid-dsig";

    private void reseau() {
        when(perimetreService.perimetreDe(anyString()))
                .thenReturn(new Perimetre(true, Set.of(), "RESEAU", null));
    }

    private void agence(String... codes) {
        when(perimetreService.perimetreDe(anyString()))
                .thenReturn(new Perimetre(false, Set.of(codes), "AGENCE", null));
    }

    private static PhotoRecue photo(LocalDate jour, String module, BigDecimal ecart) {
        return new PhotoRecue(jour, module, 2026, 11, ecart,
                new BigDecimal("1641471534"), new BigDecimal("-1565971664"),
                13, 5, 8, 185, 185, null, "tache planifiee",
                List.of(new LigneRecue("612", "CAISSE DE BOFFA", "61", "BOFFA", "6", "BASSE GUINEE",
                        "", null, 3688, ecart, null, null, "ECART", null)), null);
    }

    @Test
    @DisplayName("une photo complete est rangee et son identifiant rendu")
    void photoAcceptee() {
        when(repository.enregistrer(any())).thenReturn(42L);
        assertEquals(42L, service.recevoir(photo(LocalDate.now(), "COMPTES", new BigDecimal("134477192.19"))));

        ArgumentCaptor<PhotoRecue> captee = ArgumentCaptor.forClass(PhotoRecue.class);
        verify(repository).enregistrer(captee.capture());
        assertEquals("COMPTES", captee.getValue().module());
        assertEquals(1, captee.getValue().lignes().size());
    }

    @Test
    @DisplayName("sans jour, sans module connu ou sans ecart, la photo est refusee")
    void photoRefusee() {
        assertThrows(ApiException.class, () -> service.recevoir(null));
        assertThrows(ApiException.class,
                () -> service.recevoir(photo(null, "COMPTES", BigDecimal.ONE)));
        assertThrows(ApiException.class,
                () -> service.recevoir(photo(LocalDate.now(), "MOUVEMENTS", BigDecimal.ONE)));
        assertThrows(ApiException.class,
                () -> service.recevoir(photo(LocalDate.now(), null, BigDecimal.ONE)));
        assertThrows(ApiException.class,
                () -> service.recevoir(photo(LocalDate.now(), "COMPTES", null)));
        verifyNoInteractions(repository);
    }

    @Test
    @DisplayName("une photo datee du futur est refusee, un jour de marge pour les fuseaux")
    void photoDuFutur() {
        when(repository.enregistrer(any())).thenReturn(1L);
        // Demain passe : le poste peut etre en avance de quelques heures sur le serveur.
        assertDoesNotThrow(() -> service.recevoir(
                photo(LocalDate.now().plusDays(1), "COMPTES", BigDecimal.TEN)));
        ApiException e = assertThrows(ApiException.class, () -> service.recevoir(
                photo(LocalDate.now().plusDays(2), "COMPTES", BigDecimal.TEN)));
        assertTrue(e.getMessage().contains("horloge"), e.getMessage());
    }

    @Test
    @DisplayName("un ecart nul est une photo valable : la concordance se suit aussi")
    void ecartNulAccepte() {
        when(repository.enregistrer(any())).thenReturn(7L);
        assertEquals(7L, service.recevoir(photo(LocalDate.now(), "DAT", BigDecimal.ZERO)));
    }

    @Test
    @DisplayName("la fenetre de la courbe a un defaut et un plafond")
    void fenetreBornee() {
        reseau();
        when(repository.courbe(anyString(), anyInt())).thenReturn(List.of());
        service.courbe(UUID_DSIG, "COMPTES", null);
        service.courbe(UUID_DSIG, "comptes", 0);
        service.courbe(UUID_DSIG, "COMPTES", 9999);
        service.courbe(UUID_DSIG, "COMPTES", 7);

        verify(repository, times(2)).courbe("COMPTES", PhotoEcartService.JOURS_COURBE);
        verify(repository).courbe("COMPTES", PhotoEcartService.JOURS_MAX);
        verify(repository).courbe("COMPTES", 7);
    }

    @Test
    @DisplayName("sans la rubrique, l'ecran est ferme avant meme de regarder le perimetre")
    void rubriqueExigee() {
        reseau();
        doThrow(new ApiException("Ecran non autorise")).when(habilitations)
                .exigerUneDe(anyString(), any(String[].class));
        assertThrows(ApiException.class, () -> service.courbe(UUID_DSIG, "COMPTES", 30));
        assertThrows(ApiException.class, () -> service.situation(UUID_DSIG, "COMPTES", null));
        assertThrows(ApiException.class, () -> service.joursConnus(UUID_DSIG, "COMPTES"));
        assertThrows(ApiException.class, () -> service.comptesDuPoint(UUID_DSIG, "COMPTES", null, "612"));
        verifyNoInteractions(repository);
    }

    @Test
    @DisplayName("la rubrique des ecarts et celle de l'Audit ouvrent toutes deux l'ecran")
    void deuxRubriquesOuvrent() {
        reseau();
        when(repository.courbe(anyString(), anyInt())).thenReturn(List.of());
        service.courbe(UUID_DSIG, "COMPTES", 30);
        verify(habilitations).exigerUneDe(UUID_DSIG, "EVOLUTION_ECARTS", "AUDIT_CAISSE");
    }

    @Test
    @DisplayName("un module inconnu est refuse a la lecture comme a l'ecriture")
    void moduleInconnuALaLecture() {
        reseau();
        assertThrows(ApiException.class, () -> service.courbe(UUID_DSIG, "CAISSE", 30));
        assertThrows(ApiException.class, () -> service.joursConnus(UUID_DSIG, ""));
        verifyNoInteractions(repository);
    }

    @Test
    @DisplayName("le reseau voit toutes les lignes, une agence seulement les siennes")
    void perimetreApplique() {
        PointJour jour = new PointJour(LocalDate.now(), "COMPTES", new BigDecimal("134477192.19"),
                null, null, 13, 5, 8, 185, 185, true, null, null);
        when(repository.photo(eq("COMPTES"), any())).thenReturn(jour);
        when(repository.pointsDuJour(anyString(), any(), any())).thenReturn(List.of());

        reseau();
        service.situation(UUID_DSIG, "COMPTES", null);
        // Tout le reseau : aucun filtre de points de service n'est transmis au depot.
        verify(repository).pointsDuJour("COMPTES", jour.jour(), null);

        agence("612", "613");
        service.situation("uuid-da", "COMPTES", null);
        ArgumentCaptor<List<String>> codes = ArgumentCaptor.forClass(List.class);
        verify(repository, atLeastOnce()).pointsDuJour(anyString(), any(), codes.capture());
        assertEquals(Set.of("612", "613"), Set.copyOf(codes.getValue()));
    }

    @Test
    @DisplayName("sans photo, la situation est vide et ne cherche aucune ligne")
    void situationSansPhoto() {
        reseau();
        when(repository.photo(anyString(), any())).thenReturn(null);
        var situation = service.situation(UUID_DSIG, "COMPTES", null);
        assertNull(situation.photo());
        assertTrue(situation.points().isEmpty());
        verify(repository, never()).pointsDuJour(anyString(), any(), any());
    }

    @Test
    @DisplayName("un point de service hors perimetre ne se lit pas, et un point vide non plus")
    void pointHorsPerimetre() {
        agence("612");
        assertDoesNotThrow(() -> service.comptesDuPoint("uuid-da", "COMPTES", null, "612"));
        assertThrows(ApiException.class,
                () -> service.comptesDuPoint("uuid-da", "COMPTES", null, "951"));
        assertThrows(ApiException.class,
                () -> service.seriePoint("uuid-da", "COMPTES", "951", 30));
        assertThrows(ApiException.class,
                () -> service.comptesDuPoint("uuid-da", "COMPTES", null, "  "));
    }
}
