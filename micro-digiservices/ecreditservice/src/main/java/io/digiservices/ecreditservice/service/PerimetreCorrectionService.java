package io.digiservices.ecreditservice.service;

import io.digiservices.clients.UserClient;
import io.digiservices.clients.domain.User;
import io.digiservices.ecreditservice.exception.ApiException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * Perimetre de consultation des statistiques d'assainissement.
 *
 * <p>Le directeur d'agence ne voit que son agence, le delegue regional que sa delegation.
 * La direction generale, la Direction de l'Exploitation, le societariat, l'inspection et
 * l'administrateur voient tout le reseau. Le filtrage porte sur l'assiette des fiches : les
 * totaux affiches ne contiennent donc que ce que l'utilisateur a le droit de voir, a tous
 * les niveaux de la descente.</p>
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class PerimetreCorrectionService {

    private final UserClient userClient;

    /**
     * Bornes a appliquer aux requetes : {@code null} signifie « pas de restriction ».
     * Au plus une des deux est renseignee.
     */
    public record Perimetre(Long delegationId, Long agenceId, String role) {

        public boolean toutReseau() {
            return delegationId == null && agenceId == null;
        }
    }

    public Perimetre perimetreDe(String uuid) {
        User user = userClient.getUserByUuid(uuid);
        if (user == null) {
            throw new ApiException("Utilisateur non identifie");
        }
        String role = user.getRole();
        if ("DA".equals(role) || "RA".equals(role)) {
            if (user.getAgenceId() == null) {
                throw new ApiException("Votre compte n'est rattache a aucune agence — contactez l'administrateur");
            }
            return new Perimetre(null, user.getAgenceId(), role);
        }
        if ("DR".equals(role)) {
            if (user.getDelegationId() == null) {
                throw new ApiException("Votre compte n'est rattache a aucune delegation — contactez l'administrateur");
            }
            return new Perimetre(user.getDelegationId(), null, role);
        }
        // DG, SUPER_ADMIN, MANAGER (DE, Societariat, DI...) et les autres profils : tout le reseau
        return new Perimetre(null, null, role);
    }
}
