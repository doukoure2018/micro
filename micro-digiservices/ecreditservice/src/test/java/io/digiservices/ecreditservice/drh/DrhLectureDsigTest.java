package io.digiservices.ecreditservice.drh;

import io.digiservices.clients.domain.User;
import io.digiservices.ecreditservice.drh.repository.DrhRepository;
import io.digiservices.ecreditservice.drh.service.impl.DrhServiceImpl;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

/**
 * La DSIG consulte les pointages et les mouvements du personnel, et ne les modifie jamais.
 *
 * <p>Ces deux ecrans servent aussi a instruire la plateforme : qui etait present le jour ou une
 * saisie fautive est partie, quel agent a ete mute pendant qu'un dossier dormait. Mais ce sont
 * des donnees de paie et de carriere : toute correction engage la responsabilite de la DRH.</p>
 *
 * <p>La separation tient donc a une seule chose — {@code aHabilitationLecture} s'ouvre,
 * {@code aHabilitation} reste fermee. C'est elle que ce test protege : les confondre donnerait
 * a la DSIG le droit de corriger un pointage, ce que personne n'a demande.</p>
 */
class DrhLectureDsigTest {

    private static final String PRESENCES = DrhServiceImpl.F_PRESENCES;
    private static final String MOUVEMENTS = DrhServiceImpl.F_MOUVEMENTS;

    private DrhServiceImpl service() {
        DrhRepository depot = mock(DrhRepository.class);
        when(depot.fonctionsDelegueesDe(anyLong())).thenReturn(List.of());
        when(depot.estMembreDepartementDrh(anyLong())).thenReturn(false);
        return new DrhServiceImpl(depot,
                mock(io.digiservices.ecreditservice.service.SmsService.class));
    }

    private static User compte(String role, String serviceRattachement) {
        User u = new User();
        u.setUserId(1L);
        u.setRole(role);
        u.setService(serviceRattachement);
        return u;
    }

    @Test
    @DisplayName("la DSIG lit les presences et les mouvements")
    void laDsigLit() {
        DrhServiceImpl s = service();
        for (String role : new String[]{"MANAGER", "USER", null}) {
            User u = compte(role, "DSIG");
            assertTrue(s.aHabilitationLecture(u, PRESENCES), "DSIG/" + role + " doit lire les presences");
            assertTrue(s.aHabilitationLecture(u, MOUVEMENTS), "DSIG/" + role + " doit lire les mouvements");
        }
        // La casse du libelle du service ne doit pas fermer la porte.
        assertTrue(s.aHabilitationLecture(compte("MANAGER", " dsig "), PRESENCES));
    }

    @Test
    @DisplayName("la DSIG n'ecrit jamais : ni pointage corrige, ni mouvement saisi")
    void laDsigNEcritPas() {
        DrhServiceImpl s = service();
        User u = compte("MANAGER", "DSIG");
        assertFalse(s.aHabilitation(u, PRESENCES), "corriger un pointage reste a la DRH");
        assertFalse(s.aHabilitation(u, MOUVEMENTS), "saisir un mouvement reste a la DRH");
    }

    @Test
    @DisplayName("l'ouverture ne deborde pas sur les autres fonctions DRH")
    void pasDeDebordement() {
        DrhServiceImpl s = service();
        User u = compte("MANAGER", "DSIG");
        for (String f : new String[]{"VALIDATION_CONGES", "VALIDATION_PREVISIONS", "PERSONNEL",
                "AVANCES", "ORGANISATION"}) {
            assertFalse(s.aHabilitationLecture(u, f),
                    "la DSIG n'a rien a faire dans « " + f + " » : seules les presences et les "
                            + "mouvements lui ont ete ouverts");
        }
    }

    @Test
    @DisplayName("un service autre que la DSIG reste dehors")
    void lesAutresServicesRestentDehors() {
        DrhServiceImpl s = service();
        for (String serviceRattachement : new String[]{"DE", "Audit", "DF", "DI", null, ""}) {
            assertFalse(s.aHabilitationLecture(compte("MANAGER", serviceRattachement), PRESENCES),
                    "le service " + serviceRattachement + " ne doit pas lire les presences");
        }
    }
}
