package io.digiservices.userservice.dto;

import java.util.Map;

/**
 * Périmètre géographique d'un agent CRG exposé à KUMY/AgriScore.
 *
 * @param agentId   identifiant stable de l'agent (ex. "CR-42")
 * @param role      rôle tel qu'exposé à AgriScore (AGENT_CREDIT, RA, DA, DR, DE, DG) ; rôle brut si hors périmètre
 * @param active    même règle que {@code /agents/{id}/status}
 * @param perimetre {@code {niveau, delegations[ {id, libelle, agences[ {id, libelle, points_de_service[ {id, code, libelle} ]} ]} ]}} ;
 *                  {@code niveau = "AUCUN"} et liste vide si l'agent est hors périmètre AgriScore
 */
public record AgentPerimetreResponse(
        String agentId,
        String role,
        boolean active,
        Map<String, Object> perimetre
) {}
