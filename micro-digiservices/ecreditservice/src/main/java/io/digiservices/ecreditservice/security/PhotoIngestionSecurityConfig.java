package io.digiservices.ecreditservice.security;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Chaine de securite de l'envoi des photos d'ecarts ({@code /ecredit/rapprochement/photo/**}),
 * protegee par cle API (V217).
 *
 * <p>Calquee sur le perimetre partenaire. Elle ne couvre QUE l'ecriture d'une photo : la lecture
 * de la courbe et du tableau reste sur la chaine JWT, bornee au perimetre du compte connecte.</p>
 *
 * <p>L'ordre est juste apres le perimetre partenaire (qui tient la plus haute priorite) et avant
 * la chaine JWT d'origine, inchangee pour tout le reste d'ecreditservice.</p>
 */
@Slf4j
@Configuration
public class PhotoIngestionSecurityConfig {

    @Bean
    @Order(5)
    public SecurityFilterChain photoIngestionFilterChain(
            HttpSecurity http,
            @Value("${ecredit.rapprochement.api-key:}") String cleApi) throws Exception {

        http.securityMatcher("/ecredit/rapprochement/photo/**")
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(new PhotoIngestionApiKeyFilter(cleApi),
                        UsernamePasswordAuthenticationFilter.class)
                .authorizeHttpRequests(a -> a.anyRequest().authenticated());

        log.info("[PHOTO ECARTS] Chaine cle API active sur /ecredit/rapprochement/photo/**");
        return http.build();
    }
}
