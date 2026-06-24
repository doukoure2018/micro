package io.digiservices.userservice.dto;

/**
 * Statut temps réel d'un agent CRG, exposé à KUMY/AgriScore (SSO fédéré OIDC, Variante A).
 * Permet à KUMY de bloquer immédiatement un agent désactivé sans attendre l'expiration du token.
 *
 * @param agentId            identifiant stable de l'agent (ex. "CR-42")
 * @param active             vrai si l'agent peut se connecter (compte activé, non verrouillé, non expiré)
 * @param status             "ACTIVE" ou "DISABLED" (forme lisible de {@code active})
 * @param enabled            compte activé
 * @param accountNonLocked   compte non verrouillé
 * @param accountNonExpired  compte non expiré
 */
public record AgentStatusResponse(
        String agentId,
        boolean active,
        String status,
        boolean enabled,
        boolean accountNonLocked,
        boolean accountNonExpired
) {}
