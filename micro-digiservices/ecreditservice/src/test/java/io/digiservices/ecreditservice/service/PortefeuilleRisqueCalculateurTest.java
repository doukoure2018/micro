package io.digiservices.ecreditservice.service;

import io.digiservices.clients.portefeuille.PortefeuilleCreditDto;
import io.digiservices.ecreditservice.dto.PortefeuilleAffectationDtos.AffectationDto;
import io.digiservices.ecreditservice.dto.PortefeuilleRisqueDtos.LigneRisqueDto;
import io.digiservices.ecreditservice.service.PortefeuilleRisqueCalculateur.Resultat;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Set;

import static io.digiservices.ecreditservice.dto.PortefeuilleRisqueDtos.NON_AFFECTE;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * Quatre credits, deux produits, deux agents et un credit sans gestionnaire : les sommes par
 * produit et par agent doivent redonner le point de service, et la regle de l'agent de credit
 * ne doit laisser que sa ligne et « Non affecte ».
 */
class PortefeuilleRisqueCalculateurTest {

    private static final LocalDate JOUR = LocalDate.of(2026, 10, 29);
    private static final String PS = "102";

    // A : agent 1, produit 3, retard 45 j, solde 100
    // B : agent 1, produit 3, sain, solde 50
    // C : non affecte, produit 10, retard 100 j, solde 200, contentieux declare
    // D : agent 2 (parti), produit 10, retard 10 j, solde 30
    private final List<PortefeuilleCreditDto> credits = List.of(
            credit(1L, 3L, "CREDIT COMMERCIAL", 100, JOUR.minusDays(45), 10, 2),
            credit(2L, 3L, "CREDIT COMMERCIAL", 50, null, 0, 0),
            credit(3L, 10L, "CREDIT AGRICOLE", 200, JOUR.minusDays(100), 80, 20),
            credit(4L, 10L, "CREDIT AGRICOLE", 30, JOUR.minusDays(10), 5, 1));

    private final Map<Long, AffectationDto> affectations = Map.of(
            1L, affectation(1L, "Conde Alioune", true, PS),
            2L, affectation(1L, "Conde Alioune", true, PS),
            4L, affectation(2L, "Sonomou Yake", false, PS));

    @Test
    void lesSommesRedonnentLePointDeService() {
        Resultat r = PortefeuilleRisqueCalculateur.calculer(credits, affectations, Set.of(3L), PS, JOUR, null);

        LigneRisqueDto t = r.total();
        assertEquals(4, t.getNbCredits());
        assertEquals(new BigDecimal("380"), t.getEncours());
        assertEquals(3, t.getNbEnRetard());
        assertEquals(new BigDecimal("300"), t.getEncoursPar30(), "A (45 j) et C (100 j)");
        assertEquals(2, t.getNbPar30());
        assertEquals(new BigDecimal("200"), t.getEncoursPar90(), "C seul");
        assertEquals(new BigDecimal("78.95"), t.getTauxPar30());
        assertEquals(new BigDecimal("52.63"), t.getTauxPar90());
        assertEquals(new BigDecimal("118"), t.getImpaye());
        assertEquals(1, t.getNbContentieuxDeclares());

        assertEquals(somme(r.parProduit(), LigneRisqueDto::getEncours), t.getEncours());
        assertEquals(somme(r.parAgent(), LigneRisqueDto::getEncours), t.getEncours());
        assertEquals(somme(r.croisement(), LigneRisqueDto::getEncours), t.getEncours());
        assertEquals(somme(r.parAgent(), LigneRisqueDto::getEncoursPar30), t.getEncoursPar30());
    }

    @Test
    void leProduitLePlusExposeVientEnTete() {
        Resultat r = PortefeuilleRisqueCalculateur.calculer(credits, affectations, Set.of(), PS, JOUR, null);
        assertEquals(2, r.parProduit().size());
        LigneRisqueDto agricole = r.parProduit().get(0);
        assertEquals("CREDIT AGRICOLE", agricole.getLibelle());
        assertEquals(new BigDecimal("200"), agricole.getEncoursPar30());
        assertEquals(new BigDecimal("86.96"), agricole.getTauxPar30(), "200 / 230");
        assertEquals("CREDIT COMMERCIAL", r.parProduit().get(1).getLibelle());
    }

