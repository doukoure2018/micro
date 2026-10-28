package io.digiservices.ecreditservice.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * Les dates sortent en texte, jamais en horodatage numerique (DSIG, 28/10/2026).
 *
 * <p>Avant le correctif, un {@code OffsetDateTime} partait en nombre de secondes depuis
 * 1970 et l'ecran, qui lit des millisecondes, affichait « 21/01/1970 » a la place de la
 * date du jour.</p>
 */
class JacksonConfigTest {

    /** Le mapper du service : le builder de Spring Boot, regle par le customizer. */
    private ObjectMapper mapper() {
        Jackson2ObjectMapperBuilder builder = new Jackson2ObjectMapperBuilder();
        new JacksonConfig().jsonCustomizer().customize(builder);
        return builder.build();
    }

    @Test
    void offsetDateTimeSortEnTexte() throws Exception {
        OffsetDateTime quand = OffsetDateTime.of(2026, 10, 28, 12, 13, 51, 99_868_000, ZoneOffset.UTC);
        String json = mapper().writeValueAsString(quand);
        assertTrue(json.startsWith("\"2026-10-28T12:13:51"), "attendu une date ISO, obtenu " + json);
    }

    @Test
    void localDateTimeSortEnTexte() throws Exception {
        LocalDateTime quand = LocalDateTime.of(2026, 10, 28, 12, 13, 51, 99_868_000);
        assertEquals("\"2026-10-28T12:13:51.099868\"", mapper().writeValueAsString(quand));
    }

    @Test
    void lectureToleranteDeLIso() throws Exception {
        // Les reponses d'ebanking et de SAF arrivent avec 0 a 6 decimales de seconde.
        for (String texte : new String[]{"2027-06-16T00:00:00", "2026-10-28T12:13:51.247",
                                          "2026-10-28T12:13:51.099868"}) {
            LocalDateTime lu = mapper().readValue("\"" + texte + "\"", LocalDateTime.class);
            assertEquals(2026 + (texte.startsWith("2027") ? 1 : 0), lu.getYear());
        }
    }
}
