package io.digiservices.ecreditservice.service;

import io.digiservices.clients.portefeuille.PortefeuilleCreditDto;
import io.digiservices.ecreditservice.dto.PortefeuilleScoreDtos.BornesDto;
import io.digiservices.ecreditservice.dto.PortefeuilleScoreDtos.ScoreAgentDto;
import io.digiservices.ecreditservice.service.ScoreAgentCalculateur.CreditPorte;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

/** Grille d'appreciation (proposition DSIG du 2026-10-16), verifiee a sec. */
class ScoreAgentCalculateurTest {

    private static final LocalDate AUJOURDHUI = LocalDate.of(2026, 10, 16);
    private static final LocalDate ANCIEN = AUJOURDHUI.minusDays(200);

    private final ScoreAgentCalculateur calc = new ScoreAgentCalculateur(BornesDto.builder()
            .par30Mauvais(0.15).regulariteMauvais(0.70).tauxRetardMauvais(0.30).poidsRetardMauvais(0.10)
            .minCredits(10).minJoursAffectation(90).joursFranchiseHerite(90).build());

    private static PortefeuilleCreditDto credit(long num, long solde, Long joursRetard, long impaye, long payees, long impayees) {
        PortefeuilleCreditDto c = new PortefeuilleCreditDto();
        c.setNumCredito(num);
        c.setIndEstado("A");
        c.setMonSaldo(BigDecimal.valueOf(solde));
        c.setJoursRetard(joursRetard);
        c.setDatPremiereImpayee(joursRetard == null ? null : AUJOURDHUI.minusDays(joursRetard));
        c.setMntCapImpaye(BigDecimal.valueOf(impaye));
        c.setMntIntImpaye(BigDecimal.ZERO);
        c.setNbEchPayees(payees);
        c.setNbEchImpayees(impayees);
        return c;
    }

    private static List<CreditPorte> portefeuilleSain(int n) {
        List<CreditPorte> l = new ArrayList<>();
        for (int i = 1; i <= n; i++) l.add(new CreditPorte(credit(i, 1_000_000, null, 0, 6, 0), ANCIEN));
        return l;
    }

    @Test
    void portefeuilleSainEstClasseA() {
        ScoreAgentDto s = calc.calculer(1L, "951", portefeuilleSain(20), ANCIEN, 20, AUJOURDHUI);
        assertEquals(100, s.getScore());
        assertEquals("A", s.getClasse());
        assertEquals(20, s.getNbCredits());
        assertEquals(0, s.getNbEnRetard());
        assertEquals(new BigDecimal("30.00"), s.getPtsPar30());
        assertEquals(new BigDecimal("10.00"), s.getPtsCharge());
    }

    @Test
    void pointsLineairesEntreLesBornes() {
        assertEquals(30.0, ScoreAgentCalculateur.lineaire(0.0, 0, 0.15, 30), 1e-9);
        assertEquals(15.0, ScoreAgentCalculateur.lineaire(0.075, 0, 0.15, 30), 1e-9);
        assertEquals(0.0, ScoreAgentCalculateur.lineaire(0.20, 0, 0.15, 30), 1e-9);
    }

    @Test
    void retardsFontBaisserLeScore() {
        List<CreditPorte> l = portefeuilleSain(16);
        // 4 credits en retard de 45 jours sur 20 : PAR 30 = 20 %, part en retard 20 %, poids 2 %
        for (int i = 17; i <= 20; i++) l.add(new CreditPorte(credit(i, 1_000_000, 45L, 100_000, 4, 2), ANCIEN));
        ScoreAgentDto s = calc.calculer(1L, "951", l, ANCIEN, 20, AUJOURDHUI);
        assertEquals(4, s.getNbEnRetard());
        assertEquals(new BigDecimal("0.00"), s.getPtsPar30());                  // 20 % > 15 %
        assertEquals(new BigDecimal("5.00"), s.getPtsTauxRetard());             // 20 % sur 30 %
        assertEquals(new BigDecimal("12.00"), s.getPtsPoidsRetard());           // 2 % sur 10 %
        // regularite : 16×6 + 4×4 = 112 payees sur 120 echues = 93,3 % → 20 × (0,933−0,70)/0,30 = 15,56
        assertEquals(new BigDecimal("15.56"), s.getPtsRegularite());
        assertEquals(new BigDecimal("10.00"), s.getPtsCharge());
        assertEquals(47, s.getScore());                                          // 42,56 / 90
        assertEquals("D", s.getClasse());
    }

    @Test
    void retardHeriteNeComptePasPendantLaFranchise() {
        List<CreditPorte> l = portefeuilleSain(19);
        // En retard depuis 120 jours, confie il y a 30 jours : herite, hors ratios
        PortefeuilleCreditDto herite = credit(99, 1_000_000, 120L, 500_000, 2, 4);
        l.add(new CreditPorte(herite, AUJOURDHUI.minusDays(30)));
        ScoreAgentDto s = calc.calculer(1L, "951", l, ANCIEN, 20, AUJOURDHUI);
        assertEquals(1, s.getNbHerites());
        assertEquals(1, s.getNbEnRetard());                                      // affiche quand meme
        assertEquals(100, s.getScore());                                         // mais hors score
        // Le meme credit confie il y a 100 jours : la franchise est passee
        l.set(19, new CreditPorte(herite, AUJOURDHUI.minusDays(100)));
        s = calc.calculer(1L, "951", l, ANCIEN, 20, AUJOURDHUI);
        assertEquals(0, s.getNbHerites());
        assertEquals("B", s.getClasse());
    }

    @Test
    void nonNoteSousLesMinimums() {
        ScoreAgentDto s = calc.calculer(1L, "951", portefeuilleSain(4), ANCIEN, 20, AUJOURDHUI);
        assertEquals("NN", s.getClasse());
        assertNull(s.getScore());
        assertEquals("moins de 10 crédits en cours (4)", s.getMotifNonNote());
        s = calc.calculer(1L, "951", portefeuilleSain(20), AUJOURDHUI.minusDays(20), 20, AUJOURDHUI);
        assertEquals("affecté depuis moins de 90 jours", s.getMotifNonNote());
    }

    @Test
    void chargeAuProrataDeLaMediane() {
        ScoreAgentDto s = calc.calculer(1L, "951", portefeuilleSain(12), ANCIEN, 24, AUJOURDHUI);
        assertEquals(new BigDecimal("5.00"), s.getPtsCharge());                  // 12 / 24
        assertEquals(94, s.getScore());                                          // 85 / 90
    }

    @Test
    void medianeDesAgentsQuiPortent() {
        assertEquals(0, ScoreAgentCalculateur.mediane(List.of()));
        assertEquals(20, ScoreAgentCalculateur.mediane(List.of(5, 20, 40)));
        assertEquals(20, ScoreAgentCalculateur.mediane(List.of(0, 10, 20, 30, 0)));   // les zeros sont ignores
        assertEquals(15, ScoreAgentCalculateur.mediane(List.of(10, 20)));
    }
}