    @Test
    void laLigneNonAffecteFermeLeTableauDesAgents() {
        Resultat r = PortefeuilleRisqueCalculateur.calculer(credits, affectations, Set.of(), PS, JOUR, null);
        assertEquals(3, r.parAgent().size());
        LigneRisqueDto derniere = r.parAgent().get(2);
        assertTrue(derniere.isNonAffecte());
        assertEquals(NON_AFFECTE, derniere.getCle());
        assertEquals(new BigDecimal("200"), derniere.getEncoursPar30(), "le non affecte porte le pire retard");
        // Les deux agents sont tries par PAR 30 decroissant : Conde (100) avant Sonomou (0).
        assertEquals(1L, r.parAgent().get(0).getAgentUserId());
        assertTrue(r.parAgent().get(0).getDisponible());
        assertEquals(2L, r.parAgent().get(1).getAgentUserId());
        assertFalse(r.parAgent().get(1).getDisponible(), "agent desactive");
    }

    @Test
    void lAgentDeCreditNeVoitQueSaLigneEtLeNonAffecte() {
        Resultat r = PortefeuilleRisqueCalculateur.calculer(credits, affectations, Set.of(), PS, JOUR, 2L);
        assertEquals(2, r.parAgent().size());
        assertEquals(2L, r.parAgent().get(0).getAgentUserId());
        assertTrue(r.parAgent().get(1).isNonAffecte());
        assertTrue(r.croisement().stream().allMatch(l -> l.isNonAffecte() || Long.valueOf(2L).equals(l.getAgentUserId())));
        // Le tableau par produit reste celui du point de service entier.
        assertEquals(new BigDecimal("380"), somme(r.parProduit(), LigneRisqueDto::getEncours));
    }

    @Test
    void lesFiltresDeLaListeDesCredits() {
        PortefeuilleCreditDto a = credits.get(0), c = credits.get(2);
        assertTrue(PortefeuilleRisqueCalculateur.correspond(a, affectations.get(1L), 3L, "1", "30", JOUR));
        assertFalse(PortefeuilleRisqueCalculateur.correspond(a, affectations.get(1L), 3L, "1", "90", JOUR));
        assertTrue(PortefeuilleRisqueCalculateur.correspond(c, null, null, NON_AFFECTE, "90", JOUR));
        assertFalse(PortefeuilleRisqueCalculateur.correspond(c, null, null, "1", null, JOUR));
        assertFalse(PortefeuilleRisqueCalculateur.correspond(a, affectations.get(1L), 10L, null, null, JOUR));
        assertTrue(PortefeuilleRisqueCalculateur.correspond(credits.get(1), affectations.get(2L), null, null, null, JOUR));
        assertFalse(PortefeuilleRisqueCalculateur.correspond(credits.get(1), affectations.get(2L), null, null, "retard", JOUR));
    }

    // ------------------------------------------------------------------ fabrique

    private static PortefeuilleCreditDto credit(long num, Long type, String libelle, int solde, LocalDate premiereImpayee,
                                                int capImpaye, int intImpaye) {
        PortefeuilleCreditDto c = new PortefeuilleCreditDto();
        c.setCodAgencia(PS);
        c.setNumCredito(num);
        c.setTipCredito(type);
        c.setDesTipCredito(libelle);
        c.setMonSaldo(BigDecimal.valueOf(solde));
        c.setDatPremiereImpayee(premiereImpayee);
        c.setMntCapImpaye(premiereImpayee == null ? null : BigDecimal.valueOf(capImpaye));
        c.setMntIntImpaye(premiereImpayee == null ? null : BigDecimal.valueOf(intImpaye));
        c.setIndEstado("D");
        return c;
    }

    private static AffectationDto affectation(long agent, String nom, boolean actif, String codAgenciaAgent) {
        AffectationDto a = new AffectationDto();
        a.setAgentUserId(agent);
        a.setAgentNom(nom);
        a.setAgentActif(actif);
        a.setAgentCodAgencia(codAgenciaAgent);
        a.setActif(true);
        return a;
    }

    private static BigDecimal somme(List<LigneRisqueDto> lignes, java.util.function.Function<LigneRisqueDto, BigDecimal> f) {
        return lignes.stream().map(f).reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
