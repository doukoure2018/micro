package io.digiservices.userservice.perimetre;

import io.digiservices.userservice.dto.AgentPerimetreResponse;
import io.digiservices.userservice.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;

/**
 * Périmètre géographique d'un agent pour KUMY/AgriScore (endpoint {@code /agents/{id}/perimeter}),
 * identique à l'objet {@code perimetre} renvoyé par {@code /userinfo} du fournisseur d'identité.
 */
@Service
@RequiredArgsConstructor
public class AgentPerimetreService {

    private final StructureReseauRepository structureReseauRepository;

    public AgentPerimetreResponse perimetre(String agentId, User user) {
        String roleAgriScore = AgentPerimetreResolver.roleAgriScore(user.getRole(), user.getService());
        PerimetreNiveau niveau = AgentPerimetreResolver.niveau(roleAgriScore);
        boolean active = user.isEnabled() && user.isAccountNonLocked() && user.isAccountNonExpired();
        Map<String, Object> perimetre = AgentPerimetreBuilder.build(niveau,
                user.getDelegationId(), user.getAgenceId(), user.getPointventeId(),
                structureReseauRepository.getStructure());
        return new AgentPerimetreResponse(agentId,
                roleAgriScore != null ? roleAgriScore : user.getRole(),
                active, perimetre);
    }

    /** Rôle exposé pour le périmètre de toute la structure (aucun agent). */
    public static final String ROLE_STRUCTURE = "STRUCTURE";

    /**
     * Périmètre de TOUTE la structure CRG (endpoint {@code /agents/structure/perimeter}) : même
     * objet que le périmètre d'un agent de niveau NATIONAL (toutes les délégations, agences et
     * points de service), sans agent ({@code agentId = null}, {@code role = STRUCTURE},
     * {@code active = true}). Demandé par KUMY pour l'administration/maintenance d'AgriScore.
     */
    public AgentPerimetreResponse perimetreStructure() {
        Map<String, Object> perimetre = AgentPerimetreBuilder.build(PerimetreNiveau.NATIONAL,
                null, null, null, structureReseauRepository.getStructure());
        return new AgentPerimetreResponse(null, ROLE_STRUCTURE, true, perimetre);
    }
}
