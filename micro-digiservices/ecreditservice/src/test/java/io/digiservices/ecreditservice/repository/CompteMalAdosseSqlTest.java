package io.digiservices.ecreditservice.repository;

import io.digiservices.ecreditservice.repository.CompteMalAdosseRepository.Filtres;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.fail;

/**
 * Garde-fou sur les requetes de la page des comptes mal adosses, qui se construisent par
 * morceaux selon les filtres choisis.
 *
 * <p>Ce test existe parce que le meme piege s'est presente trois fois dans ce depot : un
 * fragment de requete concatene a la fin d'un bloc de texte Java perd l'espace qui le separait
 * du mot precedent, et {@code WHERE """ + FRAGMENT} devient « WHEREind_estado ». Le 04/09/2026,
 * la faute a rendu les indicateurs du portefeuille muets pendant pres de deux mois sans que
 * personne ne le voie. Elle a ete reproduite ici le 31/10/2026, et corrigee avant deploiement.</p>
 *
 * <p>Ni le compilateur ni une relecture ne voient cette faute : seule l'execution la revele. Ce
 * test la cherche dans toutes les combinaisons de filtres de l'ecran.</p>
 */
class CompteMalAdosseSqlTest {

    /**
     * Le piege a DEUX sens, et c'est le second qui a frappe ici.
     *
     * <p>{@code AVANT} : un caractere de mot suivi d'un mot-cle — « ) tWHERE », la faute du
     * 04/09/2026 sur les indicateurs du portefeuille.</p>
     *
     * <p>{@code APRES} : un mot-cle suivi d'un caractere de mot — « WHEREind_estado », la faute
     * commise ici, quand le fragment est concatene a la fin d'un bloc de texte. Les mots-cles
     * courts et ambigus (AND, OR, AS) sont exclus de ce sens : ils sont le debut de ANDROID,
     * ORDER BY et ASC.</p>
     */
    private static final Pattern AVANT = Pattern.compile(
            "[A-Za-z0-9_](WHERE|FROM|SELECT|GROUP BY|ORDER BY|HAVING|AND|OR|LIMIT|FILTER)\\b");
    private static final Pattern APRES = Pattern.compile(
            "\\b(WHERE|FROM|SELECT|GROUP BY|ORDER BY|HAVING|LIMIT|FILTER|JOIN|SET)[A-Za-z0-9_]");

    @Test
    @DisplayName("le garde-fou attrape bien les deux formes de la faute")
    void leGardeFouAttrapeLesDeuxFormes() {
        assertTrue(AVANT.matcher("SELECT 1 FROM (SELECT 1) tWHERE x = 1").find(),
                "la forme « ) tWHERE » doit etre vue");
        assertTrue(APRES.matcher("count(*) FILTER (WHEREind_estado IN ('D'))").find(),
                "la forme « WHEREind_estado » doit etre vue");
        assertTrue(APRES.matcher("GROUP BYfamille").find(), "« GROUP BYfamille » doit etre vu");
        // Et il ne crie pas sur du SQL correct, ORDER BY et ASC compris.
        assertTrue(!AVANT.matcher("ORDER BY famille ASC LIMIT 10").find()
                        && !APRES.matcher("ORDER BY famille ASC LIMIT 10").find(),
                "du SQL correct ne doit pas etre signale");
    }

    @Test
    @DisplayName("les compteurs et les trois synthèses n'ont aucun mot-cle colle")
    void lesAgregatsSontBienFormes() {
        verifier("compteurs", CompteMalAdosseRepository.SQL_COMPTEURS);
        verifier("par famille", CompteMalAdosseRepository.sqlGroupes("famille", "famille", null));
        verifier("par agence", CompteMalAdosseRepository.sqlGroupes(
                "cod_agencia", "cod_agencia", "COALESCE(max(des_agencia), '')"));
        verifier("par usager", CompteMalAdosseRepository.sqlGroupes(
                "COALESCE(saisi_par, '(inconnu)')", "COALESCE(saisi_par, '(inconnu)')", null));
    }

    @Test
    @DisplayName("la liste est bien formee pour toutes les combinaisons de filtres")
    void laListeEstBienFormee() {
        List<String> fautes = new ArrayList<>();
        for (Filtres f : combinaisons()) {
            String sql = CompteMalAdosseRepository.sqlLignes(f);
            for (Pattern p : List.of(AVANT, APRES)) {
                Matcher m = p.matcher(sql);
                while (m.find()) {
                    fautes.add(f + " : « " + extrait(sql, m.start(), m.end()) + " »");
                }
            }
            if (!sql.contains(" WHERE  ") && !sql.contains(" WHERE corrige")
                    && !sql.contains(" WHERE  TRUE")) {
                // Le WHERE doit toujours etre suivi d'un espace puis d'une condition.
                assertTrue(sql.matches("(?s).* WHERE \\s*\\S.*"),
                        () -> "le WHERE de " + f + " n'est pas separe de sa condition");
            }
        }
        if (!fautes.isEmpty()) {
            fail("Mot-cle SQL colle au token precedent :\n  - " + String.join("\n  - ", fautes));
        }
    }

    @Test
    @DisplayName("le filtre par defaut ne retient que les cas a traiter")
    void leFiltreParDefautRetientLesCasATraiter() {
        String defaut = CompteMalAdosseRepository.filtre(
                new Filtres(null, null, null, null, null, false, false));
        assertTrue(defaut.contains("corrige_at IS NULL"), "les lignes closes doivent etre exclues");
        assertTrue(defaut.contains("ind_estado IN ('D', 'J')"),
                "seuls les credits en cours et au contentieux sont a traiter (perimetre du 31/10)");
        assertTrue(defaut.contains("famille <> 'TYPE_NON_AUTORISE'"),
                "le type non autorise ne fait pas partie des cas a traiter");

        String tout = CompteMalAdosseRepository.filtre(
                new Filtres(null, null, null, null, null, false, true));
        assertTrue(!tout.contains("TYPE_NON_AUTORISE"),
                "« tout afficher » doit lever la restriction aux familles alertees");
    }

    private static List<Filtres> combinaisons() {
        List<Filtres> liste = new ArrayList<>();
        for (boolean corriges : new boolean[]{false, true}) {
            for (boolean tout : new boolean[]{false, true}) {
                liste.add(new Filtres(null, null, null, null, null, corriges, tout));
                liste.add(new Filtres("PAS_DE_COMPTE", "D", "323", "MLSIDIBE", "DIALLO", corriges, tout));
                liste.add(new Filtres(null, "J", null, null, "548546", corriges, tout));
                liste.add(new Filtres("COMPTE_AUTRE_CLIENT", null, "102", null, null, corriges, tout));
            }
        }
        return liste;
    }

    private static void verifier(String quoi, String sql) {
        for (Pattern p : List.of(AVANT, APRES)) {
            Matcher m = p.matcher(sql);
            assertTrue(!m.find(), () -> quoi + " colle un mot-cle : « "
                    + extrait(sql, m.start(), m.end()) + " »");
        }
    }

    private static String extrait(String sql, int debut, int fin) {
        return sql.substring(Math.max(0, debut - 20), Math.min(sql.length(), fin + 10)).replace("\n", " ");
    }
}
