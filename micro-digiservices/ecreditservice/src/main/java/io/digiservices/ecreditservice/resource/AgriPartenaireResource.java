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
    private final io.digiservices.ecreditservice.service.AgriHistoriqueService historique;

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

    /**
     * Serie mensuelle du portefeuille (point 6). Bornes au format AAAA-MM, incluses.
     *
     * <p>Chaque ligne dit sa provenance : PHOTO (mois observe, encours reel de SAF) ou
     * RECONSTITUTION (mois recalcule, encours nul a dessein).</p>
     */
    @GetMapping("/historique")
    public ResponseEntity<java.util.List<io.digiservices.clients.agri.HistoriqueMensuelDto>> historique(
            @RequestParam("debut") String debut,
            @RequestParam("fin") String fin,
            @RequestParam(value = "codeAgence", required = false) String codeAgence,
            @RequestParam(value = "delegationId", required = false) Long delegationId) {
        LocalDate d = mois(debut, "debut");
        LocalDate f = mois(fin, "fin");
        if (f.isBefore(d)) {
            throw new ApiException("fin doit etre posterieure ou egale a debut");
        }
        return ResponseEntity.ok(historique.serie(d, f, codeAgence, delegationId));
    }

    /** Objectifs de la Direction de l'exploitation pour une annee (point 7). */
    @GetMapping("/objectifs")
    public ResponseEntity<java.util.List<io.digiservices.clients.agri.ObjectifDto>> objectifs(
            @RequestParam("annee") int annee,
            @RequestParam(value = "codeAgence", required = false) String codeAgence,
            @RequestParam(value = "delegationId", required = false) Long delegationId) {
        if (annee < 2000 || annee > 2100) {
            throw new ApiException("annee invalide : " + annee);
        }
        return ResponseEntity.ok(historique.objectifs(annee, codeAgence, delegationId));
    }

    /**
     * Reconstitution des mois passes. <b>Action de maintenance interne</b>, a lancer une fois :
     * elle n'est jamais exposee par agriculteurservice, donc hors de portee du partenaire. Ne
     * reecrit aucun mois deja photographie.
     */
    @PostMapping("/historique/reprise")
    public ResponseEntity<java.util.Map<String, String>> reprise(
            @RequestParam(value = "mois", required = false) Integer mois) {
        String resume = historique.reprendre(mois);
        return ResponseEntity.ok(java.util.Map.of("resultat", resume));
    }

    /** Photographie un mois precis et le range (maintenance). */
    @PostMapping("/historique/photographier")
    public ResponseEntity<java.util.Map<String, Object>> photographier(@RequestParam("mois") String mois) {
        LocalDate m = mois(mois, "mois");
        return ResponseEntity.ok(java.util.Map.of("mois", m.toString(), "pointsDeVente", historique.photographier(m)));
    }

    private static LocalDate mois(String valeur, String nom) {
        try {
            String v = valeur.trim();
            return LocalDate.parse(v.length() == 7 ? v + "-01" : v).withDayOfMonth(1);
        } catch (Exception e) {
            throw new ApiException(nom + " doit etre un mois au format AAAA-MM (recu « " + valeur + " »)");
        }
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
