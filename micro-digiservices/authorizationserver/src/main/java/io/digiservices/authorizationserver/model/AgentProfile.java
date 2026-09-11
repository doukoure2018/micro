package io.digiservices.authorizationserver.model;

/**
 * Profil d'un agent CRG lu en base pour construire les claims du scope {@code agent_profile}
 * transmis à KUMY/AgriScore (SSO fédéré OIDC, Variante A) : rôle, service et rattachement
 * géographique (délégation -> agence -> point de service).
 *
 * <p>Les champs de rattachement sont nullables : un DA/RA n'a pas de point de service,
 * un DR n'a que la délégation, un DE/DG n'a aucun rattachement.</p>
 */
public record AgentProfile(
        String role,
        String service,
        Long delegationId,
        String delegationLibele,
        Long agenceId,
        String agenceLibele,
        Long pointventeId,
        String pointventeLibele,
        String pointventeCode
) {}
