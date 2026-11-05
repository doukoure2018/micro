package io.digiservices.ecreditservice.service;

import io.digiservices.clients.UserClient;
import io.digiservices.clients.domain.User;
import io.digiservices.ecreditservice.exception.ApiException;
import io.digiservices.ecreditservice.repository.PortefeuillePerimetreRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

/**
 * « Ce compte controle-t-il sans modifier ? » ne doit rien demander de son perimetre
 * geographique.
 *
 * <p>Le 02/11/2026, un operationnel de la DSIG cliquant « Je m'en occupe » sur un credit negatif
 * recevait « Acces reserve aux agents de credit et niveaux de direction ». La garde n'appelait
 * {@code perimetreDe} que pour lire {@code lectureSeule()}, mais {@code perimetreDe} commence par
 * exiger un rattachement geographique et refuse tout role hors agent de credit et direction. Le
 * compte portait bien la rubrique voulue : il mourait avant qu'on la regarde.</p>
 *
 * <p>Un ecran qui porte sur TOUT le reseau n'a pas de perimetre a borner. Son autorisation est la
 * rubrique d'habilitation, et le seul refus legitime est celui du service Audit.</p>
 */
class PerimetreSafLectureSeuleTest {

    private static final String UUID_TEST = "uuid-essai";

    private PerimetreSafService service(User user) {
        UserClient userClient = mock(UserClient.class);
        when(userClient.getUserByUuid(anyString())).thenReturn(user);
        return new PerimetreSafService(userClient, mock(PortefeuillePerimetreRepository.class));
    }

    private static User compte(String role, String serviceRattachement) {
        User u = new User();
        u.setUserId(1L);
        u.setRole(role);
        u.setService(serviceRattachement);
        return u;
    }

    @Test
    @DisplayName("un operationnel de la DSIG n'est pas en lecture seule, quel que soit son role")
    void unOperationnelPeutAgir() {
        // Le role importe peu : c'est le service qui dit si le compte controle sans modifier.
        for (String role : new String[]{"USER", "MANAGER", "ADMIN", null}) {
            assertFalse(service(compte(role, "DSIG")).lectureSeule(UUID_TEST),
                    "un compte DSIG de role " + role + " doit pouvoir agir");
        }
    }

    @Test
    @DisplayName("le service Audit reste en lecture seule")
    void leServiceAuditNePeutPasAgir() {
        assertTrue(service(compte("MANAGER", "Audit")).lectureSeule(UUID_TEST));
        // La casse du libelle ne doit pas ouvrir une porte derobee.
        assertTrue(service(compte("USER", "AUDIT")).lectureSeule(UUID_TEST));
        assertTrue(service(compte("USER", "audit")).lectureSeule(UUID_TEST));
    }

    @Test
    @DisplayName("un service absent ne vaut pas lecture seule")
    void serviceAbsent() {
        assertFalse(service(compte("AGENT_CREDIT", null)).lectureSeule(UUID_TEST));
        assertFalse(service(compte("DA", "")).lectureSeule(UUID_TEST));
    }

    @Test
    @DisplayName("un compte inconnu est refuse, sans se taire")
    void compteInconnu() {
        assertThrows(ApiException.class, () -> service(null).lectureSeule(UUID_TEST));
    }

    @Test
    @DisplayName("le directeur de la DSIG voit tout le reseau")
    void leDirecteurDeLaDsigVoitLeReseau() {
        // Ajoute le 05/11/2026 : il est MANAGER du service DSIG, pas SUPER_ADMIN, et se voyait
        // refuser le portefeuille SAF, le portefeuille a risque, les classes de confiance,
        // l'affectation, le contentieux et les ecrans d'audit — sur le tableau de bord de son
        // propre service.
        var p = service(compte("MANAGER", "DSIG")).perimetreDe(UUID_TEST);
        assertTrue(p.toutReseau(), "le service DSIG exploite la plateforme : il en voit tout");
        assertEquals("RESEAU", p.niveau());
        assertFalse(p.lectureSeule(), "la DSIG agit, contrairement au service Audit");
    }

    @Test
    @DisplayName("les trois autres directions gardent leur perimetre reseau")
    void lesAutresDirectionsGardentLeReseau() {
        for (String[] compte : new String[][]{{"DG", null}, {"SUPER_ADMIN", null},
                {"MANAGER", "DE"}, {"MANAGER", "Audit"}}) {
            var p = service(compte(compte[0], compte[1])).perimetreDe(UUID_TEST);
            assertTrue(p.toutReseau(), compte[0] + "/" + compte[1] + " doit voir le reseau");
        }
        // Et l'Audit reste en lecture seule, lui.
        assertTrue(service(compte("MANAGER", "Audit")).perimetreDe(UUID_TEST).lectureSeule());
    }

    @Test
    @DisplayName("perimetreDe, lui, refuse toujours un role sans rattachement geographique")
    void perimetreDeRefuseToujoursUnRoleSansRattachement() {
        // C'est bien le comportement attendu de perimetreDe : il borne ce que le compte voit du
        // reseau, et un role sans rattachement n'a rien a y faire. C'est pour cela qu'un ecran
        // couvrant tout le reseau ne doit pas l'appeler pour une simple question de lecture seule.
        ApiException e = assertThrows(ApiException.class,
                () -> service(compte("USER", "DSIG")).perimetreDe(UUID_TEST));
        assertTrue(e.getMessage().contains("agents de credit"),
                "le message de perimetreDe doit rester celui du perimetre, pas celui d'une action");
    }
}
