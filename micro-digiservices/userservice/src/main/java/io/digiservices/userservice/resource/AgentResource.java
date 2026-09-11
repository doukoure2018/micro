package io.digiservices.userservice.resource;

import io.digiservices.userservice.dto.AgentPerimetreResponse;
import io.digiservices.userservice.dto.AgentStatusResponse;
import io.digiservices.userservice.exception.ApiException;
import io.digiservices.userservice.model.User;
import io.digiservices.userservice.perimetre.AgentPerimetreService;
import io.digiservices.userservice.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Endpoint dédié au contrôle de statut des agents par KUMY/AgriScore (SSO fédéré OIDC, Variante A).
 * KUMY s'appuie dessus pour le contrôle temps réel (agent désactivé), et non sur /userinfo.
 *
 * Sécurité : chaîne dédiée {@code /agents/**} dans ResourceServerConfig, clé API {@code KUMY_AGENTS_API_KEY}
 * (header X-API-Key), distincte des autres clés.
 */
@RestController
@RequestMapping("/agents")
@RequiredArgsConstructor
@Slf4j
public class AgentResource {

    private static final String AGENT_ID_PREFIX = "CR-";

    private final UserService userService;
    private final AgentPerimetreService agentPerimetreService;

    @GetMapping("/{agentId}/status")
    public ResponseEntity<AgentStatusResponse> getAgentStatus(@PathVariable("agentId") String agentId) {
        Long userId = parseAgentId(agentId);
        if (userId == null) {
            log.warn("agent_id invalide reçu: {}", agentId);
            return ResponseEntity.badRequest().build();
        }
        try {
            User user = userService.getUserId(userId);
            boolean active = user.isEnabled() && user.isAccountNonLocked() && user.isAccountNonExpired();
            return ResponseEntity.ok(new AgentStatusResponse(
                    agentId,
                    active,
                    active ? "ACTIVE" : "DISABLED",
                    user.isEnabled(),
                    user.isAccountNonLocked(),
                    user.isAccountNonExpired()));
        } catch (ApiException e) {
            log.warn("Statut agent {} introuvable: {}", agentId, e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Périmètre géographique de l'agent (délégations -> agences -> points de service, élagué à son
     * niveau), identique à l'objet {@code perimetre} de {@code /userinfo}. Permet à KUMY de
     * rafraîchir le périmètre côté serveur sans nouveau login.
     */
    @GetMapping("/{agentId}/perimeter")
    public ResponseEntity<AgentPerimetreResponse> getAgentPerimetre(@PathVariable("agentId") String agentId) {
        Long userId = parseAgentId(agentId);
        if (userId == null) {
            log.warn("agent_id invalide reçu: {}", agentId);
            return ResponseEntity.badRequest().build();
        }
        try {
            User user = userService.getUserId(userId);
            return ResponseEntity.ok(agentPerimetreService.perimetre(agentId, user));
        } catch (ApiException e) {
            log.warn("Périmètre agent {} introuvable: {}", agentId, e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    /** Convertit "CR-42" en user_id (42). Retourne null si le format est invalide. */
    private Long parseAgentId(String agentId) {
        if (agentId == null || !agentId.startsWith(AGENT_ID_PREFIX)) {
            return null;
        }
        try {
            return Long.parseLong(agentId.substring(AGENT_ID_PREFIX.length()));
        } catch (NumberFormatException e) {
            return null;
        }
    }
}
