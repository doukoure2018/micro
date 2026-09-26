package io.digiservices.ecreditservice.resource;

import io.digiservices.clients.EbankingPortefeuilleClient;
import io.digiservices.clients.UserClient;
import io.digiservices.clients.domain.User;
import io.digiservices.clients.portefeuille.AgenceSafDto;
import io.digiservices.clients.portefeuille.EcheancePeriodeDto;
import io.digiservices.clients.portefeuille.EcheancesIndicateursDto;
import io.digiservices.clients.portefeuille.PortefeuilleCreditDto;
import io.digiservices.ecreditservice.utils.PortefeuilleExcelUtils;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import io.digiservices.ecreditservice.domain.Response;
import io.digiservices.ecreditservice.exception.ApiException;
import io.digiservices.ecreditservice.repository.PortefeuillePerimetreRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.Set;

import static io.digiservices.ecreditservice.utils.RequestUtils.getResponse;
import static org.springframework.http.HttpStatus.OK;

/**
 * Suivi du portefeuille credits SAF : vue lecture seule des credits mis en place dans
 * SAF2000, avec indicateurs (encours, PAR 30/90, impayes) et echeancier detaille.
 * Donnees servies par ebanking (/ebanking/portefeuille/**).
 *
 * <p><b>Perimetre impose cote serveur (pointvente.code = COD_AGENCIA SAF)</b> :
 * AGENT_CREDIT = son point de service ; DA = les PS de son agence ; DR = les PS de sa
 * delegation ; DG, MANAGER du service DE et SUPER_ADMIN = tout le reseau. Chaque
 * endpoint verifie l'appartenance du code agence demande au perimetre.</p>
 */
@RestController
@RequestMapping("/ecredit/portefeuille")
@AllArgsConstructor
@Slf4j
public class PortefeuilleResource {

    private final EbankingPortefeuilleClient portefeuilleClient;
    private final UserClient userClient;
    private final PortefeuillePerimetreRepository perimetreRepository;

    @GetMapping("/agences")
    public ResponseEntity<Response> getAgences(@NotNull Authentication authentication, HttpServletRequest request) {
        Perimetre perimetre = perimetreDe(authentication);
        List<AgenceSafDto> agences = portefeuilleClient.getAgences();
        if (!perimetre.toutReseau()) {
            agences = agences.stream().filter(a -> perimetre.codes().contains(a.getCodAgencia())).toList();
        }
        return ResponseEntity.ok(getResponse(request,
                Map.of("agences", agences),
                "Agences SAF du perimetre", OK));
    }

