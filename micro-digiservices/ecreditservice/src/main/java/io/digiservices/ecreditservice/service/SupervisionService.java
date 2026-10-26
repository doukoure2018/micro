package io.digiservices.ecreditservice.service;

import io.digiservices.ecreditservice.repository.SupervisionRepository;
import io.digiservices.ecreditservice.repository.SupervisionRepository.Envois;
import io.digiservices.ecreditservice.repository.SupervisionRepository.FluxCredit;
import io.digiservices.ecreditservice.repository.SupervisionRepository.Passage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

/**
 * L'etat du jour de la plateforme (lot 3) : « est-ce que ca tourne ? », repondu sans ouvrir six
 * ecrans. Rien n'est calcule ici qui ne soit deja ecrit ailleurs ; tout l'apport est de
 * rassembler, et surtout de dire ce qui n'a PAS tourne.
 *
 * <p>Le journal ne montrait jusqu'ici que les traitements ayant tourne. C'est ce silence qui a
 * fait perdre les syntheses du 24 octobre : personne ne pouvait voir qu'un envoi attendu
 * n'etait jamais parti. Les traitements surveilles sont donc declares ici, avec leur heure,
 * et compares a ce que le journal contient.</p>
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class SupervisionService {

    /** Les traitements dont l'absence est une anomalie, avec l'heure GMT attendue. */
    private record Attendu(String code, String libelle, LocalTime heure, Cadence cadence) {
    }

    private enum Cadence { QUOTIDIEN, HORAIRE, HEBDO_LUNDI }

    private static final List<Attendu> ATTENDUS = List.of(
            new Attendu("DIGEST_QUOTIDIEN", "Alertes portefeuille du jour",
                    LocalTime.of(8, 20), Cadence.QUOTIDIEN),
            new Attendu("CREDIT_NEGATIF", "Surveillance des crédits négatifs",
                    LocalTime.of(6, 10), Cadence.HORAIRE),
            new Attendu("USAGE_HEBDO", "Baromètre d'usage hebdomadaire",
                    LocalTime.of(7, 5), Cadence.HEBDO_LUNDI),
            new Attendu("MEMBRE_SAF_REPRISE", "Reprise des numéros de membre non vérifiés",
                    LocalTime.of(6, 20), Cadence.HORAIRE));

    /** Derniere heure de la surveillance horaire des credits negatifs. */
    private static final int HORAIRE_FIN = 20;

    /**
     * Types d'envoi pour lesquels un meme objet deux fois vers la meme adresse est anormal.
     * La sonde SAF est volontairement exclue : elle repete le meme objet a dessein, tant que la
     * base reste injoignable.
     */
    private static final Set<String> ENVOIS_SANS_REPETITION = Set.of(
            "DIGEST_AGENT", "SYNTHESE_DA", "SYNTHESE_DR", "SYNTHESE_DE", "USAGE_HEBDO",
            "CREDIT_NEGATIF", "TT1_MENSUEL");

    private final SupervisionRepository repository;
    private final DonneesSafService donneesSaf;
    private final io.digiservices.ecreditservice.repository.CreditNegatifRepository creditsNegatifs;

    public Map<String, Object> etatDuJour() {
        LocalDate jour = LocalDate.now(ZoneOffset.UTC);
        LocalTime maintenant = ZonedDateTime.now(ZoneOffset.UTC).toLocalTime();

        List<Passage> passages = repository.passagesDuJour(jour);
        Map<String, Passage> parJob = new LinkedHashMap<>();
        passages.forEach(p -> parJob.put(p.job(), p));

        List<Map<String, Object>> travaux = new ArrayList<>();
        int manquants = 0;
        int enEchec = 0;
        for (Attendu a : ATTENDUS) {
            Map<String, Object> ligne = ligneTravail(a, parJob.get(a.code()), jour, maintenant);
            String etat = (String) ligne.get("etat");
            if ("MANQUANT".equals(etat)) {
                manquants++;
            }
            if ("ECHEC".equals(etat)) {
                enEchec++;
            }
            travaux.add(ligne);
        }
        // Les traitements qui ont tourne sans etre declares : on les montre, sans les juger.
        for (Passage p : passages) {
            if (ATTENDUS.stream().noneMatch(a -> a.code().equals(p.job()))) {
                travaux.add(ligneLibre(p));
            }
        }

        List<Map<String, Object>> envois = new ArrayList<>();
        int doublons = 0;
        for (Envois e : repository.envoisDuJour(jour)) {
            boolean anormal = ENVOIS_SANS_REPETITION.contains(e.type()) && e.doublons() > 0;
            doublons += anormal ? e.doublons() : 0;
            Map<String, Object> ligne = new LinkedHashMap<>();
            ligne.put("type", e.type());
            ligne.put("libelle", libelleEnvoi(e.type()));
            ligne.put("envois", e.envois());
            ligne.put("destinataires", e.destinataires());
            ligne.put("sujets", e.sujets());
            ligne.put("doublons", e.doublons());
            ligne.put("anormal", anormal);
            ligne.put("premier", e.premier());
            ligne.put("dernier", e.dernier());
            envois.add(ligne);
        }

        FluxCredit flux = repository.fluxCredit(jour);
        var saf = donneesSaf.etat();

        Map<String, Object> etat = new LinkedHashMap<>();
        etat.put("jour", jour);
        etat.put("heure", maintenant.withSecond(0).withNano(0).toString());
        etat.put("travaux", travaux);
        etat.put("travauxManquants", manquants);
        etat.put("travauxEnEchec", enEchec);
        etat.put("envois", envois);
        etat.put("envoisDoublons", doublons);
        etat.put("saf", Map.of(
                "mention", saf.getMention() == null ? "" : saf.getMention(),
                "joignable", saf.isToutOk(),
                "enRestauration", saf.isEnRestauration(),
                "sauvegardeActive", saf.isSauvegardeActive(),
                "dateDonneesTexte", saf.getDateDonneesTexte() == null ? "" : saf.getDateDonneesTexte()));
        etat.put("anomalies", anomalies(jour));
        etat.put("credit", Map.of(
                "enCours", flux.enCours(),
                "enCorrection", flux.enCorrection(),
                "enAttenteDa", flux.enAttenteDa(),
                "annulationsDemandees", flux.annulationsDemandees(),
                "validesAujourdhui", flux.validesAujourdhui(),
                "creesAujourdhui", flux.creesAujourdhui()));
        etat.put("connexions", repository.connexionsDuJour(jour));
        return etat;
    }

    private Map<String, Object> anomalies(LocalDate jour) {
        Map<String, Object> a = new LinkedHashMap<>();
        a.put("creditsNegatifsOuverts", repository.creditsNegatifsOuverts());
        a.put("creditsNegatifsDuJour", repository.creditsNegatifsDuJour(jour));
        a.put("creditsNegatifsPrisEnChargeAnciens", creditsNegatifs.prisesEnChargeAnciennes(CreditNegatifService.JOURS_RAPPEL));
        a.put("contactsEnEchec", repository.contactsEnEchec());
        a.put("correctionsEnAttente", repository.correctionsEnAttente());
        a.put("dossiersSansTitulaire", repository.dossiersSansTitulaire());
        return a;
    }

    /**
     * Etat d'un traitement attendu : A_VENIR tant que l'heure n'est pas passee, FAIT, ECHEC, ou
     * MANQUANT quand l'heure est passee et que le journal ne contient rien. La surveillance
     * horaire compte en plus les passages manquants dans la journee.
     */
    private Map<String, Object> ligneTravail(Attendu a, Passage p, LocalDate jour, LocalTime maintenant) {
        Map<String, Object> ligne = new LinkedHashMap<>();
        ligne.put("code", a.code());
        ligne.put("libelle", a.libelle());
        ligne.put("attendu", a.heure().toString() + " GMT" + cadenceTexte(a.cadence()));

        boolean duJour = a.cadence() != Cadence.HEBDO_LUNDI || jour.getDayOfWeek() == DayOfWeek.MONDAY;
        boolean heurePassee = maintenant.isAfter(a.heure());

        String etat;
        if (!duJour) {
            etat = "PAS_ATTENDU";
        } else if (p == null) {
            etat = heurePassee ? "MANQUANT" : "A_VENIR";
        } else if (p.echecs() > 0 && "ECHEC".equals(p.statut())) {
            etat = "ECHEC";
        } else {
            etat = "FAIT";
        }

        if (a.cadence() == Cadence.HORAIRE) {
            int attendusCeJour = passagesHorairesAttendus(a.heure(), maintenant);
            int faits = p == null ? 0 : p.executions();
            ligne.put("passagesAttendus", attendusCeJour);
            ligne.put("passagesFaits", faits);
            if ("FAIT".equals(etat) && faits < attendusCeJour) {
                etat = "INCOMPLET";
            }
        }

        ligne.put("etat", etat);
        ligne.put("quand", p == null ? null : p.quand());
        ligne.put("dureeMs", p == null ? null : p.dureeMs());
        ligne.put("message", p == null ? null : p.message());
        ligne.put("executions", p == null ? 0 : p.executions());
        ligne.put("echecs", p == null ? 0 : p.echecs());
        if (p == null) {
            Optional<Passage> dernier = repository.dernierPassage(a.code());
            ligne.put("dernierConnu", dernier.map(Passage::quand).orElse(null));
        }
        return ligne;
    }

    /** Un traitement qui a tourne sans figurer dans la liste des attendus. */
    private Map<String, Object> ligneLibre(Passage p) {
        Map<String, Object> ligne = new LinkedHashMap<>();
        ligne.put("code", p.job());
        ligne.put("libelle", libelleEnvoi(p.job()));
        ligne.put("attendu", "non déclaré");
        ligne.put("etat", p.echecs() > 0 && "ECHEC".equals(p.statut()) ? "ECHEC" : "FAIT");
        ligne.put("quand", p.quand());
        ligne.put("dureeMs", p.dureeMs());
        ligne.put("message", p.message());
        ligne.put("executions", p.executions());
        ligne.put("echecs", p.echecs());
        return ligne;
    }

    /** Nombre de passages horaires qui devraient avoir eu lieu depuis le premier de la journee. */
    private static int passagesHorairesAttendus(LocalTime premier, LocalTime maintenant) {
        if (maintenant.isBefore(premier)) {
            return 0;
        }
        int derniere = Math.min(maintenant.getHour(), HORAIRE_FIN);
        if (maintenant.getHour() == derniere && maintenant.getMinute() < premier.getMinute()) {
            derniere--;
        }
        return Math.max(0, derniere - premier.getHour() + 1);
    }

    private static String cadenceTexte(Cadence cadence) {
        return switch (cadence) {
            case QUOTIDIEN -> ", chaque jour";
            case HORAIRE -> ", puis chaque heure jusqu'à " + HORAIRE_FIN + " h";
            case HEBDO_LUNDI -> ", le lundi";
        };
    }

    static String libelleEnvoi(String type) {
        return switch (type) {
            case "DIGEST_AGENT" -> "Digest aux agents de crédit";
            case "DIGEST_QUOTIDIEN" -> "Alertes portefeuille du jour";
            case "SYNTHESE_DA" -> "Synthèse aux directeurs d'agence";
            case "SYNTHESE_DR" -> "Synthèse aux directeurs régionaux";
            case "SYNTHESE_DE" -> "Synthèse à la Direction de l'exploitation";
            case "USAGE_HEBDO" -> "Baromètre d'usage hebdomadaire";
            case "CREDIT_NEGATIF" -> "Alerte crédits négatifs";
            case "TT1_MENSUEL" -> "État TT1 mensuel";
            case "SAF_SANTE" -> "Sonde de disponibilité SAF";
            case "MEMBRE_SAF_REPRISE" -> "Reprise des numéros de membre non vérifiés";
            default -> type;
        };
    }
}
