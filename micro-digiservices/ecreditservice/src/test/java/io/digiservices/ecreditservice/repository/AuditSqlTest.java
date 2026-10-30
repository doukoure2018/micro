package io.digiservices.ecreditservice.repository;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.lang.reflect.Field;
import java.lang.reflect.Modifier;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.fail;

/**
 * Garde-fou sur les requetes d'audit, apres le piege du 04/09/2026 : dans le portefeuille,
 * {@code ") t" + FILTRE_RETARD} avait produit « ) tWHERE (...) », les indicateurs ont repondu
 * 500 pendant pres de deux mois, et l'ecran se contentait de n'afficher aucun chiffre.
 *
 * <p>Les journaux d'audit assemblent leurs requetes de la meme facon : une base commune, puis
 * soit un {@code ORDER BY ... LIMIT} ajoute a la suite, soit un {@code SELECT COUNT(*) FROM (…) t}
 * autour. Si la base ne finit pas par un separateur, les deux assemblages cassent — et un bloc
 * de texte Java perd justement les espaces de fin de ligne. Ce test echoue avant le deploiement.</p>
 */
class AuditSqlTest {

    /** Un caractere de mot, immediatement suivi d'un mot-cle SQL : il manque un separateur. */
    private static final Pattern COLLE = Pattern.compile(
            "[A-Za-z0-9_](WHERE|FROM|SELECT|GROUP BY|ORDER BY|HAVING|INNER JOIN|LEFT JOIN|OFFSET|LIMIT)\\b");

    /** Les bases concatenees : chacune est pagine et comptee par assemblage. */
    private static final List<String> BASES_ASSEMBLEES = List.of("DECISIONS_BASE", "ACTIONS_BASE");

    @Test
    @DisplayName("aucune requete d'audit ne colle un mot-cle SQL au token precedent")
    void aucunMotCleColle() {
        List<String> fautes = new ArrayList<>();
        for (Field champ : AuditJournauxRepository.class.getDeclaredFields()) {
            String sql = valeur(champ);
            if (sql == null || !sql.toUpperCase().contains("SELECT")) {
                continue;
            }
            Matcher m = COLLE.matcher(sql);
            while (m.find()) {
                fautes.add(champ.getName() + " : « " + extrait(sql, m.start(), m.end()) + " »");
            }
        }
        if (!fautes.isEmpty()) {
            fail("Mot-cle SQL colle au token precedent :\n  - " + String.join("\n  - ", fautes));
        }
    }

    @Test
    @DisplayName("les bases paginees supportent l'ajout d'un ORDER BY et l'enveloppe d'un COUNT")
    void lesBasesSupportentLesDeuxAssemblages() throws Exception {
        for (String nom : BASES_ASSEMBLEES) {
            Field champ = AuditJournauxRepository.class.getDeclaredField(nom);
            String base = valeur(champ);
            verifier(nom + " + ORDER BY", base + " ORDER BY 1 DESC OFFSET :offset LIMIT :limite");
            verifier(nom + " enveloppee", "SELECT COUNT(*) FROM (" + base + ") t");
        }
    }

    private static void verifier(String quoi, String sql) {
        Matcher m = COLLE.matcher(sql);
        assertFalse(m.find(), () -> quoi + " colle un mot-cle : « "
                + extrait(sql, m.start(), m.end()) + " »");
    }

    private static String valeur(Field champ) {
        if (!Modifier.isStatic(champ.getModifiers()) || champ.getType() != String.class) {
            return null;
        }
        champ.setAccessible(true);
        try {
            return (String) champ.get(null);
        } catch (IllegalAccessException e) {
            return null;
        }
    }

    private static String extrait(String sql, int debut, int fin) {
        return sql.substring(Math.max(0, debut - 20), Math.min(sql.length(), fin + 10)).replace("\n", " ");
    }
}
