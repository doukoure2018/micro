package io.digiservices.ecreditservice.security;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Chaine de securite du perimetre partenaire ({@code /ecredit/agri/**}), protegee par cle API.
 * Prioritaire sur la chaine JWT d'origine ({@link ResourceServerConfig}), qui reste inchangee
 * pour tout le reste d'ecreditservice.
 */
@Slf4j
@Configuration
public class AgriPartenaireSecurityConfig {

    @Bean
    @Order(Ordered.HIGHEST_PRECEDENCE)
    public SecurityFilterChain agriPartenaireFilterChain(
            HttpSecurity http,
            @Value("${ecredit.agri.api-key:}") String cleApi) throws Exception {

        http.securityMatcher("/ecredit/agri/**")
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(new AgriPartenaireApiKeyFilter(cleApi), UsernamePasswordAuthenticationFilter.class)
                .authorizeHttpRequests(a -> a.anyRequest().authenticated());

        log.info("[AGRI-PARTENAIRE] Chaine cle API active sur /ecredit/agri/**");
        return http.build();
    }
}
