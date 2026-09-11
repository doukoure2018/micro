package io.digiservices.authorizationserver.perimetre;

import io.digiservices.authorizationserver.model.PerimetreNiveau;
import io.digiservices.authorizationserver.model.StructureReseau;
import io.digiservices.authorizationserver.model.StructureReseau.AgenceRow;
import io.digiservices.authorizationserver.model.StructureReseau.DelegationRow;
import io.digiservices.authorizationserver.model.StructureReseau.PointVenteRow;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * Réseau de test : 2 délégations, 3 agences, 5 points de service.
 * Haute Guinée (2) : DINGUIRAYE (22 : 555, 556) et KANKAN (23 : 322)
 * Guinée Forestière (5) : NZEREKORE (7 : 420, 421)
 */
class AgentPerimetreBuilderTest {

    private static final StructureReseau RESEAU = new StructureReseau(
            List.of(new DelegationRow(2L, "Haute Guinée"), new DelegationRow(5L, "Guinée Forestière")),
            List.of(new AgenceRow(22L, "DINGUIRAYE", 2L), new AgenceRow(23L, "KANKAN", 2L), new AgenceRow(7L, "NZEREKORE", 5L)),
            List.of(new PointVenteRow(113L, "Dialakoro", "555", 22L, 2L),
                    new PointVenteRow(112L, "Kalinko", "556", 22L, 2L),
                    new PointVenteRow(50L, "Kankan", "322", 23L, 2L),
                    new PointVenteRow(30L, "N'Zerekoré 2", "420", 7L, 5L),
                    new PointVenteRow(31L, "N'Zerekoré 1", "421", 7L, 5L)));

    @SuppressWarnings("unchecked")
    private static List<Map<String, Object>> delegations(Map<String, Object> perimetre) {
        return (List<Map<String, Object>>) perimetre.get("delegations");
    }

    @SuppressWarnings("unchecked")
    private static List<Map<String, Object>> agences(Map<String, Object> delegation) {
        return (List<Map<String, Object>>) delegation.get("agences");
    }

    @SuppressWarnings("unchecked")
    private static List<Map<String, Object>> points(Map<String, Object> agence) {
        return (List<Map<String, Object>>) agence.get("points_de_service");
    }

    @Test
    void agentCreditNeVoitQueSonPoint() {
        Map<String, Object> p = AgentPerimetreBuilder.build(PerimetreNiveau.POINT_DE_SERVICE, 5L, 7L, 30L, RESEAU);
        assertEquals("POINT_DE_SERVICE", p.get("niveau"));
        List<Map<String, Object>> d = delegations(p);
        assertEquals(1, d.size());
        assertEquals(5L, d.get(0).get("id"));
        List<Map<String, Object>> a = agences(d.get(0));
        assertEquals(1, a.size());
        assertEquals(7L, a.get(0).get("id"));
        List<Map<String, Object>> pts = points(a.get(0));
        assertEquals(1, pts.size());
        assertEquals("420", pts.get(0).get("code"));
    }

    @Test
    void daVoitTousLesPointsDeSonAgence() {
        Map<String, Object> p = AgentPerimetreBuilder.build(PerimetreNiveau.AGENCE, 2L, 22L, null, RESEAU);
        List<Map<String, Object>> a = agences(delegations(p).get(0));
        assertEquals(1, a.size());
        assertEquals("DINGUIRAYE", a.get(0).get("libelle"));
        assertEquals(2, points(a.get(0)).size());
    }

    @Test
    void daAvecPointDeServiceParasiteResteAuNiveauAgence() {
        Map<String, Object> p = AgentPerimetreBuilder.build(PerimetreNiveau.AGENCE, 2L, 22L, 113L, RESEAU);
        assertEquals(2, points(agences(delegations(p).get(0)).get(0)).size());
    }

    @Test
    void drVoitToutesLesAgencesDeSaDelegation() {
        Map<String, Object> p = AgentPerimetreBuilder.build(PerimetreNiveau.DELEGATION, 2L, null, null, RESEAU);
        List<Map<String, Object>> d = delegations(p);
        assertEquals(1, d.size());
        assertEquals("Haute Guinée", d.get(0).get("libelle"));
        List<Map<String, Object>> a = agences(d.get(0));
        assertEquals(2, a.size());
        assertEquals(3, a.stream().mapToInt(x -> points(x).size()).sum());
    }

    @Test
    void dgVoitToutLeReseau() {
        Map<String, Object> p = AgentPerimetreBuilder.build(PerimetreNiveau.NATIONAL, null, null, null, RESEAU);
        assertEquals("NATIONAL", p.get("niveau"));
        List<Map<String, Object>> d = delegations(p);
        assertEquals(2, d.size());
        assertEquals(5, d.stream().flatMap(x -> agences(x).stream()).mapToInt(x -> points(x).size()).sum());
    }

    @Test
    void daSansAgenceObtientSaDelegationVide() {
        Map<String, Object> p = AgentPerimetreBuilder.build(PerimetreNiveau.AGENCE, 2L, null, null, RESEAU);
        List<Map<String, Object>> d = delegations(p);
        assertEquals(1, d.size());
        assertTrue(agences(d.get(0)).isEmpty());
    }

    @Test
    void agentCreditSansPointObtientSonAgenceVide() {
        Map<String, Object> p = AgentPerimetreBuilder.build(PerimetreNiveau.POINT_DE_SERVICE, 2L, 22L, null, RESEAU);
        List<Map<String, Object>> a = agences(delegations(p).get(0));
        assertEquals(1, a.size());
        assertTrue(points(a.get(0)).isEmpty());
    }

    @Test
    void drSansDelegationObtientUnArbreVide() {
        Map<String, Object> p = AgentPerimetreBuilder.build(PerimetreNiveau.DELEGATION, null, null, null, RESEAU);
        assertEquals("DELEGATION", p.get("niveau"));
        assertTrue(delegations(p).isEmpty());
    }

    @Test
    void horsPerimetreDonneNiveauAucun() {
        Map<String, Object> p = AgentPerimetreBuilder.build(null, 2L, 22L, 113L, RESEAU);
        assertEquals("AUCUN", p.get("niveau"));
        assertTrue(delegations(p).isEmpty());
    }

    @Test
    void laDelegationDeLagencePrimeSurCelleDuProfil() {
        // profil incohérent : délégation 5 déclarée mais agence 22 (Haute Guinée)
        Map<String, Object> p = AgentPerimetreBuilder.build(PerimetreNiveau.AGENCE, 5L, 22L, null, RESEAU);
        assertEquals(2L, delegations(p).get(0).get("id"));
    }
}
