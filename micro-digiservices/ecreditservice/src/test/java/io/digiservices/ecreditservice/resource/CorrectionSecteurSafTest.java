package io.digiservices.ecreditservice.resource;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * Test de garde de la lecture du referentiel SAF des secteurs.
 *
 * <p>Ce que ce test tient : si la forme du JSON rendu par ebanking change, l'extraction rend une
 * liste vide, le controle anti-code-orphelin se desactive de lui-meme et l'agent retrouve le refus
 * « le secteur 107 n'existe pas » sans que rien n'ait signale la regression. Un echec silencieux
 * merite un test bruyant.</p>
 */
class CorrectionSecteurSafTest {

    /** La forme reelle, verifiee le 11/11/2026 sur http://localhost:8081/ebanking/ecredit/sector. */
    private static Map<String, Object> ligneSaf(String code, String libelle) {
        Map<String, Object> cle = new LinkedHashMap<>();
        cle.put("cod_EMPRESA", "00000");
        cle.put("cod_SECTOR", code);
        Map<String, Object> ligne = new LinkedHashMap<>();
        ligne.put("sectorEconomicoPKId", cle);
        ligne.put("des_SECTOR", libelle);
        return ligne;
    }

    @Test
    @DisplayName("le code se lit dans la cle composite, pas au premier niveau")
    void lectureDeLaCleComposite() {
        List<Map<String, Object>> bruts = List.of(
                ligneSaf("101", "PRIMAIRE"),
                ligneSaf("102", "SECONDAIRE"),
                ligneSaf("103", "TERTIAIRE"),
                ligneSaf("104", "QUATERTIAIRE"),
                ligneSaf("999", "A NE PAS UTILISER"));

        List<Map.Entry<String, String>> secteurs = CorrectionResource.extraireSecteurs(bruts);

        assertEquals(5, secteurs.size(), "les cinq secteurs SAF doivent etre lus");
        assertEquals("101", secteurs.get(0).getKey());
        assertEquals("PRIMAIRE", secteurs.get(0).getValue());
        assertTrue(secteurs.stream().anyMatch(s -> "999".equals(s.getKey())),
                "999 est le code de remplacement : il doit etre reconnu comme valide");
    }

    @Test
    @DisplayName("107 n'est pas dans le referentiel : c'est tout le probleme")
    void codeOrphelinAbsent() {
        List<Map.Entry<String, String>> secteurs = CorrectionResource.extraireSecteurs(List.of(
                ligneSaf("101", "PRIMAIRE"), ligneSaf("102", "SECONDAIRE"),
                ligneSaf("103", "TERTIAIRE"), ligneSaf("104", "QUATERTIAIRE"),
                ligneSaf("999", "A NE PAS UTILISER")));

        assertTrue(secteurs.stream().noneMatch(s -> "107".equals(s.getKey())));
    }

    @Test
    @DisplayName("une reponse vide, nulle ou bancale ne fait pas tomber la validation")
    void reponsesDegradees() {
        assertTrue(CorrectionResource.extraireSecteurs(null).isEmpty());
        assertTrue(CorrectionResource.extraireSecteurs(List.of()).isEmpty());

        List<Map<String, Object>> bancales = new ArrayList<>();
        bancales.add(null);
        bancales.add(new LinkedHashMap<>());
        bancales.add(ligneSaf("", "SANS CODE"));
        bancales.add(ligneSaf("103", null));
        List<Map.Entry<String, String>> secteurs = CorrectionResource.extraireSecteurs(bancales);

        assertEquals(1, secteurs.size(), "seules les lignes portant un code sont retenues");
        assertEquals("103", secteurs.get(0).getKey());
        assertEquals("103", secteurs.get(0).getValue(), "sans libelle, le code sert de libelle");
    }

    @Test
    @DisplayName("les espaces autour du code ne creent pas un faux code inconnu")
    void espacesIgnores() {
        List<Map.Entry<String, String>> secteurs =
                CorrectionResource.extraireSecteurs(List.of(ligneSaf(" 104 ", " QUATERTIAIRE ")));
        assertEquals("104", secteurs.get(0).getKey());
        assertEquals("QUATERTIAIRE", secteurs.get(0).getValue());
    }
}
