package io.digiservices.ecreditservice.service;

import io.digiservices.clients.UserClient;
import io.digiservices.clients.domain.User;
import io.digiservices.ecreditservice.exception.ApiException;
import io.digiservices.ecreditservice.repository.PortefeuillePerimetreRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Set;

/**
 * Perimetre SAF de l'utilisateur connecte, partage par le suivi du portefeuille, l'etat TT1
 * et le signalement de numero de telephone. Source unique : pointvente.code = COD_AGENCIA SAF.
 *
 * <p>DG, SUPER_ADMIN et MANAGER du service DE voient tout le reseau ; le DR sa delegation ;
 * le DA son agence ; l'AGENT_CREDIT son point de service.</p>
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class PerimetreSafService {

    private final UserClient userClient;
    private final PortefeuillePerimetreRepository perimetreRepository;

    /** niveau : RESEAU, DELEGATION, AGENCE ou PS. */
    public record Perimetre(boolean toutReseau, Set<String> codes, String niveau, User user) {

        public boolean couvre(String codAgencia) {
            return toutReseau || codes.contains(codAgencia);
        }

        public String role() {
            return user == null ? null : user.getRole();
        }
    }

    public Perimetre perimetreDe(String uuid) {
        User user = userClient.getUserByUuid(uuid);
        if (user == null) {
            throw new ApiException("Utilisateur non identifie");
        }
        String role = user.getRole();
        if ("DG".equals(role) || "SUPER_ADMIN".equals(role)
                || ("MANAGER".equals(role) && "DE".equalsIgnoreCase(user.getService()))) {
            return new Perimetre(true, Set.of(), "RESEAU", user);
        }
        Set<String> codes;
        String rattachement;
        String niveau;
        if ("DR".equals(role)) {
            codes = perimetreRepository.codesParDelegation(user.getDelegationId());
            rattachement = "votre delegation";
            niveau = "DELEGATION";
        } else if ("DA".equals(role)) {
            codes = perimetreRepository.codesParAgence(user.getAgenceId());
            rattachement = "votre agence";
            niveau = "AGENCE";
        } else if ("AGENT_CREDIT".equals(role)) {
            codes = perimetreRepository.codesParPointVente(user.getPointventeId());
            rattachement = "votre point de service";
            niveau = "PS";
        } else {
            throw new ApiException("Acces reserve aux agents de credit et niveaux de direction");
        }
        if (codes.isEmpty()) {
            log.warn("[PERIMETRE SAF] Perimetre vide pour user={} role={} (pointvente.code non renseigne)",
                    user.getUserId(), role);
            throw new ApiException("Aucun point de service de " + rattachement
                    + " n'est encore relie a SAF — contactez l'administrateur");
        }
        return new Perimetre(false, codes, niveau, user);
    }
}
