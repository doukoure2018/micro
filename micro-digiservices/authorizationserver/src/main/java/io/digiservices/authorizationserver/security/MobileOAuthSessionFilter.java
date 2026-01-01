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
    private static final String SAVED_REQUEST_ATTR = "SPRING_SECURITY_SAVED_REQUEST";

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        String requestUri = httpRequest.getRequestURI();

        // Intercepter les requêtes OAuth2 authorize
        if (requestUri.contains("/oauth2/authorize")) {
            String clientId = httpRequest.getParameter("client_id");
            String redirectUri = httpRequest.getParameter("redirect_uri");

            log.info("========================================");
            log.info("🔐 OAuth2 Authorize Request");
            log.info("Client ID: {}", clientId);
            log.info("Redirect URI: {}", redirectUri);
            log.info("Full URL: {}", httpRequest.getRequestURL() + "?" + httpRequest.getQueryString());
            log.info("========================================");

            // Détecter requête mobile
            boolean isMobileRequest = MOBILE_CLIENT_ID.equals(clientId) ||
                    (redirectUri != null && redirectUri.startsWith("com.digiservices.digicrg://"));

            if (isMobileRequest) {
                log.info("📱 MOBILE REQUEST DETECTED");

                // Sauvegarder l'URL complète OAuth2 AVANT de toucher à la session
                String fullOAuthUrl = httpRequest.getRequestURL().toString();
                String queryString = httpRequest.getQueryString();
                if (queryString != null) {
                    fullOAuthUrl += "?" + queryString;
                }
                log.info("📎 Saving OAuth URL: {}", fullOAuthUrl);

                // Effacer SEULEMENT le contexte de sécurité (pas la session!)
                SecurityContextHolder.clearContext();
                log.info("🔓 Security context cleared (session preserved)");

                // Stocker l'URL OAuth dans la session pour le success handler
                HttpSession session = httpRequest.getSession(true);
                session.setAttribute("MOBILE_OAUTH_URL", fullOAuthUrl);
                session.setAttribute("IS_MOBILE_AUTH", true);

                // Supprimer l'authentification existante de la session
                session.removeAttribute("SPRING_SECURITY_CONTEXT");

                log.info("✅ Mobile auth prepared - Session ID: {}", session.getId());
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