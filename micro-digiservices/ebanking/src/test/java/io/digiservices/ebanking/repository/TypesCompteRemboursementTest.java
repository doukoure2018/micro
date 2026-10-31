package io.digiservices.ebanking.repository;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

/**
 * Les types de compte de remboursement autorises sont une configuration, et cette configuration
 * est inseree telle quelle dans la requete SAF : un type se lit par position dans le numero de
 * compte et ne peut pas passer par un parametre nomme sans {@code STRING_SPLIT}, absent des
 * anciennes versions de SQL Server.
 *
 * <p>Le format est donc verifie avant insertion : trois chiffres par type, separes par des
 * virgules, rien d'autre. Ce test fixe cette garantie — toute valeur qui ne la respecte pas
 * retombe sur {@code 014,011} au lieu d'entrer dans la requete.</p>
 */
class TypesCompteRemboursementTest {

    @Test
    @DisplayName("une liste valide devient une liste SQL de litteraux quotes")
    void listeValide() {
        assertEquals("'014', '011'", listeTypes("014,011"));
        assertEquals("'014'", listeTypes("014"));
        assertEquals("'014', '011', '021'", listeTypes("014, 011, 021"));
    }

    @Test
    @DisplayName("toute valeur hors format retombe sur les deux types par defaut")
    void valeurRefusee() {
        for (String mauvais : new String[]{null, "", "abc", "14", "0145", "014,", ",014",
                "014,011,", "014' OR '1'='1", "014;DROP TABLE PR.PR_CREDITOS"}) {
            assertEquals("'014', '011'", listeTypes(mauvais),
                    "« " + mauvais + " » ne doit pas entrer dans la requete");
        }
    }

    private static String listeTypes(String configuration) {
        return PortefeuilleRepository.listeTypes(configuration);
    }
}
