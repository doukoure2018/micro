package io.digiservices.ebanking.service.score;

import io.digiservices.ebanking.dto.EvaluationRisqueDTO;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;

/**
 * Regles UNIQUES du score de confiance d'un membre.
 *
 * <p>Avant le lot 0, deux calculs coexistaient dans {@code CreditosServiceImpl} avec des
 * tolerances, des paliers et des fenetres de recence differents : un meme membre pouvait
 * obtenir deux scores selon l'ecran qui l'interrogeait. Les bornes vivent desormais ICI
 * et nulle part ailleurs, cote serveur comme cote interface
 * (voir {@code frontend/.../utils/score-confiance.ts}).</p>
 *
 * <p>Deux bases de calcul restent necessaires — a regles identiques :</p>
 * <ul>
 *   <li>{@link #BASE_ECHEANCES} : une note par echeance echue. Base de reference.</li>
 *   <li>{@link #BASE_CREDITS} : une note par credit (cloture vs echeance finale), pour les
 *       ecrans qui lisent la sauvegarde SAF sans la requete des echeanciers, trop lente.
 *       Plus grossiere par nature, d'ou le champ {@code basePourScore} rendu au client.</li>
 * </ul>
 *
 * <p>Un membre sans aucun historique n'a pas un score de zero : il a un ETAT, la classe
 * « nouveau membre » ({@link #nouveauMembre()}).</p>
 */
public final class ScoreConfiance {

    /** Version des regles, rendue au client et destinee a etre journalisee (lot 2). */
    public static final String VERSION = "lot0-2026-11";

    public static final String BASE_ECHEANCES = "ECHEANCES";
    public static final String BASE_CREDITS = "CREDITS";

    /** Un retard jusqu'a 5 jours est considere comme respecte. */
    public static final long TOLERANCE_JOURS = 5;
    public static final long PALIER_LEGER_JOURS = 30;
    public static final long PALIER_SERIEUX_JOURS = 90;

    /** Le comportement recent pese double, sur cette fenetre. */
    public static final int MOIS_RECENCE = 18;
    private static final double POIDS_RECENT = 2.0;
    private static final double POIDS_ANCIEN = 1.0;

    /** Points d'une echeance pleinement respectee : le maximum atteignable. */
    public static final double POINTS_MAX = 100.0;
    private static final double POINTS_A_TEMPS = POINTS_MAX;
    private static final double POINTS_LEGER = 70.0;
    private static final double POINTS_SERIEUX = 40.0;
    private static final double POINTS_REGULARISE_TARD = 10.0;
    private static final double POINTS_IMPAYE = 0.0;

    private static final BigDecimal CENT = new BigDecimal("100");
    private static final BigDecimal SEUIL_TRES_FAIBLE = new BigDecimal("90");
    private static final BigDecimal SEUIL_FAIBLE = new BigDecimal("75");
    private static final BigDecimal SEUIL_MODERE = new BigDecimal("60");
    private static final BigDecimal SEUIL_ELEVE = new BigDecimal("40");

    public static final String NIVEAU_NOUVEAU = "NOUVEAU";

    private ScoreConfiance() {
    }

    /**
     * Points obtenus pour un retard donne.
     *
     * @param joursRetard retard en jours, 0 si a temps ou en avance
     * @param regularise  vrai si la somme a fini par etre payee (sinon : toujours impayee)
     */
    public static double points(long joursRetard, boolean regularise) {
        if (joursRetard <= TOLERANCE_JOURS) return POINTS_A_TEMPS;
        if (joursRetard <= PALIER_LEGER_JOURS) return POINTS_LEGER;
        if (joursRetard <= PALIER_SERIEUX_JOURS) return POINTS_SERIEUX;
        return regularise ? POINTS_REGULARISE_TARD : POINTS_IMPAYE;
    }

    /** Vrai quand les points valent une echeance pleinement respectee. */
    public static boolean respectee(double points) {
        return points >= POINTS_A_TEMPS;
    }

