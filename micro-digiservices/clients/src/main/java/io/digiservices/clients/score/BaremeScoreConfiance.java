package io.digiservices.clients.score;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;

/**
 * Bareme UNIQUE du score de confiance d'un membre (version 2).
 *
 * <p>Il vit dans {@code clients} parce que le score se calcule a deux endroits : le
 * e-banking tient les trois composantes tirees de SAF, le e-credit ajoute les signaux
 * connus de digi seul puis arrete la classe. Sans bareme partage, les deux moities
 * divergeraient — c'est exactement le defaut que le lot 0 a supprime.</p>
 *
 * <p>Quatre composantes, 100 points :</p>
 * <ul>
 *   <li><b>Ponctualite /60</b> — chaque echeance echue notee selon son retard, ponderee par
 *       son MONTANT (une traite de 5 M ne vaut pas une de 50 000) et par sa recence.</li>
 *   <li><b>Profondeur /15</b> — ce que la relation a deja prouve : credits soldes, anciennete.
 *       C'est la composante qui distingue « je ne sais rien » de « je sais que c'est mauvais ».</li>
 *   <li><b>Situation /15</b> — l'etat des credits en cours aujourd'hui.</li>
 *   <li><b>Signaux digi /10</b> — ce que la plateforme sait et que SAF ignore. Dix points
 *       quand il n'y a aucun signal : on ne recompense pas, on retire.</li>
 * </ul>
 *
 * <p>Deux regles dures au-dessus du score : un contentieux declare place en classe E quel
 * que soit le total, une restructuration detectee plafonne le total. Le score prepare, le
 * decideur decide — il ne bloque jamais seul.</p>
 *
 * <p>Classes : A 85-100, B 70-84, C 55-69, D 40-54, E &lt; 40, et N pour un membre sans
 * historique — un etat, pas une note. Memes lettres que le score des agents de credit,
 * deja connues des directeurs d'agence.</p>
 */
public final class BaremeScoreConfiance {

    /** Version des regles. Journalisee avec chaque score : un score sans sa version n'est pas comparable. */
    public static final String VERSION = "v2-2026-11";

    public static final String BASE_ECHEANCES = "ECHEANCES";
    public static final String BASE_CREDITS = "CREDITS";

    // ---------------------------------------------------------------- retard
    /** Un retard jusqu'a 5 jours est considere comme respecte. */
    public static final long TOLERANCE_JOURS = 5;
    public static final long PALIER_LEGER_JOURS = 30;
    public static final long PALIER_SERIEUX_JOURS = 90;

    public static final double POINTS_MAX = 100.0;
    private static final double POINTS_LEGER = 70.0;
    private static final double POINTS_SERIEUX = 40.0;
    private static final double POINTS_REGULARISE_TARD = 10.0;
    private static final double POINTS_IMPAYE = 0.0;

    /** Le comportement recent pese double, sur cette fenetre. */
    public static final int MOIS_RECENCE = 18;
    private static final double POIDS_RECENT = 2.0;
    private static final double POIDS_ANCIEN = 1.0;

    /**
     * Plancher de montant, en part du montant moyen des echeances analysees. Sans lui, une
     * seule grosse echeance ecraserait dix petits impayes ; avec lui, une echeance
     * derisoire compte encore un peu.
     */
    public static final double PART_PLANCHER_MONTANT = 0.10;

    // ---------------------------------------------------------------- composantes
    public static final BigDecimal MAX_PONCTUALITE = new BigDecimal("60");
    public static final BigDecimal MAX_PROFONDEUR = new BigDecimal("15");
    public static final BigDecimal MAX_SITUATION = new BigDecimal("15");
    public static final BigDecimal MAX_SIGNAUX_DIGI = new BigDecimal("10");
    public static final BigDecimal MAX_TOTAL = new BigDecimal("100");

    /** Profondeur : points par nombre de credits deja soldes. */
    private static final BigDecimal PROFONDEUR_UN = new BigDecimal("8");
    private static final BigDecimal PROFONDEUR_DEUX = new BigDecimal("12");
    private static final BigDecimal PROFONDEUR_TROIS = new BigDecimal("15");
    private static final BigDecimal PROFONDEUR_BONUS_ANCIENNETE = new BigDecimal("3");
    public static final int ANNEES_ANCIENNETE = 5;

    /** Situation courante : points selon le pire retard constate sur les credits en cours. */
    private static final BigDecimal SITUATION_SAINE = new BigDecimal("15");
    private static final BigDecimal SITUATION_RETARD_LEGER = new BigDecimal("8");
    private static final BigDecimal SITUATION_RETARD_SERIEUX = new BigDecimal("3");
    private static final BigDecimal SITUATION_DEFAILLANTE = BigDecimal.ZERO;

