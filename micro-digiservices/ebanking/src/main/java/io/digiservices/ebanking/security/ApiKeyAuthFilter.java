package io.digiservices.ebanking.security;

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
 * Authentification par cle API pour le perimetre AgriPilot.
 *
 * <p>Lit le header {@code X-API-Key} et le compare en temps constant
 * ({@link MessageDigest#isEqual}) a la cle configuree. Ne traite que les URLs
 * {@code /ebanking/agri/**}. En cas d'echec : 401 + log WARN (IP source uniquement,
 * jamais la cle).</p>
 */
@Slf4j
public class ApiKeyAuthFilter extends OncePerRequestFilter {

    public static final String API_KEY_HEADER = "X-API-Key";
    private static final String PROTECTED_PREFIX = "/ebanking/agri/";

    private final byte[] expectedApiKey;

    public ApiKeyAuthFilter(String expectedApiKey) {
        this.expectedApiKey = expectedApiKey != null
                ? expectedApiKey.getBytes(StandardCharsets.UTF_8)
                : new byte[0];
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        // Defense en profondeur : ne s'applique qu'au perimetre agri
        return !request.getRequestURI().startsWith(PROTECTED_PREFIX);
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String providedKey = request.getHeader(API_KEY_HEADER);

        if (!StringUtils.hasText(providedKey) || !isApiKeyValid(providedKey)) {
            log.warn("[AGRI-AUTH] Acces refuse a {} - cle API absente ou invalide (source={})",
                    request.getRequestURI(), clientIp(request));
            unauthorized(response);
            return;
        }

        // Cle valide : on authentifie la requete pour le reste de la chaine
        var authentication = new UsernamePasswordAuthenticationToken(
                "agripilot", null, List.of(new SimpleGrantedAuthority("ROLE_AGRIPILOT")));
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
        response.getWriter().write("{\"error\":\"Unauthorized\",\"message\":\"Cle API manquante ou invalide\"}");
    }

    /** IP source uniquement (jamais la cle) ; prend en compte le proxy/gateway. */
    private String clientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (StringUtils.hasText(forwarded)) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
