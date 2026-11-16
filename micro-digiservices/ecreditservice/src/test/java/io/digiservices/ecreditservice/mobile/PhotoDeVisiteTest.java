package io.digiservices.ecreditservice.mobile;

import io.digiservices.clients.EbankingPortefeuilleClient;
import io.digiservices.clients.UserClient;
import io.digiservices.clients.domain.User;
import io.digiservices.ecreditservice.exception.ApiException;
import io.digiservices.ecreditservice.mobile.dto.MobileDtos.SortSaisie;
import io.digiservices.ecreditservice.mobile.repository.MobileRepository;
import io.digiservices.ecreditservice.mobile.repository.MobileRepository.VisiteConnue;
import io.digiservices.ecreditservice.mobile.service.MobileService;
import io.digiservices.ecreditservice.repository.PortefeuilleCreditPhotoRepository;
import io.digiservices.ecreditservice.service.FileStorageService;
import io.digiservices.ecreditservice.service.PerimetreSafService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.time.OffsetDateTime;
import java.util.Optional;

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
 * La photo d'une visite : ce qui entre, ce qui attend, ce qui est refuse pour de bon.
 *
 * <p>Une appreciation D propose le contentieux ; la regle arretee le 12/11 exige la photo du
 * constat. Elle part APRES la visite — le telephone l'envoie seule, et la rejoue tant qu'il
 * n'a pas d'accuse. Trois distinctions tiennent tout : un renvoi est un DOUBLON et non une
 * faute ; une visite pas encore arrivee est un refus TEMPORAIRE, la photo reste en attente ;
 * et la visite d'un autre agent est refusee, car l'identifiant vient du telephone et ne
 * prouve rien par lui-meme.</p>
 */
class PhotoDeVisiteTest {

    private static final String UUID_AGENT = "uuid-agent";
    private static final String PHOTO = "photo-uuid-1";
    private static final String VISITE = "visite-uuid-1";
    private static final long AGENT = 92L;

    private final MobileRepository repository = mock(MobileRepository.class);
    private final UserClient userClient = mock(UserClient.class);
    private final EbankingPortefeuilleClient saf = mock(EbankingPortefeuilleClient.class);
    private final PortefeuilleCreditPhotoRepository photoCredit = mock(PortefeuilleCreditPhotoRepository.class);
    private final FileStorageService stockage = mock(FileStorageService.class);

    @BeforeEach
    void unAgentEtSaVisite() {
        User agent = new User();
        agent.setUserId(AGENT);
        agent.setRole("AGENT_CREDIT");
        when(userClient.getUserByUuid(anyString())).thenReturn(agent);
        when(repository.idPhoto(anyString())).thenReturn(Optional.empty());
        when(repository.visiteConnue(anyString()))
                .thenReturn(Optional.of(new VisiteConnue(7L, AGENT, "D")));
        when(stockage.storeFile(any()))
                .thenReturn("https://test.digi-creditrural-io.com/ecredit/files/abcd-1234.jpg");
        when(repository.enregistrerPhoto(anyString(), anyLong(), anyString(), anyLong(), any()))
                .thenReturn(Optional.of(55L));
    }

    private MobileService service() {
        return new MobileService(repository, userClient, saf, photoCredit, stockage,
                mock(PerimetreSafService.class),
                mock(io.digiservices.ecreditservice.mobile.service.ExpoPushService.class),
                mock(io.digiservices.ecreditservice.dossier.DossierAgentRepository.class));
    }

    private static MultipartFile photo(byte[] contenu, String type) {
        return new MockMultipartFile("fichier", "constat.jpg", type, contenu);
    }

    private SortSaisie envoyer(MultipartFile fichier) {
        return service().recevoirPhoto(UUID_AGENT, PHOTO, VISITE, OffsetDateTime.now(), fichier);
    }

    @Test
    @DisplayName("la photo est rangee sous son NOM, jamais sous son adresse complete")
    void lePhotoEstRangeeSousSonNom() {
        SortSaisie sort = envoyer(photo(new byte[] {1, 2, 3}, "image/jpeg"));

        assertEquals(SortSaisie.ACCEPTEE, sort.sort());
        assertEquals(55L, sort.id());
        // L'hote fige en base ferait pointer une restauration de test vers la production.
        verify(repository).enregistrerPhoto(eq(PHOTO), eq(7L), eq("abcd-1234.jpg"), anyLong(), any());
    }

    @Test
    @DisplayName("une photo deja recue est un doublon, pas une faute : le telephone la range")
    void unRenvoiEstUnDoublon() {
        when(repository.idPhoto(PHOTO)).thenReturn(Optional.of(41L));

        SortSaisie sort = envoyer(photo(new byte[] {1}, "image/jpeg"));

        assertEquals(SortSaisie.DOUBLON, sort.sort());
        assertEquals(41L, sort.id());
        verify(stockage, never()).storeFile(any());
    }

    @Test
    @DisplayName("visite pas encore transmise : refus TEMPORAIRE, la photo reste en attente")
    void visiteInconnueRefusTemporaire() {
        when(repository.visiteConnue(anyString())).thenReturn(Optional.empty());

        SortSaisie sort = envoyer(photo(new byte[] {1}, "image/jpeg"));

        assertEquals(SortSaisie.REFUSEE, sort.sort());
        assertEquals("Visite pas encore transmise", sort.motif(),
                "le telephone reconnait ce motif et garde la photo au lieu de l'abandonner");
        verify(stockage, never()).storeFile(any());
    }

    @Test
    @DisplayName("la visite d'un autre agent est refusee : l'identifiant vient du telephone")
    void laVisiteDUnAutreAgentEstRefusee() {
        when(repository.visiteConnue(anyString()))
                .thenReturn(Optional.of(new VisiteConnue(7L, 404L, "D")));

        SortSaisie sort = envoyer(photo(new byte[] {1}, "image/jpeg"));

        assertEquals(SortSaisie.REFUSEE, sort.sort());
        assertEquals("Cette visite n'est pas la votre", sort.motif());
        verify(repository, never()).enregistrerPhoto(anyString(), anyLong(), anyString(), anyLong(), any());
    }

    @Test
    @DisplayName("un fichier trop lourd ou d'un autre type est refuse pour de bon")
    void cequiNEstPasUnePhotoDeTerrain() {
        assertEquals("Photo trop lourde : 8 Mo au plus",
                envoyer(photo(new byte[9 * 1024 * 1024], "image/jpeg")).motif());
        assertEquals("Seules les photos JPEG et PNG sont acceptees",
                envoyer(photo(new byte[] {1}, "application/pdf")).motif());
        assertEquals("Photo vide", envoyer(photo(new byte[0], "image/jpeg")).motif());
        verify(stockage, never()).storeFile(any());
    }

    @Test
    @DisplayName("un directeur d'agence ne transmet pas de photo : il lit, il ne saisit pas")
    void seulUnAgentTransmet() {
        User directeur = new User();
        directeur.setUserId(5L);
        directeur.setRole("DA");
        when(userClient.getUserByUuid(anyString())).thenReturn(directeur);

        assertThrows(ApiException.class, () -> envoyer(photo(new byte[] {1}, "image/jpeg")));
    }
}
