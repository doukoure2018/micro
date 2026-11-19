package io.digiservices.ecreditservice.dossier;

import io.digiservices.ecreditservice.dossier.AnnulationDossier.Acteur;
import io.digiservices.ecreditservice.dossier.AnnulationDossier.Decision;
import io.digiservices.ecreditservice.dossier.AnnulationDossier.Dossier;
import io.digiservices.ecreditservice.dossier.AnnulationDossier.Mode;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static io.digiservices.ecreditservice.dossier.AnnulationDossier.*;
import static org.junit.jupiter.api.Assertions.*;

/**
 * La règle d'annulation, étape par étape et rôle par rôle (V216, DSIG du 2026-11-19).
 *
 * <p>Ce qui est protégé ici : le tenant annule directement, les autres demandent, une demande
 * ne remonte jamais plus d'un cran, un crédit mis en place dans SAF n'est jamais annulé ici,
 * et un dossier clôturé ne bouge plus.</p>
 */
class AnnulationDossierTest {

    private static final Long AGENCE = 26L, AUTRE_AGENCE = 27L, DELEGATION = 950L, AUTRE_DELEGATION = 951L;

    private static Dossier dossier(String etape) {
        return new Dossier(816L, etape, STATUT_VIVANT, AGENCE, DELEGATION, 754L, "WASOROPOGUI420", 900L, false);
    }

    private static Acteur agent(Long userId) {
        return new Acteur(AGENT_CREDIT, null, userId, "AGENT", "Agent Test", AGENCE, DELEGATION);
    }

    private static Acteur da(Long agence) {
        return new Acteur(DA, null, 10L, "DA", "Dir Agence", agence, DELEGATION);
    }

    private static Acteur dr(Long delegation) {
        return new Acteur(DR, null, 20L, "DR", "Dir Regional", null, delegation);
    }

    private static final Acteur DE_ = new Acteur("MANAGER", "DE", 30L, "DE", "Direction Exploitation", null, null);
    private static final Acteur DG_ = new Acteur(DG, null, 40L, "DG", "Direction Generale", null, null);
    private static final Acteur DSIG_ = new Acteur("SUPER_ADMIN", "DSIG", 50L, "ADMIN", "Admin", null, null);

    @Test
    @DisplayName("le tenant de chaque étape est celui dont la file contient le dossier")
    void tenants() {
        assertEquals(DA, tenantDe("EN_ATTENTE_DA"));
        assertEquals(DA, tenantDe("NOUVEAU"));
        assertEquals(DA, tenantDe(null));
        assertEquals(DA, tenantDe("SELECTION"));
        assertEquals(DA, tenantDe("VALIDATION"));
        assertEquals(DA, tenantDe("APPROVED"));
        assertEquals(DR, tenantDe("VALIDATED_DA"));
        assertEquals(DE, tenantDe("VALIDATED_DR"));
        assertEquals(DE, tenantDe("VALIDATED_FINAL"));
        assertEquals(DG, tenantDe("PENDING_DG"));
        assertNull(tenantDe("ANNULATION_DEMANDEE"));
    }

    @Test
    @DisplayName("l'agent affecté demande, le DA de l'agence annule directement (dossier 816 en sélection)")
    void dossier816() {
        Dossier d = dossier("SELECTION");
        Decision agentAffecte = decider(agent(754L), d);
        assertEquals(Mode.DEMANDEE, agentAffecte.mode());
        assertEquals(DA, agentAffecte.tenant());
        assertTrue(agentAffecte.raison().contains("Directeur d'Agence"));

        assertEquals(Mode.REFUS, decider(agent(999L), d).mode(), "un autre agent n'a rien à faire ici");
        assertEquals(Mode.DIRECTE, decider(da(AGENCE), d).mode());
        assertEquals(Mode.REFUS, decider(da(AUTRE_AGENCE), d).mode(), "pas son agence");
    }

    @Test
    @DisplayName("l'agent est reconnu par identifiant, par identifiant SAF ou par nom affiché (anciens dossiers)")
    void agentAffecteTroisEcritures() {
        Dossier d = new Dossier(1L, "SELECTION", STATUT_VIVANT, AGENCE, DELEGATION, null, "WASOROPOGUI420", null, false);
        assertTrue(estAgentAffecte(new Acteur(AGENT_CREDIT, null, 5L, "WASOROPOGUI420", "x", AGENCE, DELEGATION), d));
        assertTrue(estAgentAffecte(new Acteur(AGENT_CREDIT, null, 5L, "autre", "WASOROPOGUI420", AGENCE, DELEGATION), d));
        assertFalse(estAgentAffecte(new Acteur(AGENT_CREDIT, null, 5L, "autre", "y", AGENCE, DELEGATION), d));
    }

