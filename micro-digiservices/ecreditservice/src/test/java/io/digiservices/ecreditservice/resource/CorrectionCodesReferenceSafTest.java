package io.digiservices.ecreditservice.resource;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * Tests de garde des codes de reference SAF : lecture des referentiels (secteurs, districts) et
 * LA regle commune qui decide d'un code absent du referentiel.
 *
 * <p>Deux choses y sont tenues. D'abord la lecture : si la forme du JSON rendu par ebanking change,
 * l'extraction rend une liste vide, le controle se desactive DE LUI-MEME et l'agent retrouve le
 * refus « le secteur 107 n'existe pas » sans que rien n'ait signale la regression. Un echec
 * silencieux merite un test bruyant.</p>
 *
 * <p>Ensuite la regle, parce qu'elle distingue deux situations qu'il ne faut jamais confondre : une
 * valeur HERITEE de SAF, dont l'agent n'est pas responsable et qu'il ne peut pas corriger depuis
 * l'ecran de validation, et une valeur qu'il a SAISIE. La premiere se remplace en avertissant, la
 * seconde se refuse en proposant la liste. Quatre fois en deux mois ce defaut est remonte sur un
 * champ different ; la regle est desormais ecrite une seule fois.</p>
 */
class CorrectionCodesReferenceSafTest {

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

    // ================================================================ districts (11/11/2026)

    /** La forme reelle de DistrictDto : codDistrito + DES_DISTRITO. */
    private static Map<String, Object> ligneDistrict(String code, String libelle) {
        Map<String, Object> ligne = new LinkedHashMap<>();
        ligne.put("codDistrito", code);
        ligne.put("COD_PAIS", "GN");
        ligne.put("codProvincia", "103");
        ligne.put("codCanton", "204");
        ligne.put("DES_DISTRITO", libelle);
        return ligne;
    }

    @Test
    @DisplayName("les districts d un canton se lisent, et 398 n y est pas")
    void lectureDesDistricts() {
        List<Map.Entry<String, String>> districts = CorrectionResource.extraireDistricts(List.of(
                ligneDistrict("301", "CENTRE"),
                ligneDistrict("302", "NORD"),
                ligneDistrict("399", "NON PRECISE")));

        assertEquals(3, districts.size());
        assertEquals("301", districts.get(0).getKey());
        assertEquals("CENTRE", districts.get(0).getValue());
        assertTrue(districts.stream().noneMatch(d -> "398".equals(d.getKey())),
                "398 est precisement le code que SAF refuse");
    }

    @Test
    @DisplayName("une reponse district bancale ne fait pas tomber la validation")
    void districtsDegrades() {
        assertTrue(CorrectionResource.extraireDistricts(null).isEmpty());
        List<Map<String, Object>> bancales = new ArrayList<>();
        bancales.add(null);
        bancales.add(new LinkedHashMap<>());
        bancales.add(ligneDistrict(" 307 ", null));
        List<Map.Entry<String, String>> districts = CorrectionResource.extraireDistricts(bancales);
        assertEquals(1, districts.size());
        assertEquals("307", districts.get(0).getKey());
        assertEquals("307", districts.get(0).getValue());
    }

    // ================================================================ LA regle, une seule fois

    private static final List<Map.Entry<String, String>> VALIDES = List.of(
            Map.entry("101", "PRIMAIRE"), Map.entry("102", "SECONDAIRE"), Map.entry("999", "A NE PAS UTILISER"));

    @Test
    @DisplayName("un code valide passe sans rien toucher")
    void codeValide() {
        List<String> ecrits = new ArrayList<>();
        List<String> avertissements = new ArrayList<>();
        String refus = CorrectionResource.controlerCodeContreSaf("le secteur", "102", VALIDES,
                "codSector", "999", ecrits::add, Map.of("codSector", "102"), "C1", avertissements);

        assertNull(refus);
        assertTrue(ecrits.isEmpty(), "aucune substitution sur un code valide");
        assertTrue(avertissements.isEmpty());
    }

    @Test
    @DisplayName("code herite de SAF : remplace et signale, la validation aboutit")
    void codeHeriteRemplace() {
        List<String> ecrits = new ArrayList<>();
        List<String> avertissements = new ArrayList<>();
        String refus = CorrectionResource.controlerCodeContreSaf("le secteur", "107", VALIDES,
                "codSector", "999", ecrits::add, Map.of("codSector", "107"), "C1", avertissements);

        assertNull(refus, "l agent ne doit pas etre bloque pour une valeur qu il n a pas saisie");
        assertEquals(List.of("999"), ecrits);
        assertEquals(1, avertissements.size());
        assertTrue(avertissements.get(0).contains("107"), "l ancien code doit etre nomme");
        assertTrue(avertissements.get(0).contains("999"), "le code de remplacement doit etre nomme");
    }

    @Test
    @DisplayName("code saisi par l agent : refus, avec la liste des valeurs valides")
    void codeSaisiRefuse() {
        List<String> ecrits = new ArrayList<>();
        String refus = CorrectionResource.controlerCodeContreSaf("le secteur", "107", VALIDES,
                "codSector", "999", ecrits::add, Map.of("codSector", "102"), "C1", new ArrayList<>());

        assertNotNull(refus);
        assertTrue(refus.contains("101 PRIMAIRE"), "la liste doit etre dans le message : " + refus);
        assertTrue(ecrits.isEmpty(), "rien n est substitue a la place de l agent");
    }

    @Test
    @DisplayName("herite mais aucun remplacement legitime : refus qui le DIT, sans accuser l agent")
    void heriteSansRemplacement() {
        // Cas du district : 399 n existe pas dans ce canton, on ne peut rien substituer
        List<Map.Entry<String, String>> districts = List.of(Map.entry("301", "CENTRE"), Map.entry("302", "NORD"));
        List<String> ecrits = new ArrayList<>();
        String refus = CorrectionResource.controlerCodeContreSaf("le district", "398", districts,
                "codDistrito", "399", ecrits::add, Map.of("codDistrito", "398"), "C1", new ArrayList<>());

        assertNotNull(refus);
        assertTrue(refus.contains("porte par la fiche SAF"), "le message doit dire que la valeur vient de SAF");
        assertTrue(refus.contains("301 CENTRE"), "et proposer les districts du canton : " + refus);
        assertTrue(ecrits.isEmpty(), "ne jamais substituer un code absent du referentiel");
    }

    @Test
    @DisplayName("referentiel vide ou injoignable : on laisse passer, SAF tranchera")
    void referentielInjoignable() {
        assertNull(CorrectionResource.controlerCodeContreSaf("le secteur", "107", List.of(),
                "codSector", "999", v -> {}, Map.of(), "C1", new ArrayList<>()));
        assertNull(CorrectionResource.controlerCodeContreSaf("le secteur", "107", null,
                "codSector", "999", v -> {}, Map.of(), "C1", new ArrayList<>()));
    }

    @Test
    @DisplayName("code vide : laisse a completerCodesReferenceDepuisSaf")
    void codeVide() {
        assertNull(CorrectionResource.controlerCodeContreSaf("le secteur", null, VALIDES,
                "codSector", "999", v -> {}, Map.of(), "C1", new ArrayList<>()));
        assertNull(CorrectionResource.controlerCodeContreSaf("le secteur", "  ", VALIDES,
                "codSector", "999", v -> {}, Map.of(), "C1", new ArrayList<>()));
    }
}
