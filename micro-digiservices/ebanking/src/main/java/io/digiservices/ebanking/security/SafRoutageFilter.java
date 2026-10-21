package io.digiservices.ebanking.security;

import io.digiservices.ebanking.config.SafRoutage;
import io.digiservices.ebanking.config.SafRoutageProperties;
import io.digiservices.ebanking.service.SafSanteProbe;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Decide, pour chaque requete, quelle base SAF elle lira : production si ce n'est pas une
 * lecture (toute ecriture va en production, quoi qu'il arrive) ou si son chemin figure dans
 * la liste des modules « production » ; sauvegarde sinon.
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
@RequiredArgsConstructor
public class SafRoutageFilter extends OncePerRequestFilter {

    private final SafRoutageProperties proprietes;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        SafRoutage.Cible cible = cible(request);
        SafRoutage.forcer(cible);
        try {
            // Les reponses servies par la sauvegarde disent de quand datent leurs donnees.
            if (cible == SafRoutage.Cible.SAUVEGARDE && proprietes.isActive()) {
                String date = SafSanteProbe.dateRestaurationConnue();
                if (date != null) response.setHeader("X-Donnees-SAF-Au", date);
            }
            chain.doFilter(request, response);
        } finally {
            SafRoutage.effacer();
        }
    }

    private SafRoutage.Cible cible(HttpServletRequest request) {
        if (!"GET".equalsIgnoreCase(request.getMethod()) && !"HEAD".equalsIgnoreCase(request.getMethod())) {
            return SafRoutage.Cible.PRODUCTION;
        }
        String chemin = request.getRequestURI();
        for (String prefixe : proprietes.getCheminsProduction()) {
            if (prefixe != null && !prefixe.isBlank() && chemin.startsWith(prefixe.trim())) {
                return SafRoutage.Cible.PRODUCTION;
            }
        }
        return SafRoutage.Cible.SAUVEGARDE;
    }
}
