package io.digiservices.ecreditservice.security;

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
 * Authentification par cle API du perimetre partenaire d'ecreditservice
 * ({@code /ecredit/agri/**}). Meme principe que le filtre d'ebanking : comparaison en temps
 * constant, 401 sans detail, et jamais la cle dans les journaux.
 */
@Slf4j
public class AgriPartenaireApiKeyFilter extends OncePerRequestFilter {

    public static final String API_KEY_HEADER = "X-API-Key";
    private static final String PREFIXE_PROTEGE = "/ecredit/agri/";

    private final byte[] cleAttendue;

    public AgriPartenaireApiKeyFilter(String cleAttendue) {
        this.cleAttendue = cleAttendue != null ? cleAttendue.getBytes(StandardCharsets.UTF_8) : new byte[0];
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return !request.getRequestURI().startsWith(PREFIXE_PROTEGE);
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String fournie = request.getHeader(API_KEY_HEADER);
        if (!StringUtils.hasText(fournie) || !valide(fournie)) {
            log.warn("[AGRI-PARTENAIRE] Acces refuse a {} — cle API absente ou invalide (source={})",
                    request.getRequestURI(), ip(request));
            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.getWriter().write("{\"message\":\"Cle API absente ou invalide\"}");
            return;
        }
        SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(
                "agripilot", null, List.of(new SimpleGrantedAuthority("ROLE_PARTENAIRE"))));
        filterChain.doFilter(request, response);
    }

    /** Fail-closed : aucune cle configuree => tout est refuse. */
    private boolean valide(String fournie) {
        if (cleAttendue.length == 0) {
            log.error("[AGRI-PARTENAIRE] Aucune cle configuree : tout acces a /ecredit/agri/** est refuse");
            return false;
        }
        return MessageDigest.isEqual(cleAttendue, fournie.getBytes(StandardCharsets.UTF_8));
    }

    private static String ip(HttpServletRequest request) {
        String transmise = request.getHeader("X-Forwarded-For");
        return StringUtils.hasText(transmise) ? transmise.split(",")[0].trim() : request.getRemoteAddr();
    }
}
