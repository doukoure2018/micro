package io.digiservices.ecreditservice.service;

import io.digiservices.clients.domain.User;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * Qui echappe a la coupure de 10 h du rapprochement de caisse.
 *
 * <p>La coupure est une regle d'exploitation : le caissier et son responsable d'agence
 * rapprochent le matin, avant que la journee comptable ne s'ecarte. Elle n'a jamais eu pour
 * objet d'empecher de CONTROLER un rapprochement deja fait. Le 07/11/2026, le directeur de la
 * DSIG ouvrait l'ecran d'audit — son habilitation le lui donnait — et recevait « Le service de
 * rapprochement caisse est ferme » des qu'il lancait la verification apres 10 h 15 : la journee
 * entiere lui etait fermee pour regarder la veille.</p>
 *
 * <p>Ce test tient les deux bords. Ouvrir pour les services qui controlent sans tenir de caisse,
 * et refermer pour ceux qui en tiennent une : si le RA passait par l'ecran d'audit, il
 * rapprocherait sa propre caisse a 16 h et la coupure ne vaudrait plus rien.</p>
 */
class RapprochementCoupureExemptionTest {

    private final RapprochementCutoffService service = new RapprochementCutoffService();

    private static User compte(String role, String serviceRattachement) {
        User u = new User();
        u.setUserId(1L);
        u.setRole(role);
        u.setService(serviceRattachement);
        return u;
    }

    @Test
    @DisplayName("les services qui controlent le reseau ne sont pas tenus par l'heure")
    void lesServicesDeControleSontExemptes() {
        for (String s : new String[]{"DSIG", "Audit", "DI", "DF", "DE"}) {
            for (String role : new String[]{"MANAGER", "USER", null}) {
                assertTrue(service.exempteDeCoupure(compte(role, s)),
                        "le service " + s + " (role " + role + ") controle le rapprochement, "
                                + "il ne le produit pas");
            }
        }
        // La casse et les espaces du libelle ne doivent pas refermer la porte : les fiches
        // d'agents portent « dsig », « DSIG » et parfois un espace de saisie.
        assertTrue(service.exempteDeCoupure(compte("MANAGER", " dsig ")));
        assertTrue(service.exempteDeCoupure(compte("MANAGER", "audit")));
    }

    @Test
    @DisplayName("le DG et le SUPER_ADMIN s'expriment par leur role, sans service")
    void lesRolesDeDirection() {
        assertTrue(service.exempteDeCoupure(compte("DG", null)));
        assertTrue(service.exempteDeCoupure(compte("SUPER_ADMIN", null)));
        assertTrue(service.exempteDeCoupure(compte("super_admin", "")));
    }

    @Test
    @DisplayName("ceux qui tiennent une caisse restent tenus par l'heure")
    void lesPorteursDeCaisseRestentTenus() {
        // C'est le coeur de la regle : le RA et le DA ont la rubrique RAPPROCHEMENT_CAISSE et
        // atteignent donc l'ecran d'audit. S'ils en etaient exemptes, la coupure du matin
        // serait contournable d'un clic.
        for (String role : new String[]{"AGENT_CREDIT", "RA", "DA", "DR", "USER", "MANAGER"}) {
            assertFalse(service.exempteDeCoupure(compte(role, null)),
                    "le role " + role + " doit rester tenu par la coupure");
        }
        for (String s : new String[]{"DRH", "Societariat", "Juridique", "", null}) {
            assertFalse(service.exempteDeCoupure(compte("MANAGER", s)),
                    "le service " + s + " n'a pas a rapprocher l'apres-midi");
        }
    }

    @Test
    @DisplayName("un compte introuvable n'ouvre rien")
    void compteInconnu() {
        // getUserByUuid peut rendre null : dans le doute, la coupure s'applique.
        assertFalse(service.exempteDeCoupure(null));
    }

    @Test
    @DisplayName("l'exemption suit la liste unique des services du siege")
    void memeListeQueLePerimetre() {
        // Deux listes finissent par diverger — c'est exactement ce qui est arrive le 05/11/2026
        // entre PerimetreSafService et le resolveur de l'outil de bureau. Celle-ci est derivee,
        // pas recopiee ; ce test le verifie pour que personne ne la recopie demain.
        for (String s : new String[]{"DSIG", "Audit", "DI", "DF", "DE", "DRH", "Juridique"}) {
            assertTrue(PerimetreSafService.serviceReseau(s) == service.exempteDeCoupure(compte("MANAGER", s)),
                    "l'exemption et le perimetre doivent repondre la meme chose pour « " + s + " »");
        }
    }
}
