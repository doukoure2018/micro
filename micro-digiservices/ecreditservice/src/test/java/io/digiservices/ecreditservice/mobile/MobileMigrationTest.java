package io.digiservices.ecreditservice.mobile;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * Les garde-fous du recouvrement hors ligne vivent dans la BASE, pas seulement dans le code.
 *
 * <p>Une transmission coupee se rejoue : si l'unicite de l'identifiant cree par le telephone
 * disparaissait, la meme visite s'ecrirait deux fois et le directeur d'agence verrait deux
 * passages la ou l'agent n'en a fait qu'un. De meme, une appreciation C ou D engage le membre :
 * la remarque qui la justifie est exigee par la base, pour qu'un futur point d'entree ne puisse
 * pas l'oublier.</p>
 *
 * <p>Ce test lit la migration. Il ne demande ni base ni Spring.</p>
 */
class MobileMigrationTest {

    private static final Path MIGRATIONS = Path.of("..", "database-migrations", "src", "main",
            "resources", "db", "migration");

    private static String migration() {
        Path f = MIGRATIONS.resolve("V209__mobile_recouvrement.sql");
        assertTrue(Files.exists(f), "V209 a disparu : le recouvrement hors ligne n'aurait plus de table.");
        try {
            return Files.readString(f);
        } catch (IOException e) {
            throw new IllegalStateException("migration illisible", e);
        }
    }

    @Test
    @DisplayName("l'identifiant cree par le telephone est unique : une transmission se rejoue")
    void identifiantUnique() {
        String sql = migration();
        assertTrue(sql.contains("identifiant_client  VARCHAR(64)  NOT NULL UNIQUE"),
                "sans unicite, un lot renvoye apres une coupure ecrirait les visites deux fois");
        assertTrue(sql.contains("identifiant_client VARCHAR(64)  NOT NULL UNIQUE"),
                "la photo porte aussi son identifiant : elle part apres la visite et se rejoue seule");
    }

    @Test
    @DisplayName("une appreciation C ou D exige une remarque, et une promesse un montant ET une date")
    void lesDeuxGardeFousMetier() {
        String sql = migration();
        assertTrue(sql.contains("ck_visite_remarque_obligatoire"),
                "C et D engagent le membre : la base exige le constat de l'agent");
        assertTrue(sql.contains("length(trim(remarque)) >= 10"),
                "le seuil doit rester lisible dans la contrainte elle-meme");
        assertTrue(sql.contains("ck_visite_promesse_complete"),
                "un montant sans date, ou l'inverse, n'est pas une promesse");
    }

    @Test
    @DisplayName("les quatre listes fermees sont servies au telephone")
    void lesListesFermees() {
        String sql = migration();
        for (String liste : List.of("TYPE_CONTACT", "RESULTAT", "MOTIF_RETARD", "APPRECIATION")) {
            assertTrue(sql.contains("('" + liste + "',"),
                    "la liste " + liste + " doit etre servie : l'application la met en cache et "
                            + "refuse ce qu'elle ne connait pas");
        }
        for (String appreciation : List.of("'A'", "'B'", "'C'", "'D'")) {
            assertTrue(sql.contains("('APPRECIATION', " + appreciation),
                    "le bareme arbitre le 12/11/2026 compte quatre classes : " + appreciation + " manque");
        }
    }

    @Test
    @DisplayName("la migration se rejoue sans doublon")
    void migrationRejouable() {
        String sql = migration();
        int inserts = sql.split("INSERT INTO", -1).length - 1;
        int conflits = sql.split("ON CONFLICT", -1).length - 1;
        assertEquals(inserts, conflits,
                "chaque INSERT doit porter un ON CONFLICT : Flyway rejoue une migration au moindre "
                        + "environnement reconstruit");
        assertTrue(sql.contains("CREATE TABLE IF NOT EXISTS"), "les tables aussi se rejouent");
    }
}
