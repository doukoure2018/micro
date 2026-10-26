package io.digiservices.gateway.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Refuse toute requete portee par le jeton d'un compte bloque (V182). Le sujet du jeton est lu
 * sans verifier la signature : la verification est faite juste apres par le serveur de
 * ressources, et un jeton forge au nom d'un compte bloque n'obtient qu'un refus de plus.
 */
@Component
@Order(1)
@RequiredArgsConstructor
@Slf4j
public class ComptesBloquesFilter extends OncePerRequestFilter {

    private static final Pattern SUJET = Pattern.compile("\"sub\"\\s*:\\s*\"([^\"]+)\"");

    private final ComptesBloquesCache cache;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        if (cache.taille() > 0) {
            String sujet = sujetDu(request.getHeader(HttpHeaders.AUTHORIZATION));
            if (cache.estBloque(sujet)) {
                log.warn("[COMPTES BLOQUES] Requete refusee pour le compte bloque {} sur {}", sujet, request.getRequestURI());
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                response.setCharacterEncoding(StandardCharsets.UTF_8.name());
                response.getWriter().write("{\"code\":401,\"status\":\"UNAUTHORIZED\","
                        + "\"message\":\"Votre compte a été bloqué par l'administrateur\"}");
                return;
            }
        }
        chain.doFilter(request, response);
    }

    static String sujetDu(String autorisation) {
        if (autorisation == null || !autorisation.regionMatches(true, 0, "Bearer ", 0, 7)) {
            return null;
        }
        String[] parts = autorisation.substring(7).trim().split("\\.");
        if (parts.length < 2) {
            return null;
        }
        try {
            String payload = new String(Base64.getUrlDecoder().decode(parts[1]), StandardCharsets.UTF_8);
            Matcher m = SUJET.matcher(payload);
            return m.find() ? m.group(1) : null;
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}