    @GetMapping("/credits")
    public ResponseEntity<Response> getCredits(
            @NotNull Authentication authentication,
            @RequestParam(name = "codAgencia") String codAgencia,
            @RequestParam(name = "statut", defaultValue = "actifs") String statut,
            @RequestParam(name = "tranche", required = false) String tranche,
            @RequestParam(name = "recherche", required = false) String recherche,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "20") int size,
            HttpServletRequest request) {
        verifierAcces(authentication, codAgencia);
        return ResponseEntity.ok(getResponse(request,
                Map.of("credits", portefeuilleClient.getCredits(codAgencia, statut, tranche, recherche, page, size)),
                "Portefeuille credits SAF", OK));
    }

    @GetMapping("/indicateurs")
    public ResponseEntity<Response> getIndicateurs(
            @NotNull Authentication authentication,
            @RequestParam(name = "codAgencia") String codAgencia,
            @RequestParam(name = "statut", defaultValue = "actifs") String statut,
            @RequestParam(name = "tranche", required = false) String tranche,
            @RequestParam(name = "recherche", required = false) String recherche,
            HttpServletRequest request) {
        verifierAcces(authentication, codAgencia);
        return ResponseEntity.ok(getResponse(request,
                Map.of("indicateurs", portefeuilleClient.getIndicateurs(codAgencia, statut, tranche, recherche)),
                "Indicateurs du portefeuille", OK));
    }

    @GetMapping("/credits/{codAgencia}/{numCredito}/echeancier")
    public ResponseEntity<Response> getEcheancier(
            @NotNull Authentication authentication,
            @PathVariable("codAgencia") String codAgencia,
            @PathVariable("numCredito") Long numCredito,
            HttpServletRequest request) {
        verifierAcces(authentication, codAgencia);
        return ResponseEntity.ok(getResponse(request,
                Map.of("echeancier", portefeuilleClient.getEcheancier(codAgencia, numCredito)),
                "Echeancier du credit", OK));
    }

    /**
     * Export Excel de la selection courante (agence + filtre statut + recherche) :
     * feuille Synthese (indicateurs) + feuille Credits (toutes les lignes, pas
     * seulement la page affichee). Meme verification de perimetre que la page.
     */
    @GetMapping("/export")
    public ResponseEntity<byte[]> exporter(
            @NotNull Authentication authentication,
            @RequestParam(name = "codAgencia") String codAgencia,
            @RequestParam(name = "statut", defaultValue = "actifs") String statut,
            @RequestParam(name = "tranche", required = false) String tranche,
            @RequestParam(name = "recherche", required = false) String recherche) {
        verifierAcces(authentication, codAgencia);
        try {
            String libelle = portefeuilleClient.getAgences().stream()
                    .filter(a -> codAgencia.equals(a.getCodAgencia()))
                    .map(AgenceSafDto::getDesAgencia)
                    .findFirst().orElse(codAgencia);
            var indicateurs = portefeuilleClient.getIndicateurs(codAgencia, statut, tranche, recherche);

            // Recuperation complete par pages de 100, bornee a 10 000 lignes
            java.util.List<PortefeuilleCreditDto> credits = new java.util.ArrayList<>();
            int page = 0;
            while (credits.size() < EXPORT_MAX_LIGNES) {
                var lot = portefeuilleClient.getCredits(codAgencia, statut, tranche, recherche, page, 100);
                if (lot.getContent() == null || lot.getContent().isEmpty()) break;
                credits.addAll(lot.getContent());
                if (!lot.isHasNext()) break;
                page++;
            }
            if (credits.size() > EXPORT_MAX_LIGNES) {
                credits = credits.subList(0, EXPORT_MAX_LIGNES);
                log.warn("[PORTEFEUILLE] Export tronque a {} lignes pour l'agence {}", EXPORT_MAX_LIGNES, codAgencia);
            }

            String filtreExport = "retard".equals(statut) ? "retard" : "actifs";
            if (tranche != null && !tranche.isBlank()) {
                filtreExport += " — tranche " + ("plus120".equals(tranche) ? "+120" : tranche) + " jours";
            }
            byte[] contenu = PortefeuilleExcelUtils.construireClasseur(
                    libelle, codAgencia, filtreExport, recherche, indicateurs, credits);

            String nomFichier = "portefeuille_"
                    + libelle.replaceAll("[^A-Za-z0-9]+", "_")
                    + "_" + java.time.LocalDate.now().format(java.time.format.DateTimeFormatter.BASIC_ISO_DATE)
                    + ".xlsx";
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType(
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
            headers.setContentDispositionFormData("attachment", nomFichier);
            headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");
            headers.setContentLength(contenu.length);
            log.info("[PORTEFEUILLE] Export Excel {} : {} credits, {} octets", nomFichier, credits.size(), contenu.length);
            return ResponseEntity.ok().headers(headers).body(contenu);
        } catch (java.io.IOException e) {
            log.error("[PORTEFEUILLE] Echec de generation Excel : {}", e.getMessage(), e);
            throw new ApiException("Echec de la generation du fichier Excel");
        }
    }

    private static final int EXPORT_MAX_LIGNES = 10000;

    // ==================== TT1 (lot 1) : echeances de la periode ====================

    /**
     * Echeances tombant dans [du, au] sur le perimetre de l'utilisateur : un code agence SAF
     * precis (verifie), ou, sans codAgencia, tous les points de service de son perimetre
     * (agent = son PS, DA = son agence, DR = sa delegation, DE / DG = tout le reseau).
     */
    @GetMapping("/echeances")
    public ResponseEntity<Response> getEcheances(
            @NotNull Authentication authentication,
            @RequestParam(name = "du") String du,
            @RequestParam(name = "au") String au,
            @RequestParam(name = "codAgencia", required = false) String codAgencia,
            @RequestParam(name = "etat", defaultValue = "toutes") String etat,
            @RequestParam(name = "recherche", required = false) String recherche,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "50") int size,
            HttpServletRequest request) {
        List<String> codes = codesDuPerimetre(authentication, codAgencia);
        return ResponseEntity.ok(getResponse(request,
                Map.of("echeances", portefeuilleClient.getEcheancesPeriode(codes, du, au, etat, recherche, page, size)),
                "Echeances de la periode", OK));
    }

    @GetMapping("/echeances/indicateurs")
    public ResponseEntity<Response> getEcheancesIndicateurs(
            @NotNull Authentication authentication,
            @RequestParam(name = "du") String du,
            @RequestParam(name = "au") String au,
            @RequestParam(name = "codAgencia", required = false) String codAgencia,
            @RequestParam(name = "etat", defaultValue = "toutes") String etat,
            @RequestParam(name = "recherche", required = false) String recherche,
            HttpServletRequest request) {
        List<String> codes = codesDuPerimetre(authentication, codAgencia);
        return ResponseEntity.ok(getResponse(request,
                Map.of("indicateurs", portefeuilleClient.getEcheancesPeriodeIndicateurs(codes, du, au, etat, recherche)),
                "Indicateurs des echeances de la periode", OK));
    }

    /** Export Excel de l'etat TT1 : synthese + toutes les echeances (borne a EXPORT_MAX_LIGNES). */
    @GetMapping("/echeances/export")
    public ResponseEntity<byte[]> exporterEcheances(
            @NotNull Authentication authentication,
            @RequestParam(name = "du") String du,
            @RequestParam(name = "au") String au,
            @RequestParam(name = "codAgencia", required = false) String codAgencia,
            @RequestParam(name = "etat", defaultValue = "toutes") String etat,
            @RequestParam(name = "recherche", required = false) String recherche) {
        List<String> codes = codesDuPerimetre(authentication, codAgencia);
        try {
            String perimetre;
            if (codAgencia != null && !codAgencia.isBlank()) {
                perimetre = portefeuilleClient.getAgences().stream()
                        .filter(a -> codAgencia.equals(a.getCodAgencia()))
                        .map(AgenceSafDto::getDesAgencia).findFirst().orElse(codAgencia);
            } else {
                perimetre = codes.size() + " point(s) de service";
            }
            EcheancesIndicateursDto indicateurs = portefeuilleClient.getEcheancesPeriodeIndicateurs(codes, du, au, etat, recherche);
            java.util.List<EcheancePeriodeDto> lignes = new java.util.ArrayList<>();
            int page = 0;
            while (lignes.size() < EXPORT_MAX_LIGNES) {
                var lot = portefeuilleClient.getEcheancesPeriode(codes, du, au, etat, recherche, page, 100);
                if (lot.getContent() == null || lot.getContent().isEmpty()) break;
                lignes.addAll(lot.getContent());
                if (!lot.isHasNext()) break;
                page++;
            }
            if (lignes.size() > EXPORT_MAX_LIGNES) {
                lignes = lignes.subList(0, EXPORT_MAX_LIGNES);
                log.warn("[PORTEFEUILLE] Export TT1 tronque a {} lignes", EXPORT_MAX_LIGNES);
            }
            java.time.LocalDate dDu = java.time.LocalDate.parse(du);
            java.time.LocalDate dAu = java.time.LocalDate.parse(au);
            byte[] contenu = PortefeuilleExcelUtils.construireClasseurEcheances(perimetre, dDu, dAu, etat, recherche, indicateurs, lignes);
            String nomFichier = "echeances_TT1_" + du + "_" + au
                    + (codAgencia != null && !codAgencia.isBlank() ? "_" + codAgencia : "") + ".xlsx";
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
            headers.setContentDispositionFormData("attachment", nomFichier);
            headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");
            headers.setContentLength(contenu.length);
            log.info("[PORTEFEUILLE] Export TT1 {} : {} echeances, {} octets", nomFichier, lignes.size(), contenu.length);
            return ResponseEntity.ok().headers(headers).body(contenu);
        } catch (java.io.IOException e) {
            log.error("[PORTEFEUILLE] Echec de generation Excel TT1 : {}", e.getMessage(), e);
            throw new ApiException("Echec de la generation du fichier Excel");
        }
    }

    /** Codes SAF interrogeables : un code verifie, ou tout le perimetre de l'utilisateur. */
    private List<String> codesDuPerimetre(Authentication authentication, String codAgencia) {
        Perimetre perimetre = perimetreDe(authentication);
        if (codAgencia != null && !codAgencia.isBlank()) {
            if (!perimetre.toutReseau() && !perimetre.codes().contains(codAgencia)) {
                throw new ApiException("Cette agence SAF est hors de votre perimetre");
            }
            return List.of(codAgencia);
        }
        if (perimetre.toutReseau()) {
            List<String> tous = portefeuilleClient.getAgences().stream().map(AgenceSafDto::getCodAgencia).toList();
            if (tous.isEmpty()) {
                throw new ApiException("Aucune agence SAF disponible");
            }
            return tous;
        }
        return List.copyOf(perimetre.codes());
    }

    // ==================== Perimetre ====================

    private record Perimetre(boolean toutReseau, Set<String> codes) {
    }

    private void verifierAcces(Authentication authentication, String codAgencia) {
        Perimetre perimetre = perimetreDe(authentication);
        if (!perimetre.toutReseau() && !perimetre.codes().contains(codAgencia)) {
            throw new ApiException("Cette agence SAF est hors de votre perimetre");
        }
    }

    /**
     * Perimetre de l'utilisateur connecte : DG / MANAGER-DE / SUPER_ADMIN = tout le
     * reseau ; DR = PS de sa delegation ; DA = PS de son agence ; AGENT_CREDIT = son PS.
     * Un rattachement sans code SAF (colonne V129 non renseignee) est signale clairement.
     */
    private Perimetre perimetreDe(Authentication authentication) {
        User user = userClient.getUserByUuid(authentication.getName());
        if (user == null) {
            throw new ApiException("Utilisateur non identifie");
        }
        String role = user.getRole();
        if ("DG".equals(role) || "SUPER_ADMIN".equals(role)
                || ("MANAGER".equals(role) && "DE".equalsIgnoreCase(user.getService()))) {
            return new Perimetre(true, Set.of());
        }
        Set<String> codes;
        String rattachement;
        if ("DR".equals(role)) {
            codes = perimetreRepository.codesParDelegation(user.getDelegationId());
            rattachement = "votre delegation";
        } else if ("DA".equals(role)) {
            codes = perimetreRepository.codesParAgence(user.getAgenceId());
            rattachement = "votre agence";
        } else if ("AGENT_CREDIT".equals(role)) {
            codes = perimetreRepository.codesParPointVente(user.getPointventeId());
            rattachement = "votre point de service";
        } else {
            throw new ApiException("Acces reserve aux agents de credit et niveaux de direction");
        }
        if (codes.isEmpty()) {
            log.warn("[PORTEFEUILLE] Perimetre vide pour user={} role={} (pointvente.code non renseigne)",
                    user.getUserId(), role);
            throw new ApiException("Aucun point de service de " + rattachement
                    + " n'est encore relie a SAF — contactez l'administrateur");
        }
        return new Perimetre(false, codes);
    }
}
