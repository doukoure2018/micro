package io.digiservices.ecreditservice.repository;

import io.digiservices.clients.domain.EvaluationRisqueDTO;
import io.digiservices.ecreditservice.dto.ScoreConfianceDtos.DegradationDto;
import io.digiservices.ecreditservice.dto.ScoreConfianceDtos.RepartitionDto;
import io.digiservices.ecreditservice.dto.ScoreConfianceDtos.SignauxDigiDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Signaux digi d'un membre et memoire du score (V205).
 *
 * <p>Les signaux ne sortent pas de SAF : ils viennent des decisions prises dans digi — un
 * dossier annule par desistement, une demande rejetee, un numero de membre qui ne se verifie
 * pas, un contentieux declare. SAF ne les connait pas, et c'est precisement leur interet.</p>
 */
@Repository
@RequiredArgsConstructor
@Slf4j
public class ScoreConfianceRepository {

    private final JdbcClient jdbcClient;

    // ================================================================ signaux digi

    /**
     * Ce que digi sait du membre sur les derniers mois. Une lecture, pas un jugement : le
     * bareme decide seul de ce que chaque fait coute.
     */
    public SignauxDigiDto signauxDigi(String numeroMembre, int moisFenetre) {
        if (numeroMembre == null || numeroMembre.isBlank()) {
            return SignauxDigiDto.aucun();
        }
        LocalDate depuis = LocalDate.now().minusMonths(moisFenetre);

        Map<String, Object> dossiers = jdbcClient.sql("""
                        SELECT
                          COUNT(*) FILTER (WHERE statut_demande = 'ANNULE'
                                AND COALESCE(date_decision_annulation_dossier,
                                             date_demande_annulation_dossier,
                                             createdat) >= :depuis)                      AS annules,
                          COUNT(*) FILTER (WHERE statut_demande IN ('REJET', 'REJETE', 'REFUSE')
                                AND COALESCE(date_rejet_dg,
                                             date_confirmation_rejet_de,
                                             createdat) >= :depuis)                      AS refuses,
                          COALESCE(BOOL_OR(membre_verifie_saf IS FALSE
                                AND createdat >= :depuis), FALSE)                        AS non_verifie
                        FROM demandeindividuel
                        WHERE numero_membre = :membre
                        """)
                .param("membre", numeroMembre)
                .param("depuis", depuis.atStartOfDay())
                .query()
                .singleRow();

        boolean contentieux = Boolean.TRUE.equals(jdbcClient.sql("""
                        SELECT EXISTS (SELECT 1 FROM portefeuille_contentieux
                                        WHERE cod_cliente = :membre AND actif)
                        """)
                .param("membre", numeroMembre)
                .query(Boolean.class)
                .single());

        int annules = entier(dossiers.get("annules"));
        int refuses = entier(dossiers.get("refuses"));
        boolean nonVerifie = Boolean.TRUE.equals(dossiers.get("non_verifie"));

        List<String> faits = new ArrayList<>();
        if (contentieux) faits.add("Contentieux déclaré sur un crédit de ce membre");
        if (refuses > 0) faits.add(refuses + " demande(s) rejetée(s) sur " + moisFenetre + " mois");
        if (annules > 0) faits.add(annules + " dossier(s) annulé(s) sur " + moisFenetre + " mois");
        if (nonVerifie) faits.add("Numéro de membre non vérifié dans SAF sur un dossier récent");

        return new SignauxDigiDto(annules, refuses, nonVerifie, contentieux, faits);
    }

    // ================================================================ memoire du score

