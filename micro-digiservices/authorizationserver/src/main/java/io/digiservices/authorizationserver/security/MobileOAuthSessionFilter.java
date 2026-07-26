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
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Slf4j
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class MobileOAuthSessionFilter implements Filter {

    private static final String MOBILE_CLIENT_ID = "mobile-app-client";
    public static final String MOBILE_AUTH_COOKIE = "MOBILE_OAUTH_URL";
    public static final String MOBILE_LOGIN_DONE_COOKIE = "MOBILE_LOGIN_DONE";
    /**
     * Filet de sécurité pour le flux WEB : URL complète de /oauth2/authorize mémorisée en session.
     * Si la SavedRequest standard est perdue (écrasée par une ressource non permitAll, multi-onglets,
     * session recréée...), le successHandler du login peut reprendre le flux OAuth2 grâce à cette URL
     * au lieu de rediriger vers la SPA sans code (cause du "double login").
     */
    public static final String WEB_AUTH_SESSION_KEY = "WEB_OAUTH_URL_SESSION";

    /**
     * Filet de sécurité SUPPLÉMENTAIRE pour le flux WEB, cette fois dans un COOKIE.
     * Contrairement à {@link #WEB_AUTH_SESSION_KEY} (session), ce cookie survit à une
     * recréation/perte de session HTTP entre /oauth2/authorize et le POST /login — cause
     * du retour intermittent sur la home au lieu du profil. Le successHandler le lit en
     * dernier recours pour reprendre le flux OAuth2.
     */
    public static final String WEB_AUTH_COOKIE = "WEB_OAUTH_URL";

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

                // Vérifier si on vient du success handler (login déjà fait)
                boolean loginJustCompleted = hasCookie(httpRequest, MOBILE_LOGIN_DONE_COOKIE);
                log.info("🔍 Login just completed: {}", loginJustCompleted);

                if (loginJustCompleted) {
                    // On vient du login - laisser passer sans toucher à rien
                    log.info("✅ Post-login OAuth2 request - letting through");

                    // Supprimer les cookies
                    clearCookie(httpResponse, MOBILE_LOGIN_DONE_COOKIE);
                    clearCookie(httpResponse, MOBILE_AUTH_COOKIE);

                    log.info("========================================");
                    chain.doFilter(request, response);
                    return;
                }

                // Première requête - sauvegarder l'URL et forcer le login
                log.info("🔒 First OAuth2 request - saving URL and forcing login");

                // Construire l'URL OAuth2 complète
                String fullOAuthUrl = httpRequest.getRequestURL().toString();
                String queryString = httpRequest.getQueryString();
                if (queryString != null) {
                    fullOAuthUrl += "?" + queryString;
                }
                log.info("📎 Saving OAuth URL to cookie");

                // Sauvegarder dans un COOKIE
                String encodedUrl = URLEncoder.encode(fullOAuthUrl, StandardCharsets.UTF_8);
                Cookie mobileAuthCookie = new Cookie(MOBILE_AUTH_COOKIE, encodedUrl);
                mobileAuthCookie.setPath("/");
                mobileAuthCookie.setMaxAge(300);
                mobileAuthCookie.setHttpOnly(true);
                mobileAuthCookie.setSecure(true);
                httpResponse.addCookie(mobileAuthCookie);

                // Effacer le contexte de sécurité pour forcer un nouveau login
                SecurityContextHolder.clearContext();

                HttpSession session = httpRequest.getSession(false);
                if (session != null) {
                    session.removeAttribute("SPRING_SECURITY_CONTEXT");
                }

                log.info("✅ Mobile auth cookie set - will redirect to login");
            } else if ("GET".equalsIgnoreCase(httpRequest.getMethod())) {
                // Flux WEB (SPA) : mémoriser l'URL d'autorisation complète.
                // Sert de fallback au successHandler si la SavedRequest standard est perdue.
                String fullOAuthUrl = httpRequest.getRequestURL().toString();
                if (httpRequest.getQueryString() != null) {
                    fullOAuthUrl += "?" + httpRequest.getQueryString();
                }
                // (1) En session (comportement historique).
                httpRequest.getSession(true).setAttribute(WEB_AUTH_SESSION_KEY, fullOAuthUrl);
                // (2) ET dans un cookie, qui survit a une recreation de session HTTP.
                Cookie webAuthCookie = new Cookie(WEB_AUTH_COOKIE,
                        URLEncoder.encode(fullOAuthUrl, StandardCharsets.UTF_8));
                webAuthCookie.setPath("/");
                webAuthCookie.setMaxAge(300);
                webAuthCookie.setHttpOnly(true);
                webAuthCookie.setSecure(true);
                webAuthCookie.setAttribute("SameSite", "Lax");
                httpResponse.addCookie(webAuthCookie);
                log.info("🌐 Web OAuth2 request - URL saved in session + cookie as login fallback");
            }
            log.info("========================================");
        }

        chain.doFilter(request, response);
    }

    private boolean hasCookie(HttpServletRequest request, String cookieName) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookieName.equals(cookie.getName()) && !"".equals(cookie.getValue())) {
                    return true;
                }
            }
        }
        return false;
    }

    private void clearCookie(HttpServletResponse response, String cookieName) {
        Cookie cookie = new Cookie(cookieName, "");
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);
    }
}