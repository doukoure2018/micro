package io.digiservices.userservice.perimetre;

import io.digiservices.userservice.dto.RapprochementProfilResponse;
import io.digiservices.userservice.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Profil et perimetre d'un utilisateur dans l'outil « Rapprochement des encours »
 * (endpoint {@code /agents/{id}/rapprochement}), identiques aux claims du scope
 * {@code rapprochement} emis par le fournisseur d'identite.
 */
@Service
@RequiredArgsConstructor
public class RapprochementProfilService {

    private final StructureReseauRepository structureReseauRepository;

    public RapprochementProfilResponse profil(String agentId, User user) {
        String profil = RapprochementProfilResolver.profil(user.getRole(), user.getService());
        PerimetreNiveau niveau = RapprochementProfilResolver.niveau(profil);
        boolean active = user.isEnabled() && user.isAccountNonLocked() && user.isAccountNonExpired();
        List<String> points = RapprochementPerimetreBuilder.points(niveau,
                user.getDelegationId(), user.getAgenceId(), user.getPointventeId(),
                structureReseauRepository.getStructure());
        return new RapprochementProfilResponse(agentId, profil,
                niveau == null ? null : niveau.name(), points,
                RapprochementProfilResolver.peutRecalculerLeReseau(profil), active);
    }
}
