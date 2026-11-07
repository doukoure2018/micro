package io.digiservices.ecreditservice.utils;

import io.digiservices.clients.portefeuille.CreditMembreSafDto;
import io.digiservices.ecreditservice.dto.CreditsOctroyesDtos.CreditOctroye;
import io.digiservices.ecreditservice.utils.CreditsOctroyesRapprochement.Etat;
import io.digiservices.ecreditservice.utils.CreditsOctroyesRapprochement.Resultat;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * « Qu'est devenu le credit que nous avons accorde ? »
 *
 * <p>digi et SAF ne partagent aucun numero de credit : le rapprochement se fait sur le numero
 * de membre, et c'est donc une DEDUCTION. Une deduction qui se trompe est pire que pas de
 * reponse : elle ferait passer un octroi jamais mis en place pour un credit sain, ou
 * compterait deux fois le meme encours pour un membre qui a deux dossiers.</p>
 *
 * <p>Ces cas tiennent la regle par les deux bouts : ne jamais attribuer a un dossier un credit
 * qui lui est anterieur, et ne jamais attribuer deux fois le meme credit.</p>
 */
class CreditsOctroyesRapprochementTest {

    private static final String MEMBRE = "00123456789";

    private static CreditOctroye dossier(long id, String membre, LocalDate octroi, long montant) {
        return new CreditOctroye(id, "DIALLO", "Mamadou", "620000000", membre,
                Boolean.TRUE, false, "DIALLO MAMADOU", "Demande credit Pour Particulier",
                BigDecimal.valueOf(montant), "Commerce",
                3L, "Moyenne Guinee", 12L, "Mamou", 101L, "Mamou Centre", "102",
                "de@creditruralgn.com",
                octroi == null ? null : octroi.atStartOfDay(), LocalDateTime.now(), 10);
    }

    private static CreditMembreSafDto credit(long num, String membre, LocalDate ouverture,
                                             String etat, long octroye, long solde,
                                             LocalDate premierImpaye, long capImp, long intImp) {
        return new CreditMembreSafDto("102", "MAMOU CENTRE", num, membre, "DIALLO MAMADOU",
                1, "Credit commerce", etat,
                BigDecimal.valueOf(octroye), BigDecimal.valueOf(solde),
                ouverture, ouverture == null ? null : ouverture.plusYears(1),
                premierImpaye,
                premierImpaye == null ? null : BigDecimal.valueOf(capImp),
                premierImpaye == null ? null : BigDecimal.valueOf(intImp));
    }

    @Test
    @DisplayName("un credit ouvert apres l'octroi est le credit du dossier")
    void appariementSimple() {
        var octroi = LocalDate.of(2026, 3, 10);
        Resultat r = CreditsOctroyesRapprochement.rapprocher(
                List.of(dossier(1, MEMBRE, octroi, 10_000_000)),
                List.of(credit(94389, MEMBRE, octroi.plusDays(2), "D", 10_000_000, 6_000_000, null, 0, 0)));

        assertEquals(1, r.dossiers().size());
        assertEquals(Etat.EN_PLACE, r.dossiers().get(0).etat());
        assertEquals(94389L, r.dossiers().get(0).credit().getNumCredito());
        assertEquals("En cours", r.dossiers().get(0).situationSaf());
        assertEquals(1, r.totaux().nombreEnPlace());
        assertEquals(BigDecimal.valueOf(10_000_000), r.totaux().montantOctroye());
        assertEquals(BigDecimal.valueOf(6_000_000), r.totaux().encours());
        assertEquals(0, r.totaux().creditsHorsDigi());
    }

    @Test
    @DisplayName("un ancien credit du membre n'est jamais pris pour le dossier du jour")
    void lAncienCreditNeCompteJamais() {
        var octroi = LocalDate.of(2026, 3, 10);
        Resultat r = CreditsOctroyesRapprochement.rapprocher(
                List.of(dossier(1, MEMBRE, octroi, 10_000_000)),
                List.of(credit(80000, MEMBRE, LocalDate.of(2023, 5, 1), "C", 5_000_000, 0, null, 0, 0)));

        assertEquals(Etat.PAS_DE_CREDIT, r.dossiers().get(0).etat(),
                "un octroi non suivi de mise en place doit se voir, pas se cacher derriere un credit de 2023");
        assertNull(r.dossiers().get(0).credit());
        assertEquals(BigDecimal.ZERO, r.totaux().montantOctroye());
        assertEquals(1, r.totaux().creditsHorsDigi(),
                "le credit de 2023 existe : il est compte a part, pas ignore");
    }