    /** Signaux digi : ce que chaque signal retire aux 10 points de depart. */
    public static final BigDecimal PENALITE_DOSSIER_ANNULE = new BigDecimal("3");
    public static final BigDecimal PENALITE_DEMANDE_REFUSEE = new BigDecimal("4");
    public static final BigDecimal PENALITE_MEMBRE_NON_VERIFIE = new BigDecimal("3");
    /** Fenetre pendant laquelle une decision interne pese encore. */
    public static final int MOIS_SIGNAUX_DIGI = 12;

    /** Une restructuration detectee plafonne le total : le remboursement n'a pas eu lieu. */
    public static final BigDecimal PLAFOND_RESTRUCTURATION = new BigDecimal("60");
    /** Tolerance de date pour reconnaitre une restructuration (credit solde par un autre). */
    public static final long JOURS_RESTRUCTURATION = 3;

    // ---------------------------------------------------------------- classes
    public static final String CLASSE_NOUVEAU = "N";
    private static final BigDecimal SEUIL_A = new BigDecimal("85");
    private static final BigDecimal SEUIL_B = new BigDecimal("70");
    private static final BigDecimal SEUIL_C = new BigDecimal("55");
    private static final BigDecimal SEUIL_D = new BigDecimal("40");

    private BaremeScoreConfiance() {
    }

    // ================================================================ retard

    /**
     * Points d'une echeance (ou d'un credit) selon son retard.
     *
     * @param joursRetard retard en jours, 0 si a temps ou en avance
     * @param regularise  vrai si la somme a fini par etre payee
     */
    public static double points(long joursRetard, boolean regularise) {
        if (joursRetard <= TOLERANCE_JOURS) return POINTS_MAX;
        if (joursRetard <= PALIER_LEGER_JOURS) return POINTS_LEGER;
        if (joursRetard <= PALIER_SERIEUX_JOURS) return POINTS_SERIEUX;
        return regularise ? POINTS_REGULARISE_TARD : POINTS_IMPAYE;
    }

    /** Vrai quand les points valent une echeance pleinement respectee. */
    public static boolean respectee(double points) {
        return points >= POINTS_MAX;
    }

    /** Poids de recence : double sur les {@value #MOIS_RECENCE} derniers mois. */
    public static double poidsRecence(LocalDateTime date, LocalDateTime maintenant) {
        if (date == null) return POIDS_ANCIEN;
        return date.isAfter(maintenant.minusMonths(MOIS_RECENCE)) ? POIDS_RECENT : POIDS_ANCIEN;
    }

    /**
     * Poids de montant, plancher applique. Le plancher evite qu'une echeance de fin de
     * credit, derisoire, ne disparaisse du calcul.
     */
    public static double poidsMontant(BigDecimal montant, double montantMoyen) {
        double plancher = Math.max(montantMoyen * PART_PLANCHER_MONTANT, 1.0);
        double valeur = montant == null ? 0.0 : montant.doubleValue();
        if (valeur <= 0.0) return plancher;
        return Math.max(valeur, plancher);
    }

    // ================================================================ composantes

    /** Ponctualite sur {@link #MAX_PONCTUALITE} points. */
    public static BigDecimal ponctualite(double sommePointsPonderes, double sommePoidsPonderes) {
        if (sommePoidsPonderes <= 0) return BigDecimal.ZERO;
        double ratio = sommePointsPonderes / (POINTS_MAX * sommePoidsPonderes);
        return MAX_PONCTUALITE.multiply(BigDecimal.valueOf(ratio)).setScale(2, RoundingMode.HALF_UP);
    }

    /** Profondeur de la relation sur {@link #MAX_PROFONDEUR} points. */
    public static BigDecimal profondeur(int creditsSoldes, int anneesRelation) {
        BigDecimal base;
        if (creditsSoldes >= 3) base = PROFONDEUR_TROIS;
        else if (creditsSoldes == 2) base = PROFONDEUR_DEUX;
        else if (creditsSoldes == 1) base = PROFONDEUR_UN;
        else base = BigDecimal.ZERO;

        if (anneesRelation >= ANNEES_ANCIENNETE) {
            base = base.add(PROFONDEUR_BONUS_ANCIENNETE);
        }
        return base.min(MAX_PROFONDEUR).setScale(2, RoundingMode.HALF_UP);
    }

