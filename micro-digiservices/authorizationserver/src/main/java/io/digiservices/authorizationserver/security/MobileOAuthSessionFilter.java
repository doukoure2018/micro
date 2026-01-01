package io.digiservices.authorizationserver.security;

import jakarta.servlet.*;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Slf4j
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class MobileOAuthSessionFilter implements Filter {

    private static final String MOBILE_CLIENT_ID = "mobile-app-client";
    public static final String MOBILE_AUTH_COOKIE = "MOBILE_OAUTH_URL";

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

            // Détecter requête mobile
            boolean isMobileRequest = MOBILE_CLIENT_ID.equals(clientId) ||
                    (redirectUri != null && redirectUri.startsWith("com.digiservices.digicrg://"));

            if (isMobileRequest) {
                log.info("📱 MOBILE REQUEST DETECTED");

                // IMPORTANT: Vérifier si l'utilisateur est DÉJÀ authentifié
                Authentication currentAuth = SecurityContextHolder.getContext().getAuthentication();
                boolean isAlreadyAuthenticated = currentAuth != null
                        && currentAuth.isAuthenticated()
                        && !"anonymousUser".equals(currentAuth.getPrincipal().toString())
                        && currentAuth.getPrincipal() != null;

                log.info("🔍 Current auth: {}", currentAuth);
                log.info("🔍 Is already authenticated: {}", isAlreadyAuthenticated);

                if (isAlreadyAuthenticated) {
                    // L'utilisateur est déjà connecté - laisser passer le flux OAuth2
                    log.info("✅ User already authenticated - continuing OAuth2 flow");

                    // Supprimer le cookie car on n'en a plus besoin
                    Cookie clearCookie = new Cookie(MOBILE_AUTH_COOKIE, "");
                    clearCookie.setPath("/");
                    clearCookie.setMaxAge(0);
                    httpResponse.addCookie(clearCookie);

                } else {
                    // L'utilisateur n'est PAS authentifié - sauvegarder l'URL et forcer le login
                    log.info("🔒 User not authenticated - saving OAuth URL for after login");

                    // Construire l'URL OAuth2 complète
                    String fullOAuthUrl = httpRequest.getRequestURL().toString();
                    String queryString = httpRequest.getQueryString();
                    if (queryString != null) {
                        fullOAuthUrl += "?" + queryString;
                    }
                    log.info("📎 Saving OAuth URL to cookie: {}", fullOAuthUrl);

                    // Sauvegarder dans un COOKIE
                    String encodedUrl = URLEncoder.encode(fullOAuthUrl, StandardCharsets.UTF_8);
                    Cookie mobileAuthCookie = new Cookie(MOBILE_AUTH_COOKIE, encodedUrl);
                    mobileAuthCookie.setPath("/");
                    mobileAuthCookie.setMaxAge(300); // 5 minutes
                    mobileAuthCookie.setHttpOnly(true);
                    mobileAuthCookie.setSecure(true);
                    httpResponse.addCookie(mobileAuthCookie);

                    // Effacer le contexte de sécurité pour forcer un nouveau login
                    SecurityContextHolder.clearContext();

                    // Effacer l'authentification de la session existante
                    HttpSession session = httpRequest.getSession(false);
                    if (session != null) {
                        session.removeAttribute("SPRING_SECURITY_CONTEXT");
                    }

                    log.info("✅ Mobile auth cookie set - will redirect to login");
                }
            }
            log.info("========================================");
        }

        chain.doFilter(request, response);
    }
}