    @Test
    @DisplayName("à l'accueil : le DA annule, l'agent d'accueil qui a saisi demande, l'agent de crédit n'a pas la main")
    void accueil() {
        Dossier d = dossier("EN_ATTENTE_DA");
        assertEquals(Mode.DIRECTE, decider(da(AGENCE), d).mode());
        Acteur accueil = new Acteur(AGENT_ACCUEIL, null, 900L, "ACC", "Accueil", AGENCE, DELEGATION);
        assertEquals(Mode.DEMANDEE, decider(accueil, d).mode());
        Acteur autreAccueil = new Acteur(AGENT_ACCUEIL, null, 901L, "ACC2", "Accueil 2", AGENCE, DELEGATION);
        assertEquals(Mode.REFUS, decider(autreAccueil, d).mode());
        assertEquals(Mode.REFUS, decider(agent(754L), d).mode());
    }

    @Test
    @DisplayName("au-dessus de l'agence, le DA redevient demandeur et une demande ne remonte que d'un cran")
    void circuitHierarchique() {
        Dossier chezLeDr = dossier("VALIDATED_DA");
        assertEquals(Mode.DIRECTE, decider(dr(DELEGATION), chezLeDr).mode());
        assertEquals(Mode.REFUS, decider(dr(AUTRE_DELEGATION), chezLeDr).mode());
        assertEquals(Mode.DEMANDEE, decider(da(AGENCE), chezLeDr).mode());
        assertEquals(DR, decider(da(AGENCE), chezLeDr).tenant());
        assertEquals(Mode.DEMANDEE, decider(agent(754L), chezLeDr).mode());
        assertEquals(Mode.REFUS, decider(DE_, chezLeDr).mode(), "la DE ne tranche pas un dossier qui est chez le DR");

        Dossier chezLaDe = dossier("VALIDATED_DR");
        assertEquals(Mode.DIRECTE, decider(DE_, chezLaDe).mode());
        assertEquals(Mode.DEMANDEE, decider(dr(DELEGATION), chezLaDe).mode());
        assertEquals(Mode.DEMANDEE, decider(da(AGENCE), chezLaDe).mode());

        Dossier chezLaDg = dossier("PENDING_DG");
        assertEquals(Mode.DIRECTE, decider(DG_, chezLaDg).mode());
        assertEquals(Mode.DEMANDEE, decider(DE_, chezLaDg).mode());
        assertEquals(Mode.DEMANDEE, decider(dr(DELEGATION), chezLaDg).mode());
    }

    @Test
    @DisplayName("niveau final : la DE annule tant que SAF n'a pas de crédit ; après la mise en place, plus personne")
    void niveauFinal() {
        Dossier pasEncore = dossier("VALIDATED_FINAL");
        assertEquals(Mode.DIRECTE, decider(DE_, pasEncore).mode());
        assertEquals(Mode.DEMANDEE, decider(da(AGENCE), pasEncore).mode());
        assertEquals(Mode.DEMANDEE, decider(agent(754L), pasEncore).mode());

        Dossier misEnPlace = new Dossier(1L, "VALIDATED_FINAL", STATUT_VIVANT, AGENCE, DELEGATION, 754L, null, null, true);
        for (Acteur a : new Acteur[]{DE_, DG_, DSIG_, da(AGENCE), agent(754L)}) {
            Decision decision = decider(a, misEnPlace);
            assertEquals(Mode.REFUS, decision.mode(), a.role());
            assertTrue(decision.raison().contains("SAF"));
        }
    }

    @Test
    @DisplayName("la DSIG annule directement partout, un dossier clôturé ou déjà en demande ne bouge plus")
    void dsigEtClotures() {
        assertEquals(Mode.DIRECTE, decider(DSIG_, dossier("NOUVEAU")).mode());
        assertEquals(Mode.DIRECTE, decider(DSIG_, dossier("PENDING_DG")).mode());
        Dossier annule = new Dossier(1L, "SELECTION", "ANNULE", AGENCE, DELEGATION, 754L, null, null, false);
        assertEquals(Mode.REFUS, decider(DSIG_, annule).mode());
        Dossier enDemande = dossier("ANNULATION_DEMANDEE");
        assertEquals(Mode.REFUS, decider(da(AGENCE), enDemande).mode());
        assertEquals(Mode.REFUS, decider(DSIG_, enDemande).mode());
    }

    @Test
    @DisplayName("valider, refuser ou rouvrir : le tenant de l'étape mémorisée, dans son périmètre, ou la DSIG")
    void decideurs() {
        Dossier d = dossier("VALIDATED_DA");
        assertTrue(peutDecider(dr(DELEGATION), DR, d));
        assertFalse(peutDecider(dr(AUTRE_DELEGATION), DR, d));
        assertFalse(peutDecider(da(AGENCE), DR, d));
        assertTrue(peutDecider(DSIG_, DR, d));
        assertTrue(peutDecider(da(AGENCE), DA, dossier("SELECTION")));
        assertFalse(peutDecider(da(AUTRE_AGENCE), DA, dossier("SELECTION")));
        assertTrue(peutDecider(DE_, DE, dossier("VALIDATED_FINAL")));
        assertFalse(peutDecider(null, DA, d));
    }
}
