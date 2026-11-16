package io.digiservices.ecreditservice.mobile;

import io.digiservices.clients.EbankingPortefeuilleClient;
import io.digiservices.clients.UserClient;
import io.digiservices.clients.domain.User;
import io.digiservices.clients.portefeuille.PortefeuilleEcheanceDto;
import io.digiservices.ecreditservice.dossier.DossierAgentRepository;
import io.digiservices.ecreditservice.mobile.dto.MobileDtos.FicheCredit;
import io.digiservices.ecreditservice.mobile.repository.MobileRepository;
import io.digiservices.ecreditservice.mobile.service.ExpoPushService;
import io.digiservices.ecreditservice.mobile.service.MobileService;
import io.digiservices.ecreditservice.repository.PortefeuilleCreditPhotoRepository;
import io.digiservices.ecreditservice.service.FileStorageService;
import io.digiservices.ecreditservice.service.PerimetreSafService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

/**
 * La fiche d'un credit : echeancier, cautions, derniere position.
 *
 * <p>Trois choses s'y jouent. Un morceau qui tombe ne doit pas emporter les autres — les
 * cautions viennent de digi et ne dependent pas de SAF. Un echeancier dont TOUTES les lignes
 * sont soldees alors que le credit court est signale : ce credit n'apparaitra dans aucune
 * relance (22 cas sur 220 credits 2026 au PS 952, mesure du 16/11). Et une position absente
 * reste absente : l'ecran n'offre alors pas d'itineraire, plutot que d'ouvrir une carte sur
 * le nom du membre — ce qui faisait echouer l'ouverture sur iPhone.</p>
 */
class FicheCreditTest {

    private static final String UUID_AGENT = "uuid-agent";
    private static final String PS = "952";
    private static final long CREDIT = 18966L;

    private final MobileRepository repository = mock(MobileRepository.class);
    private final UserClient userClient = mock(UserClient.class);
    private final EbankingPortefeuilleClient saf = mock(EbankingPortefeuilleClient.class);

    @BeforeEach
    void unAgent() {
        User agent = new User();
        agent.setUserId(92L);
        agent.setRole("AGENT_CREDIT");
        when(userClient.getUserByUuid(anyString())).thenReturn(agent);
        when(repository.clientDuCredit(anyString(), anyLong())).thenReturn(Optional.of("95240043004"));
        when(repository.cautionsDuMembre(anyString(), anyInt())).thenReturn(List.of());
        when(repository.dernierePosition(anyString(), anyLong())).thenReturn(Optional.empty());
    }

    private MobileService service() {
        return new MobileService(repository, userClient, saf,
                mock(PortefeuilleCreditPhotoRepository.class), mock(FileStorageService.class),
                mock(PerimetreSafService.class), mock(ExpoPushService.class),
                mock(DossierAgentRepository.class));
    }

    private static PortefeuilleEcheanceDto echeance(long numero, LocalDate date, LocalDate payee) {
        return new PortefeuilleEcheanceDto(numero, date, new BigDecimal("750000"),
                new BigDecimal("50000"), BigDecimal.ZERO, BigDecimal.ZERO, payee);
    }

    @Test
    @DisplayName("un echeancier dont tout est solde alors que le credit court est signale")
    void echeancierSansAucuneEcheanceAVenir() {
        when(saf.getEcheancier(anyString(), anyLong())).thenReturn(List.of(
                echeance(1, LocalDate.of(2026, 11, 14), LocalDate.of(2026, 11, 14))));

        FicheCredit fiche = service().ficheCredit(UUID_AGENT, PS, CREDIT);

        assertEquals(1, fiche.echeancier().size());
        assertTrue(fiche.echeancierIncomplet(),
                "ce credit n'apparaitra dans aucune relance : l'agent doit le voir");
    }

    @Test
    @DisplayName("un echeancier normal n'est pas signale")
    void echeancierNormal() {
        when(saf.getEcheancier(anyString(), anyLong())).thenReturn(List.of(
                echeance(1, LocalDate.of(2026, 11, 14), LocalDate.of(2026, 11, 14)),
                echeance(2, LocalDate.of(2026, 12, 14), null)));

        assertFalse(service().ficheCredit(UUID_AGENT, PS, CREDIT).echeancierIncomplet());
    }

    @Test
    @DisplayName("SAF muet : l'echeancier est vide, les cautions arrivent quand meme")
    void safMuetNEmporteRienDautre() {
        when(saf.getEcheancier(anyString(), anyLong()))
                .thenThrow(new IllegalStateException("VPN bancaire coupe"));
        when(repository.cautionsDuMembre(anyString(), anyInt())).thenReturn(List.of(
                Map.of("demandeindividuel_id", 75L, "createdat", java.sql.Timestamp.valueOf("2026-02-10 10:00:00"),
                        "montant_demande", new BigDecimal("9000000"),
                        "validation_state", "VALIDATED_FINAL", "statut_demande", "EN_ATTENTE",
                        "nom", "MILLIMONO", "prenom", "SIA ESTHER",
                        "telephone", "620101453", "profession", "INFIRMIERE",
                        "adresse_complete", "Kipe")));

        FicheCredit fiche = service().ficheCredit(UUID_AGENT, PS, CREDIT);

        assertTrue(fiche.echeancier().isEmpty());
        assertFalse(fiche.echeancierIncomplet(), "un echeancier absent n'est pas un echeancier solde");
        assertEquals(1, fiche.cautions().size(), "les cautions viennent de digi, pas de SAF");
        assertEquals("MILLIMONO", fiche.cautions().get(0).personnes().get(0).nom());
        assertEquals(LocalDate.of(2026, 2, 10), fiche.cautions().get(0).deposeLe());
        assertEquals("Approuvée (niveau final)", fiche.cautions().get(0).etat());
    }

    @Test
    @DisplayName("aucune visite situee : aucune position, donc aucun itineraire propose")
    void sansVisiteAucunePosition() {
        when(saf.getEcheancier(anyString(), anyLong())).thenReturn(List.of());

        assertNull(service().ficheCredit(UUID_AGENT, PS, CREDIT).dernierePosition());
    }

    @Test
    @DisplayName("la position de la derniere visite est rendue telle quelle")
    void lapositionDeLaDerniereVisite() {
        when(saf.getEcheancier(anyString(), anyLong())).thenReturn(List.of());
        when(repository.dernierePosition(anyString(), anyLong())).thenReturn(Optional.of(Map.of(
                "latitude", new BigDecimal("9.5370000"), "longitude", new BigDecimal("-13.6785000"),
                "precision_m", 12, "saisie_at", java.time.OffsetDateTime.now(),
                "agent", "CONDE ALIOUNE")));

        var position = service().ficheCredit(UUID_AGENT, PS, CREDIT).dernierePosition();

        assertEquals(new BigDecimal("9.5370000"), position.latitude());
        assertEquals("CONDE ALIOUNE", position.agent());
    }
}
