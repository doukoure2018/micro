package io.digiservices.ebanking.service.score;

import io.digiservices.clients.score.BaremeScoreConfiance;
import io.digiservices.ebanking.domain.CreditoDTO;
import io.digiservices.ebanking.domain.PlanPagoDTO;
import io.digiservices.ebanking.dto.EvaluationRisqueDTO;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * Tests de garde du moteur de score. Ils tiennent en place ce qui s'est deja trompe :
 * le nouveau membre note comme un defaillant, les deux bases qui divergent, et la
 * restructuration qui passait pour un remboursement.
 */
class ScoreConfianceTest {

    private static final LocalDateTime MAINTENANT = LocalDateTime.of(2026, 11, 5, 12, 0);

    // ================================================================ nouveau membre

    @Test
    @DisplayName("sans echeance echue, le membre est un ETAT et non un score de zero")
    void nouveauMembre() {
        CreditoDTO credit = credit(1L, MAINTENANT.minusDays(10), MAINTENANT.plusMonths(10), null, "A",
                "5000000", "5000000");
        // Une seule echeance, pas encore echue
        PlanPagoDTO aVenir = echeance(1L, 1, MAINTENANT.plusMonths(1), null, "A", "500000");

        EvaluationRisqueDTO e = ScoreConfiance.surEcheances(List.of(credit), List.of(aVenir), MAINTENANT);

        assertAll(
                () -> assertTrue(e.getNouveauMembre()),
                () -> assertEquals(BaremeScoreConfiance.CLASSE_NOUVEAU, e.getClasse()),
                () -> assertNull(e.getScoreConfiance(), "aucun score : l'ecran ne doit pas afficher 0"),
                () -> assertNull(e.getPourcentageRisque()),
                () -> assertTrue(e.getAnalyseRenforcee(), "un premier credit s'analyse sur pieces"),
                () -> assertEquals(BaremeScoreConfiance.VERSION, e.getVersionScore()));
    }

    @Test
    @DisplayName("aucun credit du tout : meme etat, jamais une note")
    void aucunCredit() {
        EvaluationRisqueDTO e = ScoreConfiance.surCredits(List.of(), MAINTENANT);
        assertTrue(e.getNouveauMembre());
        assertNull(e.getScoreConfiance());
    }

    // ================================================================ payeur exemplaire

    @Test
    @DisplayName("un payeur a l'heure avec trois credits soldes atteint la classe A")
    void payeurExemplaire() {
        List<CreditoDTO> credits = new ArrayList<>();
        List<PlanPagoDTO> echeances = new ArrayList<>();
        // Trois credits soldes et espaces : profondeur maximale, et SURTOUT aucune cloture qui
        // tombe sur l'ouverture du suivant — ce serait une restructuration, pas un remboursement.
        for (int i = 1; i <= 3; i++) {
            LocalDateTime ouverture = MAINTENANT.minusYears(7 - 2 * i);
            LocalDateTime echeanceFinale = ouverture.plusMonths(12);
            credits.add(credit((long) i, ouverture, echeanceFinale, echeanceFinale, "C", "5000000", "0"));
            for (int c = 1; c <= 12; c++) {
                LocalDateTime due = ouverture.plusMonths(c);
                echeances.add(echeance((long) i, c, due, due, "C", "500000"));
            }
        }

        EvaluationRisqueDTO e = ScoreConfiance.surEcheances(credits, echeances, MAINTENANT);

        assertAll(
                () -> assertFalse(e.getNouveauMembre()),
                () -> assertEquals(0, e.getEcheancesEnRetard()),
                () -> assertEquals(new BigDecimal("60.00"), e.getPonctualite()),
                () -> assertEquals(new BigDecimal("15.00"), e.getProfondeur(), "3 credits soldes + anciennete"),
                () -> assertEquals(new BigDecimal("15.00"), e.getSituation(), "aucun credit en cours"),
                () -> assertEquals("A", e.getClasse()),
                () -> assertFalse(e.getAnalyseRenforcee()),
                () -> assertEquals(BaremeScoreConfiance.BASE_ECHEANCES, e.getBasePourScore()));
    }

    // ================================================================ ponderation par montant

