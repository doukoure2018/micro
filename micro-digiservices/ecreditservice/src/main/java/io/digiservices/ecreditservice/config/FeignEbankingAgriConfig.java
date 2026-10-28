package io.digiservices.ecreditservice.config;

import feign.RequestInterceptor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.StringUtils;

/**
 * ecreditservice appelle le perimetre agricole d'ebanking ({@code /ebanking/agri/**}) pour
 * calculer la photo mensuelle du portefeuille (point 6 du tableau de bord DE). Ce perimetre est
 * protege par cle API : sans l'en-tete, l'appel repart en 401.
 *
 * <p>La cle est celle du perimetre agricole, deja en service entre agriculteurservice et
 * ebanking : rien de nouveau a creer, seulement a transmettre au conteneur.</p>
 */
@Configuration
@Slf4j
public class FeignEbankingAgriConfig {

    @Value("${ebanking.agri.api-key:}")
    private String ebankingAgriApiKey;

    @Bean
    public RequestInterceptor ebankingAgriApiKeyInterceptor() {
        return template -> {
            if (!template.path().startsWith("/ebanking/agri/")) {
                return;
            }
            if (StringUtils.hasText(ebankingAgriApiKey)) {
                template.header("X-API-Key", ebankingAgriApiKey);
            } else {
                log.warn("[AGRI-FEIGN] ebanking.agri.api-key non configure : les appels "
                        + "/ebanking/agri/** depuis ecreditservice seront rejetes (401)");
            }
        };
    }
}
