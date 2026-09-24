package io.digiservices.ecreditservice.utils;

import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.assertEquals;

/** Regle figee le 2026-09-24 : traite proposee = M / N + M x t x p (1re traite, capital constant). */
class PropositionCalculateurTest {

    @Test
    void dossier3526_mensuel_24mois_2virgule5() {
        int mois = PropositionCalculateur.moisParPeriode("Mensuelle");
        int n = PropositionCalculateur.nombreEcheances(24, mois);
        assertEquals(1, mois);
        assertEquals(24, n);
        assertEquals(new BigDecimal("6666667"),
                PropositionCalculateur.echeanceMax(new BigDecimal("100000000"), new BigDecimal("2.5"), mois, n));
    }

    @Test
    void trimestriel_12mois_4echeances_3pourcent() {
        int mois = PropositionCalculateur.moisParPeriode("Trimestrielle");
        int n = PropositionCalculateur.nombreEcheances(12, mois);
        assertEquals(3, mois);
        assertEquals(4, n);
        // 50 M / 4 + 50 M x 3 % x 3 = 12 500 000 + 4 500 000
        assertEquals(new BigDecimal("17000000"),
                PropositionCalculateur.echeanceMax(new BigDecimal("50000000"), new BigDecimal("3"), mois, n));
    }

    @Test
    void periodicites_tolerantes() {
        assertEquals("Quadrimestrielle", PropositionCalculateur.normaliserPeriodicite("QUATRIMESTRIELLE"));
        assertEquals("Mensuelle", PropositionCalculateur.normaliserPeriodicite("MENSUELLE"));
        assertEquals(12, PropositionCalculateur.moisParPeriode("annuelle"));
        assertEquals(1, PropositionCalculateur.moisParPeriode(null));
        assertEquals(1, PropositionCalculateur.nombreEcheances(2, 3));
    }
}
