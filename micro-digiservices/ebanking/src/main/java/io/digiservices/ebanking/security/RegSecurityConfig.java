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
 * Chaine de securite dediee au perimetre reglementaire BCRG ({@code /ebanking/reg/**}),
 * protegee par cle API ({@link RegApiKeyAuthFilter}).
 *
 * <p>Ordre juste apres la chaine agri ; tout le reste retombe sur la chaine JWT
 * existante (ResourceServerConfig), inchangee.</p>
 */
@Slf4j
@Configuration
public class RegSecurityConfig {

    @Bean
    @Order(Ordered.HIGHEST_PRECEDENCE + 1)
    public SecurityFilterChain regSecurityFilterChain(HttpSecurity http,
                                                      @Value("${bcrg.api-key:}") String apiKey) throws Exception {
        RegApiKeyAuthFilter regApiKeyAuthFilter = new RegApiKeyAuthFilter(apiKey);

        http
                .securityMatcher("/ebanking/reg/**")
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(regApiKeyAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .authorizeHttpRequests(authorize -> authorize.anyRequest().authenticated());

        log.info("[REG-SECURITY] Chaine API Key active sur /ebanking/reg/**");
        return http.build();
    }
}