    /** Ecrit un score dans l'historique. Les photos et le retrospectif remplacent la ligne du mois. */
    public void enregistrer(String numeroMembre,
                            LocalDate dateCalcul,
                            String origine,
                            EvaluationRisqueDTO evaluation,
                            Long demandeIndividuelId,
                            Long consultePar,
                            String codAgencia,
                            Long agentUserId,
                            Boolean defaut12Mois) {
        if (numeroMembre == null || numeroMembre.isBlank() || evaluation == null) {
            return;
        }
        jdbcClient.sql("""
                        INSERT INTO score_confiance_historique (
                            numero_membre, date_calcul, origine, score, classe,
                            ponctualite, profondeur, situation, signaux_digi, signaux_digi_lus,
                            base_pour_score, restructuration, contentieux,
                            credits_analyses, echeances_analysees, echeances_en_retard, retard_moyen_jours,
                            version_score, demande_individuel_id, consulte_par_user_id,
                            cod_agencia, agent_user_id, defaut_12_mois)
                        VALUES (
                            :membre, :date, :origine, :score, :classe,
                            :ponctualite, :profondeur, :situation, :signaux, :signauxLus,
                            :base, :restructuration, :contentieux,
                            :credits, :echeances, :retard, :retardMoyen,
                            :version, :dossier, :user, :agence, :agent, :defaut)
                        ON CONFLICT DO NOTHING
                        """)
                .param("membre", numeroMembre)
                .param("date", dateCalcul)
                .param("origine", origine)
                .param("score", evaluation.getScoreConfiance())
                .param("classe", evaluation.getClasse())
                .param("ponctualite", evaluation.getPonctualite())
                .param("profondeur", evaluation.getProfondeur())
                .param("situation", evaluation.getSituation())
                .param("signaux", evaluation.getSignauxDigi())
                .param("signauxLus", Boolean.TRUE.equals(evaluation.getSignauxDigiDisponibles()))
                .param("base", evaluation.getBasePourScore())
                .param("restructuration", Boolean.TRUE.equals(evaluation.getRestructurationDetectee()))
                .param("contentieux", Boolean.TRUE.equals(evaluation.getContentieux()))
                .param("credits", evaluation.getCreditsAnalyses())
                .param("echeances", evaluation.getEcheancesAnalysees())
                .param("retard", evaluation.getEcheancesEnRetard())
                .param("retardMoyen", evaluation.getRetardMoyenJours())
                .param("version", evaluation.getVersionScore())
                .param("dossier", demandeIndividuelId)
                .param("user", consultePar)
                .param("agence", codAgencia)
                .param("agent", agentUserId)
                .param("defaut", defaut12Mois)
                .update();
    }

    /** Remplace la ligne d'un mois (photo relancee) ou d'une date de reference (test rejoue). */
    public void supprimer(String origine, LocalDate dateCalcul) {
        jdbcClient.sql("DELETE FROM score_confiance_historique WHERE origine = :o AND date_calcul = :d")
                .param("o", origine).param("d", dateCalcul).update();
    }

    /** Dernier score connu d'un membre, toutes origines confondues. */
    public Optional<Map<String, Object>> dernier(String numeroMembre) {
        return jdbcClient.sql("""
                        SELECT date_calcul, origine, score, classe, version_score
                          FROM score_confiance_historique
                         WHERE numero_membre = :m
                         ORDER BY date_calcul DESC, id DESC
                         LIMIT 1
                        """)
                .param("m", numeroMembre)
                .query()
                .listOfRows()
                .stream()
                .findFirst();
    }

    /** Historique d'un membre, du plus recent au plus ancien. */
    public List<Map<String, Object>> historique(String numeroMembre, int limite) {
        return jdbcClient.sql("""
                        SELECT date_calcul, origine, score, classe, ponctualite, profondeur,
                               situation, signaux_digi, restructuration, contentieux, version_score
                          FROM score_confiance_historique
                         WHERE numero_membre = :m
                         ORDER BY date_calcul DESC, id DESC
                         LIMIT :n
                        """)
                .param("m", numeroMembre).param("n", limite)
                .query()
                .listOfRows();
    }

    // ================================================================ membres a photographier

    /**
     * Les membres portant un credit affecte, avec leur point de service et leur agent. SAF ne
     * connait pas les affectations : c'est digi qui dit de qui releve chaque credit.
     */
    public List<Map<String, Object>> membresAvecCreditAffecte() {
        return jdbcClient.sql("""
                        SELECT cod_cliente        AS membre,
                               MIN(cod_agencia)   AS agence,
                               MIN(agent_user_id) AS agent
                          FROM portefeuille_affectation
                         WHERE actif
                           AND type_affectation = 'CREDIT'
                           AND cod_cliente IS NOT NULL
                           AND cod_cliente <> ''
                         GROUP BY cod_cliente
                         ORDER BY 1
                        """)
                .query()
                .listOfRows();
    }

    // ================================================================ lot 3 : repartition et derive

