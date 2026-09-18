package io.digiservices.ecreditservice.dto;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * Échéancier prévisionnel d'un crédit à capital constant avec moratoire (règle métier du 2026-09-18).
 * Calculé, jamais stocké : la même règle sert à la saisie, à l'analyse agricole et aux approbations.
 */
@Getter
@Builder
public class EcheancierDto {

    // ---- Paramètres d'entrée
    private BigDecimal montant;
    /** Taux mensuel en % (3 = 3 % par mois). */
    private BigDecimal tauxMensuel;
    private Integer dureeMois;
    private Integer moratoireMois;
    private Integer nombreEcheances;
    /** Date d'octroi de référence ; null si non renseignée (les lignes n'ont alors pas de date). */
    private LocalDate dateOctroi;

    // ---- Résultat
    private List<Ligne> lignes;
    private BigDecimal totalCapital;
    private BigDecimal totalInterets;
    private BigDecimal totalARembourser;
    /** Échéance la plus élevée (la 1re, qui porte les intérêts du moratoire) : base du ratio de capacité. */
    private BigDecimal echeanceMax;
    private LocalDate datePremiereEcheance;
    private LocalDate dateDerniereEcheance;

    // ---- Repères pour la mise en place manuelle dans SAF (unités SAF : jours, taux annuel)
    private ReperesSaf reperesSaf;

    @Getter
    @Builder
    public static class Ligne {
        private int numero;
        private LocalDate dateEcheance;
        /** Nombre de mois entre l'octroi et cette échéance. */
        private int moisDepuisOctroi;
        private BigDecimal capitalRestantAvant;
        /** Mois d'intérêts portés par cette échéance (G + 1 pour la 1re, 1 ensuite). */
        private int moisInteret;
        private BigDecimal interet;
        private BigDecimal capital;
        private BigDecimal montant;
    }

    @Getter
    @Builder
    public static class ReperesSaf {
        /** PLAZO_CREDITO : durée totale en jours (mois x 30). */
        private int plazoCreditoJours;
        /** CANT_CUOTAS : nombre d'échéances mensuelles (PER_CUOTA = ME). */
        private int cantCuotas;
        /** PLAZO_ADICIONAL tel que SAF le stocke : cuotas x 30 - plazo (négatif = différé). */
        private int plazoAdicionalJours;
        /** TASA_INTERES : taux annuel en % (mensuel x 12). */
        private BigDecimal tasaInteresAnnuelle;
        /** FEC_INICIO_PLAN : date de la 1re échéance. */
        private LocalDate fecInicioPlan;
    }
}
