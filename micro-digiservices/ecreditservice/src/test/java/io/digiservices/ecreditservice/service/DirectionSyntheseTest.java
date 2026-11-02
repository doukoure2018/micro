package io.digiservices.ecreditservice.service;

import io.digiservices.ecreditservice.service.DirectionSyntheseService.Sens;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * La logique de la synthese hebdomadaire qui ne touche pas la base : les bornes de la semaine
 * decrite, le sens des variations, et la mise en forme des montants.
 *
 * <p>Ces trois points decident de ce qu'un directeur lit. Une borne de semaine fausse decale
 * tous les chiffres d'une semaine sans que rien ne le signale ; une couleur a l'envers fait lire
 * une bonne nouvelle comme une mauvaise.</p>
 */
class DirectionSyntheseTest {

    private static final LocalDate LUNDI_2_NOV = LocalDate.of(2026, 11, 2);

    @Test
    @DisplayName("la semaine decrite est toujours la derniere semaine complete")
    void laSemaineDecriteEstLaDerniereComplete() {
        // Envoi du lundi : la semaine qui vient de se clore.
        assertEquals(LocalDate.of(2026, 10, 26),
                DirectionSyntheseService.lundiDeLaSemaineDecrite(LUNDI_2_NOV),
                "un envoi du lundi 2 novembre decrit la semaine du 26 octobre");

        // Un apercu demande en milieu ou en fin de semaine donne la MEME semaine : la synthese
        // ne doit pas changer de perimetre selon le jour ou on la relit.
        for (int jour = 2; jour <= 8; jour++) {
            LocalDate reference = LocalDate.of(2026, 11, jour);
            assertEquals(LocalDate.of(2026, 10, 26),
                    DirectionSyntheseService.lundiDeLaSemaineDecrite(reference),
                    "le " + reference + " doit decrire la semaine du 26 octobre");
        }
        // Et le lundi suivant, la semaine avance d'exactement sept jours.
        assertEquals(LocalDate.of(2026, 11, 2),
                DirectionSyntheseService.lundiDeLaSemaineDecrite(LocalDate.of(2026, 11, 9)));
    }

    @Test
    @DisplayName("le dernier jour ouvre saute le week-end")
    void leDernierJourOuvreSauteLeWeekEnd() {
        // Un lundi : le dernier jour ouvre est le vendredi precedent.
        assertEquals(LocalDate.of(2026, 10, 30),
                DirectionSyntheseService.dernierJourOuvre(LUNDI_2_NOV));
        // Un mardi : la veille suffit.
        assertEquals(LocalDate.of(2026, 11, 2),
                DirectionSyntheseService.dernierJourOuvre(LocalDate.of(2026, 11, 3)));
        // Un dimanche : on remonte au vendredi.
        assertEquals(LocalDate.of(2026, 10, 30),
                DirectionSyntheseService.dernierJourOuvre(LocalDate.of(2026, 11, 1)));
    }

    @Test
    @DisplayName("une variation sans reference n'est pas inventee")
    void uneVariationSansReferenceNEstPasInventee() {
        assertTrue(DirectionSyntheseService.variation(42, null, Sens.NEUTRE).contains("—"),
                "sans semaine precedente, aucune variation n'est affichee");
        assertTrue(DirectionSyntheseService.variation(null, 42, Sens.NEUTRE).contains("—"),
                "sans valeur courante, aucune variation n'est affichee");
        assertTrue(DirectionSyntheseService.variation(42, 42, Sens.NEUTRE).contains("inchangé"));
    }

    @Test
    @DisplayName("la couleur suit le sens du metier, pas le signe")
    void laCouleurSuitLeSensDuMetier() {
        String vert = "#1E6B4F";
        String rouge = "#B3261E";

        // Plus de dossiers accordes : bonne nouvelle, donc vert.
        assertTrue(DirectionSyntheseService.variation(470, 400, Sens.HAUSSE_BONNE).contains(vert));
        assertTrue(DirectionSyntheseService.variation(400, 470, Sens.HAUSSE_BONNE).contains(rouge));

        // Plus d'arretes en retard : mauvaise nouvelle, donc rouge, bien que le signe soit « + ».
        assertTrue(DirectionSyntheseService.variation(19, 12, Sens.BAISSE_BONNE).contains(rouge),
                "une hausse des retards doit etre rouge");
        assertTrue(DirectionSyntheseService.variation(12, 19, Sens.BAISSE_BONNE).contains(vert),
                "une baisse des retards doit etre verte");

        // Le signe est toujours explicite.
        assertTrue(DirectionSyntheseService.variation(470, 400, Sens.HAUSSE_BONNE).contains("+70"));
    }

    @Test
    @DisplayName("un encours se lit en milliards, a la francaise")
    void unEncoursSeLitEnMilliards() {
        assertEquals("233,51 Md", DirectionSyntheseService.milliards(new BigDecimal("233510000000")));
        assertEquals("14,33 Md", DirectionSyntheseService.milliards(new BigDecimal("14330000000")));
        assertEquals("0,00 Md", DirectionSyntheseService.milliards(BigDecimal.ZERO));
    }
}
