package io.digiservices.agriculteurservice.security;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Securite de l'API publique AgriPilot : authentification par cle API.
 *
 * <ul>
 *   <li>{@code /agriculteurs/**} : protege par {@link ApiKeyAuthFilter}
 *       (header {@code X-API-Key} = {@code AGRIPILOT_PUBLIC_API_KEY})</li>
 *   <li>actuator health/info + swagger/openapi : ouverts</li>
 *   <li>tout le reste : refuse</li>
 * </ul>
 *
 * <p>KUMY appelle directement agriculteurservice (via une location nginx dediee
 * qui bypasse le gateway). Aucun JWT requis.</p>
 */
@Configuration
@EnableWebSecurity
@Slf4j
public class SecurityConfig {

    @Value("${agripilot.public-api-key:}")
    private String publicApiKey;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        ApiKeyAuthFilter apiKeyAuthFilter = new ApiKeyAuthFilter(publicApiKey);

        http
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/actuator/health", "/actuator/info",
                                "/swagger-ui/**", "/swagger-ui.html", "/v3/api-docs/**").permitAll()
                        .requestMatchers("/agriculteurs/**").authenticated()
                        .anyRequest().denyAll())
                .addFilterBefore(apiKeyAuthFilter, UsernamePasswordAuthenticationFilter.class);

        if (!org.springframework.util.StringUtils.hasText(publicApiKey)) {
            log.warn("[AGRI-PUBLIC-AUTH] AGRIPILOT_PUBLIC_API_KEY non configuree : /agriculteurs/** rejette tout (401)");
        }
        return http.build();
    }
}
