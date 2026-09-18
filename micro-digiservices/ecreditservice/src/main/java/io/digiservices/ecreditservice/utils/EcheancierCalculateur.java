package io.digiservices.ecreditservice.utils;

import io.digiservices.ecreditservice.dto.EcheancierDto;
import io.digiservices.ecreditservice.exception.ValidationException;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * Calcul unique de l'échéancier prévisionnel avec moratoire (règle métier figée le 2026-09-18).
 *
 * <pre>
 *   D = durée en mois, N = nombre d'échéances, G = moratoire en mois, avec D = G + N
 *   capital par échéance   = M / N (capital constant, le reliquat d'arrondi va sur la dernière)
 *   intérêt échéance 1     = M x t x (G + 1)          (t = taux mensuel)
 *   intérêt échéance k > 1 = capital restant x t x 1
 *   date échéance k        = octroi + (G + k - 1) mois
 * </pre>
 * Exemple métier : 2 000 000, 9 mois, 2 échéances, moratoire 7, octroi 10/07/2026
 * -> 10/02/2027 : 480 000 + 1 000 000 = 1 480 000 ; 10/03/2027 : 30 000 + 1 000 000 = 1 030 000.
 * <p>
 * Convention identique à SAF (intérêt simple sur capital restant, 30/360, taux annuel = 12 x t,
 * intérêts du différé réglés avec la 1re cuota) : l'agent retrouve les mêmes montants lors de la
 * mise en place manuelle dans le core banking.
 */
public final class EcheancierCalculateur {

    private static final BigDecimal CENT = new BigDecimal("100");
    private static final int JOURS_PAR_MOIS = 30;

    private EcheancierCalculateur() {
    }

    /**
     * Contrôle de cohérence des modalités : D >= 1, N >= 1, G >= 0 et D = G + N.
     *
     * @throws ValidationException message explicite pour l'agent
     */
    public static void validerCoherence(Integer dureeMois, Integer moratoireMois, Integer nombreEcheances) {
        if (dureeMois == null || dureeMois < 1) {
            throw new ValidationException("La durée du crédit (en mois) doit être supérieure à 0");
        }
        if (nombreEcheances == null || nombreEcheances < 1) {
            throw new ValidationException("Le nombre d'échéances doit être supérieur à 0");
        }
        int g = moratoireMois == null ? 0 : moratoireMois;
        if (g < 0) {
            throw new ValidationException("Le moratoire (en mois) ne peut pas être négatif");
        }
        if (g + nombreEcheances != dureeMois) {
            throw new ValidationException(String.format(
                    "Modalités incohérentes : la durée (%d mois) doit être égale au moratoire (%d mois) + le nombre d'échéances (%d). "
                            + "Exemple : 9 mois = 7 mois de moratoire + 2 échéances",
                    dureeMois, g, nombreEcheances));
        }
    }

    /**
     * @param montant         montant du crédit
     * @param tauxMensuelPct  taux mensuel en % (3 = 3 %/mois)
     * @param dureeMois       durée totale D
     * @param moratoireMois   moratoire G (null = 0)
     * @param nombreEcheances nombre d'échéances N
     * @param dateOctroi      date d'octroi prévue ; null autorisé (lignes sans date)
     */
    public static EcheancierDto calculer(BigDecimal montant, BigDecimal tauxMensuelPct, Integer dureeMois,
                                         Integer moratoireMois, Integer nombreEcheances, LocalDate dateOctroi) {
        if (montant == null || montant.signum() <= 0) {
            throw new ValidationException("Le montant du crédit doit être supérieur à 0");
        }
        validerCoherence(dureeMois, moratoireMois, nombreEcheances);
        BigDecimal taux = (tauxMensuelPct == null ? BigDecimal.ZERO : tauxMensuelPct)
                .divide(CENT, 10, RoundingMode.HALF_UP);
        if (taux.signum() < 0) {
            throw new ValidationException("Le taux d'intérêt ne peut pas être négatif");
        }
        int n = nombreEcheances;
        int g = moratoireMois == null ? 0 : moratoireMois;

        BigDecimal capitalParEcheance = montant.divide(BigDecimal.valueOf(n), 2, RoundingMode.HALF_UP);
        BigDecimal capitalRestant = montant.setScale(2, RoundingMode.HALF_UP);
        BigDecimal totalInterets = BigDecimal.ZERO;
        BigDecimal echeanceMax = BigDecimal.ZERO;
        List<EcheancierDto.Ligne> lignes = new ArrayList<>(n);

        for (int k = 1; k <= n; k++) {
            int moisInteret = (k == 1) ? g + 1 : 1;
            int moisDepuisOctroi = g + k - 1;
            BigDecimal interet = capitalRestant.multiply(taux).multiply(BigDecimal.valueOf(moisInteret))
                    .setScale(2, RoundingMode.HALF_UP);
            // La dernière échéance solde le capital (absorbe le reliquat d'arrondi)
            BigDecimal capital = (k == n) ? capitalRestant : capitalParEcheance;
            BigDecimal montantLigne = capital.add(interet);

            lignes.add(EcheancierDto.Ligne.builder()
                    .numero(k)
                    .dateEcheance(dateOctroi == null ? null : dateOctroi.plusMonths(moisDepuisOctroi))
                    .moisDepuisOctroi(moisDepuisOctroi)
                    .capitalRestantAvant(capitalRestant)
                    .moisInteret(moisInteret)
                    .interet(interet)
                    .capital(capital)
                    .montant(montantLigne)
                    .build());

            totalInterets = totalInterets.add(interet);
            if (montantLigne.compareTo(echeanceMax) > 0) {
                echeanceMax = montantLigne;
            }
            capitalRestant = capitalRestant.subtract(capital);
        }

        BigDecimal totalCapital = montant.setScale(2, RoundingMode.HALF_UP);
        EcheancierDto.Ligne premiere = lignes.get(0);
        EcheancierDto.Ligne derniere = lignes.get(n - 1);

        return EcheancierDto.builder()
                .montant(totalCapital)
                .tauxMensuel(tauxMensuelPct)
                .dureeMois(dureeMois)
                .moratoireMois(g)
                .nombreEcheances(n)
                .dateOctroi(dateOctroi)
                .lignes(lignes)
                .totalCapital(totalCapital)
                .totalInterets(totalInterets.setScale(2, RoundingMode.HALF_UP))
                .totalARembourser(totalCapital.add(totalInterets).setScale(2, RoundingMode.HALF_UP))
                .echeanceMax(echeanceMax)
                .datePremiereEcheance(premiere.getDateEcheance())
                .dateDerniereEcheance(derniere.getDateEcheance())
                .reperesSaf(EcheancierDto.ReperesSaf.builder()
                        .plazoCreditoJours(dureeMois * JOURS_PAR_MOIS)
                        .cantCuotas(n)
                        .plazoAdicionalJours(n * JOURS_PAR_MOIS - dureeMois * JOURS_PAR_MOIS)
                        .tasaInteresAnnuelle(tauxMensuelPct == null ? BigDecimal.ZERO
                                : tauxMensuelPct.multiply(BigDecimal.valueOf(12)).setScale(2, RoundingMode.HALF_UP))
                        .fecInicioPlan(premiere.getDateEcheance())
                        .build())
                .build();
    }
}
