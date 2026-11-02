package io.digiservices.ecreditservice.service;

import io.digiservices.ecreditservice.repository.PortefeuilleRisqueRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * La borne de comparaison de la tendance du portefeuille a risque.
 *
 * <p>La photo quotidienne a commence le 29/10/2026, mais les tranches 60 et 120 jours n'ont ete
 * ajoutees que plus tard dans la journee (V192) : la photo du 29 les porte donc a ZERO. Mesure
 * du 02/11/2026 sur la production : PAR 60 vaut 0,00 % au 29/10 et 6,21 % au 30/10.</p>
 *
 * <p>Comparer a cette premiere photo annoncerait a chaque DA et DR une hausse de six points du
 * portefeuille a risque a soixante jours qui n'a jamais eu lieu — le genre de chiffre qui
 * declenche une reunion. La borne existe pour cela, et ce test la fixe.</p>
 */
class PortefeuilleRisqueTendanceTest {

    @Test
    @DisplayName("la borne des quatre tranches est le 30 octobre 2026, pas le 29")
    void laBorneEstLePremierJourComplet() {
        assertEquals(LocalDate.of(2026, 10, 30),
                PortefeuilleRisqueRepository.TRANCHES_COMPLETES_DEPUIS,
                "le 29/10 porte les tranches 60 et 120 a zero : il ne peut pas servir de reference");
    }

    @Test
    @DisplayName("une serie qui commence avant la borne ne fournit pas de reference")
    void uneSerieTropAncienneNeFournitPasDeReference() {
        var borne = PortefeuilleRisqueRepository.TRANCHES_COMPLETES_DEPUIS;
        // Le 29/10 est hors borne : seul le 30 reste, et une seule photo ne permet aucune
        // comparaison. Le courriel doit alors afficher « — » et non une variation inventee.
        var serie = java.util.List.of(
                jour(LocalDate.of(2026, 10, 29), "0"),
                jour(LocalDate.of(2026, 10, 30), "6210000000"));
        var comparables = serie.stream().filter(j -> !j.date().isBefore(borne)).toList();
        assertEquals(1, comparables.size(), "la photo du 29 doit etre ecartee");

        // Avec trois photos dont deux dans la borne, la reference est la plus ancienne valable.
        var serie2 = java.util.List.of(
                jour(LocalDate.of(2026, 10, 29), "0"),
                jour(LocalDate.of(2026, 10, 30), "6210000000"),
                jour(LocalDate.of(2026, 11, 1), "6660000000"));
        var comparables2 = serie2.stream().filter(j -> !j.date().isBefore(borne)).toList();
        assertEquals(2, comparables2.size());
        assertEquals(LocalDate.of(2026, 10, 30), comparables2.get(0).date(),
                "la reference est la plus ancienne photo complete, pas la plus ancienne photo");
        assertTrue(comparables2.get(0).par60().signum() > 0,
                "une reference a zero signifierait que la tranche n'etait pas encore mesuree");
    }

    private static PortefeuilleRisqueRepository.JourTendance jour(LocalDate date, String par60) {
        return new PortefeuilleRisqueRepository.JourTendance(date, 30000,
                new java.math.BigDecimal("233000000000"), new java.math.BigDecimal("16000000000"),
                new java.math.BigDecimal(par60), new java.math.BigDecimal("11000000000"),
                new java.math.BigDecimal(par60));
    }
}
