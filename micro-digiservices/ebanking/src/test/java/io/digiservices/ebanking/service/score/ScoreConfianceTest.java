package io.digiservices.ebanking.service.score;

import io.digiservices.ebanking.dto.EvaluationRisqueDTO;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * Tests de garde des regles du score de confiance.
 *
 * <p>Ils tiennent en place les trois corrections du lot 0 : un membre sans historique est un
 * ETAT et non un zero, les paliers et la tolerance sont les memes pour les deux bases de
 * calcul, et les seuils de niveau sont ceux et uniquement ceux du serveur.</p>
 */
class ScoreConfianceTest {

    @Test
    @DisplayName("un membre sans historique est un etat, pas un score de zero")
    void nouveauMembreNEstPasUnDefaillant() {
        EvaluationRisqueDTO e = ScoreConfiance.nouveauMembre();

        assertTrue(e.getNouveauMembre(), "doit etre marque nouveau membre");
        assertEquals(ScoreConfiance.NIVEAU_NOUVEAU, e.getNiveauRisque());
        assertNull(e.getScoreConfiance(), "aucun score : l'ecran ne doit pas afficher 0 %");
        assertNull(e.getPourcentageRisque(), "aucun risque calcule : pas de 100 % en rouge");
        assertNull(e.getBasePourScore());
        assertEquals(ScoreConfiance.VERSION, e.getVersionScore());
    }

    @Test
    @DisplayName("tolerance de 5 jours puis paliers 30 / 90")
    void paliersDeRetard() {
        assertEquals(100.0, ScoreConfiance.points(0, true));
        assertEquals(100.0, ScoreConfiance.points(5, true), "5 jours = encore respectee");
        assertEquals(70.0, ScoreConfiance.points(6, true), "au-dela de la tolerance");
        assertEquals(70.0, ScoreConfiance.points(30, true));
        assertEquals(40.0, ScoreConfiance.points(31, true));
        assertEquals(40.0, ScoreConfiance.points(90, true));
        assertEquals(10.0, ScoreConfiance.points(91, true), "regularisee tres tard");
        assertEquals(0.0, ScoreConfiance.points(91, false), "jamais payee");
    }

    @Test
    @DisplayName("seule une echeance a l'heure compte comme respectee")
    void respectee() {
        assertTrue(ScoreConfiance.respectee(100.0));
        assertFalse(ScoreConfiance.respectee(70.0));
        assertFalse(ScoreConfiance.respectee(0.0));
    }

    @Test
    @DisplayName("le comportement des 18 derniers mois pese double")
    void recence() {
        LocalDateTime maintenant = LocalDateTime.of(2026, 11, 5, 12, 0);

        assertEquals(2.0, ScoreConfiance.poids(maintenant.minusMonths(17), maintenant));
        assertEquals(1.0, ScoreConfiance.poids(maintenant.minusMonths(19), maintenant));
        assertEquals(1.0, ScoreConfiance.poids(null, maintenant), "date absente : poids simple");
    }

    @Test
    @DisplayName("les seuils de niveau sont 90 / 75 / 60 / 40, et eux seuls")
    void seuilsDeNiveau() {
        assertEquals("TRÈS FAIBLE", ScoreConfiance.niveau(new BigDecimal("90")));
        assertEquals("FAIBLE", ScoreConfiance.niveau(new BigDecimal("89.99")));
        assertEquals("FAIBLE", ScoreConfiance.niveau(new BigDecimal("75")));
        assertEquals("MODÉRÉ", ScoreConfiance.niveau(new BigDecimal("74.99")));
        assertEquals("MODÉRÉ", ScoreConfiance.niveau(new BigDecimal("60")));
        assertEquals("ÉLEVÉ", ScoreConfiance.niveau(new BigDecimal("59.99")));
        assertEquals("ÉLEVÉ", ScoreConfiance.niveau(new BigDecimal("40")));
        assertEquals("TRÈS ÉLEVÉ", ScoreConfiance.niveau(new BigDecimal("39.99")));
        assertEquals(ScoreConfiance.NIVEAU_NOUVEAU, ScoreConfiance.niveau(null));
    }

    @Test
    @DisplayName("le libelle du comportement suit les memes seuils que le niveau")
    void libelleAligneSurLesSeuils() {
        assertEquals("Excellent", ScoreConfiance.historiqueRemboursement(new BigDecimal("90")));
        assertEquals("Bon", ScoreConfiance.historiqueRemboursement(new BigDecimal("75")));
        assertEquals("Moyen", ScoreConfiance.historiqueRemboursement(new BigDecimal("60")));
        assertEquals("Faible", ScoreConfiance.historiqueRemboursement(new BigDecimal("40")));
        assertEquals("Très faible", ScoreConfiance.historiqueRemboursement(new BigDecimal("39.99")));
    }

    @Test
    @DisplayName("score et pourcentage de risque sont complementaires")
    void scoreEtRisque() {
        // 7 echeances a l'heure sur 10, poids simple
        EvaluationRisqueDTO e = ScoreConfiance.evaluation(700.0, 1000.0, 2, 10, 7, 3, 42,
                ScoreConfiance.BASE_ECHEANCES);

        assertEquals(new BigDecimal("70.00"), e.getScoreConfiance());
        assertEquals(new BigDecimal("30.00"), e.getPourcentageRisque());
        assertEquals("MODÉRÉ", e.getNiveauRisque());
        assertFalse(e.getNouveauMembre());
        assertEquals(ScoreConfiance.BASE_ECHEANCES, e.getBasePourScore());
        assertEquals(42, e.getRetardMoyenJours());
    }

    @Test
    @DisplayName("aucun poids accumule : score plancher, jamais une division par zero")
    void aucunPoids() {
        assertEquals(BigDecimal.ZERO, ScoreConfiance.score(0.0, 0.0));
    }
}