    @Test
    @DisplayName("une grosse echeance impayee pese plus que trois petites a l'heure")
    void laPonderationParMontantCompte() {
        LocalDateTime ouverture = MAINTENANT.minusMonths(10);
        CreditoDTO credit = credit(1L, ouverture, MAINTENANT.plusMonths(2), null, "A", "10000000", "8000000");

        // Trois petites echeances payees a l'heure, une grosse jamais payee
        List<PlanPagoDTO> echeances = List.of(
                echeance(1L, 1, ouverture.plusMonths(1), ouverture.plusMonths(1), "C", "100000"),
                echeance(1L, 2, ouverture.plusMonths(2), ouverture.plusMonths(2), "C", "100000"),
                echeance(1L, 3, ouverture.plusMonths(3), ouverture.plusMonths(3), "C", "100000"),
                echeance(1L, 4, ouverture.plusMonths(4), null, "A", "8000000"));

        EvaluationRisqueDTO avecMontants = ScoreConfiance.surEcheances(List.of(credit), echeances, MAINTENANT);

        // Les memes echeances, toutes du meme montant : l'impaye ne pese plus qu'un quart
        List<PlanPagoDTO> uniformes = List.of(
                echeance(1L, 1, ouverture.plusMonths(1), ouverture.plusMonths(1), "C", "100000"),
                echeance(1L, 2, ouverture.plusMonths(2), ouverture.plusMonths(2), "C", "100000"),
                echeance(1L, 3, ouverture.plusMonths(3), ouverture.plusMonths(3), "C", "100000"),
                echeance(1L, 4, ouverture.plusMonths(4), null, "A", "100000"));
        EvaluationRisqueDTO sansMontants = ScoreConfiance.surEcheances(List.of(credit), uniformes, MAINTENANT);

        assertTrue(avecMontants.getPonctualite().compareTo(sansMontants.getPonctualite()) < 0,
                "l'impaye de 8 M doit peser plus lourd que s'il valait 100 000");
    }

    // ================================================================ restructuration

    @Test
    @DisplayName("un credit solde le jour de l'ouverture d'un autre est une restructuration, pas un remboursement")
    void restructurationDetectee() {
        LocalDateTime ouvertureAncien = MAINTENANT.minusMonths(20);
        LocalDateTime cloture = MAINTENANT.minusMonths(8);
        CreditoDTO ancien = credit(1L, ouvertureAncien, MAINTENANT.minusMonths(2), cloture, "C", "5000000", "0");
        CreditoDTO nouveau = credit(2L, cloture.plusDays(1), MAINTENANT.plusMonths(10), null, "A", "7000000", "7000000");

        List<PlanPagoDTO> echeances = new ArrayList<>();
        for (int c = 1; c <= 12; c++) {
            LocalDateTime due = ouvertureAncien.plusMonths(c);
            // Toutes les echeances de l'ancien credit portent la date de cloture : elles ont ete
            // soldees par le nouveau credit, pas par le membre.
            echeances.add(echeance(1L, c, due, cloture, "C", "400000"));
        }

        EvaluationRisqueDTO e = ScoreConfiance.surEcheances(List.of(ancien, nouveau), echeances, MAINTENANT);

        assertAll(
                () -> assertTrue(e.getRestructurationDetectee(), "la restructuration doit etre vue"),
                () -> assertTrue(e.getScoreConfiance().compareTo(BaremeScoreConfiance.PLAFOND_RESTRUCTURATION) <= 0,
                        "le total est plafonne a 60"),
                () -> assertEquals(BigDecimal.ZERO.setScale(2), e.getProfondeur(),
                        "un credit restructure ne compte pas comme solde"),
                () -> assertTrue(e.getExplications().stream().anyMatch(x -> x.contains("Restructuration")),
                        "le decideur doit lire pourquoi le score est plafonne"));
    }

    // ================================================================ situation courante

