package io.digiservices.authorizationserver.model;

/**
 * Profil géographique d'un agent CRG (délégation -> agence -> point de service),
 * utilisé pour construire les claims métier du scope {@code agent_profile}
 * transmis à KUMY/AgriScore (SSO fédéré OIDC, Variante A).
 * Les champs sont nullables : un DA/RA n'a pas de point de service, un DR n'a que la délégation.
 */
public record AgentProfile(
        String delegationLibele,
        String agenceLibele,
        String pointventeLibele,
        String pointventeCode
) {}