    /**
     * Situation courante sur {@link #MAX_SITUATION} points.
     *
     * @param joursRetardMax pire retard constate sur les credits en cours, 0 si aucun
     * @param creditsEnCours nombre de credits en cours ; aucun credit en cours = situation saine
     */
    public static BigDecimal situation(long joursRetardMax, int creditsEnCours) {
        if (creditsEnCours == 0 || joursRetardMax <= TOLERANCE_JOURS) {
            return SITUATION_SAINE.setScale(2, RoundingMode.HALF_UP);
        }
        if (joursRetardMax < PALIER_LEGER_JOURS) return SITUATION_RETARD_LEGER.setScale(2, RoundingMode.HALF_UP);
        if (joursRetardMax <= PALIER_SERIEUX_JOURS) return SITUATION_RETARD_SERIEUX.setScale(2, RoundingMode.HALF_UP);
        return SITUATION_DEFAILLANTE.setScale(2, RoundingMode.HALF_UP);
    }

    /**
     * Signaux digi sur {@link #MAX_SIGNAUX_DIGI} points : dix au depart, chaque signal en
     * retire. Jamais negatif.
     */
    public static BigDecimal signauxDigi(int dossiersAnnules, int demandesRefusees, boolean membreNonVerifie) {
        BigDecimal note = MAX_SIGNAUX_DIGI;
        if (dossiersAnnules > 0) note = note.subtract(PENALITE_DOSSIER_ANNULE);
        if (demandesRefusees > 0) note = note.subtract(PENALITE_DEMANDE_REFUSEE);
        if (membreNonVerifie) note = note.subtract(PENALITE_MEMBRE_NON_VERIFIE);
        return note.max(BigDecimal.ZERO).setScale(2, RoundingMode.HALF_UP);
    }

    /** Signaux digi neutres : utilise quand la base digi n'a pas ete interrogee. */
    public static BigDecimal signauxDigiNeutres() {
        return MAX_SIGNAUX_DIGI.setScale(2, RoundingMode.HALF_UP);
    }

    // ================================================================ total et classe

    /** Total sur 100, plafonne en cas de restructuration detectee. */
    public static BigDecimal total(BigDecimal ponctualite,
                                   BigDecimal profondeur,
                                   BigDecimal situation,
                                   BigDecimal signauxDigi,
                                   boolean restructurationDetectee) {
        BigDecimal somme = nonNul(ponctualite)
                .add(nonNul(profondeur))
                .add(nonNul(situation))
                .add(nonNul(signauxDigi))
                .min(MAX_TOTAL);
        if (restructurationDetectee) {
            somme = somme.min(PLAFOND_RESTRUCTURATION);
        }
        return somme.setScale(2, RoundingMode.HALF_UP);
    }

    /**
     * Classe du membre. Un contentieux declare place en E quel que soit le total : une
     * creance passee au contentieux n'est pas une nuance de score.
     */
    public static String classe(BigDecimal total, boolean nouveauMembre, boolean contentieux) {
        if (nouveauMembre) return CLASSE_NOUVEAU;
        if (contentieux) return "E";
        if (total == null) return CLASSE_NOUVEAU;
        if (total.compareTo(SEUIL_A) >= 0) return "A";
        if (total.compareTo(SEUIL_B) >= 0) return "B";
        if (total.compareTo(SEUIL_C) >= 0) return "C";
        if (total.compareTo(SEUIL_D) >= 0) return "D";
        return "E";
    }

    /** Libelle de la classe, tel qu'il doit etre lu a l'ecran. */
    public static String classeLibelle(String classe) {
        if (classe == null) return "INDISPONIBLE";
        switch (classe) {
            case "A": return "EXCELLENT";
            case "B": return "BON";
            case "C": return "À SURVEILLER";
            case "D": return "FRAGILE";
            case "E": return "DÉFAILLANT";
            case CLASSE_NOUVEAU: return "NOUVEAU MEMBRE";
            default: return "INDISPONIBLE";
        }
    }

    /** Phrase d'orientation, sans rien bloquer : le decideur reste le decideur. */
    public static String classeConduite(String classe) {
        if (classe == null) return "";
        switch (classe) {
            case "A": return "Historique excellent, aucune réserve";
            case "B": return "Bon historique, retards légers isolés";
            case "C": return "À surveiller : analyse renforcée conseillée";
            case "D": return "Fragile : visite et caution exigées";
            case "E": return "Défaillant ou en contentieux : analyse renforcée";
            case CLASSE_NOUVEAU: return "Premier crédit : analyse sur pièces et visite, ce n’est pas un défaut de paiement";
            default: return "";
        }
    }

    /** Vrai pour les classes qui appellent une analyse renforcee. */
    public static boolean analyseRenforcee(String classe) {
        return "C".equals(classe) || "D".equals(classe) || "E".equals(classe) || CLASSE_NOUVEAU.equals(classe);
    }

    private static BigDecimal nonNul(BigDecimal valeur) {
        return valeur == null ? BigDecimal.ZERO : valeur;
    }
}
