package io.digiservices.authorizationserver.perimetre;

import io.digiservices.authorizationserver.model.PerimetreNiveau;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

class AgentPerimetreResolverTest {

    @Test
    void agentCreditVoitSonPointDeService() {
        assertEquals("AGENT_CREDIT", AgentPerimetreResolver.roleAgriScore("AGENT_CREDIT", null));
        assertEquals(PerimetreNiveau.POINT_DE_SERVICE, AgentPerimetreResolver.niveau("AGENT_CREDIT"));
    }

    @Test
    void daEtRaSontAuNiveauAgence() {
        assertEquals(PerimetreNiveau.AGENCE, AgentPerimetreResolver.niveau(AgentPerimetreResolver.roleAgriScore("DA", null)));
        assertEquals(PerimetreNiveau.AGENCE, AgentPerimetreResolver.niveau(AgentPerimetreResolver.roleAgriScore("RA", "CREDIT")));
    }

    @Test
    void drEstAuNiveauDelegation() {
        assertEquals(PerimetreNiveau.DELEGATION, AgentPerimetreResolver.niveau(AgentPerimetreResolver.roleAgriScore("DR", null)));
    }

    @Test
    void dgEstNational() {
        assertEquals("DG", AgentPerimetreResolver.roleAgriScore("DG", null));
        assertEquals(PerimetreNiveau.NATIONAL, AgentPerimetreResolver.niveau("DG"));
    }

    @Test
    void managerDuServiceDeDevientDeNational() {
        assertEquals("DE", AgentPerimetreResolver.roleAgriScore("MANAGER", "DE"));
        assertEquals("DE", AgentPerimetreResolver.roleAgriScore("MANAGER", " de "));
        assertEquals(PerimetreNiveau.NATIONAL, AgentPerimetreResolver.niveau("DE"));
    }

    @Test
    void autresManagersSontHorsPerimetre() {
        assertNull(AgentPerimetreResolver.roleAgriScore("MANAGER", "DSIG"));
        assertNull(AgentPerimetreResolver.roleAgriScore("MANAGER", "DRH"));
        assertNull(AgentPerimetreResolver.roleAgriScore("MANAGER", null));
    }

    @Test
    void rolesHorsAgriScoreSontIgnores() {
        assertNull(AgentPerimetreResolver.roleAgriScore("CAISSE", null));
        assertNull(AgentPerimetreResolver.roleAgriScore("SUPER_ADMIN", "DE"));
        assertNull(AgentPerimetreResolver.roleAgriScore(null, "DE"));
        assertNull(AgentPerimetreResolver.niveau(null));
    }
}
