package io.digiservices.agriculteurservice.config;

import feign.RequestInterceptor;
import feign.RequestTemplate;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.StringUtils;

/**
 * Configuration Feign pour les appels sortants proteges par cle API.
 *
 * <p>Injecte l'en-tete {@code X-API-Key} selon la destination :</p>
 * <ul>
 *   <li>{@code /ebanking/agri/**} (ebanking, donnees SAF) : {@code ebanking.agri.api-key}
 *       (env {@code EBANKING_AGRI_API_KEY}) ;</li>
 *   <li>{@code /agents/**} (userservice, perimetre / statut agent) : {@code userservice.agents.api-key}
 *       (env {@code KUMY_AGENTS_API_KEY}, meme cle que celle configuree cote userservice).</li>
 * </ul>
 * <p>Les autres appels (ex. {@code /user/offLine/**}, ouverts) ne recoivent aucune cle.</p>
 */
@Configuration
@Slf4j
public class FeignAgriConfig {

    private static final String API_KEY_HEADER = "X-API-Key";

    @Value("${ebanking.agri.api-key:}")
    private String ebankingAgriApiKey;

    @Value("${userservice.agents.api-key:}")
    private String userserviceAgentsApiKey;

    @Bean
    public RequestInterceptor apiKeyInterceptor() {
        return template -> {
            String path = template.path();
            if (path.startsWith("/ebanking/agri/")) {
                inject(template, ebankingAgriApiKey, "ebanking.agri.api-key", "/ebanking/agri/**");
            } else if (path.startsWith("/agents/")) {
                inject(template, userserviceAgentsApiKey, "userservice.agents.api-key", "/agents/**");
            }
        };
    }

    private static void inject(RequestTemplate template, String key, String property, String scope) {
        if (StringUtils.hasText(key)) {
            template.header(API_KEY_HEADER, key);
        } else {
            log.warn("[AGRI-FEIGN] {} non configure : les appels {} seront rejetes (401)", property, scope);
        }
    }
}
