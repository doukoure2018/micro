package io.digiservices.userservice.service;

import io.digiservices.userservice.exception.ApiException;
import org.junit.jupiter.api.Test;

import static io.digiservices.userservice.service.VerificationContactService.masquer;
import static io.digiservices.userservice.service.VerificationContactService.normaliserTelephone;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

/** Regles de saisie et d'affichage des contacts verifies (V172). */
class VerificationContactServiceTest {

    @Test
    void numeroRamenéANeufChiffres() {
        assertEquals("622001122", normaliserTelephone("622001122"));
        assertEquals("622001122", normaliserTelephone("+224 622 00 11 22"));
        assertEquals("622001122", normaliserTelephone("00224622001122"));
        assertEquals("622001122", normaliserTelephone("224622001122"));
        assertEquals("622001122", normaliserTelephone("622-00-11-22"));
        assertEquals("622001122", normaliserTelephone("  622 001 122  "));
    }

    @Test
    void numeroRefuseQuandLeFormatNEstPasGuineen() {
        assertThrows(ApiException.class, () -> normaliserTelephone("22001122"));      // huit chiffres
        assertThrows(ApiException.class, () -> normaliserTelephone("7220011223"));    // dix chiffres
        assertThrows(ApiException.class, () -> normaliserTelephone("522001122"));     // ne commence pas par 6
        assertThrows(ApiException.class, () -> normaliserTelephone(""));
        assertThrows(ApiException.class, () -> normaliserTelephone(null));
    }

    @Test
    void destinationMasqueeDansLesReponses() {
        // Le serveur ne renvoie jamais la destination en clair : l'ecran rappelle seulement
        // ou le code est parti, sans exposer l'adresse a quelqu'un qui regarde par-dessus l'epaule.
        assertEquals("rk" + "*".repeat(8) + "@gmail.com", masquer("EMAIL", "rkamano322@gmail.com"));
        assertEquals("62*****22", masquer("SMS", "622001122"));
        assertEquals("", masquer("EMAIL", null));
        assertEquals("", masquer("SMS", "   "));
    }

    @Test
    void masquageSupporteLesCasCourts() {
        assertEquals("a@b.com", masquer("EMAIL", "a@b.com"));   // trop court pour etre masque
        assertEquals("6220", masquer("SMS", "6220"));
    }
}