    @Test
    @DisplayName("deux echeances impayees sur le credit en cours font tomber la situation")
    void situationDegradee() {
        LocalDateTime ouverture = MAINTENANT.minusMonths(8);
        CreditoDTO credit = credit(1L, ouverture, MAINTENANT.plusMonths(4), null, "A", "6000000", "4000000");

        List<PlanPagoDTO> echeances = List.of(
                echeance(1L, 1, ouverture.plusMonths(1), ouverture.plusMonths(1), "C", "500000"),
                echeance(1L, 2, ouverture.plusMonths(2), ouverture.plusMonths(2), "C", "500000"),
                echeance(1L, 3, MAINTENANT.minusDays(70), null, "A", "500000"),
                echeance(1L, 4, MAINTENANT.minusDays(40), null, "A", "500000"));

        EvaluationRisqueDTO e = ScoreConfiance.surEcheances(List.of(credit), echeances, MAINTENANT);

        assertAll(
                () -> assertEquals(2, e.getEcheancesEnRetard()),
                () -> assertEquals(new BigDecimal("3.00"), e.getSituation(), "pire retard entre 30 et 90 jours"),
                () -> assertNotNull(e.getDetailsParCredit()),
                () -> assertEquals(1, e.getDetailsParCredit().size()),
                () -> assertEquals(70, e.getDetailsParCredit().get(0).getRetardMaxJours()),
                () -> assertEquals(new BigDecimal("1000000"), e.getDetailsParCredit().get(0).getMontantEnRetard(),
                        "le decideur doit voir le montant reste en l'air"));
    }

    // ================================================================ les deux bases

    @Test
    @DisplayName("la base par credits rend les memes composantes, et annonce qu'elle est plus grossiere")
    void baseParCredits() {
        LocalDateTime ouverture = MAINTENANT.minusMonths(30);
        LocalDateTime echeanceFinale = ouverture.plusMonths(12);
        CreditoDTO solde = credit(1L, ouverture, echeanceFinale, echeanceFinale.plusDays(2), "C", "4000000", "0");

        EvaluationRisqueDTO e = ScoreConfiance.surCredits(List.of(solde), MAINTENANT);

        assertAll(
                () -> assertEquals(BaremeScoreConfiance.BASE_CREDITS, e.getBasePourScore()),
                () -> assertEquals(new BigDecimal("60.00"), e.getPonctualite(), "solde 2 jours apres : dans la tolerance"),
                () -> assertEquals(new BigDecimal("8.00"), e.getProfondeur(), "un seul credit solde"),
                () -> assertEquals(new BigDecimal("15.00"), e.getSituation(), "aucun credit en cours"),
                () -> assertTrue(e.getExplications().stream().anyMatch(x -> x.contains("sauvegarde SAF")),
                        "l'ecran doit savoir qu'il lit une base plus grossiere"));
    }

    @Test
    @DisplayName("le e-banking ne lit pas digi : il le declare au lieu de faire semblant")
    void signauxDigiNonLus() {
        CreditoDTO solde = credit(1L, MAINTENANT.minusMonths(24), MAINTENANT.minusMonths(12),
                MAINTENANT.minusMonths(12), "C", "3000000", "0");
        EvaluationRisqueDTO e = ScoreConfiance.surCredits(List.of(solde), MAINTENANT);

        assertFalse(e.getSignauxDigiDisponibles(), "la note digi est neutre, pas connue");
        assertEquals(new BigDecimal("10.00"), e.getSignauxDigi());
    }

    // ================================================================ fabriques

    private static CreditoDTO credit(Long numero, LocalDateTime ouverture, LocalDateTime echeance,
                                     LocalDateTime cloture, String etat, String montant, String solde) {
        CreditoDTO credit = new CreditoDTO();
        credit.setNumCredito(numero);
        credit.setTipCredito(1);
        credit.setFecApertura(ouverture);
        credit.setFecVencimiento(echeance);
        credit.setFecCancelacion(cloture);
        credit.setIndEstado(etat);
        credit.setMonCredito(new BigDecimal(montant));
        credit.setMonSaldo(new BigDecimal(solde));
        return credit;
    }

    private static PlanPagoDTO echeance(Long numeroCredit, int numero, LocalDateTime due,
                                        LocalDateTime paiement, String etat, String montant) {
        PlanPagoDTO echeance = new PlanPagoDTO();
        echeance.setNumCredito(numeroCredit);
        echeance.setNumCuota(numero);
        echeance.setFecCuota(due);
        echeance.setFecCancelacion(paiement);
        echeance.setIndEstado(etat);
        echeance.setMonCuota(new BigDecimal(montant));
        return echeance;
    }
}
