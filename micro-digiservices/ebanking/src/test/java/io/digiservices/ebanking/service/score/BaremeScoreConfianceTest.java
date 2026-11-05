package io.digiservices.ebanking.service.score;

import io.digiservices.clients.score.BaremeScoreConfiance;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * Tests de garde du bareme : les bornes du score. Elles sont partagees par le e-banking et le
 * e-credit, donc une seule derive suffirait a faire reapparaitre le defaut du lot 0 — deux
 * scores pour le meme membre selon l'ecran.
 */
class BaremeScoreConfianceTest {

    private static final LocalDateTime MAINTENANT = LocalDateTime.of(2026, 11, 5, 12, 0);

    @Test
    @DisplayName("tolerance de 5 jours, puis paliers 30 et 90")
    void paliersDeRetard() {
        assertEquals(100.0, BaremeScoreConfiance.points(0, true));
        assertEquals(100.0, BaremeScoreConfiance.points(5, true), "5 jours = encore respectee");
        assertEquals(70.0, BaremeScoreConfiance.points(6, true));
        assertEquals(70.0, BaremeScoreConfiance.points(30, true));
        assertEquals(40.0, BaremeScoreConfiance.points(31, true));
        assertEquals(40.0, BaremeScoreConfiance.points(90, true));
        assertEquals(10.0, BaremeScoreConfiance.points(91, true), "regularisee tres tard");
        assertEquals(0.0, BaremeScoreConfiance.points(91, false), "jamais payee");
    }

    @Test
    @DisplayName("seule une echeance a l'heure compte comme respectee")
    void respectee() {
        assertTrue(BaremeScoreConfiance.respectee(100.0));
        assertFalse(BaremeScoreConfiance.respectee(70.0));
    }

    @Test
    @DisplayName("le comportement des 18 derniers mois pese double")
    void recence() {
        assertEquals(2.0, BaremeScoreConfiance.poidsRecence(MAINTENANT.minusMonths(17), MAINTENANT));
        assertEquals(1.0, BaremeScoreConfiance.poidsRecence(MAINTENANT.minusMonths(19), MAINTENANT));
        assertEquals(1.0, BaremeScoreConfiance.poidsRecence(null, MAINTENANT));
    }

    @Test
    @DisplayName("le plancher de montant empeche une echeance derisoire de disparaitre")
    void plancherDeMontant() {
        double moyen = 1_000_000.0;
        assertEquals(1_000_000.0, BaremeScoreConfiance.poidsMontant(new BigDecimal("1000000"), moyen));
        assertEquals(100_000.0, BaremeScoreConfiance.poidsMontant(new BigDecimal("5000"), moyen),
                "5 000 GNF remonte au plancher de 10 % de la moyenne");
        assertEquals(100_000.0, BaremeScoreConfiance.poidsMontant(null, moyen),
                "montant absent : le plancher, pas zero");
    }

    @Test
    @DisplayName("ponctualite : 60 points pour un sans-faute, 0 pour un impaye total")
    void ponctualite() {
        assertEquals(new BigDecimal("60.00"), BaremeScoreConfiance.ponctualite(100.0 * 10, 10));
        assertEquals(new BigDecimal("0.00"), BaremeScoreConfiance.ponctualite(0.0, 10));
        assertEquals(new BigDecimal("42.00"), BaremeScoreConfiance.ponctualite(70.0 * 10, 10));
        assertEquals(BigDecimal.ZERO, BaremeScoreConfiance.ponctualite(0.0, 0), "aucun poids : pas de division");
    }

    @Test
    @DisplayName("profondeur : ce que la relation a deja prouve")
    void profondeur() {
        assertEquals(new BigDecimal("0.00"), BaremeScoreConfiance.profondeur(0, 1));
        assertEquals(new BigDecimal("8.00"), BaremeScoreConfiance.profondeur(1, 1));
        assertEquals(new BigDecimal("12.00"), BaremeScoreConfiance.profondeur(2, 1));
        assertEquals(new BigDecimal("15.00"), BaremeScoreConfiance.profondeur(3, 1));
        assertEquals(new BigDecimal("11.00"), BaremeScoreConfiance.profondeur(1, 6), "bonus d'anciennete");
        assertEquals(new BigDecimal("15.00"), BaremeScoreConfiance.profondeur(3, 9), "le bonus ne depasse pas 15");
    }

