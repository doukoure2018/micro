package io.digiservices.userservice.perimetre;

import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

/** Profils de l'outil de rapprochement et perimetre en codes de points de service. */
class RapprochementProfilResolverTest {

    // Reseau de test : 1 delegation (10) > 2 agences (20, 21) > 3 points de service.
    private static final StructureReseau RESEAU = new StructureReseau(
            List.of(new StructureReseau.DelegationRow(10L, "KANKAN")),
            List.of(new StructureReseau.AgenceRow(20L, "KANKAN", 10L),
                    new StructureReseau.AgenceRow(21L, "SIGUIRI", 10L)),
            List.of(new StructureReseau.PointVenteRow(100L, "Kankan", "322", 20L, 10L),
                    new StructureReseau.PointVenteRow(101L, "Nafagui", "336", 20L, 10L),
                    new StructureReseau.PointVenteRow(102L, "Siguiri", "331", 21L, 10L)));

    @Test
    void agentDeCreditVoitSonPointDeService() {
        assertEquals("AGENT_CREDIT", RapprochementProfilResolver.profil("AGENT_CREDIT", "DE"));
        assertEquals(PerimetreNiveau.POINT_DE_SERVICE, RapprochementProfilResolver.niveau("AGENT_CREDIT"));
        assertEquals(List.of("336"),
                RapprochementPerimetreBuilder.points(PerimetreNiveau.POINT_DE_SERVICE, 10L, 20L, 101L, RESEAU));
    }

    @Test
    void responsableAgenceVoitSonAgence() {
        assertEquals("RA", RapprochementProfilResolver.profil("RA", "DE"));
        assertEquals(PerimetreNiveau.AGENCE, RapprochementProfilResolver.niveau("RA"));
        assertEquals(List.of("322", "336"),
                RapprochementPerimetreBuilder.points(PerimetreNiveau.AGENCE, 10L, 20L, null, RESEAU));
    }

    @Test
    void delegationEtDrVoientLaDelegation() {
        assertEquals("DELEGATION", RapprochementProfilResolver.profil("AGENT_DELEGATION", null));
        assertEquals("DR", RapprochementProfilResolver.profil("DR", "DE"));
        assertEquals(PerimetreNiveau.DELEGATION, RapprochementProfilResolver.niveau("DELEGATION"));
        assertEquals(PerimetreNiveau.DELEGATION, RapprochementProfilResolver.niveau("DR"));
        assertEquals(List.of("322", "331", "336"),
                RapprochementPerimetreBuilder.points(PerimetreNiveau.DELEGATION, 10L, null, null, RESEAU));
    }

    @Test
    void managerSelonSonService() {
        assertEquals("DE", RapprochementProfilResolver.profil("MANAGER", "DE"));
        assertEquals("INSPECTION", RapprochementProfilResolver.profil("MANAGER", "DI"));
        assertEquals("DSIG", RapprochementProfilResolver.profil("MANAGER", "DSIG"));
        assertNull(RapprochementProfilResolver.profil("MANAGER", "DRH"));
        assertNull(RapprochementProfilResolver.profil("MANAGER", "Audit"));
        assertNull(RapprochementProfilResolver.profil("MANAGER", null));
    }

    @Test
    void directionEtDsigSontNationaux() {
        assertEquals("DIRECTION", RapprochementProfilResolver.profil("DG", null));
        assertEquals("DSIG", RapprochementProfilResolver.profil("SUPER_ADMIN", "DSIG"));
        assertEquals(PerimetreNiveau.NATIONAL, RapprochementProfilResolver.niveau("DIRECTION"));
        assertEquals(PerimetreNiveau.NATIONAL, RapprochementProfilResolver.niveau("INSPECTION"));
        // Au niveau national la liste des codes reste vide : l'outil lit tout le reseau.
        assertTrue(RapprochementPerimetreBuilder.points(PerimetreNiveau.NATIONAL, null, null, null, RESEAU).isEmpty());
    }

    @Test
    void rolesNonHabilites() {
        assertNull(RapprochementProfilResolver.profil("DA", "DE"));
        assertNull(RapprochementProfilResolver.profil("CAISSE", null));
        assertNull(RapprochementProfilResolver.profil("AGENT_ACCUEIL", null));
        assertNull(RapprochementProfilResolver.profil("USER", "Personnel"));
        assertNull(RapprochementProfilResolver.profil(null, null));
        assertNull(RapprochementProfilResolver.niveau(null));
    }

    @Test
    void seulesLaDeEtLaDsigRecalculentLeReseau() {
        assertTrue(RapprochementProfilResolver.peutRecalculerLeReseau("DE"));
        assertTrue(RapprochementProfilResolver.peutRecalculerLeReseau("DSIG"));
        assertFalse(RapprochementProfilResolver.peutRecalculerLeReseau("INSPECTION"));
        assertFalse(RapprochementProfilResolver.peutRecalculerLeReseau("DIRECTION"));
        assertFalse(RapprochementProfilResolver.peutRecalculerLeReseau("DR"));
        assertFalse(RapprochementProfilResolver.peutRecalculerLeReseau(null));
    }

    @Test
    void ficheIncompleteDonneUnPerimetreVide() {
        // Agent de credit sans point de service : perimetre vide, l'outil le dit a l'utilisateur.
        assertTrue(RapprochementPerimetreBuilder.points(PerimetreNiveau.POINT_DE_SERVICE, 10L, 20L, null, RESEAU).isEmpty());
        assertTrue(RapprochementPerimetreBuilder.points(PerimetreNiveau.AGENCE, 10L, null, null, RESEAU).isEmpty());
        assertTrue(RapprochementPerimetreBuilder.points(null, 10L, 20L, 100L, RESEAU).isEmpty());
    }
}
