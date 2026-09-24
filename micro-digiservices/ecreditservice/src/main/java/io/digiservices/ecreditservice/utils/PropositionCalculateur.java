package io.digiservices.ecreditservice.utils;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.Normalizer;

/**
 * Calcul de la proposition de l'agent (decision user du 2026-09-24, dossier 3526).
 * <p>
 * Regle CRG (identique a la traite sollicitee saisie par les agents et a EcheancierCalculateur
 * sans moratoire) : capital constant, interet simple sur capital restant. La traite retenue pour
 * le ratio R.1 est la <b>premiere</b>, la plus elevee :
 * <pre>
 *   mois par periode  p = 1 (mensuelle), 2, 3, 4, 6, 12
 *   nombre d'echeances N = ceil(duree / p)
 *   traite             = M / N + M x t x p        (t = taux mensuel)
 * </pre>
 * Exemple 3526 : 100 000 000, 24 mois, mensuelle, 2,5 %/mois -> N = 24, traite = 4 166 667 + 2 500 000 = 6 666 667.
 */
public final class PropositionCalculateur {

    private static final BigDecimal CENT = new BigDecimal("100");

    private PropositionCalculateur() {
    }

    /** Libelle canonique attendu par la contrainte periodicite_proposee (Mensuelle, Trimestrielle...). */
    public static String normaliserPeriodicite(String periodicite) {
        if (periodicite == null) {
            return null;
        }
        String base = Normalizer.normalize(periodicite.trim(), Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "").toLowerCase();
        return switch (base) {
            case "mensuelle", "mensuel" -> "Mensuelle";
            case "bimestrielle", "bimestriel" -> "Bimestrielle";
            case "trimestrielle", "trimestriel" -> "Trimestrielle";
            case "quadrimestrielle", "quatrimestrielle", "quadrimestriel" -> "Quadrimestrielle";
            case "semestrielle", "semestriel" -> "Semestrielle";
            case "annuelle", "annuel" -> "Annuelle";
            default -> periodicite.trim();
        };
    }

    /** Nombre de mois entre deux traites (miroir de fn_mois_periodicite, V152). */
    public static int moisParPeriode(String periodicite) {
        String p = normaliserPeriodicite(periodicite);
        if (p == null) {
            return 1;
        }
        return switch (p) {
            case "Bimestrielle" -> 2;
            case "Trimestrielle" -> 3;
            case "Quadrimestrielle" -> 4;
            case "Semestrielle" -> 6;
            case "Annuelle" -> 12;
            default -> 1;
        };
    }

    public static int nombreEcheances(int dureeMois, int moisParPeriode) {
        int p = Math.max(moisParPeriode, 1);
        return Math.max(1, (dureeMois + p - 1) / p);
    }

    /** Premiere traite (capital / N + interet d'une periode sur la totalite du capital), arrondie au franc. */
    public static BigDecimal echeanceMax(BigDecimal montant, BigDecimal tauxMensuelPct, int moisParPeriode, int nombreEcheances) {
        BigDecimal capital = montant.divide(BigDecimal.valueOf(Math.max(nombreEcheances, 1)), 2, RoundingMode.HALF_UP);
        BigDecimal taux = (tauxMensuelPct == null ? BigDecimal.ZERO : tauxMensuelPct).divide(CENT, 10, RoundingMode.HALF_UP);
        BigDecimal interet = montant.multiply(taux).multiply(BigDecimal.valueOf(Math.max(moisParPeriode, 1)));
        return capital.add(interet).setScale(0, RoundingMode.HALF_UP);
    }
}
