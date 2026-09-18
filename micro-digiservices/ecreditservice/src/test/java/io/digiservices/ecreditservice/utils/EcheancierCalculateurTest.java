package io.digiservices.ecreditservice.utils;

import io.digiservices.ecreditservice.dto.EcheancierDto;
import io.digiservices.ecreditservice.exception.ValidationException;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

/** Règle métier figée le 2026-09-18 (exemple riz : 2 000 000, 9 mois, 2 échéances, moratoire 7). */
class EcheancierCalculateurTest {

    private static final BigDecimal DEUX_MILLIONS = new BigDecimal("2000000");
    private static final BigDecimal TROIS_POURCENT = new BigDecimal("3");

    @Test
    void exempleMetierRiz_9mois_2echeances_moratoire7() {
        EcheancierDto e = EcheancierCalculateur.calculer(
                DEUX_MILLIONS, TROIS_POURCENT, 9, 7, 2, LocalDate.of(2026, 7, 10));

        assertEquals(2, e.getLignes().size());

        EcheancierDto.Ligne l1 = e.getLignes().get(0);
        assertEquals(LocalDate.of(2027, 2, 10), l1.getDateEcheance());
        assertEquals(8, l1.getMoisInteret());
        assertEquals(bd("480000.00"), l1.getInteret());
        assertEquals(bd("1000000.00"), l1.getCapital());
        assertEquals(bd("1480000.00"), l1.getMontant());

        EcheancierDto.Ligne l2 = e.getLignes().get(1);
        assertEquals(LocalDate.of(2027, 3, 10), l2.getDateEcheance());
        assertEquals(1, l2.getMoisInteret());
        assertEquals(bd("1000000.00"), l2.getCapitalRestantAvant());
        assertEquals(bd("30000.00"), l2.getInteret());
        assertEquals(bd("1030000.00"), l2.getMontant());

        assertEquals(bd("510000.00"), e.getTotalInterets());
        assertEquals(bd("2510000.00"), e.getTotalARembourser());
        assertEquals(bd("1480000.00"), e.getEcheanceMax());

        // Repères SAF : 270 jours, 2 cuotas ME, PLAZO_ADICIONAL = 60 - 270, 36 %/an, plan au 10/02/2027
        assertEquals(270, e.getReperesSaf().getPlazoCreditoJours());
        assertEquals(2, e.getReperesSaf().getCantCuotas());
        assertEquals(-210, e.getReperesSaf().getPlazoAdicionalJours());
        assertEquals(bd("36.00"), e.getReperesSaf().getTasaInteresAnnuelle());
        assertEquals(LocalDate.of(2027, 2, 10), e.getReperesSaf().getFecInicioPlan());
    }

    @Test
    void uneSeuleEcheance_inFine() {
        EcheancierDto e = EcheancierCalculateur.calculer(DEUX_MILLIONS, TROIS_POURCENT, 9, 8, 1, LocalDate.of(2026, 7, 10));
        assertEquals(1, e.getLignes().size());
        assertEquals(9, e.getLignes().get(0).getMoisInteret());
        assertEquals(bd("540000.00"), e.getTotalInterets());
        assertEquals(LocalDate.of(2027, 3, 10), e.getLignes().get(0).getDateEcheance());
    }

    @Test
    void troisEcheances_reliquatArrondiSurLaDerniere() {
        EcheancierDto e = EcheancierCalculateur.calculer(DEUX_MILLIONS, TROIS_POURCENT, 9, 6, 3, null);
        assertEquals(3, e.getLignes().size());
        assertEquals(bd("666666.67"), e.getLignes().get(0).getCapital());
        assertEquals(bd("666666.67"), e.getLignes().get(1).getCapital());
        assertEquals(bd("666666.66"), e.getLignes().get(2).getCapital());
        assertEquals(bd("2000000.00"), e.getTotalCapital());
        // 7 mois sur 2 M, puis 1 mois sur 1 333 333,33, puis 1 mois sur 666 666,66
        assertEquals(bd("420000.00"), e.getLignes().get(0).getInteret());
        assertEquals(bd("40000.00"), e.getLignes().get(1).getInteret());
        assertEquals(bd("20000.00"), e.getLignes().get(2).getInteret());
        assertNull(e.getLignes().get(0).getDateEcheance());
        assertEquals(6, e.getLignes().get(0).getMoisDepuisOctroi());
    }

    @Test
    void sansMoratoire_creditClassiqueCapitalConstant() {
        EcheancierDto e = EcheancierCalculateur.calculer(new BigDecimal("1200000"), TROIS_POURCENT, 3, 0, 3, LocalDate.of(2026, 1, 31));
        assertEquals(1, e.getLignes().get(0).getMoisInteret());
        assertEquals(bd("36000.00"), e.getLignes().get(0).getInteret());
        assertEquals(bd("24000.00"), e.getLignes().get(1).getInteret());
        assertEquals(bd("12000.00"), e.getLignes().get(2).getInteret());
        // Jour inexistant : dernier jour du mois
        assertEquals(LocalDate.of(2026, 1, 31), e.getLignes().get(0).getDateEcheance());
        assertEquals(LocalDate.of(2026, 2, 28), e.getLignes().get(1).getDateEcheance());
    }

    @Test
    void dureeIncoherente_rejetee() {
        ValidationException ex = assertThrows(ValidationException.class,
                () -> EcheancierCalculateur.calculer(DEUX_MILLIONS, TROIS_POURCENT, 9, 6, 2, null));
        assertTrue(ex.getMessage().contains("9 mois"));
        assertThrows(ValidationException.class, () -> EcheancierCalculateur.validerCoherence(0, 0, 1));
        assertThrows(ValidationException.class, () -> EcheancierCalculateur.validerCoherence(6, -1, 7));
        assertThrows(ValidationException.class,
                () -> EcheancierCalculateur.calculer(BigDecimal.ZERO, TROIS_POURCENT, 2, 0, 2, null));
    }

    private static BigDecimal bd(String v) {
        return new BigDecimal(v);
    }
}
