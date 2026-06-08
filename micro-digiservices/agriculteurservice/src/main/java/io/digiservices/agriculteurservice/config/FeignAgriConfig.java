package io.digiservices.agriculteurservice.config;

import feign.RequestInterceptor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.StringUtils;

/**
 * Configuration Feign pour les appels sortants vers ebanking.
 *
 * <p>Injecte l'en-tete {@code X-API-Key} sur les requetes Feign afin de satisfaire
 * la securite par cle API des endpoints {@code /ebanking/agri/**}. La cle provient
 * de {@code ebanking.agri.api-key} (variable d'env {@code EBANKING_AGRI_API_KEY}).</p>
 */
@Configuration
@Slf4j
public class FeignAgriConfig {

    @Value("${ebanking.agri.api-key:}")
    private String ebankingAgriApiKey;

    @Bean
    public RequestInterceptor agriApiKeyInterceptor() {
        return template -> {
            if (StringUtils.hasText(ebankingAgriApiKey)) {
                template.header("X-API-Key", ebankingAgriApiKey);
            } else {
                log.warn("[AGRI-FEIGN] ebanking.agri.api-key non configure : les appels /ebanking/agri/** seront rejetes (401)");
            }
        };
    }
}
