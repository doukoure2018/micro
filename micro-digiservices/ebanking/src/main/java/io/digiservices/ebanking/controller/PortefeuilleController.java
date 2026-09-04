package io.digiservices.ebanking.controller;

import io.digiservices.clients.agri.PageDto;
import io.digiservices.clients.portefeuille.AgenceSafDto;
import io.digiservices.clients.portefeuille.PortefeuilleCreditDto;
import io.digiservices.clients.portefeuille.PortefeuilleEcheanceDto;
import io.digiservices.clients.portefeuille.PortefeuilleIndicateursDto;
import io.digiservices.ebanking.exception.BlogAPIException;
import io.digiservices.ebanking.repository.PortefeuilleRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Endpoints internes du suivi du portefeuille credits SAF (phase 1), consommes par
 * ecreditservice via Feign. Lecture seule sur la datasource primary.
 *
 * <p>Ne PAS exposer ces routes au gateway public : la securite metier (roles
 * DA/DR/DE/DG) est portee par ecreditservice.</p>
 */
@RestController
@RequestMapping("/ebanking/portefeuille")
@AllArgsConstructor
@Slf4j
public class PortefeuilleController {

    private static final int MAX_PAGE_SIZE = 100;

    private final PortefeuilleRepository repository;

    @GetMapping("/agences")
    public ResponseEntity<List<AgenceSafDto>> getAgences() {
        return ResponseEntity.ok(repository.findAgences());
    }

    @GetMapping("/credits")
    public ResponseEntity<PageDto<PortefeuilleCreditDto>> getCredits(
            @RequestParam(name = "codAgencia") String codAgencia,
            @RequestParam(name = "statut", defaultValue = "actifs") String statut,
            @RequestParam(name = "tranche", required = false) String tranche,
            @RequestParam(name = "recherche", required = false) String recherche,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "20") int size) {
        if (page < 0 || size < 1 || size > MAX_PAGE_SIZE) {
            throw new BlogAPIException(HttpStatus.BAD_REQUEST,
                    "Pagination invalide (page >= 0, 1 <= size <= " + MAX_PAGE_SIZE + ")");
        }
        boolean seulementRetard = switch (statut == null ? "" : statut.trim().toLowerCase()) {
            case "retard" -> true;
            case "", "actifs" -> false;
            default -> throw new BlogAPIException(HttpStatus.BAD_REQUEST,
                    "Le parametre 'statut' doit valoir 'actifs' ou 'retard'");
        };
        int[] bornes = bornesTranche(tranche);
        Integer retardMin = bornes != null ? bornes[0] : null;
        Integer retardMax = bornes != null && bornes[1] > 0 ? bornes[1] : null;
        long total = repository.countCredits(codAgencia, seulementRetard, retardMin, retardMax, recherche);
        List<PortefeuilleCreditDto> content =
                repository.findCredits(codAgencia, seulementRetard, retardMin, retardMax, recherche, page * size, size);
        return ResponseEntity.ok(PageDto.of(content, page, size, total));
    }

    /**
     * Tranches de retard (PAR) : 1-30, 31-60, 61-90, 91-120, 120+ (jours de retard
     * de la plus ancienne echeance impayee). null = pas de filtre de tranche.
     */
    private static int[] bornesTranche(String tranche) {
        if (tranche == null || tranche.isBlank()) return null;
        return switch (tranche.trim()) {
            case "1-30" -> new int[]{1, 30};
            case "31-60" -> new int[]{31, 60};
            case "61-90" -> new int[]{61, 90};
            case "91-120" -> new int[]{91, 120};
            // "120+" devient "120 " via Feign (le '+' est encode en espace) puis "120" apres trim :
            // on accepte toutes les formes, la valeur canonique cote frontend est "plus120"
            case "120+", "+120", "120", "plus120" -> new int[]{121, 0};
            default -> throw new BlogAPIException(HttpStatus.BAD_REQUEST,
                    "Le parametre 'tranche' doit valoir 1-30, 31-60, 61-90, 91-120 ou 120+");
        };
    }

    @GetMapping("/indicateurs")
    public ResponseEntity<PortefeuilleIndicateursDto> getIndicateurs(
            @RequestParam(name = "codAgencia") String codAgencia,
            @RequestParam(name = "statut", defaultValue = "actifs") String statut,
            @RequestParam(name = "tranche", required = false) String tranche,
            @RequestParam(name = "recherche", required = false) String recherche) {
        boolean seulementRetard = "retard".equalsIgnoreCase(statut);
        int[] bornes = bornesTranche(tranche);
        Integer retardMin = bornes != null ? bornes[0] : null;
        Integer retardMax = bornes != null && bornes[1] > 0 ? bornes[1] : null;
        return ResponseEntity.ok(repository.indicateurs(codAgencia, seulementRetard, retardMin, retardMax, recherche));
    }

    // ==================== Alertes (phase 3) ====================

    @GetMapping("/echeances-avenir")
    public ResponseEntity<List<io.digiservices.clients.portefeuille.EcheanceAvenirDto>> getEcheancesAvenir(
            @RequestParam(name = "joursAvant", defaultValue = "3") int joursAvant) {
        if (joursAvant < 0 || joursAvant > 30) {
            throw new BlogAPIException(HttpStatus.BAD_REQUEST, "joursAvant doit etre entre 0 et 30");
        }
        return ResponseEntity.ok(repository.findEcheancesAvenir(joursAvant));
    }

    @GetMapping("/nouveaux-impayes")
    public ResponseEntity<List<io.digiservices.clients.portefeuille.NouvelImpayeDto>> getNouveauxImpayes(
            @RequestParam(name = "depuisJours", defaultValue = "1") int depuisJours) {
        if (depuisJours < 1 || depuisJours > 31) {
            throw new BlogAPIException(HttpStatus.BAD_REQUEST, "depuisJours doit etre entre 1 et 31");
        }
        return ResponseEntity.ok(repository.findNouveauxImpayes(depuisJours));
    }

    @GetMapping("/indicateurs-reseau")
    public ResponseEntity<List<io.digiservices.clients.portefeuille.IndicateursAgenceDto>> getIndicateursReseau() {
        return ResponseEntity.ok(repository.indicateursReseau());
    }

    @GetMapping("/credits/{codAgencia}/{numCredito}/echeancier")
    public ResponseEntity<List<PortefeuilleEcheanceDto>> getEcheancier(
            @PathVariable("codAgencia") String codAgencia,
            @PathVariable("numCredito") Long numCredito) {
        return ResponseEntity.ok(repository.findEcheancier(codAgencia, numCredito));
    }
}
