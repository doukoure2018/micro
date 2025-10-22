package io.digiservices.authorizationserver.security;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Slf4j
@Component
@Order(1) // Execute early in filter chain
public class MobileOAuthSessionFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest httpRequest = (HttpServletRequest) request;

        // Check if this is a mobile OAuth authorization request
        if (httpRequest.getRequestURI().contains("/oauth2/authorize")) {
            String clientId = httpRequest.getParameter("client_id");
            String redirectUri = httpRequest.getParameter("redirect_uri");

            log.info("OAuth2 authorize request - client_id: {}, redirect_uri: {}", clientId, redirectUri);

            // Clear session for mobile app requests to force fresh login
            if ("mobile-app-client".equals(clientId)) {
                HttpSession session = httpRequest.getSession(false);
                if (session != null) {
                    log.info("✂️ Clearing existing session for mobile OAuth request");
                    session.invalidate();
                } else {
                    log.info("ℹ️ No existing session found for mobile OAuth request");
                }
            }
        }

        chain.doFilter(request, response);
    }
}