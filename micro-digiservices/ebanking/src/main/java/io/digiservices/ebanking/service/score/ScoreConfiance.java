package io.digiservices.ebanking.service.score;

import io.digiservices.clients.score.BaremeScoreConfiance;
import io.digiservices.ebanking.domain.CreditoDTO;
import io.digiservices.ebanking.domain.PlanPagoDTO;
import io.digiservices.ebanking.dto.DetailRisqueCreditDTO;
import io.digiservices.ebanking.dto.EvaluationRisqueDTO;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Part SAF du score de confiance : les trois composantes qui se lisent dans SAF2000
 * (ponctualite, profondeur, situation), le detail par credit et la detection des
 * restructurations.
 *
 * <p>Les bornes ne sont pas ici : elles sont dans {@link BaremeScoreConfiance}, partage avec
 * le e-credit qui ajoute les signaux digi et arrete la classe. Le e-banking ignore tout de
 * digi : il rend donc des signaux NEUTRES, marques comme indisponibles
 * ({@code signauxDigiDisponibles = false}), pour que les ecrans qui l'interrogent en direct
 * — la synthese DG sur la sauvegarde SAF — affichent un score complet sans pretendre
 * connaitre ce qu'ils n'ont pas lu.</p>
 *
 * <p>Deux bases de calcul, memes regles : {@link #surEcheances} note chaque echeance echue
 * (reference), {@link #surCredits} note chaque credit entier, pour les lectures qui ne
 * peuvent pas se payer la requete des echeanciers.</p>
 */
public final class ScoreConfiance {

    private ScoreConfiance() {
    }

    // ================================================================ nouveau membre

    /**
     * Membre sans aucun historique exploitable : un etat, pas un score de zero. L'interface
     * l'affiche en gris, jamais un 0 % en rouge devant le directeur d'agence.
     */
    public static EvaluationRisqueDTO nouveauMembre() {
        return EvaluationRisqueDTO.builder()
                .niveauRisque(BaremeScoreConfiance.classeLibelle(BaremeScoreConfiance.CLASSE_NOUVEAU))
                .classe(BaremeScoreConfiance.CLASSE_NOUVEAU)
                .classeLibelle(BaremeScoreConfiance.classeLibelle(BaremeScoreConfiance.CLASSE_NOUVEAU))
                .classeConduite(BaremeScoreConfiance.classeConduite(BaremeScoreConfiance.CLASSE_NOUVEAU))
                .analyseRenforcee(true)
                .nouveauMembre(true)
                .pourcentageRisque(null)
                .scoreConfiance(null)
                .ponctualite(null)
                .profondeur(null)
                .situation(null)
                .signauxDigi(null)
                .signauxDigiDisponibles(false)
                .restructurationDetectee(false)
                .contentieux(false)
                .creditsAnalyses(0)
                .echeancesAnalysees(0)
                .echeancesRespectees(0)
                .echeancesEnRetard(0)
                .retardMoyenJours(0)
                .historiqueRemboursement(BaremeScoreConfiance.classeConduite(BaremeScoreConfiance.CLASSE_NOUVEAU))
                .basePourScore(null)
                .versionScore(BaremeScoreConfiance.VERSION)
                .explications(List.of(BaremeScoreConfiance.classeConduite(BaremeScoreConfiance.CLASSE_NOUVEAU)))
                .detailsParCredit(List.of())
                .build();
    }

    // ================================================================ base de reference

    /**
     * Score a partir des echeances echues : la base de reference.
     *
     * @param credits   tous les credits du membre (pour la profondeur et la restructuration)
     * @param echeances toutes les echeances, ouverture comprise (filtree ici)
     */
    public static EvaluationRisqueDTO surEcheances(List<CreditoDTO> credits,
                                                   List<PlanPagoDTO> echeances,
                                                   LocalDateTime maintenant) {
        List<CreditoDTO> tousCredits = credits == null ? List.of() : credits;
        List<PlanPagoDTO> toutesEcheances = echeances == null ? List.of() : echeances;

        Set<Long> restructures = creditsRestructures(tousCredits, maintenant);

        List<PlanPagoDTO> analysees = toutesEcheances.stream()
                .filter(e -> e.getNumCuota() != null && e.getNumCuota() != 0)
                .filter(e -> e.getFecCuota() != null && e.getFecCuota().isBefore(maintenant))
                .collect(Collectors.toList());

        if (analysees.isEmpty()) {
            return nouveauMembre();
        }

        double montantMoyen = analysees.stream()
                .map(PlanPagoDTO::getMonCuota)
                .mapToDouble(m -> m == null ? 0.0 : m.doubleValue())
                .average()
                .orElse(0.0);

        Map<Long, CreditoDTO> parNumero = tousCredits.stream()
                .filter(c -> c.getNumCredito() != null)
                .collect(Collectors.toMap(CreditoDTO::getNumCredito, c -> c, (a, b) -> a));

        double sommePoints = 0.0;
        double sommePoids = 0.0;
        int respectees = 0;
        int enRetard = 0;
        long totalJoursRetard = 0;
        int nbAvecRetard = 0;

        // Accumulateurs par credit, pour le detail rendu au decideur
        Map<Long, int[]> comptesParCredit = new java.util.HashMap<>();      // [total, respectees, enRetard, retardMax]
        Map<Long, BigDecimal> retardParCredit = new java.util.HashMap<>();  // montant echu impaye

        for (PlanPagoDTO echeance : analysees) {
            CreditoDTO credit = parNumero.get(echeance.getNumCredito());
            boolean restructure = echeance.getNumCredito() != null && restructures.contains(echeance.getNumCredito());

            boolean payee = "C".equals(echeance.getIndEstado()) && echeance.getFecCancelacion() != null;
            LocalDateTime reference = maintenant;

            // Une echeance soldee le jour ou le credit a ete solde par un AUTRE credit n'a pas
            // ete remboursee par le membre : elle est notee comme impayee a cette date.
            if (payee && restructure && credit != null && credit.getFecCancelacion() != null
                    && Math.abs(ChronoUnit.DAYS.between(echeance.getFecCancelacion(), credit.getFecCancelacion())) <= 1) {
                payee = false;
                reference = credit.getFecCancelacion();
            }

            long joursRetard = payee
                    ? Math.max(0, ChronoUnit.DAYS.between(echeance.getFecCuota(), echeance.getFecCancelacion()))
                    : Math.max(0, ChronoUnit.DAYS.between(echeance.getFecCuota(), reference));

            double points = BaremeScoreConfiance.points(joursRetard, payee);
            double poids = BaremeScoreConfiance.poidsRecence(echeance.getFecCuota(), maintenant)
                    * BaremeScoreConfiance.poidsMontant(echeance.getMonCuota(), montantMoyen);

            sommePoints += points * poids;
            sommePoids += poids;

            int[] compte = comptesParCredit.computeIfAbsent(echeance.getNumCredito(), k -> new int[4]);
            compte[0]++;
            if (BaremeScoreConfiance.respectee(points)) {
                respectees++;
                compte[1]++;
            } else {
                enRetard++;
                compte[2]++;
                totalJoursRetard += joursRetard;
                nbAvecRetard++;
                if (joursRetard > compte[3]) compte[3] = (int) joursRetard;
                if (!payee) {
                    retardParCredit.merge(echeance.getNumCredito(),
                            echeance.getMonCuota() == null ? BigDecimal.ZERO : echeance.getMonCuota(),
                            BigDecimal::add);
                }
            }
        }

        // ---- composantes
        BigDecimal ponctualite = BaremeScoreConfiance.ponctualite(sommePoints, sommePoids);
        BigDecimal profondeur = profondeur(tousCredits, restructures, maintenant);

        List<CreditoDTO> enCours = tousCredits.stream().filter(c -> !estSolde(c)).collect(Collectors.toList());
        long retardMaxEnCours = analysees.stream()
                .filter(e -> enCours.stream().anyMatch(c -> c.getNumCredito() != null
                        && c.getNumCredito().equals(e.getNumCredito())))
                .filter(e -> !("C".equals(e.getIndEstado()) && e.getFecCancelacion() != null))
                .mapToLong(e -> Math.max(0, ChronoUnit.DAYS.between(e.getFecCuota(), maintenant)))
                .max()
                .orElse(0L);
        BigDecimal situation = BaremeScoreConfiance.situation(retardMaxEnCours, enCours.size());

        int creditsAnalyses = (int) analysees.stream().map(PlanPagoDTO::getNumCredito).distinct().count();
        int retardMoyen = nbAvecRetard > 0 ? (int) (totalJoursRetard / nbAvecRetard) : 0;

        List<DetailRisqueCreditDTO> details = tousCredits.stream()
                .filter(c -> c.getNumCredito() != null && comptesParCredit.containsKey(c.getNumCredito()))
                .map(c -> {
                    int[] compte = comptesParCredit.get(c.getNumCredito());
                    return detail(c, restructures.contains(c.getNumCredito()))
                            .totalEcheances(compte[0])
                            .echeancesRespectees(compte[1])
                            .echeancesEnRetard(compte[2])
                            .retardMaxJours(compte[3])
                            .tauxRespectPercent(taux(compte[1], compte[0]))
                            .montantEnRetard(retardParCredit.getOrDefault(c.getNumCredito(), BigDecimal.ZERO))
                            .build();
                })
                .sorted(Comparator.comparing(DetailRisqueCreditDTO::getRetardMaxJours,
                        Comparator.nullsLast(Comparator.reverseOrder())))
                .collect(Collectors.toList());

        return assembler(ponctualite, profondeur, situation, !restructures.isEmpty(),
                creditsAnalyses, analysees.size(), respectees, enRetard, retardMoyen,
                BaremeScoreConfiance.BASE_ECHEANCES, details);
    }

    // ================================================================ base grossiere

    /**
     * Score a partir des credits entiers, sans la requete des echeanciers : la cloture du
     * credit comparee a son echeance finale. Memes paliers, meme tolerance, meme recence que
     * la base de reference — seule la granularite differe, et elle est annoncee.
     */
    public static EvaluationRisqueDTO surCredits(List<CreditoDTO> credits, LocalDateTime maintenant) {
        List<CreditoDTO> tousCredits = credits == null ? List.of() : credits;
        Set<Long> restructures = creditsRestructures(tousCredits, maintenant);

        List<CreditoDTO> analysables = tousCredits.stream()
                .filter(c -> c.getFecApertura() != null)
                .collect(Collectors.toList());

        if (analysables.isEmpty()) {
            return nouveauMembre();
        }

        double montantMoyen = analysables.stream()
                .map(CreditoDTO::getMonCredito)
                .mapToDouble(m -> m == null ? 0.0 : m.doubleValue())
                .average()
                .orElse(0.0);

        double sommePoints = 0.0;
        double sommePoids = 0.0;
        int respectees = 0;
        int enRetard = 0;
        long totalJoursRetard = 0;
        int nbAvecRetard = 0;
        List<DetailRisqueCreditDTO> details = new ArrayList<>();

        for (CreditoDTO credit : analysables) {
            boolean solde = estSolde(credit);
            long joursRetard = retardDuCredit(credit, solde, maintenant);

            double points = BaremeScoreConfiance.points(joursRetard, solde);
            double poids = BaremeScoreConfiance.poidsRecence(credit.getFecApertura(), maintenant)
                    * BaremeScoreConfiance.poidsMontant(credit.getMonCredito(), montantMoyen);

            sommePoints += points * poids;
            sommePoids += poids;

            if (BaremeScoreConfiance.respectee(points)) {
                respectees++;
            } else {
                enRetard++;
                totalJoursRetard += joursRetard;
                nbAvecRetard++;
            }

            details.add(detail(credit, restructures.contains(credit.getNumCredito()))
                    .retardMaxJours((int) joursRetard)
                    .montantEnRetard(solde ? BigDecimal.ZERO : nonNul(credit.getMonSaldo()))
                    .build());
        }

        BigDecimal ponctualite = BaremeScoreConfiance.ponctualite(sommePoints, sommePoids);
        BigDecimal profondeur = profondeur(tousCredits, restructures, maintenant);

        List<CreditoDTO> enCours = analysables.stream().filter(c -> !estSolde(c)).collect(Collectors.toList());
        long retardMaxEnCours = enCours.stream()
                .mapToLong(c -> retardDuCredit(c, false, maintenant))
                .max()
                .orElse(0L);
        BigDecimal situation = BaremeScoreConfiance.situation(retardMaxEnCours, enCours.size());

        int retardMoyen = nbAvecRetard > 0 ? (int) (totalJoursRetard / nbAvecRetard) : 0;
        details.sort(Comparator.comparing(DetailRisqueCreditDTO::getRetardMaxJours,
                Comparator.nullsLast(Comparator.reverseOrder())));

        return assembler(ponctualite, profondeur, situation, !restructures.isEmpty(),
                analysables.size(), analysables.size(), respectees, enRetard, retardMoyen,
                BaremeScoreConfiance.BASE_CREDITS, details);
    }

    // ================================================================ interne

    private static EvaluationRisqueDTO assembler(BigDecimal ponctualite,
                                                 BigDecimal profondeur,
                                                 BigDecimal situation,
                                                 boolean restructuration,
                                                 int creditsAnalyses,
                                                 int echeancesAnalysees,
                                                 int respectees,
                                                 int enRetard,
                                                 int retardMoyen,
                                                 String base,
                                                 List<DetailRisqueCreditDTO> details) {
        // Le e-banking ne lit pas digi : signaux neutres, declares indisponibles.
        BigDecimal signaux = BaremeScoreConfiance.signauxDigiNeutres();
        BigDecimal total = BaremeScoreConfiance.total(ponctualite, profondeur, situation, signaux, restructuration);
        String classe = BaremeScoreConfiance.classe(total, false, false);

        List<String> explications = new ArrayList<>();
        explications.add(String.format("Ponctualité %s/60 : %d échéance(s) en retard sur %d analysée(s)%s.",
                ponctualite.stripTrailingZeros().toPlainString(), enRetard, echeancesAnalysees,
                retardMoyen > 0 ? ", retard moyen " + retardMoyen + " j" : ""));
        explications.add(String.format("Profondeur %s/15 et situation %s/15 sur %d crédit(s).",
                profondeur.stripTrailingZeros().toPlainString(),
                situation.stripTrailingZeros().toPlainString(), creditsAnalyses));
        if (restructuration) {
            explications.add("Restructuration détectée : un crédit a été soldé à l'ouverture d'un autre. Total plafonné à 60.");
        }
        if (BaremeScoreConfiance.BASE_CREDITS.equals(base)) {
            explications.add("Calculé crédit par crédit (base de sauvegarde SAF) : plus grossier qu'un calcul échéance par échéance.");
        }

        return EvaluationRisqueDTO.builder()
                .niveauRisque(BaremeScoreConfiance.classeLibelle(classe))
                .classe(classe)
                .classeLibelle(BaremeScoreConfiance.classeLibelle(classe))
                .classeConduite(BaremeScoreConfiance.classeConduite(classe))
                .analyseRenforcee(BaremeScoreConfiance.analyseRenforcee(classe))
                .nouveauMembre(false)
                .scoreConfiance(total)
                .pourcentageRisque(BaremeScoreConfiance.MAX_TOTAL.subtract(total).setScale(2, RoundingMode.HALF_UP))
                .ponctualite(ponctualite)
                .profondeur(profondeur)
                .situation(situation)
                .signauxDigi(signaux)
                .signauxDigiDisponibles(false)
                .restructurationDetectee(restructuration)
                .contentieux(false)
                .creditsAnalyses(creditsAnalyses)
                .echeancesAnalysees(echeancesAnalysees)
                .echeancesRespectees(respectees)
                .echeancesEnRetard(enRetard)
                .retardMoyenJours(retardMoyen)
                .historiqueRemboursement(BaremeScoreConfiance.classeConduite(classe))
                .basePourScore(base)
                .versionScore(BaremeScoreConfiance.VERSION)
                .explications(explications)
                .detailsParCredit(details)
                .build();
    }

    /**
     * Credits soldes a l'ouverture d'un autre credit du meme membre, a quelques jours pres :
     * la dette a change de numero, elle n'a pas ete remboursee.
     */
    private static Set<Long> creditsRestructures(List<CreditoDTO> credits, LocalDateTime maintenant) {
        Set<Long> restructures = new HashSet<>();
        for (CreditoDTO solde : credits) {
            if (!estSolde(solde) || solde.getFecCancelacion() == null || solde.getNumCredito() == null) continue;
            for (CreditoDTO autre : credits) {
                if (autre.getNumCredito() == null || autre.getNumCredito().equals(solde.getNumCredito())) continue;
                if (autre.getFecApertura() == null) continue;
                long ecart = Math.abs(ChronoUnit.DAYS.between(solde.getFecCancelacion(), autre.getFecApertura()));
                if (ecart <= BaremeScoreConfiance.JOURS_RESTRUCTURATION) {
                    restructures.add(solde.getNumCredito());
                    break;
                }
            }
        }
        return restructures;
    }

    /** Profondeur : les credits restructures ne comptent pas comme soldes, ils ne l'ont pas ete. */
    private static BigDecimal profondeur(List<CreditoDTO> credits, Set<Long> restructures, LocalDateTime maintenant) {
        int soldes = (int) credits.stream()
                .filter(ScoreConfiance::estSolde)
                .filter(c -> c.getNumCredito() == null || !restructures.contains(c.getNumCredito()))
                .count();

        int annees = credits.stream()
                .map(CreditoDTO::getFecApertura)
                .filter(java.util.Objects::nonNull)
                .min(Comparator.naturalOrder())
                .map(premier -> (int) ChronoUnit.YEARS.between(premier, maintenant))
                .orElse(0);

        return BaremeScoreConfiance.profondeur(soldes, annees);
    }

    private static long retardDuCredit(CreditoDTO credit, boolean solde, LocalDateTime maintenant) {
        if (solde && credit.getFecVencimiento() != null && credit.getFecCancelacion() != null) {
            return Math.max(0, ChronoUnit.DAYS.between(credit.getFecVencimiento(), credit.getFecCancelacion()));
        }
        boolean echuImpaye = !solde
                && credit.getFecVencimiento() != null
                && credit.getFecVencimiento().isBefore(maintenant)
                && credit.getMonSaldo() != null
                && credit.getMonSaldo().signum() > 0;
        return echuImpaye ? Math.max(0, ChronoUnit.DAYS.between(credit.getFecVencimiento(), maintenant)) : 0L;
    }

    private static boolean estSolde(CreditoDTO credit) {
        return "C".equals(credit.getIndEstado()) && credit.getFecCancelacion() != null;
    }

    private static DetailRisqueCreditDTO.DetailRisqueCreditDTOBuilder detail(CreditoDTO credit, boolean restructuration) {
        return DetailRisqueCreditDTO.builder()
                .numCredito(credit.getNumCredito())
                .tipCredito(credit.getTipCredito())
                .fecApertura(credit.getFecApertura())
                .fecVencimiento(credit.getFecVencimiento())
                .monCredito(credit.getMonCredito())
                .monSaldo(credit.getMonSaldo())
                .solde(estSolde(credit))
                .restructuration(restructuration);
    }

    private static BigDecimal taux(int respectees, int total) {
        if (total <= 0) return BigDecimal.ZERO;
        return BigDecimal.valueOf(respectees * 100.0 / total).setScale(2, RoundingMode.HALF_UP);
    }

    private static BigDecimal nonNul(BigDecimal valeur) {
        return valeur == null ? BigDecimal.ZERO : valeur;
    }
}
