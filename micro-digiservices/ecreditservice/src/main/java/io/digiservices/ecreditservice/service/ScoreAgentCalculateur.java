package io.digiservices.ecreditservice.service;

import io.digiservices.clients.portefeuille.PortefeuilleCreditDto;
import io.digiservices.ecreditservice.dto.PortefeuilleScoreDtos.BornesDto;
import io.digiservices.ecreditservice.dto.PortefeuilleScoreDtos.ScoreAgentDto;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * Grille d'appreciation d'un agent de credit (proposition DSIG du 2026-10-16, lot 1).
 *
 * <p>Cinq criteres calculables des aujourd'hui, 90 points, ramenes sur 100 tant que la
 * tendance a trois mois (lot 2, 10 points) n'a pas d'historique :</p>
 * <ul>
 *   <li>PAR 30 — encours des credits en retard de plus de 30 jours / encours : 30 points ;</li>
 *   <li>regularite — echeances payees / echeances echues : 20 points ;</li>
 *   <li>part des credits en retard : 15 points ;</li>
 *   <li>poids du retard — capital + interets impayes / encours : 15 points ;</li>
 *   <li>charge — nombre de credits / mediane des agents du reseau : 10 points.</li>
 * </ul>
 * <p>Chaque critere donne ses points lineairement entre une borne « bon » (tous les points)
 * et une borne « mauvais » (zero). Un credit deja en retard le jour de son affectation ne
 * compte pas contre l'agent pendant la franchise (retard herite) : il sort des ratios, il
 * reste dans le nombre de credits et l'encours affiches. Classes : A ≥ 80, B ≥ 65, C ≥ 50,
 * D en dessous ; non note (NN) sous le minimum de credits ou d'anciennete d'affectation.</p>
 *
 * <p>Classe sans etat ni dependance Spring : testable a sec.</p>
 */
public final class ScoreAgentCalculateur {

    public static final String CLASSE_A = "A", CLASSE_B = "B", CLASSE_C = "C", CLASSE_D = "D", NON_NOTE = "NN";
    public static final int PTS_PAR30 = 30, PTS_REGULARITE = 20, PTS_TAUX_RETARD = 15, PTS_POIDS_RETARD = 15,
            PTS_CHARGE = 10, PTS_TENDANCE = 10;

    private final BornesDto bornes;

    public ScoreAgentCalculateur(BornesDto bornes) {
        this.bornes = bornes;
    }

    /** Un credit porte par l'agent, avec la date a laquelle il lui a ete confie. */
    public record CreditPorte(PortefeuilleCreditDto credit, LocalDate dateAffectation) {
    }

    /** Le score d'un agent, sans les libelles (nom, hierarchie) que le service ajoute. */
    public ScoreAgentDto calculer(Long agentUserId, String codAgencia, List<CreditPorte> portes,
                                  LocalDate datePremiereAffectation, int medianeReseau, LocalDate aujourdhui) {
        BigDecimal encours = BigDecimal.ZERO, montantRetard = BigDecimal.ZERO;
        BigDecimal encoursNote = BigDecimal.ZERO, encoursPar30 = BigDecimal.ZERO, impayesNote = BigDecimal.ZERO;
        long nbEnRetard = 0, nbHerites = 0, nbNote = 0, nbRetardNote = 0, echPayees = 0, echEchues = 0;
        LocalDate limiteFranchise = aujourdhui.minusDays(bornes.getJoursFranchiseHerite());
        for (CreditPorte p : portes) {
            PortefeuilleCreditDto c = p.credit();
            BigDecimal solde = nvl(c.getMonSaldo());
            boolean enRetard = c.getDatPremiereImpayee() != null;
            BigDecimal retard = nvl(c.getMntCapImpaye()).add(nvl(c.getMntIntImpaye()));
            encours = encours.add(solde);
            if (enRetard) {
                nbEnRetard++;
                montantRetard = montantRetard.add(retard);
            }
            if (estHerite(c, p.dateAffectation(), limiteFranchise)) {
                nbHerites++;
                continue;           // hors ratios pendant la franchise
            }
            nbNote++;
            encoursNote = encoursNote.add(solde);
            long payees = nvl(c.getNbEchPayees()), impayees = nvl(c.getNbEchImpayees());
            echPayees += payees;
            echEchues += payees + impayees;
            if (enRetard) {
                nbRetardNote++;
                impayesNote = impayesNote.add(retard);
                if (nvl(c.getJoursRetard()) > 30) encoursPar30 = encoursPar30.add(solde);
            }
        }
        int nbCredits = portes.size();

        ScoreAgentDto.ScoreAgentDtoBuilder b = ScoreAgentDto.builder()
                .dateCalcul(aujourdhui).agentUserId(agentUserId).codAgencia(codAgencia)
                .datePremiereAffectation(datePremiereAffectation)
                .nbCredits(nbCredits).encours(encours).nbEnRetard((int) nbEnRetard)
                .montantRetard(montantRetard).nbHerites((int) nbHerites)
                .pointsDisponibles(PTS_PAR30 + PTS_REGULARITE + PTS_TAUX_RETARD + PTS_POIDS_RETARD + PTS_CHARGE)
                .medianeReseau(medianeReseau);

        String motif = motifNonNote(nbCredits, datePremiereAffectation, aujourdhui);
        if (motif != null) {
            return b.classe(NON_NOTE).motifNonNote(motif).build();
        }

        double par30 = ratio(encoursPar30, encoursNote);
        double regularite = echEchues == 0 ? 1.0 : (double) echPayees / echEchues;
        double tauxRetard = nbNote == 0 ? 0 : (double) nbRetardNote / nbNote;
        double poids = ratio(impayesNote, encoursNote);
        double charge = medianeReseau <= 0 ? 1.0 : (double) nbCredits / medianeReseau;

        double pPar30 = lineaire(par30, 0, bornes.getPar30Mauvais(), PTS_PAR30);
        double pReg = lineaire(1 - regularite, 0, 1 - bornes.getRegulariteMauvais(), PTS_REGULARITE);
        double pTaux = lineaire(tauxRetard, 0, bornes.getTauxRetardMauvais(), PTS_TAUX_RETARD);
        double pPoids = lineaire(poids, 0, bornes.getPoidsRetardMauvais(), PTS_POIDS_RETARD);
        double pCharge = lineaire(1 - Math.min(charge, 1.0), 0, 1, PTS_CHARGE);
        double total = pPar30 + pReg + pTaux + pPoids + pCharge;
        int disponibles = PTS_PAR30 + PTS_REGULARITE + PTS_TAUX_RETARD + PTS_POIDS_RETARD + PTS_CHARGE;
        int score = (int) Math.round(total * 100 / disponibles);

        return b.par30(dec(par30)).regularite(dec(regularite)).tauxRetard(dec(tauxRetard))
                .poidsRetard(dec(poids)).charge(dec(charge))
                .ptsPar30(pts(pPar30)).ptsRegularite(pts(pReg)).ptsTauxRetard(pts(pTaux))
                .ptsPoidsRetard(pts(pPoids)).ptsCharge(pts(pCharge))
                .score(score).classe(classe(score))
                .build();
    }

