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
 * Authentification par cle API pour le perimetre reglementaire BCRG
 * ({@code /ebanking/reg/**}). Meme mecanisme que {@link ApiKeyAuthFilter} (agri),
 * cle et prefixe distincts (rotation independante).
 */
@Slf4j
public class RegApiKeyAuthFilter extends OncePerRequestFilter {

    public static final String API_KEY_HEADER = "X-API-Key";
    private static final String PROTECTED_PREFIX = "/ebanking/reg/";

    private final byte[] expectedApiKey;

    public RegApiKeyAuthFilter(String expectedApiKey) {
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
            log.warn("[REG-AUTH] Acces refuse a {} - cle API absente ou invalide (source={})",
                    request.getRequestURI(), clientIp(request));
            unauthorized(response);
            return;
        }

        var authentication = new UsernamePasswordAuthenticationToken(
                "bcrg", null, List.of(new SimpleGrantedAuthority("ROLE_BCRG")));
        SecurityContextHolder.getContext().setAuthentication(authentication);

        filterChain.doFilter(request, response);
    }

    private boolean isApiKeyValid(String providedKey) {
        byte[] provided = providedKey.getBytes(StandardCharsets.UTF_8);
        return expectedApiKey.length > 0 && MessageDigest.isEqual(provided, expectedApiKey);
    }

    private void unauthorized(HttpServletResponse response) throws IOException {
        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.getWriter().write("{\"error\":\"Unauthorized\",\"message\":\"Cle API manquante ou invalide\"}");
    }

    private String clientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (StringUtils.hasText(forwarded)) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
