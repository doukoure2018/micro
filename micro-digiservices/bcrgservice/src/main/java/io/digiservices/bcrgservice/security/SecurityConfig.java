package io.digiservices.bcrgservice.security;

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
 * Securite de l'API publique BCRG : authentification par cle API.
 *
 * <ul>
 *   <li>{@code /bcrg/**} : protege par {@link ApiKeyAuthFilter}
 *       (header {@code X-API-Key} = {@code BCRG_PUBLIC_API_KEY})</li>
 *   <li>actuator health/info + swagger/openapi : ouverts</li>
 *   <li>tout le reste : refuse</li>
 * </ul>
 */
@Configuration
@EnableWebSecurity
@Slf4j
public class SecurityConfig {

    @Value("${bcrg.public-api-key:}")
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
                        .requestMatchers("/bcrg/**").authenticated()
                        .anyRequest().denyAll())
                .addFilterBefore(apiKeyAuthFilter, UsernamePasswordAuthenticationFilter.class);

        if (!org.springframework.util.StringUtils.hasText(publicApiKey)) {
            log.warn("[BCRG-PUBLIC-AUTH] BCRG_PUBLIC_API_KEY non configuree : /bcrg/** rejette tout (401)");
        }
        return http.build();
    }
}
