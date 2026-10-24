package io.digiservices.userservice.service;

import org.junit.jupiter.api.Test;

import static io.digiservices.userservice.service.ContactEquipeService.niveauDe;
import static io.digiservices.userservice.service.ContactEquipeService.peutSaisir;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

/** Qui voit quoi, et qui saisit a la place d'un agent (V173). */
class ContactEquipeServiceTest {

    @Test
    void agenceDelegationReseau() {
        assertEquals("AGENCE", niveauDe("DA", "DE"));
        assertEquals("AGENCE", niveauDe("RA", "DE"));
        assertEquals("DELEGATION", niveauDe("DR", "DE"));
        assertEquals("RESEAU", niveauDe("DG", null));
        assertEquals("RESEAU", niveauDe("MANAGER", "DE"));
        assertEquals("RESEAU", niveauDe("MANAGER", "DSIG"));
        assertEquals("RESEAU", niveauDe("SUPER_ADMIN", null));
    }

    @Test
    void laPageNeSOuvrePasPourLesAutres() {
        assertNull(niveauDe("AGENT_CREDIT", "DE"));
        assertNull(niveauDe("CAISSE", null));
        assertNull(niveauDe("MANAGER", "DRH"));
        assertNull(niveauDe("MANAGER", "Audit"));
        assertNull(niveauDe(null, null));
    }

    @Test
    void seulsLeDirecteurDAgenceEtLaDsigSaisissent() {
        assertTrue(peutSaisir("DA", "DE"));
        assertTrue(peutSaisir("SUPER_ADMIN", null));
        assertTrue(peutSaisir("MANAGER", "DSIG"));
        // Le directeur regional et la Direction de l'exploitation suivent, ils ne saisissent pas.
        assertFalse(peutSaisir("DR", "DE"));
        assertFalse(peutSaisir("MANAGER", "DE"));
        assertFalse(peutSaisir("RA", "DE"));
        assertFalse(peutSaisir("AGENT_CREDIT", "DE"));
    }

    @Test
    void casseEtEspacesSansImportance() {
        assertEquals("AGENCE", niveauDe(" da ", " de "));
        assertTrue(peutSaisir("manager", "dsig"));
    }
}