    @Test
    @DisplayName("deux dossiers du meme membre ne se partagent pas le meme credit")
    void pasDeDoubleComptage() {
        var premier = LocalDate.of(2026, 1, 15);
        var second = LocalDate.of(2026, 6, 20);
        Resultat r = CreditsOctroyesRapprochement.rapprocher(
                List.of(dossier(2, MEMBRE, second, 20_000_000), dossier(1, MEMBRE, premier, 10_000_000)),
                List.of(credit(90001, MEMBRE, premier.plusDays(3), "C", 10_000_000, 0, null, 0, 0),
                        credit(90002, MEMBRE, second.plusDays(1), "D", 20_000_000, 15_000_000, null, 0, 0)));

        assertEquals(2, r.totaux().nombreEnPlace());
        // Le dossier le plus ancien prend le credit le plus ancien : ordre stable et vraisemblable.
        var parId = r.dossiers().stream().collect(
                java.util.stream.Collectors.toMap(s -> s.dossier().demandeIndividuelId(),
                        s -> s.credit().getNumCredito()));
        assertEquals(90001L, parId.get(1L));
        assertEquals(90002L, parId.get(2L));
        assertEquals(BigDecimal.valueOf(30_000_000), r.totaux().montantOctroye());
        assertEquals(BigDecimal.valueOf(15_000_000), r.totaux().encours(),
                "le credit solde ne pese plus dans l'encours, le vivant seul y figure");
        assertEquals(0, r.totaux().creditsHorsDigi());
    }

    @Test
    @DisplayName("deux dossiers pour un seul credit : le plus ancien le prend, l'autre reste sans")
    void unSeulCreditPourDeuxDossiers() {
        var premier = LocalDate.of(2026, 1, 15);
        var second = LocalDate.of(2026, 6, 20);
        Resultat r = CreditsOctroyesRapprochement.rapprocher(
                List.of(dossier(1, MEMBRE, premier, 10_000_000), dossier(2, MEMBRE, second, 20_000_000)),
                List.of(credit(90001, MEMBRE, premier.plusDays(3), "D", 10_000_000, 8_000_000, null, 0, 0)));

        assertEquals(1, r.totaux().nombreEnPlace());
        assertEquals(1, r.totaux().nombrePasDeCredit());
        assertEquals(BigDecimal.valueOf(8_000_000), r.totaux().encours(),
                "l'encours ne doit compter le credit qu'une fois");
    }

    @Test
    @DisplayName("la mise en place anticipee est toleree un mois, pas deux")
    void tolerance() {
        var octroi = LocalDate.of(2026, 3, 10);
        // L'agence met le credit en place avant que le dernier visa ne soit saisi dans digi.
        Resultat proche = CreditsOctroyesRapprochement.rapprocher(
                List.of(dossier(1, MEMBRE, octroi, 10_000_000)),
                List.of(credit(90001, MEMBRE, octroi.minusDays(10), "D", 10_000_000, 9_000_000, null, 0, 0)));
        assertEquals(Etat.EN_PLACE, proche.dossiers().get(0).etat());

        Resultat loin = CreditsOctroyesRapprochement.rapprocher(
                List.of(dossier(1, MEMBRE, octroi, 10_000_000)),
                List.of(credit(90001, MEMBRE, octroi.minusDays(40), "D", 10_000_000, 9_000_000, null, 0, 0)));
        assertEquals(Etat.PAS_DE_CREDIT, loin.dossiers().get(0).etat(),
                "40 jours avant l'octroi, c'est le credit precedent du membre");
    }

    @Test
    @DisplayName("un dossier sans numero de membre le dit, au lieu de passer pour non mis en place")
    void sansNumeroDeMembre() {
        for (String vide : new String[]{null, "", "   "}) {
            Resultat r = CreditsOctroyesRapprochement.rapprocher(
                    List.of(dossier(1, vide, LocalDate.of(2026, 3, 10), 10_000_000)), List.of());
            assertEquals(Etat.SANS_NUMERO_MEMBRE, r.dossiers().get(0).etat());
            assertEquals(1, r.totaux().nombreSansNumero());
            assertEquals(0, r.totaux().nombrePasDeCredit(),
                    "ne pas avoir de numero n'est pas la meme chose que n'avoir pas de credit");
        }
    }

