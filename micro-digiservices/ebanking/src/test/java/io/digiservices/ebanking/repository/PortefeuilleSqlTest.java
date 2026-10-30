package io.digiservices.ebanking.repository;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.lang.reflect.Field;
import java.lang.reflect.Modifier;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.fail;

/**
 * Garde-fou contre un piege rencontre deux fois : un fragment de requete concatene sans
 * separateur se colle au mot qui le precede.
 *
 * <p>Le 04/09/2026, {@code ") t" + FILTRE_RETARD} a produit « ) tWHERE (...) » : SQL Server y a
 * lu un alias nomme « tWHERE » et a refuse la requete. Les indicateurs du portefeuille ont
 * repondu 500 pendant pres de deux mois sans que personne ne le voie, parce que l'ecran se
 * contentait de n'afficher aucun chiffre. Le meme piege avait deja frappe les requetes
 * agricoles, ou un bloc de texte finissant par {@code AND """} perd son espace de fin.</p>
 *
 * <p>Ce test lit toutes les requetes du depot et echoue si un mot-cle SQL est colle au token
 * precedent. Il ne remplace pas une execution reelle, mais il attrape la faute de frappe que
 * ni le compilateur ni une relecture ne voient.</p>
 */
class PortefeuilleSqlTest {

    /** Un caractere de mot, immediatement suivi d'un mot-cle SQL : il manque un separateur. */
    private static final Pattern COLLE = Pattern.compile(
            "[A-Za-z0-9_](WHERE|FROM|SELECT|GROUP BY|ORDER BY|HAVING|INNER JOIN|LEFT JOIN|OFFSET)\\b");

    @Test
    @DisplayName("aucune requete ne colle un mot-cle SQL au token precedent")
    void aucunMotCleColle() {
        List<String> fautes = new ArrayList<>();
        for (Class<?> classe : List.of(PortefeuilleRepository.class, AgriculteurRepository.class)) {
            for (Field champ : classe.getDeclaredFields()) {
                if (!Modifier.isStatic(champ.getModifiers()) || champ.getType() != String.class) {
                    continue;
                }
                champ.setAccessible(true);
                String sql;
                try {
                    sql = (String) champ.get(null);
                } catch (IllegalAccessException e) {
                    continue;
                }
                if (sql == null || !sql.toUpperCase().contains("SELECT")) {
                    continue;
                }
                Matcher m = COLLE.matcher(sql);
                while (m.find()) {
                    fautes.add(classe.getSimpleName() + "." + champ.getName()
                            + " : « " + sql.substring(Math.max(0, m.start() - 20),
                            Math.min(sql.length(), m.end() + 10)).replace("\n", " ") + " »");
                }
            }
        }
        if (!fautes.isEmpty()) {
            fail("Mot-cle SQL colle au token precedent :\n  - " + String.join("\n  - ", fautes));
        }
    }

    @Test
    @DisplayName("les indicateurs du portefeuille separent bien l'alias du WHERE")
    void lesIndicateursSeparentAliasEtWhere() throws Exception {
        Field champ = PortefeuilleRepository.class.getDeclaredField("SQL_INDICATEURS");
        champ.setAccessible(true);
        String sql = (String) champ.get(null);
        assertTrue(sql.contains(") t\n") || sql.contains(") t "),
                "l'alias « t » doit etre separe de ce qui suit");
        assertTrue(!sql.contains(") tWHERE"), "l'alias ne doit pas etre colle au WHERE");
    }
}
