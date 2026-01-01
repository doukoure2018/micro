package io.digiservices.authorizationserver.security;

import jakarta.servlet.*;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Slf4j
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)  // ← CHANGEMENT CRITIQUE : s'exécute EN PREMIER
public class MobileOAuthSessionFilter implements Filter {

    private static final String MOBILE_CLIENT_ID = "mobile-app-client";

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        String requestUri = httpRequest.getRequestURI();

        // Intercepter TOUTES les requêtes OAuth2 authorize
        if (requestUri.contains("/oauth2/authorize")) {
            String clientId = httpRequest.getParameter("client_id");
            String redirectUri = httpRequest.getParameter("redirect_uri");

            log.info("========================================");
            log.info("🔐 OAuth2 Authorize Request");
            log.info("Client ID: {}", clientId);
            log.info("Redirect URI: {}", redirectUri);
            log.info("Session ID (before): {}", getSessionId(httpRequest));
            log.info("========================================");

            // Détecter requête mobile
            boolean isMobileRequest = MOBILE_CLIENT_ID.equals(clientId) ||
                    (redirectUri != null && redirectUri.startsWith("com.digiservices.digicrg://"));

            if (isMobileRequest) {
                log.info("📱 MOBILE REQUEST DETECTED - Forcing fresh authentication");

                // 1. Invalider la session existante
                HttpSession existingSession = httpRequest.getSession(false);
                if (existingSession != null) {
                    String oldSessionId = existingSession.getId();
                    log.info("🗑️ Invalidating existing session: {}", oldSessionId);
                    try {
                        existingSession.invalidate();
                    } catch (IllegalStateException e) {
                        log.warn("Session already invalidated: {}", e.getMessage());
                    }
                }

                // 2. Effacer le contexte de sécurité Spring
                SecurityContextHolder.clearContext();
                log.info("🔓 Security context cleared");

                // 3. Supprimer les cookies de session côté client
                clearSessionCookies(httpResponse);

                // 4. Créer une nouvelle session propre
                HttpSession newSession = httpRequest.getSession(true);
                newSession.setMaxInactiveInterval(300); // 5 minutes pour le flow OAuth
                log.info("🆕 New session created: {}", newSession.getId());

                // 5. Headers anti-cache
                httpResponse.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
                httpResponse.setHeader("Pragma", "no-cache");
                httpResponse.setHeader("Expires", "0");

                log.info("✅ Mobile session cleanup complete");
            }
        }

        chain.doFilter(request, response);
    }

    private void clearSessionCookies(HttpServletResponse response) {
        // Supprimer JSESSIONID avec path /
        Cookie jsessionCookie = new Cookie("JSESSIONID", "");
        jsessionCookie.setPath("/");
        jsessionCookie.setMaxAge(0);
        jsessionCookie.setHttpOnly(true);
        response.addCookie(jsessionCookie);

        // Supprimer JSESSIONID avec path /auth/
        Cookie jsessionCookieAuth = new Cookie("JSESSIONID", "");
        jsessionCookieAuth.setPath("/auth/");
        jsessionCookieAuth.setMaxAge(0);
        jsessionCookieAuth.setHttpOnly(true);
        response.addCookie(jsessionCookieAuth);

        log.info("🍪 Session cookies cleared");
    }

    private String getSessionId(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        return session != null ? session.getId() : "null";
    }
}