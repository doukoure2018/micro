package io.digiservices.ecreditservice.service;

import io.digiservices.clients.EbankingPortefeuilleClient;
import io.digiservices.clients.portefeuille.SanteSafDto;
import io.digiservices.ecreditservice.enumeration.EventType;
import io.digiservices.ecreditservice.event.Event;
import io.digiservices.ecreditservice.repository.AlerteDestinatairesRepository;
import io.digiservices.ecreditservice.repository.AlerteDestinatairesRepository.Destinataire;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

/**
 * Surveillance des connexions au systeme bancaire (incident du 2026-10-16 : login DIGI
 * desactive cote SAF, decouvert apres plusieurs heures). Toutes les dix minutes, la sonde
 * d'ebanking est interrogee ; a la deuxieme sonde en echec consecutive, les administrateurs
 * (SUPER_ADMIN) recoivent un e-mail qui nomme la base et le message SQL Server exact, puis un
 * rappel toutes les six heures tant que l'incident dure, et un e-mail de retablissement.
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

    @Value("${saf.sante.actif:true}")
    private boolean actif;
    @Value("${saf.sante.echecs-avant-alerte:2}")
    private int echecsAvantAlerte;
    @Value("${saf.sante.rappel-heures:6}")
    private int rappelHeures;

    private int echecsConsecutifs = 0;
    private LocalDateTime enPanneDepuis;
    private LocalDateTime dernierEnvoi;
    private String derniereCause = "";

    @Scheduled(cron = "${saf.sante.cron:0 */10 * * * *}", zone = "GMT")
    public void surveiller() {
        if (!actif) {
            return;
        }
        String cause;
        try {
            SanteSafDto sante = portefeuilleClient.getSanteSaf();
            donneesSaf.memoriser(sante);
            if (sante.isToutOk()) {
                retabli();
                return;
            }
            cause = sante.getBases().stream().filter(b -> !b.isOk())
                    .map(b -> "base " + b.getNom() + " (" + b.getHote() + ", compte " + b.getUtilisateur() + ") : " + b.getMessage())
                    .reduce((a, b) -> a + "<br>" + b).orElse("cause inconnue");
        } catch (Exception e) {
            cause = "ebanking injoignable depuis ecreditservice : " + premiereLigne(e.getMessage());
        }
        echecsConsecutifs++;
        if (enPanneDepuis == null) {
            enPanneDepuis = LocalDateTime.now();
        }
        derniereCause = cause;
        log.warn("[SAF-SANTE] Echec {} consecutif(s) : {}", echecsConsecutifs, cause.replace("<br>", " | "));
        // Premiere alerte : des le seuil atteint, et tant qu'aucun envoi n'a abouti (le 22/10/2026 un
        // envoi en echec a fait planter la sonde et l'alerte n'est jamais partie).
        boolean premiereAlerte = echecsConsecutifs >= echecsAvantAlerte && dernierEnvoi == null;
        boolean rappel = dernierEnvoi != null && Duration.between(dernierEnvoi, LocalDateTime.now()).toHours() >= rappelHeures;
        if (premiereAlerte || rappel) {
            try {
                envoyer("⚠ Système bancaire (SAF) indisponible pour digi", corpsPanne(cause, rappel));
            } catch (Exception e) {
                log.error("[SAF-SANTE] Alerte non envoyee (nouvel essai au prochain passage) : {}", premiereLigne(e.getMessage()));
            }
        }
    }

    private void retabli() {
        if (echecsConsecutifs >= echecsAvantAlerte && dernierEnvoi != null) {
            try {
                envoyer("✔ Système bancaire (SAF) rétabli pour digi", corpsRetabli());
            } catch (Exception e) {
                log.error("[SAF-SANTE] Message de retablissement non envoye : {}", premiereLigne(e.getMessage()));
            }
        } else if (echecsConsecutifs > 0) {
            log.info("[SAF-SANTE] Retabli apres {} echec(s), sans alerte envoyee", echecsConsecutifs);
        }
        echecsConsecutifs = 0;
        enPanneDepuis = null;
        dernierEnvoi = null;
        derniereCause = "";
    }

    private String corpsPanne(String cause, boolean rappel) {
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
                + "<p><b>Dernière cause relevée :</b><br>" + derniereCause + "</p></div>";
    }

    private void envoyer(String sujet, String corpsHtml) {
        List<Destinataire> admins = destinataires.superAdmins();
        if (admins.isEmpty()) {
            log.warn("[SAF-SANTE] Aucun SUPER_ADMIN avec e-mail : alerte non envoyee");
            return;
        }
        for (Destinataire d : admins) {
            publisher.publishEvent(new Event(EventType.PORTEFEUILLE_ALERTE, Map.of(
                    "email", d.email(), "sujet", sujet, "corpsHtml", corpsHtml)));
        }
        dernierEnvoi = LocalDateTime.now();
        log.info("[SAF-SANTE] « {} » publie a {} administrateur(s)", sujet, admins.size());
    }

    private static String premiereLigne(String s) {
        return s == null ? "" : s.split("\\R")[0];
    }
}
