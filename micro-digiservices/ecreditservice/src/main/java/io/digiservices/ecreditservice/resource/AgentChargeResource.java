package io.digiservices.ecreditservice.resource;

import io.digiservices.clients.UserClient;
import io.digiservices.clients.domain.User;
import io.digiservices.ecreditservice.domain.Response;
import io.digiservices.ecreditservice.exception.ApiException;
import io.digiservices.ecreditservice.repository.AgentChargeRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import static io.digiservices.ecreditservice.utils.RequestUtils.getResponse;
import static org.springframework.http.HttpStatus.OK;

/**
 * Charge d'un agent (rotation, lot 1) : ce qu'il porte en cours avant qu'on le change de point de
 * service. Ouvert a ceux qui decident des rotations et des affectations : RA, DA, DR, DG,
 * SUPER_ADMIN et la Direction de l'Exploitation.
 */
@RestController
@RequestMapping("/ecredit/agents")
@RequiredArgsConstructor
public class AgentChargeResource {

    private static final Set<String> ROLES = Set.of("RA", "DA", "DR", "DG", "SUPER_ADMIN");

    private final AgentChargeRepository repository;
    private final UserClient userClient;

    /** Dossiers en cours portes par un agent parti ou desactive : DA (son agence), DR (sa delegation), reseau (tout). */
    @GetMapping("/dossiers-a-reattribuer")
    public ResponseEntity<Response> dossiersAReattribuer(@NotNull Authentication authentication, HttpServletRequest request) {
        User u = userClient.getUserByUuid(authentication.getName());
        boolean de = "MANAGER".equals(u.getRole()) && "DE".equalsIgnoreCase(u.getService());
        List<Map<String, Object>> liste;
        if ("DA".equals(u.getRole())) {
            if (u.getAgenceId() == null) throw new ApiException("Compte non rattache a une agence");
            liste = repository.dossiersOrphelins(u.getAgenceId(), null);
        } else if ("DR".equals(u.getRole())) {
            if (u.getDelegationId() == null) throw new ApiException("Compte non rattache a une delegation");
            liste = repository.dossiersOrphelins(null, u.getDelegationId());
        } else if (de || "DG".equals(u.getRole()) || "SUPER_ADMIN".equals(u.getRole())) {
            liste = repository.dossiersOrphelins(null, null);
        } else {
            throw new ApiException("Acces reserve aux directeurs d'agence, regionaux et a la Direction de l'Exploitation");
        }
        return ResponseEntity.ok(getResponse(request, Map.of("dossiers", liste, "peutReattribuer", "DA".equals(u.getRole())),
                liste.size() + " dossier(s) a reattribuer", OK));
    }

    @GetMapping("/{userId}/charge")
    public ResponseEntity<Response> charge(@NotNull Authentication authentication, @PathVariable("userId") Long userId,
                                           HttpServletRequest request) {
        User appelant = userClient.getUserByUuid(authentication.getName());
        boolean de = "MANAGER".equals(appelant.getRole()) && "DE".equalsIgnoreCase(appelant.getService());
        if (appelant.getRole() == null || (!ROLES.contains(appelant.getRole()) && !de)) {
            throw new ApiException("Acces reserve aux responsables d'agence, directeurs et administrateurs");
        }
        Map<String, Object> agent = repository.agent(userId);
        if (agent == null) {
            throw new ApiException("Agent introuvable");
        }
        // Le DA ne consulte que les agents de son agence.
        if ("DA".equals(appelant.getRole()) && (appelant.getAgenceId() == null || !appelant.getAgenceId().equals(agent.get("agence_id")))) {
            throw new ApiException("Cet agent n'est pas rattache a votre agence");
        }
        List<Map<String, Object>> credit = repository.dossiersCredit(userId);
        List<Map<String, Object>> accueil = repository.dossiersAccueil(userId);
        Map<String, Object> portefeuille = repository.portefeuille(userId);
        List<String> designations = repository.designations(userId);
        long nbCredit = credit.stream().mapToLong(m -> ((Number) m.get("nb")).longValue()).sum();
        long nbAccueil = accueil.stream().mapToLong(m -> ((Number) m.get("nb")).longValue()).sum();
        long nbPortefeuille = portefeuille.get("nb") == null ? 0 : ((Number) portefeuille.get("nb")).longValue();

        Map<String, Object> charge = new LinkedHashMap<>();
        charge.put("agent", agent);
        charge.put("dossiersCredit", credit);
        charge.put("nbDossiersCredit", nbCredit);
        charge.put("dossiersAccueil", accueil);
        charge.put("nbDossiersAccueil", nbAccueil);
        charge.put("portefeuille", portefeuille);
        charge.put("nbPortefeuille", nbPortefeuille);
        charge.put("designations", designations);
        charge.put("dossiers", repository.listeDossiers(userId));
        charge.put("vide", nbCredit == 0 && nbAccueil == 0 && nbPortefeuille == 0 && designations.isEmpty());
        return ResponseEntity.ok(getResponse(request, Map.of("charge", charge), "Charge de l'agent", OK));
    }
}
