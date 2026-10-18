package io.digiservices.authorizationserver.perimetre;

import io.digiservices.authorizationserver.model.AgentProfile;
import io.digiservices.authorizationserver.model.PerimetreNiveau;
import io.digiservices.authorizationserver.repository.StructureReseauRepository;
import io.digiservices.authorizationserver.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Claims du scope {@code rapprochement} : profil de l'utilisateur dans l'outil de
 * rapprochement des encours, niveau de perimetre et codes de points de service SAF.
 *
 * <p>Le serveur decide, l'outil affiche : la liste des codes est celle que l'outil a le
 * droit de rapprocher, et {@code rapprochement_recalcul} dit s'il peut relancer le calcul
 * de tout le reseau.</p>
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class RapprochementProfilService {

    public static final String CLAIM_PROFIL = "rapprochement_profil";
    public static final String CLAIM_NIVEAU = "rapprochement_niveau";
    public static final String CLAIM_POINTS = "rapprochement_points";
    public static final String CLAIM_RECALCUL = "rapprochement_recalcul";

    private final UserRepository userRepository;
    private final StructureReseauRepository structureReseauRepository;

    /** Resolution d'un utilisateur : {@code profil == null} => hors outil. */
    public record Resolution(String profil, PerimetreNiveau niveau, AgentProfile profile) {
        public boolean horsOutil() {
            return profil == null;
        }
    }

    public Resolution resolve(Long userId) {
        AgentProfile profile = userRepository.getAgentProfile(userId);
        String profil = RapprochementProfilResolver.profil(
                profile != null ? profile.role() : null,
                profile != null ? profile.service() : null);
        return new Resolution(profil, RapprochementProfilResolver.niveau(profil), profile);
    }

    /**
     * Claims pour l'ID Token et pour {@code /userinfo} : identiques, la liste des codes
     * tenant largement dans un jeton (au plus une delegation, soit une soixantaine de codes).
     * Rien n'est emis pour un utilisateur hors outil.
     */
    public Map<String, Object> claims(Resolution r) {
        Map<String, Object> claims = new LinkedHashMap<>();
        if (r.horsOutil()) {
            return claims;
        }
        AgentProfile p = r.profile();
        List<String> points = RapprochementPerimetreBuilder.points(r.niveau(),
                p == null ? null : p.delegationId(),
                p == null ? null : p.agenceId(),
                p == null ? null : p.pointventeId(),
                structureReseauRepository.getStructure());
        claims.put(CLAIM_PROFIL, r.profil());
        claims.put(CLAIM_NIVEAU, r.niveau().name());
        claims.put(CLAIM_POINTS, points);
        claims.put(CLAIM_RECALCUL, RapprochementProfilResolver.peutRecalculerLeReseau(r.profil()));
        return claims;
    }
}