    /** Poids de recence : double sur les {@value #MOIS_RECENCE} derniers mois. */
    public static double poids(LocalDateTime date, LocalDateTime maintenant) {
        if (date == null) return POIDS_ANCIEN;
        return date.isAfter(maintenant.minusMonths(MOIS_RECENCE)) ? POIDS_RECENT : POIDS_ANCIEN;
    }

    /** Score sur 100, deux decimales. */
    public static BigDecimal score(double sommePoints, double sommePoids) {
        if (sommePoids <= 0) return BigDecimal.ZERO;
        return BigDecimal.valueOf(sommePoints * 100.0 / sommePoids).setScale(2, RoundingMode.HALF_UP);
    }

    /** Niveau de risque correspondant au score. Seuils 90 / 75 / 60 / 40. */
    public static String niveau(BigDecimal score) {
        if (score == null) return NIVEAU_NOUVEAU;
        if (score.compareTo(SEUIL_TRES_FAIBLE) >= 0) return "TRÈS FAIBLE";
        if (score.compareTo(SEUIL_FAIBLE) >= 0) return "FAIBLE";
        if (score.compareTo(SEUIL_MODERE) >= 0) return "MODÉRÉ";
        if (score.compareTo(SEUIL_ELEVE) >= 0) return "ÉLEVÉ";
        return "TRÈS ÉLEVÉ";
    }

    /** Libelle du comportement de remboursement, aligne sur les memes seuils. */
    public static String historiqueRemboursement(BigDecimal score) {
        if (score == null) return "Premier crédit — aucun historique SAF";
        if (score.compareTo(SEUIL_TRES_FAIBLE) >= 0) return "Excellent";
        if (score.compareTo(SEUIL_FAIBLE) >= 0) return "Bon";
        if (score.compareTo(SEUIL_MODERE) >= 0) return "Moyen";
        if (score.compareTo(SEUIL_ELEVE) >= 0) return "Faible";
        return "Très faible";
    }

    /**
     * Membre sans aucun historique exploitable : un etat, pas un score de zero.
     * Le score et le pourcentage de risque restent nuls — l'interface affiche
     * « Nouveau membre » en gris, jamais un 0 % en rouge.
     */
    public static EvaluationRisqueDTO nouveauMembre() {
        return EvaluationRisqueDTO.builder()
                .niveauRisque(NIVEAU_NOUVEAU)
                .nouveauMembre(true)
                .pourcentageRisque(null)
                .scoreConfiance(null)
                .creditsAnalyses(0)
                .echeancesAnalysees(0)
                .echeancesRespectees(0)
                .echeancesEnRetard(0)
                .retardMoyenJours(0)
                .historiqueRemboursement(historiqueRemboursement(null))
                .basePourScore(null)
                .versionScore(VERSION)
                .build();
    }

    /** Evaluation complete a partir des totaux accumules par l'appelant. */
    public static EvaluationRisqueDTO evaluation(double sommePoints,
                                                 double sommePoids,
                                                 int creditsAnalyses,
                                                 int echeancesAnalysees,
                                                 int echeancesRespectees,
                                                 int echeancesEnRetard,
                                                 int retardMoyenJours,
                                                 String basePourScore) {
        BigDecimal score = score(sommePoints, sommePoids);
        return EvaluationRisqueDTO.builder()
                .niveauRisque(niveau(score))
                .nouveauMembre(false)
                .pourcentageRisque(CENT.subtract(score))
                .scoreConfiance(score)
                .creditsAnalyses(creditsAnalyses)
                .echeancesAnalysees(echeancesAnalysees)
                .echeancesRespectees(echeancesRespectees)
                .echeancesEnRetard(echeancesEnRetard)
                .retardMoyenJours(retardMoyenJours)
                .historiqueRemboursement(historiqueRemboursement(score))
                .basePourScore(basePourScore)
                .versionScore(VERSION)
                .build();
    }
}
