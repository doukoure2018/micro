package io.digiservices.userservice.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.List;

/**
 * Authentification par clé API pour le contrôle de statut agent par KUMY/AgriScore (SSO fédéré).
 *
 * <p>Lit le header {@code X-API-Key} et le compare en temps constant à la clé configurée
 * ({@code KUMY_AGENTS_API_KEY}). Ne traite que les URLs {@code /agents/**}.
 * Échec -> 401 + log WARN (IP source uniquement).</p>
 *
 * <p>Clé DISTINCTE des autres clés (rotation indépendante). Aligné sur le filtre AgriPilot
 * d'agriculteurservice.</p>
 */
@Slf4j
public class ApiKeyAuthFilter extends OncePerRequestFilter {

    public static final String API_KEY_HEADER = "X-API-Key";
    private static final String PROTECTED_PREFIX = "/agents/";

    private final byte[] expectedApiKey;

    public ApiKeyAuthFilter(String expectedApiKey) {
        this.expectedApiKey = expectedApiKey != null
                ? expectedApiKey.getBytes(StandardCharsets.UTF_8)
                : new byte[0];
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return !request.getRequestURI().startsWith(PROTECTED_PREFIX);
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String providedKey = request.getHeader(API_KEY_HEADER);

        if (!StringUtils.hasText(providedKey) || !isApiKeyValid(providedKey)) {
            log.warn("[KUMY-AUTH] Accès refusé à {} - clé API absente ou invalide (source={})",
                    request.getRequestURI(), clientIp(request));
            unauthorized(response);
            return;
        }

        var authentication = new UsernamePasswordAuthenticationToken(
                "kumy", null, List.of(new SimpleGrantedAuthority("ROLE_KUMY")));
        SecurityContextHolder.getContext().setAuthentication(authentication);

        filterChain.doFilter(request, response);
    }

    /** Comparaison en temps constant (anti timing-attack). */
    private boolean isApiKeyValid(String providedKey) {
        byte[] provided = providedKey.getBytes(StandardCharsets.UTF_8);
        return expectedApiKey.length > 0 && MessageDigest.isEqual(provided, expectedApiKey);
    }

    private void unauthorized(HttpServletResponse response) throws IOException {
        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.getWriter().write("{\"error\":\"Unauthorized\",\"message\":\"Clé API manquante ou invalide\"}");
    }

    private String clientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (StringUtils.hasText(forwarded)) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
