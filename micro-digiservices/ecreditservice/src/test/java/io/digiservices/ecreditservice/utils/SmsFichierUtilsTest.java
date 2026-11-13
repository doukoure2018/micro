package io.digiservices.ecreditservice.utils;

import io.digiservices.ecreditservice.exception.ApiException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;

import java.nio.charset.StandardCharsets;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * Tests de garde de la lecture des fichiers de numeros.
 *
 * <p>Deux choses s'y sont deja mal passees et doivent rester tenues : l'en-tete compte comme un
 * numero invalide, et un fichier trop gros emporte le service avec lui — c'est ce qui est arrive
 * le 20 octobre 2026 sur un export POI.</p>
 */
class SmsFichierUtilsTest {

    private static MockMultipartFile csv(String contenu) {
        return new MockMultipartFile("fichier", "numeros.csv", "text/csv",
                contenu.getBytes(StandardCharsets.UTF_8));
    }

    // ================================================================ en-tete

    @Test
    @DisplayName("l'en-tete est saute et ne compte pas comme un numero invalide")
    void entetteSautee() {
        List<String> lignes = SmsFichierUtils.lireLignes(csv("Telephone\n622000001\n622000002\n"));
        assertEquals(List.of("622000001", "622000002"), lignes);
    }

    @Test
    @DisplayName("les intitules accentues et abreges sont reconnus")
    void entetesReconnues() {
        assertEquals(1, SmsFichierUtils.lireLignes(csv("Téléphone\n622000001\n")).size());
        assertEquals(1, SmsFichierUtils.lireLignes(csv("NUMERO\n622000001\n")).size());
        assertEquals(1, SmsFichierUtils.lireLignes(csv("msisdn\n622000001\n")).size());
        assertEquals(1, SmsFichierUtils.lireLignes(csv("Contact client\n622000001\n")).size());
    }

    @Test
    @DisplayName("un fichier sans en-tete garde sa premiere ligne")
    void sansEntete() {
        List<String> lignes = SmsFichierUtils.lireLignes(csv("622000001\n622000002\n"));
        assertEquals(2, lignes.size(), "aucune ligne ne doit etre perdue");
        assertEquals("622000001", lignes.get(0));
    }

    // ================================================================ separateurs

    @Test
    @DisplayName("seule la premiere colonne est lue, point-virgule comme virgule")
    void premiereColonne() {
        List<String> lignes = SmsFichierUtils.lireLignes(csv("622000001;Mamadou;Conakry\n660000002,Aissatou,Kankan\n"));
        assertEquals(List.of("622000001", "660000002"), lignes);
    }

    // ================================================================ plafond

    @Test
    @DisplayName("au-dela du plafond, le fichier est refuse — et le service tient debout")
    void plafondDeLignes() {
        StringBuilder enorme = new StringBuilder("Telephone\n");
        for (int i = 0; i <= SmsFichierUtils.MAX_LIGNES; i++) {
            enorme.append("62200").append(String.format("%04d", i % 10_000)).append('\n');
        }
        ApiException erreur = assertThrows(ApiException.class, () -> SmsFichierUtils.lireLignes(csv(enorme.toString())));
        assertTrue(erreur.getMessage().contains("refusé"), "le refus doit etre explicite : " + erreur.getMessage());
    }

    // ================================================================ normalisation

    @Test
    @DisplayName("tous les habillages d'un meme numero donnent le meme resultat")
    void normalisation() {
        assertEquals("622000001", SmsFichierUtils.normaliserNumero("622000001"));
        assertEquals("622000001", SmsFichierUtils.normaliserNumero("+224 622 00 00 01"));
        assertEquals("622000001", SmsFichierUtils.normaliserNumero("00224622000001"));
        assertEquals("622000001", SmsFichierUtils.normaliserNumero("224622000001"));
        assertEquals("622000001", SmsFichierUtils.normaliserNumero("622-00-00-01"));
        assertEquals("622000001", SmsFichierUtils.normaliserNumero(" 622.000.001 "));
    }

    @Test
    @DisplayName("ce qui n'est pas un mobile guineen est refuse, pas devine")
    void normalisationRefus() {
        assertNull(SmsFichierUtils.normaliserNumero("12345"));
        assertNull(SmsFichierUtils.normaliserNumero("522000001"), "prefixe hors plage mobile");
        assertNull(SmsFichierUtils.normaliserNumero("6220000011"), "dix chiffres");
        assertNull(SmsFichierUtils.normaliserNumero(""));
        assertNull(SmsFichierUtils.normaliserNumero(null));
    }

    // ================================================================ operateur

    @Test
    @DisplayName("l'operateur se deduit du prefixe, et l'inconnu s'assume")
    void operateur() {
        assertEquals("Orange", SmsFichierUtils.operateur("622000001"));
        assertEquals("MTN", SmsFichierUtils.operateur("660000001"));
        assertEquals("Cellcom", SmsFichierUtils.operateur("655000001"));
        assertEquals("Autre", SmsFichierUtils.operateur("699000001"),
                "une plage non repertoriee se nomme, elle ne se refuse pas");
        assertEquals("Autre", SmsFichierUtils.operateur(null));
    }
}
