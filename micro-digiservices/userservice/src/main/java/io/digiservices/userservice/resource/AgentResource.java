package io.digiservices.userservice.resource;

import io.digiservices.userservice.dto.AgentStatusResponse;
import io.digiservices.userservice.exception.ApiException;
import io.digiservices.userservice.model.User;
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
 * Sécurité : à protéger par clé API KUMY lors du durcissement RSSI (cf. intégration AgriPilot).
 * Tant que ce n'est pas fait, l'endpoint est en accès ouvert pour le test local uniquement.
 */
@RestController
@RequestMapping("/agents")
@RequiredArgsConstructor
@Slf4j
public class AgentResource {

    private static final String AGENT_ID_PREFIX = "CR-";

    private final UserService userService;

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