    @Test
    @DisplayName("les espaces de saisie des deux cotes ne cassent pas l'appariement")
    void numerosAvecEspaces() {
        var octroi = LocalDate.of(2026, 3, 10);
        Resultat r = CreditsOctroyesRapprochement.rapprocher(
                List.of(dossier(1, " " + MEMBRE + " ", octroi, 10_000_000)),
                List.of(credit(90001, MEMBRE + " ", octroi, "D", 10_000_000, 9_000_000, null, 0, 0)));
        assertEquals(Etat.EN_PLACE, r.dossiers().get(0).etat());
    }

    @Test
    @DisplayName("un credit sans date d'ouverture reste libre au lieu d'etre attribue au hasard")
    void creditSansDateDOuverture() {
        Resultat r = CreditsOctroyesRapprochement.rapprocher(
                List.of(dossier(1, MEMBRE, LocalDate.of(2026, 3, 10), 10_000_000)),
                List.of(credit(90001, MEMBRE, null, "D", 10_000_000, 9_000_000, null, 0, 0)));
        assertEquals(Etat.PAS_DE_CREDIT, r.dossiers().get(0).etat());
        assertEquals(1, r.totaux().creditsHorsDigi());
    }

    @Test
    @DisplayName("le retard compte le capital ET les interets impayes, et se compte par credit")
    void retard() {
        var octroi = LocalDate.of(2026, 1, 10);
        Resultat r = CreditsOctroyesRapprochement.rapprocher(
                List.of(dossier(1, MEMBRE, octroi, 10_000_000), dossier(2, "00999", octroi, 5_000_000)),
                List.of(credit(90001, MEMBRE, octroi, "D", 10_000_000, 7_000_000,
                                LocalDate.now().minusDays(45), 900_000, 100_000),
                        credit(90002, "00999", octroi, "D", 5_000_000, 4_000_000, null, 0, 0)));

        assertEquals(1, r.totaux().nombreEnRetard());
        assertEquals(BigDecimal.valueOf(1_000_000), r.totaux().montantEnRetard());
        assertEquals(BigDecimal.valueOf(11_000_000), r.totaux().encours());
        assertEquals(45, r.dossiers().stream()
                .filter(s -> s.credit() != null && s.credit().getNumCredito() == 90001L)
                .findFirst().orElseThrow().credit().getJoursRetard());
    }

    @Test
    @DisplayName("un credit rembourse n'est pas annonce « en cours »")
    void leVocabulaireDeLIssue() {
        var octroi = LocalDate.of(2025, 1, 10);
        Resultat r = CreditsOctroyesRapprochement.rapprocher(
                List.of(dossier(1, MEMBRE, octroi, 10_000_000),
                        dossier(2, "00888", octroi, 8_000_000),
                        dossier(3, "00777", octroi, 6_000_000)),
                List.of(credit(90001, MEMBRE, octroi, "C", 10_000_000, 0, null, 0, 0),
                        credit(90002, "00888", octroi, "J", 8_000_000, 7_500_000,
                                LocalDate.now().minusDays(200), 7_000_000, 500_000),
                        credit(90003, "00777", octroi, "I", 6_000_000, 2_000_000, null, 0, 0)));

        assertEquals(1L, r.totaux().parSituationSaf().get("Solde"));
        assertEquals(1L, r.totaux().parSituationSaf().get("Contentieux"));
        assertEquals(1L, r.totaux().parSituationSaf().get("Apure"));
        assertNull(r.totaux().parSituationSaf().get("En cours"));
        // Contentieux et apure gardent un solde a recouvrer : ils pesent dans l'encours.
        assertEquals(BigDecimal.valueOf(9_500_000), r.totaux().encours());
    }

    @Test
    @DisplayName("un perimetre vide ne casse rien")
    void perimetreVide() {
        Resultat r = CreditsOctroyesRapprochement.rapprocher(List.of(), List.of());
        assertNotNull(r.totaux());
        assertEquals(0, r.totaux().nombreDossiers());
        assertEquals(BigDecimal.ZERO, r.totaux().encours());
        assertTrue(r.dossiers().isEmpty());

        Resultat nuls = CreditsOctroyesRapprochement.rapprocher(null, null);
        assertEquals(0, nuls.totaux().nombreDossiers());
    }
}
