package io.digiservices.ecreditservice.service;

import io.digiservices.clients.EbankingPortefeuilleClient;
import io.digiservices.clients.portefeuille.SanteSafDto;
import io.digiservices.ecreditservice.enumeration.EventType;
import io.digiservices.ecreditservice.event.Event;
import io.digiservices.ecreditservice.repository.AlerteDestinatairesRepository;
import io.digiservices.ecreditservice.repository.AlerteDestinatairesRepository.Destinataire;
import io.digiservices.ecreditservice.repository.AlerteJournalRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Surveillance des connexions au systeme bancaire (incident du 2026-10-16 : login DIGI
 * desactive cote SAF, decouvert apres plusieurs heures). Toutes les dix minutes, la sonde
 * d'ebanking est interrogee ; a la deuxieme sonde en echec consecutive, une alerte nomme la
 * base et le message SQL Server exact, puis un rappel toutes les six heures tant que
 * l'incident dure, et un message de retablissement.
 *
 * <p>Depuis le 24/10/2026, cette alerte part dans <b>Slack</b> et non plus par courriel
 * (demande DSIG : elle encombrait la boite des administrateurs). Le canal se regle par
 * {@code saf.sante.canal} : SLACK (defaut), EMAIL, ou SLACK_ET_EMAIL. En EMAIL, elle part
 * aux SUPER_ADMIN comme avant.</p>
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class SafSanteWatchdog {

    private static final DateTimeFormatter FMT = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    private final EbankingPortefeuilleClient portefeuilleClient;
    private final AlerteDestinatairesRepository destinataires;
    private final ApplicationEventPublisher publisher;
    private final DonneesSafService donneesSaf;
    private final SlackNotifier slack;
    private final AlerteJournalRepository journal;

    @Value("${saf.sante.actif:true}")
    private boolean actif;
    @Value("${saf.sante.echecs-avant-alerte:2}")
    private int echecsAvantAlerte;
    @Value("${saf.sante.rappel-heures:6}")
    private int rappelHeures;
    /** SLACK (defaut), EMAIL, ou SLACK_ET_EMAIL. */
    @Value("${saf.sante.canal:SLACK}")
    private String canal;

    private int echecsConsecutifs = 0;
    private LocalDateTime enPanneDepuis;
    private LocalDateTime dernierEnvoi;
    private List<String> dernieresCauses = List.of();

    @Scheduled(cron = "${saf.sante.cron:0 */10 * * * *}", zone = "GMT")
    public void surveiller() {
        if (!actif) {
            return;
        }
        List<String> causes = new ArrayList<>();
        try {
            SanteSafDto sante = portefeuilleClient.getSanteSaf();
            donneesSaf.memoriser(sante);
            if (sante.isToutOk()) {
                retabli();
                return;
            }
            sante.getBases().stream().filter(b -> !b.isOk())
                    .forEach(b -> causes.add("base " + b.getNom() + " (" + b.getHote() + ", compte "
                            + b.getUtilisateur() + ") : " + b.getMessage()));
            if (causes.isEmpty()) {
                causes.add("cause inconnue");
            }
        } catch (Exception e) {
            causes.add("ebanking injoignable depuis ecreditservice : " + premiereLigne(e.getMessage()));
        }
        echecsConsecutifs++;
        if (enPanneDepuis == null) {
            enPanneDepuis = LocalDateTime.now();
        }
        dernieresCauses = List.copyOf(causes);
        log.warn("[SAF-SANTE] Echec {} consecutif(s) : {}", echecsConsecutifs, String.join(" | ", causes));
        // Premiere alerte : des le seuil atteint, et tant qu'aucun envoi n'a abouti (le 22/10/2026 un
        // envoi en echec a fait planter la sonde et l'alerte n'est jamais partie).
        boolean premiereAlerte = echecsConsecutifs >= echecsAvantAlerte && dernierEnvoi == null;
        boolean rappel = dernierEnvoi != null && Duration.between(dernierEnvoi, LocalDateTime.now()).toHours() >= rappelHeures;
        if (premiereAlerte || rappel) {
            try {
                envoyer("⚠ Système bancaire (SAF) indisponible pour digi",
                        corpsPanne(rappel), textePanne(rappel));
            } catch (Exception e) {
                log.error("[SAF-SANTE] Alerte non envoyee (nouvel essai au prochain passage) : {}", premiereLigne(e.getMessage()));
            }
        }
    }

    private void retabli() {
        if (echecsConsecutifs >= echecsAvantAlerte && dernierEnvoi != null) {
            try {
                envoyer("✔ Système bancaire (SAF) rétabli pour digi", corpsRetabli(), texteRetabli());
            } catch (Exception e) {
                log.error("[SAF-SANTE] Message de retablissement non envoye : {}", premiereLigne(e.getMessage()));
            }
        } else if (echecsConsecutifs > 0) {
            log.info("[SAF-SANTE] Retabli apres {} echec(s), sans alerte envoyee", echecsConsecutifs);
        }
        echecsConsecutifs = 0;
        enPanneDepuis = null;
        dernierEnvoi = null;
        dernieresCauses = List.of();
    }

    private String corpsPanne(boolean rappel) {
        String cause = String.join("<br>", dernieresCauses);
        return "<div style='font-family:Arial,sans-serif;color:#1F2921'>"
                + "<h2 style='color:#A33A2E'>" + (rappel ? "Toujours en panne" : "Système bancaire indisponible") + " — "
                + LocalDateTime.now().format(FMT) + "</h2>"
                + "<p>ebanking ne parvient plus à se connecter au système bancaire depuis le <b>"
                + enPanneDepuis.format(FMT) + "</b> (" + echecsConsecutifs + " sondes en échec, une toutes les dix minutes).</p>"
                + "<p><b>Cause relevée :</b><br>" + cause + "</p>"
                + "<p>Tout ce qui lit SAF dans digi est touché : fiche signalétique, portefeuille, affectation, API partenaire, scores des agents.</p>"
                + "<p style='color:#5C6B60;font-size:12px'>Un « Login failed … account is disabled » se règle côté SAF (réactiver le login) ; "
                + "un « connection timed out » côté VPN. ebanking se reconnecte seul dès que la base répond, sans redémarrage. "
                + "Rappel toutes les " + rappelHeures + " h tant que la panne dure.</p></div>";
    }

    private String corpsRetabli() {
        return "<div style='font-family:Arial,sans-serif;color:#1F2921'>"
                + "<h2 style='color:#1E6B4F'>Système bancaire rétabli — " + LocalDateTime.now().format(FMT) + "</h2>"
                + "<p>Les connexions d'ebanking au système bancaire répondent de nouveau. Panne constatée du <b>"
                + enPanneDepuis.format(FMT) + "</b> au <b>" + LocalDateTime.now().format(FMT) + "</b>.</p>"
                + "<p><b>Dernière cause relevée :</b><br>" + String.join("<br>", dernieresCauses) + "</p></div>";
    }

    /** Message de panne au format mrkdwn de Slack. */
    private String textePanne(boolean rappel) {
        StringBuilder t = new StringBuilder();
        t.append(rappel ? "*Toujours en panne.* " : "")
                .append("ebanking ne parvient plus à se connecter au système bancaire depuis le *")
                .append(enPanneDepuis.format(FMT)).append("*").append(duree())
                .append(".\n").append(echecsConsecutifs).append(" sonde(s) en échec, une toutes les dix minutes.\n\n")
                .append("*Cause relevée*\n");
        for (String c : dernieresCauses) {
            t.append("• ").append(c).append("\n");
        }
        t.append("\nTout ce qui lit SAF dans digi est touché : fiche signalétique, portefeuille, ")
                .append("affectation, API partenaire, scores des agents.\n\n")
                .append("_Un « Login failed … account is disabled » se règle côté SAF (réactiver le login) ; ")
                .append("un « connection timed out » côté VPN. ebanking se reconnecte seul dès que la base répond, ")
                .append("sans redémarrage. Rappel toutes les ").append(rappelHeures).append(" h tant que la panne dure._");
        return t.toString();
    }

    /** Message de retablissement au format mrkdwn de Slack. */
    private String texteRetabli() {
        StringBuilder t = new StringBuilder();
        t.append("Les connexions d'ebanking au système bancaire répondent de nouveau.\n")
                .append("Panne constatée du *").append(enPanneDepuis.format(FMT)).append("* au *")
                .append(LocalDateTime.now().format(FMT)).append("*").append(duree()).append(".\n");
        if (!dernieresCauses.isEmpty()) {
            t.append("\n*Dernière cause relevée*\n");
            for (String c : dernieresCauses) {
                t.append("• ").append(c).append("\n");
            }
        }
        return t.toString();
    }

    private String duree() {
        if (enPanneDepuis == null) {
            return "";
        }
        long minutes = Duration.between(enPanneDepuis, LocalDateTime.now()).toMinutes();
        return minutes < 60 ? ", soit " + minutes + " min"
                : ", soit " + (minutes / 60) + " h " + String.format("%02d", minutes % 60);
    }

    /**
     * Route l'alerte selon {@code saf.sante.canal}. Slack d'abord : c'est le canal voulu depuis
     * le 24/10/2026. Si le webhook manque ou si Slack refuse, rien n'est marque comme envoye et
     * la tentative recommence a la sonde suivante.
     */
    private void envoyer(String sujet, String corpsHtml, String texteSlack) {
        String c = canal == null ? "SLACK" : canal.toUpperCase();
        boolean envoye = false;
        if (c.contains("SLACK")) {
            if (slack.estConfigure()) {
                envoye = slack.envoyer(sujet, texteSlack);
                if (envoye) {
                    journal.envoi("SAF_SANTE", "SLACK", "canal Slack", null, "SUPER_ADMIN", null, sujet, null);
                }
                if (!envoye) {
                    log.error("[SAF-SANTE] Slack n'a pas accepte « {} » : nouvel essai au prochain passage", sujet);
                }
            } else {
                log.error("[SAF-SANTE] Canal Slack demande mais aucun webhook (SLACK_WEBHOOK_URL) : "
                        + "« {} » n'est parti nulle part", sujet);
            }
        }
        if (c.contains("EMAIL")) {
            List<Destinataire> admins = destinataires.superAdmins();
            if (admins.isEmpty()) {
                log.warn("[SAF-SANTE] Aucun SUPER_ADMIN avec e-mail : alerte non envoyee");
            } else {
                for (Destinataire d : admins) {
                    publisher.publishEvent(new Event(EventType.PORTEFEUILLE_ALERTE, Map.of(
                            "email", d.email(), "sujet", sujet, "corpsHtml", corpsHtml)));
                    journal.envoi("SAF_SANTE", "EMAIL", d.email(), null, "SUPER_ADMIN", null, sujet, null);
                }
                envoye = true;
                log.info("[SAF-SANTE] « {} » publie a {} administrateur(s)", sujet, admins.size());
            }
        }
        if (envoye) {
            dernierEnvoi = LocalDateTime.now();
        }
    }

    private static String premiereLigne(String s) {
        return s == null ? "" : s.split("\\R")[0];
    }
}
