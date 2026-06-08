package io.digiservices.ebanking.security;

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
 * Chaine de securite dediee au perimetre AgriPilot ({@code /ebanking/agri/**}),
 * protegee par cle API ({@link ApiKeyAuthFilter}).
 *
 * <p>{@link Order} le plus prioritaire : les requetes agri sont traitees ici ;
 * tout le reste retombe sur la chaine JWT existante (ResourceServerConfig),
 * inchangee.</p>
 */
@Slf4j
@Configuration
public class AgriSecurityConfig {

    @Bean
    @Order(Ordered.HIGHEST_PRECEDENCE)
    public SecurityFilterChain agriSecurityFilterChain(HttpSecurity http,
                                                       @Value("${agripilot.api-key}") String apiKey) throws Exception {
        ApiKeyAuthFilter apiKeyAuthFilter = new ApiKeyAuthFilter(apiKey);

        http
                .securityMatcher("/ebanking/agri/**")
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(apiKeyAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .authorizeHttpRequests(authorize -> authorize.anyRequest().authenticated());

        log.info("[AGRI-SECURITY] Chaine API Key active sur /ebanking/agri/**");
        return http.build();
    }
}
