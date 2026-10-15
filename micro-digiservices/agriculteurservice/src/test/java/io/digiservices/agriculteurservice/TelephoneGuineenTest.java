package io.digiservices.agriculteurservice;

import io.digiservices.agriculteurservice.exception.BadRequestException;
import io.digiservices.agriculteurservice.utils.TelephoneGuineen;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

/** Normalisation du numéro reçu dans l'adresse de {@code /agriculteurs/telephones/{telephone}/comptes}. */
class TelephoneGuineenTest {

    @Test
    void neufChiffresTelsQuels() {
        assertEquals("622451230", TelephoneGuineen.normaliser("622451230"));
    }

    @Test
    void indicatifEtSeparateursRetires() {
        assertEquals("622451230", TelephoneGuineen.normaliser("+224 622 45 12 30"));
        assertEquals("622451230", TelephoneGuineen.normaliser("00224622451230"));
        assertEquals("622451230", TelephoneGuineen.normaliser("224622451230"));
        assertEquals("622451230", TelephoneGuineen.normaliser("622-45-12-30"));
    }

    @Test
    void valeursDeSaisieRefusees() {
        // Valeurs portées par des milliers de fiches SAF : elles ne désignent personne.
        for (String saisie : new String[]{"1", "0000", "62", "62245123", "6224512300", "abc", "", "122451230"}) {
            assertThrows(BadRequestException.class, () -> TelephoneGuineen.normaliser(saisie), saisie);
        }
        assertThrows(BadRequestException.class, () -> TelephoneGuineen.normaliser(null));
    }
}
