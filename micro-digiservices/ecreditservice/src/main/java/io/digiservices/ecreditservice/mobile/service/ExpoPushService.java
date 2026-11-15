package io.digiservices.ecreditservice.mobile.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * L'envoi des notifications poussées, par le service d'Expo.
 *
 * <p>Expo relaie vers Firebase pour Android et vers Apple pour iOS : une seule adresse à
 * appeler, aucun certificat à porter côté serveur. Le jeton d'un appareil a la forme
 * {@code ExponentPushToken[...]} et vit dans {@code appareil_mobile}.</p>
 *
 * <p><b>Un jeton mort est désactivé, pas réessayé.</b> Expo répond {@code DeviceNotRegistered}
 * quand l'application a été désinstallée ou le jeton remplacé. Le garder ferait grossir un
 * envoi pour rien, à chaque alerte, indéfiniment : la ligne est éteinte avec son motif, et
 * le téléphone la rallumera en se redéclarant à sa prochaine ouverture.</p>
 *
 * <p>Une notification ne porte JAMAIS de montant ni de nom de membre : elle s'affiche sur un
 * écran verrouillé, que n'importe qui peut lire par-dessus l'épaule de l'agent. Elle dit
 * qu'il y a quelque chose à voir, et l'application le montre une fois ouverte.</p>
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ExpoPushService {

    /** Expo accepte cent messages par appel ; au-delà, il faut découper. */
    private static final int PAR_ENVOI = 100;

    private static final String ADRESSE = "https://exp.host/--/api/v2/push/send";

    private final ObjectMapper mapper;

    @Value("${mobile.push.actif:true}")
    private boolean actif;

    @Value("${mobile.push.timeout-secondes:15}")
    private int timeoutSecondes;

    /** Ce qu'un envoi a donné, pour que l'appelant sache quoi désactiver. */
    public record Resultat(int envoyes, List<String> jetonsMorts) {

        public static Resultat vide() {
            return new Resultat(0, List.of());
        }
    }

    public boolean estActif() {
        return actif;
    }

    /**
     * Envoie le même message à plusieurs appareils. Rend les jetons qu'Expo déclare morts :
     * c'est à l'appelant de les éteindre, car lui seul sait dans quelle table ils vivent.
     */
    public Resultat envoyer(List<String> jetons, String titre, String corps, Map<String, Object> donnees) {
        if (!actif || jetons == null || jetons.isEmpty()) {
            return Resultat.vide();
        }
        List<String> valides = jetons.stream()
                .filter(j -> j != null && j.startsWith("ExponentPushToken["))
                .distinct().toList();
        if (valides.isEmpty()) {
            return Resultat.vide();
        }
        int envoyes = 0;
        List<String> morts = new ArrayList<>();
        for (int debut = 0; debut < valides.size(); debut += PAR_ENVOI) {
            List<String> paquet = valides.subList(debut, Math.min(debut + PAR_ENVOI, valides.size()));
            envoyes += envoyerUnPaquet(paquet, titre, corps, donnees, morts);
        }
        if (!morts.isEmpty()) {
            log.info("[PUSH] {} jeton(s) mort(s) a desactiver", morts.size());
        }
        return new Resultat(envoyes, morts);
    }

    private int envoyerUnPaquet(List<String> jetons, String titre, String corps,
                                Map<String, Object> donnees, List<String> morts) {
        try {
            List<Map<String, Object>> messages = new ArrayList<>();
            for (String jeton : jetons) {
                Map<String, Object> m = new HashMap<>();
                m.put("to", jeton);
                m.put("title", titre);
                m.put("body", corps);
                m.put("sound", "default");
                m.put("priority", "high");
                if (donnees != null && !donnees.isEmpty()) {
                    m.put("data", donnees);
                }
                messages.add(m);
            }
            String reponse = client().post().uri(ADRESSE)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(mapper.writeValueAsString(messages))
                    .retrieve().body(String.class);
            return lireLesAccuses(reponse, jetons, morts);
        } catch (Exception e) {
            // Une notification perdue n'est pas une donnée perdue : la saisie, elle, est rangée.
            log.warn("[PUSH] Envoi impossible : {}",
                    e.getMessage() == null ? e.toString() : e.getMessage().split("\\R")[0]);
            return 0;
        }
    }

    /**
     * Lit les accusés d'Expo, un par message et dans l'ordre d'envoi. Un accusé « error »
     * portant {@code DeviceNotRegistered} désigne un jeton à éteindre.
     */
    private int lireLesAccuses(String reponse, List<String> jetons, List<String> morts) {
        if (reponse == null || reponse.isBlank()) {
            return 0;
        }
        try {
            JsonNode accuses = mapper.readTree(reponse).path("data");
            if (!accuses.isArray()) {
                log.warn("[PUSH] Reponse inattendue d'Expo : {}", tronquer(reponse));
                return 0;
            }
            int ok = 0;
            for (int i = 0; i < accuses.size(); i++) {
                JsonNode a = accuses.get(i);
                if ("ok".equalsIgnoreCase(a.path("status").asText())) {
                    ok++;
                    continue;
                }
                String cause = a.path("details").path("error").asText("");
                if ("DeviceNotRegistered".equals(cause) && i < jetons.size()) {
                    morts.add(jetons.get(i));
                } else {
                    log.warn("[PUSH] Message refuse : {}", a.path("message").asText(cause));
                }
            }
            return ok;
        } catch (Exception e) {
            log.warn("[PUSH] Accuses illisibles : {}", e.getMessage());
            return 0;
        }
    }

    private RestClient client() {
        SimpleClientHttpRequestFactory fabrique = new SimpleClientHttpRequestFactory();
        fabrique.setConnectTimeout(5000);
        fabrique.setReadTimeout(timeoutSecondes * 1000);
        return RestClient.builder().requestFactory(fabrique).build();
    }

    private static String tronquer(String s) {
        return s.length() <= 200 ? s : s.substring(0, 200) + "…";
    }
}