    @Test
    @DisplayName("situation : aucun credit en cours vaut une situation saine, pas une inconnue")
    void situation() {
        assertEquals(new BigDecimal("15.00"), BaremeScoreConfiance.situation(0, 0));
        assertEquals(new BigDecimal("15.00"), BaremeScoreConfiance.situation(400, 0),
                "sans credit en cours, un vieux retard ne pese pas ici");
        assertEquals(new BigDecimal("15.00"), BaremeScoreConfiance.situation(5, 1));
        assertEquals(new BigDecimal("8.00"), BaremeScoreConfiance.situation(20, 1));
        assertEquals(new BigDecimal("3.00"), BaremeScoreConfiance.situation(60, 1));
        assertEquals(new BigDecimal("0.00"), BaremeScoreConfiance.situation(120, 1));
    }

    @Test
    @DisplayName("signaux digi : dix points au depart, chaque signal en retire, jamais sous zero")
    void signauxDigi() {
        assertEquals(new BigDecimal("10.00"), BaremeScoreConfiance.signauxDigi(0, 0, false));
        assertEquals(new BigDecimal("7.00"), BaremeScoreConfiance.signauxDigi(1, 0, false));
        assertEquals(new BigDecimal("6.00"), BaremeScoreConfiance.signauxDigi(0, 2, false));
        assertEquals(new BigDecimal("0.00"), BaremeScoreConfiance.signauxDigi(3, 2, true),
                "tous les signaux : zero, pas un negatif");
        assertEquals(new BigDecimal("10.00"), BaremeScoreConfiance.signauxDigiNeutres());
    }

    @Test
    @DisplayName("une restructuration plafonne le total, quelles que soient les composantes")
    void plafondRestructuration() {
        BigDecimal p = new BigDecimal("60");
        BigDecimal pr = new BigDecimal("15");
        BigDecimal s = new BigDecimal("15");
        BigDecimal d = new BigDecimal("10");

        assertEquals(new BigDecimal("100.00"), BaremeScoreConfiance.total(p, pr, s, d, false));
        assertEquals(new BigDecimal("60.00"), BaremeScoreConfiance.total(p, pr, s, d, true));
    }

    @Test
    @DisplayName("les classes : 85 / 70 / 55 / 40, et le contentieux passe devant tout")
    void classes() {
        assertEquals("A", BaremeScoreConfiance.classe(new BigDecimal("85"), false, false));
        assertEquals("B", BaremeScoreConfiance.classe(new BigDecimal("84.99"), false, false));
        assertEquals("B", BaremeScoreConfiance.classe(new BigDecimal("70"), false, false));
        assertEquals("C", BaremeScoreConfiance.classe(new BigDecimal("69.99"), false, false));
        assertEquals("C", BaremeScoreConfiance.classe(new BigDecimal("55"), false, false));
        assertEquals("D", BaremeScoreConfiance.classe(new BigDecimal("54.99"), false, false));
        assertEquals("D", BaremeScoreConfiance.classe(new BigDecimal("40"), false, false));
        assertEquals("E", BaremeScoreConfiance.classe(new BigDecimal("39.99"), false, false));

        assertEquals("E", BaremeScoreConfiance.classe(new BigDecimal("100"), false, true),
                "un contentieux declare n'est pas une nuance de score");
        assertEquals(BaremeScoreConfiance.CLASSE_NOUVEAU,
                BaremeScoreConfiance.classe(new BigDecimal("100"), true, false));
        assertEquals(BaremeScoreConfiance.CLASSE_NOUVEAU, BaremeScoreConfiance.classe(null, false, false));
    }

    @Test
    @DisplayName("les classes a surveiller appellent une analyse renforcee, A et B non")
    void analyseRenforcee() {
        assertFalse(BaremeScoreConfiance.analyseRenforcee("A"));
        assertFalse(BaremeScoreConfiance.analyseRenforcee("B"));
        assertTrue(BaremeScoreConfiance.analyseRenforcee("C"));
        assertTrue(BaremeScoreConfiance.analyseRenforcee("D"));
        assertTrue(BaremeScoreConfiance.analyseRenforcee("E"));
        assertTrue(BaremeScoreConfiance.analyseRenforcee(BaremeScoreConfiance.CLASSE_NOUVEAU),
                "un premier credit s'analyse, il ne se devine pas");
    }

    @Test
    @DisplayName("chaque classe a un libelle et une conduite a tenir")
    void libelles() {
        assertEquals("EXCELLENT", BaremeScoreConfiance.classeLibelle("A"));
        assertEquals("NOUVEAU MEMBRE", BaremeScoreConfiance.classeLibelle(BaremeScoreConfiance.CLASSE_NOUVEAU));
        assertEquals("INDISPONIBLE", BaremeScoreConfiance.classeLibelle(null));
        assertTrue(BaremeScoreConfiance.classeConduite("D").contains("caution"));
        assertTrue(BaremeScoreConfiance.classeConduite(BaremeScoreConfiance.CLASSE_NOUVEAU)
                .contains("pas un défaut de paiement"));
    }
}
