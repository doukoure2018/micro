package io.digiservices.ecreditservice.repository;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * Garde-fou sur {@code activer_rotation}, redefinie par plusieurs migrations successives.
 *
 * <p>La fonction declare {@code RETURNS TABLE (id_rotation BIGINT, message TEXT)} :
 * « id_rotation » est donc AUSSI un parametre de sortie. Toute reference non qualifiee a la
 * colonne fait echouer PostgreSQL — « column reference "id_rotation" is ambiguous »
 * (SQLSTATE 42702) — que Spring presente comme une banale erreur de grammaire SQL.</p>
 *
 * <p>La faute a ete commise deux fois. Corrigee par la V184 le 28/10/2026, elle est revenue
 * avec la V201 le 03/11/2026 : celle-ci reprenait le corps de la fonction depuis la V170, donc
 * d'AVANT le correctif. Son effet est sournois — envoyer un agent vers un point de service ou
 * il n'est jamais alle fonctionne (chemin INSERT), l'y renvoyer echoue toujours (chemin
 * UPDATE) — et ne se voit qu'a l'usage, sur la moitie des cas seulement.</p>
 *
 * <p>Recopier une fonction d'une migration a l'autre est le geste normal ; recopier une version
 * perimee est l'accident. Ce test relit la DERNIERE definition, celle qui fait foi, et la
 * refuse si elle retombe dans la faute. Sans base ni execution.</p>
 *
 * <p>Les migrations anterieures ne sont pas controlees : elles sont deja appliquees, leur
 * empreinte est figee, et les rouvrir bloquerait Flyway. Leurs fautes appartiennent a
 * l'histoire.</p>
 */
class MigrationsRotationSqlTest {

    private static final Path MIGRATIONS = Path.of("..", "database-migrations", "src", "main",
            "resources", "db", "migration");

    private static final String DEBUT_FONCTION = "CREATE OR REPLACE FUNCTION activer_rotation";

    /** « id_rotation = » sans « rotation. » devant : la forme qui rend la reference ambigue. */
    private static final Pattern NON_QUALIFIE =
            Pattern.compile("(?<![.\\w])id_rotation\\s*=", Pattern.CASE_INSENSITIVE);

    private static final Pattern NUMERO = Pattern.compile("^V(\\d+)__");

    private static String lire(Path f) {
        try {
            return Files.readString(f);
        } catch (IOException e) {
            throw new IllegalStateException("migration illisible : " + f, e);
        }
    }

    /** Le numero de version d'un fichier « V201__... » ; -1 si le nom ne s'y prete pas. */
    private static int numero(Path fichier) {
        Matcher m = NUMERO.matcher(fichier.getFileName().toString());
        return m.find() ? Integer.parseInt(m.group(1)) : -1;
    }

    /** La migration de plus haut numero qui definit la fonction : celle qui fait foi. */
    private Path migrationEnVigueur() throws IOException {
        assertTrue(Files.isDirectory(MIGRATIONS),
                "dossier des migrations introuvable : " + MIGRATIONS.toAbsolutePath().normalize());
        List<Path> migrations;
        try (Stream<Path> fichiers = Files.list(MIGRATIONS)) {
            migrations = fichiers.filter(f -> f.getFileName().toString().endsWith(".sql"))
                    .filter(f -> lire(f).contains("FUNCTION activer_rotation"))
                    .sorted(Comparator.comparingInt(MigrationsRotationSqlTest::numero))
                    .toList();
        }
        assertFalse(migrations.isEmpty(),
                "aucune migration ne definit activer_rotation : le controle ne protege plus rien");
        return migrations.get(migrations.size() - 1);
    }

    /** Le corps de la definition en vigueur, en-tete de commentaires exclu. */
    private String corpsEnVigueur(Path migration) {
        String sql = lire(migration);
        int debut = sql.indexOf(DEBUT_FONCTION);
        assertTrue(debut >= 0, migration.getFileName() + " ne contient pas " + DEBUT_FONCTION);
        return sql.substring(debut);
    }

    @Test
    @DisplayName("la definition en vigueur qualifie « id_rotation »")
    void idRotationToujoursQualifie() throws IOException {
        Path migration = migrationEnVigueur();
        String corps = corpsEnVigueur(migration);
        List<String> fautes = new ArrayList<>();
        NON_QUALIFIE.matcher(corps).results().forEach(r ->
                fautes.add("« " + corps.substring(Math.max(0, r.start() - 45),
                        Math.min(corps.length(), r.end() + 20)).replace("\n", " ") + " »"));
        assertTrue(fautes.isEmpty(), migration.getFileName()
                + " : « id_rotation » doit s'ecrire « rotation.id_rotation ». C'est aussi un "
                + "parametre de sortie de la fonction, et PostgreSQL refuse la reference ambigue "
                + "(42702). Reprenez le corps depuis la DERNIERE definition, jamais depuis une "
                + "plus ancienne.\n  - " + String.join("\n  - ", fautes));
    }

    @Test
    @DisplayName("la definition en vigueur pose les trois rattachements")
    void laDefinitionEnVigueurPoseLesTroisRattachements() throws IOException {
        Path migration = migrationEnVigueur();
        String corps = corpsEnVigueur(migration);
        for (String colonne : new String[]{"pointvente_id = p_ps", "agence_id = v_agence",
                "delegation_id = v_delegation"}) {
            assertTrue(corps.contains(colonne), migration.getFileName()
                    + " : la definition en vigueur doit poser « " + colonne + " ». Sans les "
                    + "trois, une mutation inter-agences laisse le compte a moitie rattache — "
                    + "point de service d'une agence, fiche d'une autre.");
        }
    }

    @Test
    @DisplayName("le controle attrape bien la forme fautive")
    void leControleAttrapeLaFormeFautive() {
        assertTrue(NON_QUALIFIE.matcher(
                        "UPDATE rotation SET statut = true WHERE id_rotation = v_rotation_id;").find(),
                "la forme non qualifiee doit etre vue");
        assertFalse(NON_QUALIFIE.matcher(
                        "UPDATE rotation SET statut = true WHERE rotation.id_rotation = v_rotation_id;").find(),
                "la forme qualifiee ne doit pas etre signalee");
        assertFalse(NON_QUALIFIE.matcher("RETURNING rotation.id_rotation INTO v_rotation_id").find(),
                "un RETURNING qualifie ne doit pas etre signale");
    }
}
