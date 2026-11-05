package io.digiservices.ecreditservice.dto;

import io.digiservices.clients.domain.EvaluationRisqueDTO;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * Score de confiance des membres : signaux digi, memoire du score, repartition et calibrage
 * (lots 1 a 3). Le bareme est dans {@code io.digiservices.clients.score.BaremeScoreConfiance}.
 */
public final class ScoreConfianceDtos {

    /** Rubrique d'habilitation des ecrans de pilotage du score (meme audience que le PAR). */
    public static final String RUBRIQUE = "PORTEFEUILLE_RISQUE";

    public static final String ORIGINE_CONSULTATION = "CONSULTATION";
    public static final String ORIGINE_PHOTO = "PHOTO";
    public static final String ORIGINE_RETROSPECTIF = "RETROSPECTIF";

    private ScoreConfianceDtos() {
    }

    /**
     * Ce que digi sait du membre et que SAF ignore. Les penalites sont au bareme ; ce record ne
     * porte que les faits, et la phrase a montrer au decideur.
     */
    public record SignauxDigiDto(int dossiersAnnules,
                                 int demandesRefusees,
                                 boolean membreNonVerifie,
                                 boolean contentieux,
                                 List<String> faits) {

        public static SignauxDigiDto aucun() {
            return new SignauxDigiDto(0, 0, false, false, List.of());
        }

        public boolean vide() {
            return dossiersAnnules == 0 && demandesRefusees == 0 && !membreNonVerifie && !contentieux;
        }
    }

    /** Le membre, son score complet et le dossier qui a motive la consultation. */
    public record ScoreMembreDto(String numeroMembre,
                                 EvaluationRisqueDTO evaluation,
                                 SignauxDigiDto signaux) {
    }

    /** Une ligne de repartition des classes, par point de service ou par agent. */
    public record RepartitionDto(String codAgencia,
                                 Long agentUserId,
                                 String agent,
                                 int classeA,
                                 int classeB,
                                 int classeC,
                                 int classeD,
                                 int classeE,
                                 int classeN,
                                 int total) {
    }

    /** Un membre qui a change de classe entre deux photos mensuelles. */
    public record DegradationDto(String numeroMembre,
                                 String classeAvant,
                                 String classeApres,
                                 BigDecimal scoreAvant,
                                 BigDecimal scoreApres,
                                 String codAgencia,
                                 Long agentUserId) {
    }

    /** Une classe du test retrospectif : combien de membres, combien ont fait defaut ensuite. */
    public record CohorteDto(String classe,
                             int membres,
                             int defauts,
                             BigDecimal tauxDefautPercent) {
    }

    /**
     * Resultat du test de calibrage. {@code lecture} dit en une phrase si les classes separent
     * reellement les payeurs des defaillants — c'est la seule chose qui autorise a faire
     * confiance aux seuils.
     */
    public record RetrospectifDto(LocalDate dateReference,
                                  int membresAnalyses,
                                  int membresSansHistorique,
                                  int membresEnDefaut,
                                  List<CohorteDto> cohortes,
                                  String lecture) {
    }

    /** Resultat d'une photo mensuelle. */
    public record PhotoResultatDto(LocalDate mois,
                                   int membres,
                                   int enregistres,
                                   int erreurs,
                                   String message) {
    }
}