    /** Deja en retard quand il a ete confie, et confie depuis moins longtemps que la franchise. */
    public boolean estHerite(PortefeuilleCreditDto c, LocalDate dateAffectation, LocalDate limiteFranchise) {
        return c.getDatPremiereImpayee() != null && dateAffectation != null
                && c.getDatPremiereImpayee().isBefore(dateAffectation)
                && dateAffectation.isAfter(limiteFranchise);
    }

    private String motifNonNote(int nbCredits, LocalDate premiereAffectation, LocalDate aujourdhui) {
        if (nbCredits < bornes.getMinCredits()) {
            return "moins de " + bornes.getMinCredits() + " crédits en cours (" + nbCredits + ")";
        }
        if (premiereAffectation == null || premiereAffectation.isAfter(aujourdhui.minusDays(bornes.getMinJoursAffectation()))) {
            return "affecté depuis moins de " + bornes.getMinJoursAffectation() + " jours";
        }
        return null;
    }

    public static String classe(int score) {
        if (score >= 80) return CLASSE_A;
        if (score >= 65) return CLASSE_B;
        if (score >= 50) return CLASSE_C;
        return CLASSE_D;
    }

    /** Tous les points a la borne bonne, zero a la borne mauvaise, au prorata entre les deux. */
    static double lineaire(double valeur, double bon, double mauvais, int max) {
        if (mauvais == bon) return valeur <= bon ? max : 0;
        double part = (mauvais - valeur) / (mauvais - bon);
        return max * Math.max(0, Math.min(1, part));
    }

    /** Mediane des nombres de credits des agents qui en portent au moins un. */
    public static int mediane(List<Integer> valeurs) {
        List<Integer> v = new ArrayList<>(valeurs.stream().filter(x -> x > 0).toList());
        if (v.isEmpty()) return 0;
        v.sort(null);
        int n = v.size();
        return n % 2 == 1 ? v.get(n / 2) : (v.get(n / 2 - 1) + v.get(n / 2)) / 2;
    }

    private static double ratio(BigDecimal num, BigDecimal den) {
        return den.signum() == 0 ? 0 : num.doubleValue() / den.doubleValue();
    }

    private static BigDecimal dec(double v) {
        return BigDecimal.valueOf(v).setScale(5, RoundingMode.HALF_UP);
    }

    private static BigDecimal pts(double v) {
        return BigDecimal.valueOf(v).setScale(2, RoundingMode.HALF_UP);
    }

    private static BigDecimal nvl(BigDecimal v) {
        return v == null ? BigDecimal.ZERO : v;
    }

    private static long nvl(Long v) {
        return v == null ? 0 : v;
    }
}
