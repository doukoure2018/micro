package io.digiservices.ecreditservice.service;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * Les deux alertes SAF doivent atteindre la DE, la DF et l'inspection.
 *
 * <p>Deux methodes resolvent les destinataires d'une rubrique, et la difference est invisible a
 * la lecture :</p>
 *
 * <ul>
 *   <li>{@code porteursDeRubrique} ne regarde que les DEPARTEMENTS de la matrice et le drapeau
 *       « tout voir » ;</li>
 *   <li>{@code porteursParRoleOuDepartement} honore en plus les ROLES, c'est-a-dire la regle que
 *       la plateforme applique partout ailleurs.</li>
 * </ul>
 *
 * <p>Au 03/11/2026 la matrice ne couvre que les services DSIG et Audit : la Direction de
 * l'Exploitation, la Direction financiere et l'inspection n'y ont AUCUN departement. Revenir a
 * la premiere methode les retirerait donc des alertes — sans message d'erreur, sans ligne de
 * journal, et sans que personne ne s'en apercoive avant la prochaine anomalie qu'ils auraient
 * du voir.</p>
 *
 * <p>Ce test lit le code et la migration. Il ne demande ni base ni Spring.</p>
 */
class AlertesSafDestinatairesTest {

    private static final Path SOURCES = Path.of("src", "main", "java", "io", "digiservices",
            "ecreditservice", "service");
    private static final Path MIGRATIONS = Path.of("..", "database-migrations", "src", "main",
            "resources", "db", "migration");

    private static String lire(Path f) {
        try {
            return Files.readString(f);
        } catch (IOException e) {
            throw new IllegalStateException("fichier illisible : " + f.toAbsolutePath(), e);
        }
    }

    @Test
    @DisplayName("les deux alertes resolvent leurs destinataires par role OU departement")
    void lesDeuxAlertesHonorentLesRoles() {
        for (String fichier : List.of("CreditNegatifService.java", "CompteMalAdosseService.java")) {
            String source = lire(SOURCES.resolve(fichier));
            assertTrue(source.contains("porteursParRoleOuDepartement"),
                    fichier + " doit resoudre ses destinataires par role OU departement : la DE, "
                            + "la DF et l'inspection n'ont aucun departement dans la matrice et "
                            + "seraient silencieusement retirees des alertes.");
            assertFalse(source.contains("porteursDeRubrique"),
                    fichier + " ne doit plus utiliser porteursDeRubrique, qui ignore les roles.");
        }
    }

    @Test
    @DisplayName("la migration accorde la rubrique aux trois directions")
    void laMigrationAccordeLaRubriqueAuxTroisDirections() throws IOException {
        Path migration = MIGRATIONS.resolve("V204__alertes_saf_de_df_inspection.sql");
        assertTrue(Files.exists(migration), "V204 a disparu : les trois directions perdraient "
                + "leur droit sur la rubrique, et donc les alertes.");
        String sql = lire(migration);
        for (String service : List.of("'DE'", "'DF'", "'DI'")) {
            assertTrue(sql.contains(service),
                    "V204 doit accorder CREDITS_NEGATIFS au service " + service
                            + " (DE = exploitation, DF = financiere, DI = inspection).");
        }
        assertTrue(sql.contains("CREDITS_NEGATIFS"), "la rubrique accordee doit etre la bonne");
        assertTrue(sql.contains("ON CONFLICT DO NOTHING"),
                "la migration doit pouvoir etre rejouee sans doublon");
    }
}
