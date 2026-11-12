package io.digiservices.ecreditservice.service;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * La rubrique RECLAMATIONS doit atteindre les six directions arbitrees le 12/11/2026, et elles
 * seules : les operationnels de la DSIG, le Centre de validation, l'inspection (DI), la Direction
 * de l'Exploitation (DE), la Direction generale et l'Audit.
 *
 * <p>Le piege que ce test garde : le service « DE » a lui seul designe 387 comptes, c'est-a-dire
 * TOUT LE RESEAU, puisque chaque agent de credit porte ce service. Une reclamation routee sur le
 * seul service enverrait un courriel a l'ensemble du personnel a chaque signalement. La regle de
 * la Direction de l'Exploitation est donc le role MANAGER AVEC le service DE, soit sept comptes,
 * comme pour les syntheses du matin (V198) et les alertes SAF (V204).</p>
 *
 * <p>Ce test lit la migration et le code. Il ne demande ni base ni Spring.</p>
 */
class ReclamationsDestinatairesTest {

    private static final Path MIGRATIONS = Path.of("..", "database-migrations", "src", "main",
            "resources", "db", "migration");
    private static final Path SOURCES = Path.of("src", "main", "java", "io", "digiservices",
            "ecreditservice", "repository");

    /** Role + service accordes par habilitation_role_rubrique pour une rubrique. */
    private record Grant(String role, String service) {}

    /** Une categorie et son responsable, tels que la migration les ecrit. */
    private record Categorie(String code, String service, String departement, String role) {}

    private static String lire(Path f) {
        try {
            return Files.readString(f);
        } catch (IOException e) {
            throw new IllegalStateException("fichier illisible : " + f.toAbsolutePath(), e);
        }
    }

    private static String migration() {
        Path migration = MIGRATIONS.resolve("V207__rubrique_reclamations.sql");
        assertTrue(Files.exists(migration), "V207 a disparu : plus personne ne porterait la "
                + "rubrique RECLAMATIONS, et la file des reclamations serait sans destinataire.");
        return lire(migration);
    }

    private static List<Grant> grantsDeRole(String sql) {
        Matcher m = Pattern.compile("\\('([A-Z_]+)',\\s*'([A-Z_*]+)',\\s*'RECLAMATIONS'\\)").matcher(sql);
        List<Grant> grants = new ArrayList<>();
        while (m.find()) {
            grants.add(new Grant(m.group(1), m.group(2)));
        }
        return grants;
    }

    private static List<Categorie> categories(String sql) {
        Matcher m = Pattern.compile(
                "\\('([A-Z_]+)',\\s*'[^']*',\\s*'([A-Za-z]+)',\\s*(NULL|'[A-Z_]+'),\\s*(NULL|'[A-Z_]+'),\\s*\\d+\\)")
                .matcher(sql);
        List<Categorie> categories = new ArrayList<>();
        while (m.find()) {
            categories.add(new Categorie(m.group(1), m.group(2),
                    denude(m.group(3)), denude(m.group(4))));
        }
        return categories;
    }

    private static String denude(String valeur) {
        return "NULL".equals(valeur) ? null : valeur.replace("'", "");
    }

    @Test
    @DisplayName("la rubrique est accordee aux deux departements DSIG et aux quatre directions")
    void lesSixDestinatairesSontAccordes() {
        String sql = migration();

        assertTrue(sql.contains("'RECLAMATIONS', 'Reclamations des agents'"),
                "la rubrique doit etre creee avant d'etre accordee");
        for (String departement : List.of("OPERATIONNEL", "CENTRE_VALIDATION")) {
            assertTrue(sql.contains("'" + departement + "'"),
                    "le departement DSIG " + departement + " doit porter la rubrique");
        }
        assertEquals(Set.of(new Grant("DG", "*"), new Grant("MANAGER", "DE"),
                        new Grant("MANAGER", "DI"), new Grant("MANAGER", "AUDIT")),
                Set.copyOf(grantsDeRole(sql)),
                "les quatre directions sans departement s'accordent par role ET service ; "
                        + "ni plus (une direction de trop recoit tout) ni moins (une de moins ne recoit rien)");
    }

    @Test
    @DisplayName("la Direction de l'Exploitation s'accorde par role, jamais par le seul service DE")
    void leServiceDeNeDesignePasToutLeReseau() {
        for (Grant grant : grantsDeRole(migration())) {
            if ("DE".equals(grant.service())) {
                assertEquals("MANAGER", grant.role(),
                        "le service DE sans le role MANAGER designe les 387 comptes du reseau : "
                                + "chaque agent de credit porte ce service");
            }
        }
    }

    @Test
    @DisplayName("chaque categorie nomme un responsable, pris parmi les six destinataires")
    void chaqueCategorieNommeUnResponsableHabilite() {
        List<Categorie> categories = categories(migration());
        assertEquals(6, categories.size(),
                "les six categories arbitrees doivent etre presentes : recouvrement, credit, "
                        + "compte SAF, piece de dossier, logistique, autre");
        for (Categorie c : categories) {
            if (c.departement() != null) {
                assertEquals("DSIG", c.service(), c.code() + " : seuls les departements DSIG existent dans la matrice");
                assertTrue(Set.of("OPERATIONNEL", "CENTRE_VALIDATION").contains(c.departement()),
                        c.code() + " : le departement responsable doit porter la rubrique");
            } else {
                assertEquals("MANAGER", c.role(),
                        c.code() + " : un responsable par role est toujours un MANAGER de son service");
                assertTrue(Set.of("DE", "DI").contains(c.service()),
                        c.code() + " : le service responsable doit porter la rubrique");
            }
        }
    }

    @Test
    @DisplayName("la migration se rejoue sans doublon et la resolution par role reste disponible")
    void migrationRejouableEtResolutionParRoleDisponible() {
        String sql = migration();
        int inserts = sql.split("INSERT INTO", -1).length - 1;
        int conflits = sql.split("ON CONFLICT", -1).length - 1;
        assertEquals(inserts, conflits,
                "chaque INSERT doit porter un ON CONFLICT : Flyway rejoue une migration au moindre "
                        + "redemarrage d'un environnement reconstruit");

        assertTrue(lire(SOURCES.resolve("AlerteDestinatairesRepository.java"))
                        .contains("porteursParRoleOuDepartement"),
                "la methode qui honore les ROLES doit rester disponible : la DE, l'inspection, la "
                        + "DG et l'Audit n'ont aucun departement et seraient silencieusement "
                        + "retires des reclamations.");
    }
}
