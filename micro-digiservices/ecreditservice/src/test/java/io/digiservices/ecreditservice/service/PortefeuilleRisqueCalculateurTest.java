package io.digiservices.ecreditservice.service;

import io.digiservices.clients.portefeuille.IndicateursProduitAgenceDto;
import io.digiservices.clients.portefeuille.PortefeuilleCreditDto;
import io.digiservices.ecreditservice.dto.PortefeuilleAffectationDtos.AffectationDto;
import io.digiservices.ecreditservice.dto.PortefeuilleRisqueDtos.FamilleProduitDto;
import io.digiservices.ecreditservice.dto.PortefeuilleRisqueDtos.LigneRisqueDto;
import io.digiservices.ecreditservice.repository.PortefeuillePerimetreRepository.PointVenteHierarchie;
import io.digiservices.ecreditservice.service.PortefeuilleRisqueCalculateur.ResultatReseau;
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
import static org.junit.jupiter.api.Assertions.assertNull;
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
        assertEquals(new BigDecimal("200"), t.getEncoursPar60(), "C (100 j) ; A n'a que 45 j");
        assertEquals(new BigDecimal("0"), t.getEncoursPar120(), "personne au-dela de 120 j");
        assertEquals(new BigDecimal("52.63"), t.getTauxPar60());
        assertEquals(1, t.getNbPar60());
        assertEquals(0, t.getNbPar120());
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


    @Test
    void leCroisementPorteLeNomDeLAgentEtLeLibelleDuProduit() {
        Resultat r = PortefeuilleRisqueCalculateur.calculer(credits, affectations, Set.of(), PS, JOUR, null);
        LigneRisqueDto x = r.croisement().stream().filter(l -> "1|3".equals(l.getCle())).findFirst().orElseThrow();
        assertEquals("Conde Alioune", x.getLibelle());
        assertEquals("CREDIT COMMERCIAL", x.getProduit());
        assertEquals(3L, x.getTipCredito());
        assertEquals(new BigDecimal("150"), x.getEncours());
        LigneRisqueDto na = r.croisement().stream().filter(l -> l.getCle().startsWith(NON_AFFECTE)).findFirst().orElseThrow();
        assertTrue(na.isNonAffecte());
        assertNull(na.getAgentUserId());
    }

    // ------------------------------------------------------------------ reseau (lot 2)

    // Deux agences : A (PS 102 et 103, delegation 1), B (PS 200, delegation 2) ; un PS 999 non rattache.
    private final List<PointVenteHierarchie> hierarchie = List.of(
            new PointVenteHierarchie("102", "Coyah", 10L, "Agence A", 1L, "Delegation 1"),
            new PointVenteHierarchie("103", "Dubreka", 10L, "Agence A", 1L, "Delegation 1"),
            new PointVenteHierarchie("200", "Kankan", 20L, "Agence B", 2L, "Delegation 2"));

    private final List<IndicateursProduitAgenceDto> saf = List.of(
            saf("102", 3L, "CREDIT COMMERCIAL", 10, 1000, 300, 100),
            saf("102", 10L, "CREDIT AGRICOLE", 5, 500, 0, 0),
            saf("103", 3L, "CREDIT COMMERCIAL", 4, 400, 200, 200),
            saf("200", 10L, "CREDIT AGRICOLE", 8, 800, 80, 0),
            saf("999", 10L, "CREDIT AGRICOLE", 1, 100, 100, 100));

    @Test
    void leReseauSeVentileParProduitEtParAgence() {
        ResultatReseau r = PortefeuilleRisqueCalculateur.agregerReseau(saf, hierarchie, "agence");
        assertEquals(28, r.total().getNbCredits());
        assertEquals(new BigDecimal("2800"), r.total().getEncours());
        assertEquals(new BigDecimal("680"), r.total().getEncoursPar30());
        assertEquals(new BigDecimal("680"), r.total().getEncoursPar60());
        assertEquals(new BigDecimal("400"), r.total().getEncoursPar120());
        assertEquals(new BigDecimal("24.29"), r.total().getTauxPar30());

        assertEquals(2, r.parProduit().size());
        LigneRisqueDto commercial = r.parProduit().get(0);
        assertEquals("CREDIT COMMERCIAL", commercial.getLibelle(), "500 de PAR 30 contre 180 : il vient en tete");
        assertEquals(new BigDecimal("1400"), commercial.getEncours());
        assertEquals(new BigDecimal("35.71"), commercial.getTauxPar30());

        assertEquals(3, r.parNiveau().size(), "agence A, agence B, non rattache");
        LigneRisqueDto a = r.parNiveau().stream().filter(l -> "Agence A".equals(l.getLibelle())).findFirst().orElseThrow();
        assertEquals("AGENCE", a.getNiveau());
        assertEquals(10L, a.getId());
        assertEquals("Delegation 1", a.getRattachement());
        assertEquals(2, a.getNbPointsService());
        assertEquals(new BigDecimal("1900"), a.getEncours());
        assertEquals(new BigDecimal("500"), a.getEncoursPar30());
        LigneRisqueDto orphelin = r.parNiveau().stream().filter(l -> "Non rattaché".equals(l.getLibelle())).findFirst().orElseThrow();
        assertNull(orphelin.getId());
        assertEquals(1, orphelin.getNbPointsService());

        assertEquals(r.total().getEncours(), somme(r.parNiveau(), LigneRisqueDto::getEncours));
        assertEquals(r.total().getEncours(), somme(r.parProduit(), LigneRisqueDto::getEncours));
    }

    @Test
    void leReseauParPointDeServiceEtParDelegation() {
        ResultatReseau ps = PortefeuilleRisqueCalculateur.agregerReseau(saf, hierarchie, "ps");
        assertEquals(4, ps.parNiveau().size());
        LigneRisqueDto coyah = ps.parNiveau().stream().filter(l -> "102".equals(l.getCode())).findFirst().orElseThrow();
        assertEquals("Coyah", coyah.getLibelle());
        assertEquals("Agence A", coyah.getRattachement());
        assertEquals(15, coyah.getNbCredits());

        ResultatReseau d = PortefeuilleRisqueCalculateur.agregerReseau(saf, hierarchie, "delegation");
        assertEquals(3, d.parNiveau().size());
        LigneRisqueDto d1 = d.parNiveau().stream().filter(l -> Long.valueOf(1L).equals(l.getId())).findFirst().orElseThrow();
        assertEquals("DELEGATION", d1.getNiveau());
        assertEquals(new BigDecimal("1900"), d1.getEncours());
    }

    @Test
    void lesFamillesRegroupentLesProduitsEtUnTypeInconnuTombeDansAutres() {
        ResultatReseau r = PortefeuilleRisqueCalculateur.agregerReseau(saf, hierarchie, "agence");
        Map<Long, FamilleProduitDto> familles = Map.of(
                3L, FamilleProduitDto.builder().tipCredito(3L).famille("Trésorerie et commerce").libelleCourt("Commerce")
                        .seuilPar30(new BigDecimal("7")).build());
        PortefeuilleRisqueCalculateur.appliquerFamilles(r.parProduit(), familles);
        LigneRisqueDto commercial = r.parProduit().get(0), agricole = r.parProduit().get(1);
        assertEquals("Trésorerie et commerce", commercial.getFamille());
        assertEquals("Commerce", commercial.getLibelleCourt());
        assertEquals(new BigDecimal("7"), commercial.getSeuilPar30());
        assertEquals("Autres", agricole.getFamille());
        assertNull(agricole.getSeuilPar30());

        List<LigneRisqueDto> parFamille = PortefeuilleRisqueCalculateur.parFamille(r.parProduit());
        assertEquals(2, parFamille.size());
        assertEquals(r.total().getEncours(), somme(parFamille, LigneRisqueDto::getEncours));
        LigneRisqueDto commerce = parFamille.stream().filter(l -> "Trésorerie et commerce".equals(l.getLibelle())).findFirst().orElseThrow();
        assertEquals(new BigDecimal("7"), commerce.getSeuilPar30());
        assertEquals(new BigDecimal("35.71"), commerce.getTauxPar30());
    }

    private static IndicateursProduitAgenceDto saf(String cod, Long tip, String des, int nb, int encours, int par30, int par90) {
        return new IndicateursProduitAgenceDto(cod, "PS " + cod, tip, des, nb, BigDecimal.valueOf(encours),
                par30 > 0 ? 2 : 0, BigDecimal.valueOf(par30 / 10), BigDecimal.valueOf(par30), par30 > 0 ? 1 : 0,
                BigDecimal.valueOf(par90), par90 > 0 ? 1 : 0,
                BigDecimal.valueOf(par30), par30 > 0 ? 1 : 0, BigDecimal.valueOf(par90), par90 > 0 ? 1 : 0);
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
