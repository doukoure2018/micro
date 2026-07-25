package io.digiservices.bcrgservice.config;

import feign.RequestInterceptor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.StringUtils;

/**
 * Configuration Feign pour les appels sortants vers ebanking.
 *
 * <p>Injecte l'en-tete {@code X-API-Key} afin de satisfaire la securite par cle API
 * des endpoints {@code /ebanking/reg/**}. La cle provient de {@code ebanking.reg.api-key}
 * (variable d'env {@code EBANKING_REG_API_KEY}).</p>
 */
@Configuration
@Slf4j
public class FeignRegConfig {

    @Value("${ebanking.reg.api-key:}")
    private String ebankingRegApiKey;

    @Bean
    public RequestInterceptor regApiKeyInterceptor() {
        return template -> {
            if (StringUtils.hasText(ebankingRegApiKey)) {
                template.header("X-API-Key", ebankingRegApiKey);
            } else {
                log.warn("[BCRG-FEIGN] ebanking.reg.api-key non configure : les appels /ebanking/reg/** seront rejetes (401)");
            }
        };
    }
}
