package io.digiservices.ecreditservice.repository;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * Garde-fou sur les quatre requetes de la synthese hebdomadaire de direction, assemblees par
 * morceaux a partir de fragments partages.
 *
 * <p>Le piege a deja frappe trois fois dans ce depot, dans les deux sens : un mot-cle colle au
 * token precedent (« ) tWHERE », qui a rendu les indicateurs du portefeuille muets du 04/09 au
 * 30/10/2026) ou un mot-cle suivi du fragment (« WHEREind_estado », commis le 31/10 sur les
 * comptes mal adosses). Ni le compilateur ni une relecture ne voient la faute : seule
 * l'execution la revele, et une synthese de direction muette se remarquerait tard.</p>
 */
class DirectionSyntheseSqlTest {

    private static final Pattern AVANT = Pattern.compile(
            "[A-Za-z0-9_](WHERE|FROM|SELECT|GROUP BY|ORDER BY|HAVING|AND|OR|LIMIT|FILTER)\\b");
    private static final Pattern APRES = Pattern.compile(
            "\\b(WHERE|FROM|SELECT|GROUP BY|ORDER BY|HAVING|LIMIT|FILTER|JOIN|SET|CASE|END)[A-Za-z0-9_]");

    @Test
    @DisplayName("les quatre requetes assemblees n'ont aucun mot-cle colle")
    void lesRequetesAssembleesSontBienFormees() {
        for (String sql : List.of(DirectionSyntheseRepository.SQL_STOCK_DEMANDES,
                DirectionSyntheseRepository.SQL_PORTEFEUILLE,
                DirectionSyntheseRepository.SQL_ASSAINISSEMENT,
                DirectionSyntheseRepository.SQL_ARRETES)) {
            for (Pattern p : List.of(AVANT, APRES)) {
                Matcher m = p.matcher(sql);
                assertTrue(!m.find(), () -> "mot-cle colle : « "
                        + sql.substring(Math.max(0, m.start() - 20),
                                Math.min(sql.length(), m.end() + 10)) + " »");
            }
        }
    }

    @Test
    @DisplayName("le vocabulaire des etapes est celui du partenaire, pas un second")
    void leVocabulaireDesEtapesEstPartage() {
        String sql = DirectionSyntheseRepository.SQL_STOCK_DEMANDES;
        for (String etape : List.of("'REFUSE'", "'ANNULE'", "'ACCORDE'", "'RECU'", "'EN_INSTRUCTION'")) {
            assertTrue(sql.contains(etape), "l'etape " + etape + " doit etre reconnue");
        }
        assertTrue(sql.contains("d.statut_demande = 'REJET'"),
                "un refus est porte par statut_demande et prime sur l'etat du circuit");
    }
}
