package io.digiservices.ecreditservice.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.digiservices.ecreditservice.service.CanalDecodeurService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.ResponseErrorHandler;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.util.Map;

/**
 * Client de l'API partenaire Canal+ (Yigui) pour l'actualisation des chaînes d'un décodeur.
 *
 * - Authentification : POST {base}/auth/login (token JWT, expire ~1 h) — mis en cache 50 min.
 * - Actualisation : POST {base}/securecanal/reactivation (traitement temps réel 30-90 s
 *   côté Canal+ → read timeout de 125 s, cf. bonnes pratiques du doc d'intégration).
 * - Les réponses 4xx/5xx de Canal+ sont relayées telles quelles (429 cooldown, 422 contrat
 *   non actif, 400 CGA_ERROR...) : c'est le frontend qui présente chaque cas à l'agent.
 */
@Service
@Slf4j
public class CanalDecodeurServiceImpl implements CanalDecodeurService {

    @Value("${canal.api.base-url:http://162.19.114.155:8088}")
    private String baseUrl;

    @Value("${canal.api.username:}")
    private String username;

    @Value("${canal.api.password:}")
    private String password;

    private final ObjectMapper objectMapper;
    private final RestTemplate restTemplate;

    // Cache du token partenaire (expire côté Canal+ après 1 h)
    private volatile String cachedToken;
    private volatile Instant tokenExpiresAt = Instant.EPOCH;

    public CanalDecodeurServiceImpl(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;

        var factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(10_000);
        factory.setReadTimeout(125_000); // le traitement Canal+ prend 30 à 90 s
        this.restTemplate = new RestTemplate(factory);
        // Ne jamais lever d'exception sur 4xx/5xx : on relaie le corps (cooldown, contrat...)
        this.restTemplate.setErrorHandler(new ResponseErrorHandler() {
            @Override public boolean hasError(ClientHttpResponse response) { return false; }
            @Override public void handleError(ClientHttpResponse response) { }
        });
    }

    @Override
    public CanalApiResult reactivation(String numAbonne, String phoneNumber) {
        if (username == null || username.isBlank() || password == null || password.isBlank()) {
            return errorResult(503, "Le service d'actualisation n'est pas encore configuré "
                    + "(identifiants partenaire Canal+ manquants). Contactez l'administrateur.");
        }

        String token = getToken(false);
        if (token == null) {
            return errorResult(502, "Impossible de s'authentifier auprès du service Canal+. Réessayez plus tard.");
        }

        CanalApiResult result = callReactivation(token, numAbonne, phoneNumber);

        // Token expiré entre-temps -> re-login une seule fois puis nouvelle tentative
        if (result.status() == 401) {
            log.info("Canal+ token expiré, ré-authentification puis nouvelle tentative");
            token = getToken(true);
            if (token == null) {
                return errorResult(502, "Impossible de s'authentifier auprès du service Canal+. Réessayez plus tard.");
            }
            result = callReactivation(token, numAbonne, phoneNumber);
        }
        return result;
    }

    private CanalApiResult callReactivation(String token, String numAbonne, String phoneNumber) {
        // ⚠ endpoint sous /securecanal/ (PAS /securecanal/api/) — cf. doc §4.1
        String url = baseUrl + "/securecanal/reactivation";
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(token);
            var request = new HttpEntity<>(Map.of("numAbonne", numAbonne, "phoneNumber", phoneNumber), headers);

            long start = System.currentTimeMillis();
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, request, String.class);
            log.info("Canal+ reactivation décodeur {} -> HTTP {} en {} ms",
                    numAbonne, response.getStatusCode().value(), System.currentTimeMillis() - start);

            String body = response.getBody() != null ? response.getBody() : "{}";
            return new CanalApiResult(response.getStatusCode().value(), body);
        } catch (Exception e) {
            log.error("Erreur d'appel Canal+ reactivation ({}): {}", url, e.getMessage());
            return errorResult(502, "Le service Canal+ est injoignable ou n'a pas répondu à temps. "
                    + "Si l'actualisation a été déclenchée, les chaînes reviendront sous quelques minutes ; "
                    + "sinon réessayez dans un instant.");
        }
    }

    /** Token partenaire, mis en cache 50 min (expiration réelle : 1 h). */
    private synchronized String getToken(boolean forceRefresh) {
        if (!forceRefresh && cachedToken != null && Instant.now().isBefore(tokenExpiresAt)) {
            return cachedToken;
        }
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            // Contrat validé sur l'environnement TEST (2026-07-06) : le champ attendu est
            // "email" (un {"username": ...} renvoie 400 "Email cannot be empty") et le token
            // est retourné sous data.access_token.
            var request = new HttpEntity<>(Map.of("email", username, "password", password), headers);
            ResponseEntity<String> response =
                    restTemplate.exchange(baseUrl + "/auth/login", HttpMethod.POST, request, String.class);

            if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
                log.error("Canal+ login échoué: HTTP {}", response.getStatusCode().value());
                return null;
            }
            String token = extractAccessToken(response.getBody());
            if (token == null) {
                log.error("Canal+ login: accessToken introuvable dans la réponse");
                return null;
            }
            cachedToken = token;
            tokenExpiresAt = Instant.now().plusSeconds(50 * 60);
            log.info("Canal+ login OK, token mis en cache jusqu'à {}", tokenExpiresAt);
            return token;
        } catch (Exception e) {
            log.error("Erreur de login Canal+: {}", e.getMessage());
            return null;
        }
    }

    /** Extraction défensive du token : accessToken à la racine, sous data, ou champ token. */
    private String extractAccessToken(String body) {
        try {
            JsonNode root = objectMapper.readTree(body);
            for (JsonNode node : new JsonNode[]{root, root.path("data")}) {
                for (String field : new String[]{"accessToken", "access_token", "token"}) {
                    JsonNode value = node.path(field);
                    if (value.isTextual() && !value.asText().isBlank()) {
                        return value.asText();
                    }
                }
            }
        } catch (Exception e) {
            log.error("Réponse de login Canal+ illisible: {}", e.getMessage());
        }
        return null;
    }

    private CanalApiResult errorResult(int status, String message) {
        try {
            return new CanalApiResult(status, objectMapper.writeValueAsString(
                    Map.of("statusCode", status, "status", "ERROR", "message", message)));
        } catch (Exception e) {
            return new CanalApiResult(status, "{\"message\":\"" + message + "\"}");
        }
    }
}
