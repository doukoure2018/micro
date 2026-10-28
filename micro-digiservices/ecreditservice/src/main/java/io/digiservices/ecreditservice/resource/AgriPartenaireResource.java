package io.digiservices.ecreditservice.resource;

import io.digiservices.clients.agri.AffectationDigiDto;
import io.digiservices.clients.agri.AgentCreditDto;
import io.digiservices.clients.agri.DemandeCreditPartenaireDto;
import io.digiservices.clients.agri.PageDto;
import io.digiservices.ecreditservice.exception.ApiException;
import io.digiservices.ecreditservice.repository.AgriPartenaireRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

/**
 * Perimetre partenaire d'ecreditservice ({@code /ecredit/agri/**}, cle API) : ce que digi sait
 * et que SAF ignore, pour le tableau de bord DE d'AgriScore — l'affectation des credits aux
 * agents (point 8) et les demandes de credit avec leur date de decision (point 9).
 *
 * <p>Appele par agriculteurservice, jamais directement par le partenaire : c'est
 * agriculteurservice qui porte le contrat public {@code /agriculteurs/**}.</p>
 */
@RestController
@RequestMapping("/ecredit/agri")
@RequiredArgsConstructor
@Slf4j
public class AgriPartenaireResource {

    private static final int TAILLE_MAX = 500;
    private static final Set<String> ETAPES = Set.of("RECU", "EN_INSTRUCTION", "ACCORDE", "REFUSE", "ANNULE");

    private final AgriPartenaireRepository repository;

    @GetMapping("/agents")
    public ResponseEntity<List<AgentCreditDto>> agents(@RequestParam("codeAgence") String codeAgence) {
        if (codeAgence == null || codeAgence.isBlank()) {
            throw new ApiException("codeAgence est obligatoire");
        }
        return ResponseEntity.ok(repository.agents(codeAgence.trim()));
    }

    @PostMapping("/affectations")
    public ResponseEntity<List<AffectationDigiDto>> affectations(@RequestBody List<String> cles) {
        if (cles == null || cles.isEmpty()) {
            return ResponseEntity.ok(List.of());
        }
        if (cles.size() > TAILLE_MAX) {
            throw new ApiException("Au plus " + TAILLE_MAX + " cles par appel (recu " + cles.size() + ")");
        }
        return ResponseEntity.ok(repository.affectations(cles));
    }

    @GetMapping("/demandes")
    public ResponseEntity<PageDto<DemandeCreditPartenaireDto>> demandes(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "100") int size,
            @RequestParam(value = "depuis", required = false) String depuis,
            @RequestParam(value = "delegationId", required = false) Long delegationId,
            @RequestParam(value = "codeAgence", required = false) String codeAgence,
            @RequestParam(value = "etape", required = false) String etape) {

        int p = Math.max(page, 0);
        int t = Math.min(Math.max(size, 1), TAILLE_MAX);
        LocalDate date = jour(depuis);
        String e = etape == null || etape.isBlank() ? null : etape.trim().toUpperCase();
        if (e != null && !ETAPES.contains(e)) {
            throw new ApiException("etape inconnue : " + e + " (attendu " + String.join(", ", ETAPES) + ")");
        }
        long total = repository.compterDemandes(date, delegationId, codeAgence, e);
        List<DemandeCreditPartenaireDto> contenu = total == 0 ? List.of()
                : repository.demandes(date, delegationId, codeAgence, e, p * t, t);
        return ResponseEntity.ok(PageDto.of(contenu, p, t, total));
    }

    private static LocalDate jour(String valeur) {
        if (valeur == null || valeur.isBlank()) {
            return null;
        }
        try {
            return LocalDate.parse(valeur.trim());
        } catch (Exception e) {
            throw new ApiException("depuis doit etre une date au format AAAA-MM-JJ (recu « " + valeur + " »)");
        }
    }
}
