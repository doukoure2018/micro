package io.digiservices.ecreditservice.repository;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * Garde-fou sur les requetes du journal des comptes hors agence (V214).
 *
 * <p>Meme piege, meme garde que {@link CompteMalAdosseSqlTest} : un mot-cle colle a un
 * identifiant (« WHEREnum_cuenta », « ) tWHERE ») ne se voit ni a la compilation ni a la
 * relecture, seulement a l'execution — et la surveillance echouerait a chaque passage sans que
 * personne ne le remarque avant le journal des alertes. Les requetes de ce depot sont des blocs
 * de texte entiers ; le test le prouve plutot que de le supposer.</p>
 */
class CompteHorsAgenceSqlTest {

    private static final Pattern AVANT = Pattern.compile(
            "[A-Za-z0-9_](WHERE|FROM|SELECT|GROUP BY|ORDER BY|HAVING|AND|OR|LIMIT|FILTER)\\b");
    private static final Pattern APRES = Pattern.compile(
            "\\b(WHERE|FROM|SELECT|GROUP BY|ORDER BY|HAVING|LIMIT|FILTER|JOIN|SET)[A-Za-z0-9_]");

    private static final Map<String, String> REQUETES = Map.of(
            "journal vide", CompteHorsAgenceRepository.SQL_JOURNAL_VIDE,
            "ouvertes", CompteHorsAgenceRepository.SQL_OUVERTES,
            "ouvrir", CompteHorsAgenceRepository.SQL_OUVRIR,
            "rafraichir", CompteHorsAgenceRepository.SQL_RAFRAICHIR,
            "clore les absents", CompteHorsAgenceRepository.SQL_CLORE_ABSENTS,
            "clore tout", CompteHorsAgenceRepository.SQL_CLORE_TOUT,
            "clore les transferts", CompteHorsAgenceRepository.SQL_CLORE_TRANSFERTS,
            "marquer signalees", CompteHorsAgenceRepository.SQL_MARQUER_SIGNALEES,
            "par situation", CompteHorsAgenceRepository.SQL_PAR_SITUATION);

    @Test
    @DisplayName("aucune requete du journal n'a de mot-cle colle")
    void aucunMotCleColle() {
        List<String> fautes = new ArrayList<>();
        REQUETES.forEach((nom, sql) -> {
            for (Pattern p : List.of(AVANT, APRES)) {
                Matcher m = p.matcher(sql);
                while (m.find()) {
                    fautes.add(nom + " : « " + sql.substring(Math.max(0, m.start() - 12),
                            Math.min(sql.length(), m.end() + 12)).replace('\n', ' ') + " »");
                }
            }
        });
        assertTrue(fautes.isEmpty(), String.join("\n", fautes));
    }

    @Test
    @DisplayName("la preuve de fermeture n'est jamais reecrite (lecon de V193)")
    void laPreuveEstFigee() {
        for (String sql : List.of(CompteHorsAgenceRepository.SQL_CLORE_ABSENTS,
                CompteHorsAgenceRepository.SQL_CLORE_TOUT, CompteHorsAgenceRepository.SQL_CLORE_TRANSFERTS)) {
            assertTrue(sql.contains("etat_a_la_correction = COALESCE(etat_a_la_correction,"),
                    "l'etat a la correction doit etre protege par COALESCE");
            assertTrue(sql.contains("agence_a_la_correction = COALESCE(agence_a_la_correction,"),
                    "l'agence a la correction doit etre protegee par COALESCE");
            assertTrue(sql.contains("corrige_at IS NULL"), "seules les lignes ouvertes se ferment");
        }
    }

    @Test
    @DisplayName("le rafraichissement ne touche qu'aux lignes ouvertes et ne reecrit pas la preuve")
    void leRafraichissementEstBorne() {
        String sql = CompteHorsAgenceRepository.SQL_RAFRAICHIR;
        assertTrue(sql.contains("corrige_at IS NULL"));
        assertTrue(!sql.contains("etat_a_la_correction") && !sql.contains("agence_a_la_correction"),
                "le rafraichissement ne doit jamais toucher a la preuve");
        assertTrue(sql.contains("situation_changee_at = CASE WHEN situation <> :situation"),
                "un changement de situation doit etre date");
    }
}
