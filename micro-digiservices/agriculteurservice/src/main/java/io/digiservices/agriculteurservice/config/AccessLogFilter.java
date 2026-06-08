package io.digiservices.agriculteurservice.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Journalisation d'acces : entree / sortie + duree.
 *
 * <p>Ne logue QUE methode, URI (chemin + query : codes et pagination, jamais de
 * nom/telephone), statut et duree. Aucun en-tete (donc jamais le jeton
 * Authorization) ni corps n'est journalise.</p>
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
@Slf4j
public class AccessLogFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        long start = System.currentTimeMillis();
        String method = request.getMethod();
        String uri = request.getRequestURI();
        String query = request.getQueryString();
        String path = query != null ? uri + "?" + query : uri;

        log.info(">> {} {}", method, path);
        try {
            filterChain.doFilter(request, response);
        } finally {
            log.info("<< {} {} {} ({} ms)", response.getStatus(), method, path,
                    System.currentTimeMillis() - start);
        }
    }
}
