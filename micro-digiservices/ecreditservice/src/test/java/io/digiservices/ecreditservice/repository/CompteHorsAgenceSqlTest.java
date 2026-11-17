package io.digiservices.ecreditservice.repository;

import io.digiservices.ecreditservice.repository.CompteHorsAgenceRepository.Filtres;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.fail;

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

    /** Les requetes des lots 2 et 3 : ecran, suivi, verification, relance. */
    private static final Map<String, String> REQUETES_ECRAN = Map.ofEntries(
            Map.entry("compteurs", CompteHorsAgenceRepository.SQL_COMPTEURS),
            Map.entry("corriges ce mois", CompteHorsAgenceRepository.SQL_CORRIGES_CE_MOIS),
            Map.entry("par situation (detail)", CompteHorsAgenceRepository.sqlGroupes("situation", "situation", null)),
            Map.entry("par agence de l'agent", CompteHorsAgenceRepository.sqlGroupes(
                    "COALESCE(agence_agent, '?')", "COALESCE(agence_agent, '?')", null)),
            Map.entry("par usager", CompteHorsAgenceRepository.sqlGroupes(
                    "COALESCE(cree_par, '(inconnu)')", "COALESCE(cree_par, '(inconnu)')", "COALESCE(max(nom_cree_par), '')")),
            Map.entry("dernier passage", CompteHorsAgenceRepository.SQL_DERNIER_PASSAGE),
            Map.entry("marquer traite", CompteHorsAgenceRepository.SQL_MARQUER_TRAITE),
            Map.entry("annuler traite", CompteHorsAgenceRepository.SQL_ANNULER_TRAITE),
            Map.entry("prises en charge ouvertes", CompteHorsAgenceRepository.SQL_PRISES_EN_CHARGE_OUVERTES),
            Map.entry("cle", CompteHorsAgenceRepository.SQL_CLE),
            Map.entry("clore apres verification", CompteHorsAgenceRepository.SQL_CLORE_APRES_VERIFICATION),
            Map.entry("marquer verifiee", CompteHorsAgenceRepository.SQL_MARQUER_VERIFIEE),
            Map.entry("relance (prises)", CompteHorsAgenceRepository.sqlARelancer(true)),
            Map.entry("relance (jamais prises)", CompteHorsAgenceRepository.sqlARelancer(false)),
            Map.entry("marquer relancees", CompteHorsAgenceRepository.SQL_MARQUER_RELANCEES));

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

    @Test
    @DisplayName("aucune requete de l'ecran, du suivi, de la verification ou de la relance n'a de mot-cle colle")
    void lesRequetesDeLEcranSontBienFormees() {
        List<String> fautes = new ArrayList<>();
        REQUETES_ECRAN.forEach((nom, sql) -> {
            for (Pattern p : List.of(AVANT, APRES)) {
                Matcher m = p.matcher(sql);
                while (m.find()) {
                    fautes.add(nom + " : « " + extrait(sql, m.start(), m.end()) + " »");
                }
            }
        });
        assertTrue(fautes.isEmpty(), String.join("\n", fautes));
    }

    @Test
    @DisplayName("la liste est bien formee pour toutes les combinaisons de filtres")
    void laListeEstBienFormee() {
        List<String> fautes = new ArrayList<>();
        for (Filtres f : combinaisons()) {
            String sql = CompteHorsAgenceRepository.sqlLignes(f);
            for (Pattern p : List.of(AVANT, APRES)) {
                Matcher m = p.matcher(sql);
                while (m.find()) {
                    fautes.add(f + " : « " + extrait(sql, m.start(), m.end()) + " »");
                }
            }
            assertTrue(sql.matches("(?s).* WHERE \\s*\\S.*"),
                    () -> "le WHERE de " + f + " n'est pas separe de sa condition");
            assertTrue(sql.contains(" LIMIT :limite"), "la liste doit etre plafonnee");
        }
        if (!fautes.isEmpty()) {
            fail("Mot-cle SQL colle au token precedent :\n  - " + String.join("\n  - ", fautes));
        }
    }

    @Test
    @DisplayName("le filtre par defaut ne retient que les comptes actifs a traiter ; « tout » leve la restriction")
    void leFiltreParDefautRetientLesCasATraiter() {
        String defaut = CompteHorsAgenceRepository.filtre(new Filtres(null, null, null, null, null, null, false, false));
        assertTrue(defaut.contains("corrige_at IS NULL"), "les lignes closes doivent etre exclues");
        assertTrue(defaut.contains("= 'A'"), "seuls les comptes actifs sont a traiter");
        assertTrue(defaut.contains("situation IN (:situationsAlerte)"), "les situations alertees sont parametrees");
        assertTrue(defaut.contains(":tousTypes"), "les types alertes sont parametres");
        String tout = CompteHorsAgenceRepository.filtre(new Filtres(null, null, null, null, null, null, false, true));
        assertTrue(!tout.contains(":situationsAlerte"), "« tout afficher » doit lever la restriction aux cas a traiter");
        String corriges = CompteHorsAgenceRepository.filtre(new Filtres(null, null, null, null, null, null, true, true));
        assertTrue(corriges.trim().startsWith("TRUE"), "les lignes closes doivent entrer quand on les demande");
    }

    @Test
    @DisplayName("le filtre d'etat « AUTRES » retient tout etat different de A, sans parametre")
    void leFiltreAutresEtats() {
        String sql = CompteHorsAgenceRepository.filtre(new Filtres(null, "AUTRES", null, null, null, null, false, true));
        assertTrue(sql.contains("<> 'A'"), "AUTRES doit se traduire par une difference stricte");
        assertTrue(!sql.contains(":etat"), "AUTRES ne doit lier aucun parametre d'etat");
        String actifs = CompteHorsAgenceRepository.filtre(new Filtres(null, "A", null, null, null, null, false, true));
        assertTrue(actifs.contains("= :etat"), "une autre valeur est une egalite stricte");
    }

    @Test
    @DisplayName("la recherche libre porte sur le compte, le client, l'usager et l'intitule")
    void laRechercheLibreEstComplete() {
        String sql = CompteHorsAgenceRepository.filtre(new Filtres(null, null, null, null, null, "soumah", false, true));
        for (String colonne : List.of("num_cuenta", "cod_cliente", "nom_cliente", "cree_par", "nom_cree_par", "intitule")) {
            assertTrue(sql.contains(colonne), "la recherche doit porter sur " + colonne);
        }
    }

    @Test
    @DisplayName("les deux requetes de relance visent les comptes actifs, jamais relances depuis une semaine")
    void lesRequetesDeRelanceSontBornees() {
        for (boolean prises : new boolean[]{true, false}) {
            String sql = CompteHorsAgenceRepository.sqlARelancer(prises);
            assertTrue(sql.contains("a.derniere_relance_at IS NULL"), "une ligne jamais relancee doit entrer");
            assertTrue(sql.contains("make_interval(days => :intervalle)"), "une ligne relancee recemment doit etre ecartee");
            assertTrue(sql.contains("a.etat_compte"), "on ne relance que les comptes actifs, lus sur l'alias");
            assertTrue(sql.contains("a.situation IN (:situationsAlerte)"), "la situation est lue sur l'alias");
            assertTrue(sql.contains("a.type_compte"), "le type est lu sur l'alias");
            assertTrue(sql.contains("a.nom_cree_par"), "la relance doit nommer l'usager");
        }
    }

    private static List<Filtres> combinaisons() {
        List<Filtres> liste = new ArrayList<>();
        for (boolean corriges : new boolean[]{false, true}) {
            for (boolean tout : new boolean[]{false, true}) {
                liste.add(new Filtres(null, null, null, null, null, null, corriges, tout));
                liste.add(new Filtres("AGENT_CHEZ_LUI", "A", "334", "334", "KCHERIF334", "DIALLO", corriges, tout));
                liste.add(new Filtres(null, "A", null, "?", null, "33600023271", corriges, tout));
                liste.add(new Filtres("TROIS_AGENCES", null, "102", null, null, null, corriges, tout));
                liste.add(new Filtres(null, "AUTRES", null, null, null, null, corriges, tout));
            }
        }
        return liste;
    }

    private static String extrait(String sql, int debut, int fin) {
        return sql.substring(Math.max(0, debut - 20), Math.min(sql.length(), fin + 10)).replace("\n", " ");
    }
}
