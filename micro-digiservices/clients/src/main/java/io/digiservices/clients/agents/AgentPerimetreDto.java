package io.digiservices.clients.agents;

import java.util.Map;

/**
 * Perimetre geographique d'un agent CRG (delegations -> agences -> points_de_service, elague
 * a son niveau), tel que calcule par userservice ({@code GET /agents/{agentId}/perimeter}).
 *
 * @param agentId   identifiant stable de l'agent, format {@code CR-<n>}
 * @param role      role expose a AgriScore (AGENT_CREDIT, RA, DA, DR, DE, DG) ; role brut si hors perimetre
 * @param active    compte active, non verrouille, non expire (meme regle que /status)
 * @param perimetre {@code {niveau, delegations[ {id, libelle, agences[ {id, libelle, points_de_service[ {id, code, libelle} ]} ]} ]}}
 */
public record AgentPerimetreDto(
        String agentId,
        String role,
        boolean active,
        Map<String, Object> perimetre
) {}
