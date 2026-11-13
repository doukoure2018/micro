package io.digiservices.ecreditservice.mobile;

import io.digiservices.ecreditservice.mobile.dto.MobileDtos.VisiteRecue;
import io.digiservices.ecreditservice.mobile.service.VisiteValidateur;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * Ce qu'une saisie de terrain doit contenir pour etre acceptee.
 *
 * <p>Ces regles refusent le travail d'un agent qui est peut-etre a trois heures de route : un
 * refus doit donc etre corrigeable depuis le telephone, et ce qui ne l'est pas ne doit jamais
 * couter sa saisie. C'est la ligne qui separe les cas ci-dessous.</p>
 */
class VisiteValidateurTest {

    private static final OffsetDateTime MAINTENANT = OffsetDateTime.parse("2026-11-13T10:00:00Z");
    private static final Set<String> TYPES = Set.of("VISITE", "APPEL");
    private static final Set<String> RESULTATS = Set.of("VU", "ABSENT", "REFUS", "PARTI", "DECEDE");
    private static final Set<String> MOTIFS = Set.of("RECOLTE_NON_VENDUE", "MEVENTE", "AUTRE");
    private static final Set<String> APPRECIATIONS = Set.of("A", "B", "C", "D");

    private static String refus(VisiteRecue v) {
        return VisiteValidateur.refus(v, MAINTENANT, TYPES, RESULTATS, MOTIFS, APPRECIATIONS);
    }

    /** Une visite ordinaire : associe vu, pas de promesse, pas d'appreciation. */
    private static VisiteRecue simple() {
        return new VisiteRecue("uuid-1", "102", 541625L, "10200034567",
                MAINTENANT.minusHours(2), "VISITE", "VU", null, null, null, null, null,
                null, null, null, null);
    }

    private static VisiteRecue avec(VisiteRecue v, String resultat, String motif,
                                    BigDecimal montant, LocalDate date, String appreciation,
                                    String remarque) {
        return new VisiteRecue(v.identifiantClient(), v.codAgencia(), v.numCredito(), v.codCliente(),
                v.saisieAt(), v.typeContact(), resultat, motif, montant, date, appreciation,
                remarque, v.latitude(), v.longitude(), v.precisionM(), v.corrigeIdentifiantClient());
    }

    @Test
    @DisplayName("une visite complete passe")
    void uneVisiteCompletePasse() {
        assertNull(refus(simple()));
        assertNull(refus(avec(simple(), "VU", "MEVENTE", new BigDecimal("600000"),
                LocalDate.now().plusDays(7), "C", "Riz recolte non vendu, promet le 20")));
    }

    @Test
    @DisplayName("une saisie sans identifiant est refusee : le telephone doit en creer un")
    void sansIdentifiant() {
        VisiteRecue v = simple();
        VisiteRecue sans = new VisiteRecue(null, v.codAgencia(), v.numCredito(), v.codCliente(),
                v.saisieAt(), v.typeContact(), v.resultat(), null, null, null, null, null,
                null, null, null, null);
        assertNotNull(refus(sans), "sans identifiant, la transmission rejouee ferait un doublon");
    }

    @Test
    @DisplayName("l'horloge du telephone peut deriver un peu, pas d'un jour")
    void horlogeDuTelephone() {
        VisiteRecue v = simple();
        assertNull(refusA(v, MAINTENANT.plusHours(2)), "deux heures d'avance : horloge mal reglee, "
                + "la saisie reste bonne");
        assertNotNull(refusA(v, MAINTENANT.plusDays(1)), "un jour d'avance : la date ne veut plus rien dire");
        assertNotNull(refusA(v, MAINTENANT.minusDays(90)), "trois mois : la file ne garde pas si longtemps");
        assertNull(refusA(v, MAINTENANT.minusDays(20)), "vingt jours sans reseau, cela arrive");
    }

    private static String refusA(VisiteRecue v, OffsetDateTime saisie) {
        VisiteRecue date = new VisiteRecue(v.identifiantClient(), v.codAgencia(), v.numCredito(),
                v.codCliente(), saisie, v.typeContact(), v.resultat(), null, null, null, null,
                null, null, null, null, null);
        return refus(date);
    }

    @Test
    @DisplayName("un code hors des listes fermees est refuse, avec son nom dans le motif")
    void codesHorsListe() {
        String r = refus(avec(simple(), "INCONNU", null, null, null, null, null));
        assertNotNull(r);
        assertTrue(r.contains("INCONNU"), "le motif doit nommer la valeur refusee : " + r);
        assertNotNull(refus(avec(simple(), "VU", "MOTIF_INVENTE", null, null, null, null)));
        assertNotNull(refus(avec(simple(), "VU", null, null, null, "Z", "une remarque assez longue")));
    }

    @Test
    @DisplayName("une promesse est un montant ET une date, dans un avenir raisonnable")
    void laPromesse() {
        LocalDate demain = LocalDate.now().plusDays(1);
        assertNotNull(refus(avec(simple(), "VU", null, new BigDecimal("600000"), null, null, null)),
                "un montant sans date n'engage personne");
        assertNotNull(refus(avec(simple(), "VU", null, null, demain, null, null)),
                "une date sans montant n'engage personne");
        assertNotNull(refus(avec(simple(), "VU", null, new BigDecimal("-5"), demain, null, null)));
        assertNotNull(refus(avec(simple(), "VU", null, new BigDecimal("600000"),
                LocalDate.now().minusDays(30), null, null)), "une date deja passee");
        assertNotNull(refus(avec(simple(), "VU", null, new BigDecimal("600000"),
                LocalDate.now().plusYears(3), null, null)), "trois ans : une erreur de saisie");
        assertNull(refus(avec(simple(), "VU", null, new BigDecimal("600000"), demain, null, null)));
    }

    @Test
    @DisplayName("C et D demandent une remarque, A et B non")
    void laRemarqueObligatoire() {
        assertNull(refus(avec(simple(), "VU", null, null, null, "A", null)));
        assertNull(refus(avec(simple(), "VU", null, null, null, "B", null)));
        assertNotNull(refus(avec(simple(), "VU", null, null, null, "C", null)));
        assertNotNull(refus(avec(simple(), "VU", null, null, null, "C", "   ")),
                "des espaces ne sont pas un constat");
        assertNotNull(refus(avec(simple(), "VU", null, null, null, "D", "court")));
        assertNull(refus(avec(simple(), "VU", null, null, null, "D",
                "Associe parti du village depuis deux mois, famille sans adresse")));
        assertEquals(10, VisiteValidateur.REMARQUE_MIN,
                "le seuil doit rester celui de la contrainte de la base (V209)");
    }
}
