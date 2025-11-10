package io.digiservices.authorizationserver.security;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.annotation.Order;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import java.io.IOException;
@Slf4j
@Component
@Order(1)
public class MobileOAuthSessionFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        // Check if this is a mobile OAuth authorization request
        if (httpRequest.getRequestURI().contains("/oauth2/authorize")) {
            String clientId = httpRequest.getParameter("client_id");
            String prompt = httpRequest.getParameter("prompt");

            log.info("OAuth2 authorize request - client_id: {}, prompt: {}", clientId, prompt);

            // Force fresh login for mobile app
            if ("mobile-app-client".equals(clientId)) {

                // Clear any existing session completely
                HttpSession session = httpRequest.getSession(false);
                if (session != null) {
                    log.info("✂️ Clearing existing session for mobile OAuth request");
                    session.invalidate();

                    // Also clear security context
                    SecurityContextHolder.clearContext();
                }

                // Force new session creation to avoid automatic login
                HttpSession newSession = httpRequest.getSession(true);
                newSession.setMaxInactiveInterval(60); // Short session for mobile

                log.info("🆕 Created new session for mobile: {}", newSession.getId());
            }
        }

        chain.doFilter(request, response);
    }
}