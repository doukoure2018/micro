package io.digiservices.authorizationserver.perimetre;

import io.digiservices.authorizationserver.model.AgentProfile;
import io.digiservices.authorizationserver.model.PerimetreNiveau;
import io.digiservices.authorizationserver.repository.StructureReseauRepository;
import io.digiservices.authorizationserver.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Calcule le périmètre géographique d'un agent pour le SSO KUMY/AgriScore :
 * claims compacts (ID Token) et arbre complet ({@code /userinfo}).
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AgentPerimetreService {

    public static final String CLAIM_AGENT_ID = "agent_id";
    public static final String CLAIM_ROLE = "role";
    public static final String CLAIM_NIVEAU = "perimetre_niveau";
    public static final String CLAIM_DELEGATION_ID = "delegation_id";
    public static final String CLAIM_AGENCE_REGION = "agence_region";
    public static final String CLAIM_AGENCE_ID = "agence_id";
    public static final String CLAIM_AGENCE_NAME = "agence_name";
    public static final String CLAIM_POINTVENTE_ID = "pointvente_id";
    public static final String CLAIM_POINTVENTE_CODE = "pointvente_code";
    public static final String CLAIM_POINT_DE_SERVICE = "point_de_service";
    /** Ancien nom de {@link #CLAIM_POINTVENTE_CODE}, conservé pour compatibilité KUMY. */
    public static final String CLAIM_AGENCE_CODE_LEGACY = "agence_code";
    public static final String CLAIM_PERIMETRE = "perimetre";

    private static final String AGENT_ID_PREFIX = "CR-";

    private final UserRepository userRepository;
    private final StructureReseauRepository structureReseauRepository;

    /** Résultat du calcul : rôle AgriScore, niveau et profil. {@code role == null} => hors périmètre. */
    public record Resolution(String role, PerimetreNiveau niveau, AgentProfile profile) {
        public boolean horsPerimetre() {
            return role == null;
        }
    }

    public Resolution resolve(Long userId) {
        AgentProfile profile = userRepository.getAgentProfile(userId);
        String role = AgentPerimetreResolver.roleAgriScore(
                profile != null ? profile.role() : null,
                profile != null ? profile.service() : null);
        return new Resolution(role, AgentPerimetreResolver.niveau(role), profile);
    }

    /**
     * Claims compacts destinés à l'ID Token : identifiants et libellés du rattachement,
     * limités au niveau de l'agent (un DA n'a pas de point de service, un DE/DG rien).
     * Les valeurs absentes sont omises : un claim JWT ne peut pas porter {@code null}.
     */
    public Map<String, Object> idTokenClaims(Long userId, Resolution r) {
        Map<String, Object> claims = new LinkedHashMap<>();
        if (r.horsPerimetre()) {
            return claims;
        }
        claims.put(CLAIM_AGENT_ID, AGENT_ID_PREFIX + userId);
        claims.put(CLAIM_ROLE, r.role());
        claims.put(CLAIM_NIVEAU, r.niveau().name());
        rattachement(r).forEach((k, v) -> {
            if (v != null) {
                claims.put(k, v);
            }
        });
        return claims;
    }

    /**
     * Claims destinés à {@code /userinfo} : les mêmes que l'ID Token, avec {@code null} explicite
     * pour un rattachement manquant, plus l'arbre {@code perimetre}.
     */
    public Map<String, Object> userInfoClaims(Long userId, Resolution r) {
        Map<String, Object> claims = new LinkedHashMap<>();
        if (r.horsPerimetre()) {
            return claims;
        }
        claims.put(CLAIM_AGENT_ID, AGENT_ID_PREFIX + userId);
        claims.put(CLAIM_ROLE, r.role());
        claims.put(CLAIM_NIVEAU, r.niveau().name());
        claims.putAll(rattachement(r));
        AgentProfile p = r.profile();
        claims.put(CLAIM_PERIMETRE, AgentPerimetreBuilder.build(r.niveau(),
                p == null ? null : p.delegationId(),
                p == null ? null : p.agenceId(),
                p == null ? null : p.pointventeId(),
                structureReseauRepository.getStructure()));
        return claims;
    }

    /** Claims de rattachement (valeurs possiblement nulles), filtrés par niveau. */
    private Map<String, Object> rattachement(Resolution r) {
        Map<String, Object> m = new LinkedHashMap<>();
        AgentProfile p = r.profile();
        PerimetreNiveau n = r.niveau();
        if (n.compareTo(PerimetreNiveau.NATIONAL) < 0) {
            m.put(CLAIM_DELEGATION_ID, p == null ? null : p.delegationId());
            m.put(CLAIM_AGENCE_REGION, p == null ? null : blankToNull(p.delegationLibele()));
        }
        if (n.compareTo(PerimetreNiveau.DELEGATION) < 0) {
            m.put(CLAIM_AGENCE_ID, p == null ? null : p.agenceId());
            m.put(CLAIM_AGENCE_NAME, p == null ? null : blankToNull(p.agenceLibele()));
        }
        if (n == PerimetreNiveau.POINT_DE_SERVICE) {
            String code = p == null ? null : blankToNull(p.pointventeCode());
            m.put(CLAIM_POINTVENTE_ID, p == null ? null : p.pointventeId());
            m.put(CLAIM_POINTVENTE_CODE, code);
            m.put(CLAIM_POINT_DE_SERVICE, p == null ? null : blankToNull(p.pointventeLibele()));
            m.put(CLAIM_AGENCE_CODE_LEGACY, code);
        }
        return m;
    }

    private static String blankToNull(String s) {
        return s == null || s.isBlank() ? null : s;
    }
}