    /** Repartition des classes de la derniere photo, par point de service et par agent. */
    public List<RepartitionDto> repartition(LocalDate mois, List<String> agences) {
        StringBuilder sql = new StringBuilder("""
                SELECT cod_agencia, agent_user_id,
                       COUNT(*) FILTER (WHERE classe = 'A') AS a,
                       COUNT(*) FILTER (WHERE classe = 'B') AS b,
                       COUNT(*) FILTER (WHERE classe = 'C') AS c,
                       COUNT(*) FILTER (WHERE classe = 'D') AS d,
                       COUNT(*) FILTER (WHERE classe = 'E') AS e,
                       COUNT(*) FILTER (WHERE classe = 'N') AS n,
                       COUNT(*)                             AS total
                  FROM score_confiance_historique
                 WHERE origine = 'PHOTO' AND date_calcul = :mois
                """);
        if (agences != null && !agences.isEmpty()) {
            sql.append("   AND cod_agencia IN (:agences)\n");
        }
        sql.append(" GROUP BY cod_agencia, agent_user_id ORDER BY cod_agencia, agent_user_id");

        var requete = jdbcClient.sql(sql.toString()).param("mois", mois);
        if (agences != null && !agences.isEmpty()) {
            requete = requete.param("agences", agences);
        }
        return requete.query((rs, n) -> new RepartitionDto(
                rs.getString("cod_agencia"),
                rs.getObject("agent_user_id") == null ? null : rs.getLong("agent_user_id"),
                null,
                rs.getInt("a"), rs.getInt("b"), rs.getInt("c"),
                rs.getInt("d"), rs.getInt("e"), rs.getInt("n"),
                rs.getInt("total"))).list();
    }

    /** Le mois de la derniere photo disponible. */
    public Optional<LocalDate> dernierePhoto() {
        return jdbcClient.sql("SELECT MAX(date_calcul) FROM score_confiance_historique WHERE origine = 'PHOTO'")
                .query(LocalDate.class)
                .optional();
    }

    /**
     * Membres dont la classe s'est degradee entre deux photos. On ne remonte que les
     * degradations : une amelioration ne demande pas d'action.
     */
    public List<DegradationDto> degradations(LocalDate mois, LocalDate moisPrecedent, List<String> agences) {
        Map<String, Integer> rang = rangDesClasses();
        StringBuilder sql = new StringBuilder("""
                SELECT a.numero_membre, p.classe AS avant, a.classe AS apres,
                       p.score AS score_avant, a.score AS score_apres,
                       a.cod_agencia, a.agent_user_id
                  FROM score_confiance_historique a
                  JOIN score_confiance_historique p
                       ON p.numero_membre = a.numero_membre
                      AND p.origine = 'PHOTO' AND p.date_calcul = :precedent
                 WHERE a.origine = 'PHOTO' AND a.date_calcul = :mois
                   AND a.classe <> p.classe
                """);
        if (agences != null && !agences.isEmpty()) {
            sql.append("   AND a.cod_agencia IN (:agences)\n");
        }
        sql.append(" ORDER BY a.cod_agencia, a.numero_membre");

        var requete = jdbcClient.sql(sql.toString())
                .param("mois", mois)
                .param("precedent", moisPrecedent);
        if (agences != null && !agences.isEmpty()) {
            requete = requete.param("agences", agences);
        }

        List<DegradationDto> toutes = requete.query((rs, n) -> new DegradationDto(
                rs.getString("numero_membre"),
                rs.getString("avant"),
                rs.getString("apres"),
                rs.getBigDecimal("score_avant"),
                rs.getBigDecimal("score_apres"),
                rs.getString("cod_agencia"),
                rs.getObject("agent_user_id") == null ? null : rs.getLong("agent_user_id"))).list();

        // Le tri des classes n'est pas alphabetique pour N : il n'est ni meilleur ni pire, il est hors echelle.
        List<DegradationDto> degradees = new ArrayList<>();
        for (DegradationDto d : toutes) {
            Integer avant = rang.get(d.classeAvant());
            Integer apres = rang.get(d.classeApres());
            if (avant != null && apres != null && apres > avant) {
                degradees.add(d);
            }
        }
        return degradees;
    }

    /** Cohortes du test retrospectif : par classe, combien de membres et combien ont fait defaut. */
    public List<Map<String, Object>> cohortes(LocalDate dateReference) {
        return jdbcClient.sql("""
                        SELECT classe,
                               COUNT(*)                                        AS membres,
                               COUNT(*) FILTER (WHERE defaut_12_mois)          AS defauts
                          FROM score_confiance_historique
                         WHERE origine = 'RETROSPECTIF' AND date_calcul = :d
                         GROUP BY classe
                         ORDER BY classe
                        """)
                .param("d", dateReference)
                .query()
                .listOfRows();
    }

    private static Map<String, Integer> rangDesClasses() {
        Map<String, Integer> rang = new LinkedHashMap<>();
        rang.put("A", 1);
        rang.put("B", 2);
        rang.put("C", 3);
        rang.put("D", 4);
        rang.put("E", 5);
        return rang;
    }

    private static int entier(Object valeur) {
        if (valeur == null) return 0;
        if (valeur instanceof Number nombre) return nombre.intValue();
        return Integer.parseInt(valeur.toString());
    }

}
