package io.digiservices.ecreditservice.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

/**
 * Envoi d'un message dans Slack par « Incoming Webhook » (demande DSIG du 24/10/2026 : les
 * alertes techniques encombraient la boite Gmail des administrateurs).
 *
 * <p>Le webhook est un secret : il vit dans {@code .env.prod} du serveur, jamais dans le
 * depot ni dans un fichier de configuration. Sans webhook, le service se declare non
 * configure et l'appelant decide quoi faire (journal, courriel de secours).</p>
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class SlackNotifier {

    private static final int TITRE_MAX = 150;    // limite Slack d'un bloc « header »
    private static final int CORPS_MAX = 2900;   // limite Slack d'un bloc « section » (3000)

    private final ObjectMapper mapper;

    @Value("${slack.webhook.url:}")
    private String webhook;

    @Value("${slack.timeout-secondes:10}")
    private int timeoutSecondes;

    public boolean estConfigure() {
        return webhook != null && webhook.startsWith("https://hooks.slack.com/");
    }

    /**
     * Poste un message : un titre en en-tete, un corps au format mrkdwn de Slack.
     * Retourne vrai si Slack a accepte le message.
     */
    public boolean envoyer(String titre, String corpsMrkdwn) {
        if (!estConfigure()) {
            return false;
        }
        try {
            String charge = mapper.writeValueAsString(Map.of(
                    "text", tronquer(titre, TITRE_MAX),
                    "blocks", List.of(
                            Map.of("type", "header", "text",
                                    Map.of("type", "plain_text", "text", tronquer(titre, TITRE_MAX), "emoji", true)),
                            Map.of("type", "section", "text",
                                    Map.of("type", "mrkdwn", "text", tronquer(corpsMrkdwn, CORPS_MAX))))));
            String reponse = client().post().uri(webhook)
                    .contentType(MediaType.APPLICATION_JSON).body(charge)
                    .retrieve().body(String.class);
            if (!"ok".equalsIgnoreCase(reponse == null ? "" : reponse.trim())) {
                log.warn("[SLACK] Message refuse : {}", reponse);
                return false;
            }
            log.info("[SLACK] « {} » publie", titre);
            return true;
        } catch (Exception e) {
            log.warn("[SLACK] Envoi impossible : {}", e.getMessage() == null ? e.toString() : e.getMessage().split("\\R")[0]);
            return false;
        }
    }

    private RestClient client() {
        SimpleClientHttpRequestFactory fabrique = new SimpleClientHttpRequestFactory();
        fabrique.setConnectTimeout(5000);
        fabrique.setReadTimeout(timeoutSecondes * 1000);
        return RestClient.builder().requestFactory(fabrique).build();
    }

    private static String tronquer(String s, int max) {
        if (s == null) return "";
        return s.length() <= max ? s : s.substring(0, max - 1) + "…";
    }
}
