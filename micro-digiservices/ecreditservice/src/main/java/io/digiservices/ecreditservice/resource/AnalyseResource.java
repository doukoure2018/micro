package io.digiservices.ecreditservice.resource;

import io.digiservices.clients.UserClient;
import io.digiservices.ecreditservice.domain.Response;
import io.digiservices.ecreditservice.dto.*;
import io.digiservices.ecreditservice.service.AnalyseService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.URI;
import java.util.List;
import java.util.Map;

import static io.digiservices.ecreditservice.utils.RequestUtils.*;
import static java.util.Collections.emptyMap;
import static org.springframework.http.HttpStatus.*;
import static org.springframework.http.ResponseEntity.*;

@RestController
@AllArgsConstructor
@RequestMapping("/ecredit")
@Slf4j
public class AnalyseResource {

    private final AnalyseService analyseService;

    private final UserClient userClient;

    // ========== CLIENTS ==========
    @PostMapping("/clients")
    public ResponseEntity<Response> createClient(
            @NotNull Authentication authentication,
            @RequestBody ClientDto clientDto,
            HttpServletRequest request) {
        try {
            var client = analyseService.createClient(clientDto);
            return created(getUri()).body(
                    getResponse(request, Map.of("client", client),
                            "Client créé avec succès", CREATED)
            );
        } catch (Exception e) {
            log.error("Erreur création client: ", e);
            return badRequest().body(
                    handleErrorResponse("Error message", e.getMessage(), request, BAD_REQUEST)
            );
        }
    }

    @GetMapping("/clients")
    public ResponseEntity<Response> getAllClients(
            @NotNull Authentication authentication,
            @RequestParam(name = "search", required = false) String search,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size,
            @RequestParam(name = "sort", defaultValue = "nom,ASC") String sort,
            HttpServletRequest request) {
        try {
            String[] sortParams = sort.split(",");
            Sort.Direction direction = sortParams.length > 1 ?
                    Sort.Direction.fromString(sortParams[1]) : Sort.Direction.ASC;
            Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortParams[0]));

            Page<ClientDto> clientsPage = analyseService.getAllClients(search, pageable);

            // ✅ OPTION 1 : Retourner seulement le contenu (liste)
            return ok(getResponse(request, Map.of("clients", clientsPage.getContent()),
                    "Liste des clients récupérée", OK));

            // ✅ OPTION 2 : Retourner l'objet complet avec métadonnées
        /*
        Map<String, Object> responseData = new HashMap<>();
        responseData.put("clients", clientsPage.getContent());
        responseData.put("totalElements", clientsPage.getTotalElements());
        responseData.put("totalPages", clientsPage.getTotalPages());
        responseData.put("currentPage", clientsPage.getNumber());
        responseData.put("pageSize", clientsPage.getSize());

        return ok(getResponse(request, responseData,
                "Liste des clients récupérée", OK));
        */
        } catch (Exception e) {
            log.error("Erreur récupération clients: ", e);
            return status(INTERNAL_SERVER_ERROR).body(
                    handleErrorResponse("Error message", e.getMessage(), request, INTERNAL_SERVER_ERROR)
            );
        }
    }

    @GetMapping("/clients/{id}")
    public ResponseEntity<Response> getClientById(
            @NotNull Authentication authentication,
            @PathVariable(name = "id") Long id,
            HttpServletRequest request) {
        try {
            var client = analyseService.getClientById(id);
            return ok(getResponse(request, Map.of("client", client),
                    "Client récupéré avec succès", OK));
        } catch (Exception e) {
            log.error("Erreur récupération client {}: ", id, e);
            return status(NOT_FOUND).body(
                    handleErrorResponse("Error message", e.getMessage(), request, BAD_REQUEST)
            );
        }
    }

    @PutMapping("/clients/{id}")
    public ResponseEntity<Response> updateClient(
            @NotNull Authentication authentication,
            @PathVariable(name = "id") Long id,
            @RequestBody ClientDto clientDto,
            HttpServletRequest request) {
        try {
            var client = analyseService.updateClient(id, clientDto);
            return ok(getResponse(request, Map.of("client", client),
                    "Client mis à jour avec succès", OK));
        } catch (Exception e) {
            log.error("Erreur mise à jour client {}: ", id, e);
            return badRequest().body(
                    handleErrorResponse("Error message", e.getMessage(), request, BAD_REQUEST)
            );
        }
    }

    @DeleteMapping("/clients/{id}")
    public ResponseEntity<Response> deleteClient(
            @NotNull Authentication authentication,
            @PathVariable(name = "id") Long id,
            HttpServletRequest request) {
        try {
            analyseService.deleteClient(id);
            return ok(getResponse(request, emptyMap(),
                    "Client supprimé avec succès", OK));
        } catch (Exception e) {
            log.error("Erreur suppression client {}: ", id, e);
            return badRequest().body(
                    handleErrorResponse("Error message", e.getMessage(), request, BAD_REQUEST)
            );
        }
    }

    // ========== DOSSIERS CRÉDIT ==========
    @PostMapping("/dossiers")
    public ResponseEntity<Response> createDossier(
            @NotNull Authentication authentication,
            @RequestBody DossierCreditDto dto,
            HttpServletRequest request) {
        try {
            var dossier = analyseService.createDossier(dto);
            return created(getUri()).body(
                    getResponse(request, Map.of("dossier", dossier),
                            "Dossier de crédit créé avec succès", CREATED)
            );
        } catch (Exception e) {
            log.error("Erreur création dossier: ", e);
            return badRequest().body(
                    handleErrorResponse("Error message", e.getMessage(), request, BAD_REQUEST)
            );
        }
    }
    @GetMapping("/dossiers")
    public ResponseEntity<Response> getAllDossiers(
            @NotNull Authentication authentication,
            @RequestParam(required = false) String statut,
            Pageable pageable,
            HttpServletRequest request) {
        try {
            var dossiers = analyseService.getAllDossiers(statut, pageable);
            return ok(getResponse(request, Map.of("dossiers", dossiers),
                    "Liste des dossiers récupérée", OK));
        } catch (Exception e) {
            log.error("Erreur récupération dossiers: ", e);
            return status(INTERNAL_SERVER_ERROR).body(
                    handleErrorResponse("Error message", e.getMessage(), request, BAD_REQUEST)
            );
        }
    }

    @GetMapping("/dossiers/{id}")
    public ResponseEntity<Response> getDossierById(
            @NotNull Authentication authentication,
            @PathVariable(name = "id") Long id,
            HttpServletRequest request) {
        try {
            var dossier = analyseService.getDossierById(id);
            return ok(getResponse(request, Map.of("dossier", dossier),
                    "Dossier récupéré avec succès", OK));
        } catch (Exception e) {
            log.error("Erreur récupération dossier {}: ", id, e);
            return status(NOT_FOUND).body(
                    handleErrorResponse("Error message", e.getMessage(), request, BAD_REQUEST)
            );
        }
    }

    @GetMapping("/clients/{clientId}/dossiers")
    public ResponseEntity<Response> getDossiersByClient(
            @NotNull Authentication authentication,
            @PathVariable(name = "clientId") Long clientId,
            HttpServletRequest request) {
        try {
            var dossiers = analyseService.getDossiersByClient(clientId);
            return ok(getResponse(request, Map.of("dossiers", dossiers),
                    "Dossiers du client récupérés", OK));
        } catch (Exception e) {
            log.error("Erreur récupération dossiers client {}: ", clientId, e);
            return status(INTERNAL_SERVER_ERROR).body(
                    handleErrorResponse("Error message", e.getMessage(), request, BAD_REQUEST)
            );
        }
    }

    @PutMapping("/dossiers/{id}/statut")
    public ResponseEntity<Response> updateStatutDossier(
            @NotNull Authentication authentication,
            @PathVariable(name = "id") Long id,
            @RequestParam String statut,
            HttpServletRequest request) {
        try {
            var dossier = analyseService.updateStatutDossier(id, statut);
            return ok(getResponse(request, Map.of("dossier", dossier),
                    "Statut du dossier mis à jour", OK));
        } catch (Exception e) {
            log.error("Erreur mise à jour statut dossier {}: ", id, e);
            return badRequest().body(
                    handleErrorResponse("Error message", e.getMessage(), request, BAD_REQUEST)
            );
        }
    }

    // ========== PRÉVISIONS TRÉSORERIE ==========
    @PostMapping("/dossiers/{dossierId}/previsions/init")
    public ResponseEntity<Response> initializePrevisions(
            @NotNull Authentication authentication,
            @PathVariable(name = "dossierId") Long dossierId,
            @RequestParam(defaultValue = "12") Integer nbMois,
            HttpServletRequest request) {
        try {
            var previsions = analyseService.initializePrevisions(dossierId, nbMois);
            return ok(getResponse(request, Map.of("previsions", previsions),
                    "Prévisions initialisées avec succès", OK));
        } catch (Exception e) {
            log.error("Erreur initialisation prévisions: ", e);
            return badRequest().body(
                    handleErrorResponse("Error message", e.getMessage(), request, BAD_REQUEST)
            );
        }
    }

    @GetMapping("/dossiers/{dossierId}/previsions")
    public ResponseEntity<Response> getPrevisionsByDossier(
            @NotNull Authentication authentication,
            @PathVariable(name = "dossierId") Long dossierId,
            HttpServletRequest request) {
        try {
            var previsions = analyseService.getPrevisionsByDossier(dossierId);
            return ok(getResponse(request, Map.of("previsions", previsions),
                    "Prévisions récupérées avec succès", OK));
        } catch (Exception e) {
            log.error("Erreur récupération prévisions dossier {}: ", dossierId, e);
            return status(INTERNAL_SERVER_ERROR).body(
                    handleErrorResponse("Error message", e.getMessage(), request, BAD_REQUEST)
            );
        }
    }

    @GetMapping("/previsions/{id}")
    public ResponseEntity<Response> getPrevisionById(
            @NotNull Authentication authentication,
            @PathVariable(name = "id") Long id,
            HttpServletRequest request) {
        try {
            var prevision = analyseService.getPrevisionById(id);
            return ok(getResponse(request, Map.of("prevision", prevision),
                    "Prévision récupérée avec succès", OK));
        } catch (Exception e) {
            log.error("Erreur récupération prévision {}: ", id, e);
            return status(NOT_FOUND).body(
                    handleErrorResponse("Error message", e.getMessage(), request, BAD_REQUEST)
            );
        }
    }

    @PutMapping("/previsions/{id}/solde-debut")
    public ResponseEntity<Response> updateSoldeDebut(
            @NotNull Authentication authentication,
            @PathVariable(name = "id") Long id,
            @RequestBody Map<String, Object> body,
            HttpServletRequest request) {
        try {
            var prevision = analyseService.updateSoldeDebut(id, (Double) body.get("soldeDebut"));
            return ok(getResponse(request, Map.of("prevision", prevision),
                    "Solde de début mis à jour", OK));
        } catch (Exception e) {
            log.error("Erreur mise à jour solde début: ", e);
            return badRequest().body(
                    handleErrorResponse("Error message", e.getMessage(), request, BAD_REQUEST)
            );
        }
    }

    // ========== LIGNES ENCAISSEMENT ==========
    @PostMapping("/previsions/{previsionId}/encaissements")
    public ResponseEntity<Response> saveLignesEncaissement(
            @NotNull Authentication authentication,
            @PathVariable(name = "previsionId") Long previsionId,
            @RequestBody List<LigneEncaissementDto> lignes,
            HttpServletRequest request) {
        try {
            analyseService.saveLignesEncaissement(previsionId, lignes);
            return ok(getResponse(request, emptyMap(),
                    "Lignes d'encaissement enregistrées", OK));
        } catch (Exception e) {
            log.error("Erreur sauvegarde lignes encaissement: ", e);
            return badRequest().body(
                    handleErrorResponse("Error message", e.getMessage(), request, BAD_REQUEST)
            );
        }
    }

    @GetMapping("/previsions/{previsionId}/encaissements")
    public ResponseEntity<Response> getLignesEncaissement(
            @NotNull Authentication authentication,
            @PathVariable(name = "previsionId") Long previsionId,
            HttpServletRequest request) {
        try {
            var lignes = analyseService.getLignesEncaissement(previsionId);
            return ok(getResponse(request, Map.of("encaissements", lignes),
                    "Lignes d'encaissement récupérées", OK));
        } catch (Exception e) {
            log.error("Erreur récupération lignes encaissement: ", e);
            return status(INTERNAL_SERVER_ERROR).body(
                    handleErrorResponse("Error message", e.getMessage(), request, BAD_REQUEST)
            );
        }
    }

    @PutMapping("/encaissements/{id}")
    public ResponseEntity<Response> updateLigneEncaissement(
            @NotNull Authentication authentication,
            @PathVariable(name = "id") Long id,
            @RequestBody LigneEncaissementDto dto,
            HttpServletRequest request) {
        try {
            var ligne = analyseService.updateLigneEncaissement(id, dto);
            return ok(getResponse(request, Map.of("encaissement", ligne),
                    "Ligne d'encaissement mise à jour", OK));
        } catch (Exception e) {
            log.error("Erreur mise à jour ligne encaissement {}: ", id, e);
            return badRequest().body(
                    handleErrorResponse("Error message", e.getMessage(), request, BAD_REQUEST)
            );
        }
    }

    @DeleteMapping("/encaissements/{id}")
    public ResponseEntity<Response> deleteLigneEncaissement(
            @NotNull Authentication authentication,
            @PathVariable(name = "id") Long id,
            HttpServletRequest request) {
        try {
            analyseService.deleteLigneEncaissement(id);
            return ok(getResponse(request, emptyMap(),
                    "Ligne d'encaissement supprimée", OK));
        } catch (Exception e) {
            log.error("Erreur suppression ligne encaissement {}: ", id, e);
            return badRequest().body(
                    handleErrorResponse("Error message", e.getMessage(), request, BAD_REQUEST)
            );
        }
    }

    // ========== LIGNES DÉCAISSEMENT ==========
    @PostMapping("/previsions/{previsionId}/decaissements")
    public ResponseEntity<Response> saveLignesDecaissement(
            @NotNull Authentication authentication,
            @PathVariable(name = "previsionId") Long previsionId,
            @RequestBody List<LigneDecaissementDto> lignes,
            HttpServletRequest request) {
        try {
            analyseService.saveLignesDecaissement(previsionId, lignes);
            return ok(getResponse(request, emptyMap(),
                    "Lignes de décaissement enregistrées", OK));
        } catch (Exception e) {
            log.error("Erreur sauvegarde lignes décaissement: ", e);
            return badRequest().body(
                    handleErrorResponse("Error message", e.getMessage(), request, BAD_REQUEST)
            );
        }
    }

    @GetMapping("/previsions/{previsionId}/decaissements")
    public ResponseEntity<Response> getLignesDecaissement(
            @NotNull Authentication authentication,
            @PathVariable(name = "previsionId") Long previsionId,
            HttpServletRequest request) {
        try {
            var lignes = analyseService.getLignesDecaissement(previsionId);
            return ok(getResponse(request, Map.of("decaissements", lignes),
                    "Lignes de décaissement récupérées", OK));
        } catch (Exception e) {
            log.error("Erreur récupération lignes décaissement: ", e);
            return status(INTERNAL_SERVER_ERROR).body(
                    handleErrorResponse("Error message", e.getMessage(), request, BAD_REQUEST)
            );
        }
    }

    // ========== CALCULS ET ANALYSE ==========
    @PostMapping("/previsions/{previsionId}/calculer")
    public ResponseEntity<Response> calculerPrevision(
            @NotNull Authentication authentication,
            @PathVariable(name = "previsionId") Long previsionId,
            HttpServletRequest request) {
        try {
            var prevision = analyseService.calculerPrevision(previsionId);
            return ok(getResponse(request, Map.of("prevision", prevision),
                    "Prévision calculée avec succès", OK));
        } catch (Exception e) {
            log.error("Erreur calcul prévision {}: ", previsionId, e);
            return badRequest().body(
                    handleErrorResponse("Error message", e.getMessage(), request, BAD_REQUEST)
            );
        }
    }

    @PostMapping("/dossiers/{dossierId}/calculer-tous")
    public ResponseEntity<Response> calculerToutesPrevisions(
            @NotNull Authentication authentication,
            @PathVariable(name = "dossierId") Long dossierId,
            HttpServletRequest request) {
        try {
            var previsions = analyseService.calculerToutesPrevisions(dossierId);
            return ok(getResponse(request, Map.of("previsions", previsions),
                    "Toutes les prévisions calculées", OK));
        } catch (Exception e) {
            log.error("Erreur calcul toutes prévisions dossier {}: ", dossierId, e);
            return badRequest().body(
                    handleErrorResponse("Error message", e.getMessage(), request, BAD_REQUEST)
            );
        }
    }

    @GetMapping("/dossiers/{dossierId}/analyse")
    public ResponseEntity<Response> analyserDossier(
            @NotNull Authentication authentication,
            @PathVariable(name = "dossierId") Long dossierId,
            HttpServletRequest request) {
        try {
            var analyse = analyseService.analyserDossier(dossierId);
            return ok(getResponse(request, Map.of("analyse", analyse),
                    "Analyse du dossier complétée", OK));
        } catch (Exception e) {
            log.error("Erreur analyse dossier {}: ", dossierId, e);
            return status(INTERNAL_SERVER_ERROR).body(
                    handleErrorResponse("Error message", e.getMessage(), request, BAD_REQUEST)
            );
        }
    }

    @GetMapping("/dossiers/{dossierId}/ratios")
    public ResponseEntity<Response> calculerRatios(
            @NotNull Authentication authentication,
            @PathVariable(name = "dossierId") Long dossierId,
            HttpServletRequest request) {
        try {
            var ratios = analyseService.calculerRatios(dossierId);
            return ok(getResponse(request, Map.of("ratios", ratios),
                    "Ratios financiers calculés", OK));
        } catch (Exception e) {
            log.error("Erreur calcul ratios dossier {}: ", dossierId, e);
            return status(INTERNAL_SERVER_ERROR).body(
                    handleErrorResponse("Error message", e.getMessage(), request, BAD_REQUEST)
            );
        }
    }

    @GetMapping("/dossiers/{dossierId}/capacite-remboursement")
    public ResponseEntity<Response> calculerCapaciteRemboursement(
            @NotNull Authentication authentication,
            @PathVariable(name = "dossierId") Long dossierId,
            HttpServletRequest request) {
        try {
            var capacite = analyseService.calculerCapaciteRemboursement(dossierId);
            return ok(getResponse(request, Map.of("capaciteRemboursement", capacite),
                    "Capacité de remboursement calculée", OK));
        } catch (Exception e) {
            log.error("Erreur calcul capacité remboursement dossier {}: ", dossierId, e);
            return status(INTERNAL_SERVER_ERROR).body(
                    handleErrorResponse("Error message", e.getMessage(), request, BAD_REQUEST)
            );
        }
    }

    // ========== REMBOURSEMENTS ==========
    @PostMapping("/dossiers/{dossierId}/remboursements/generer")
    public ResponseEntity<Response> genererEcheancier(
            @NotNull Authentication authentication,
            @PathVariable(name = "dossierId") Long dossierId,
            HttpServletRequest request) {
        try {
            var remboursements = analyseService.genererEcheancier(dossierId);
            return ok(getResponse(request, Map.of("remboursements", remboursements),
                    "Échéancier généré avec succès", OK));
        } catch (Exception e) {
            log.error("Erreur génération échéancier dossier {}: ", dossierId, e);
            return badRequest().body(
                    handleErrorResponse("Error message", e.getMessage(), request, BAD_REQUEST)
            );
        }
    }

    @GetMapping("/dossiers/{dossierId}/remboursements")
    public ResponseEntity<Response> getRemboursements(
            @NotNull Authentication authentication,
            @PathVariable(name = "dossierId") Long dossierId,
            HttpServletRequest request) {
        try {
            var remboursements = analyseService.getRemboursements(dossierId);
            return ok(getResponse(request, Map.of("remboursements", remboursements),
                    "Remboursements récupérés", OK));
        } catch (Exception e) {
            log.error("Erreur récupération remboursements dossier {}: ", dossierId, e);
            return status(INTERNAL_SERVER_ERROR).body(
                    handleErrorResponse("Error message", e.getMessage(), request, BAD_REQUEST)
            );
        }
    }

    @PutMapping("/remboursements/{id}/payer")
    public ResponseEntity<Response> marquerCommePaye(
            @NotNull Authentication authentication,
            @PathVariable(name = "id") Long id,
            @RequestBody Map<String, Object> body,
            HttpServletRequest request) {
        try {
            var remboursement = analyseService.marquerCommePaye(id, (String) body.get("datePaiement"));
            return ok(getResponse(request, Map.of("remboursement", remboursement),
                    "Remboursement marqué comme payé", OK));
        } catch (Exception e) {
            log.error("Erreur marquage paiement remboursement {}: ", id, e);
            return badRequest().body(
                    handleErrorResponse("Error message", e.getMessage(), request, BAD_REQUEST)
            );
        }
    }

    // ========== CATÉGORIES ==========
    @GetMapping("/categories/encaissements")
    public ResponseEntity<Response> getCategoriesEncaissement(
            @NotNull Authentication authentication,
            HttpServletRequest request) {
        try {
            var categories = analyseService.getCategoriesEncaissement();
            return ok(getResponse(request, Map.of("categoriesEncaissement", categories),
                    "Catégories d'encaissement récupérées", OK));
        } catch (Exception e) {
            log.error("Erreur récupération catégories encaissement: ", e);
            return status(INTERNAL_SERVER_ERROR).body(
                    handleErrorResponse("Error message", e.getMessage(), request, BAD_REQUEST)
            );
        }
    }

    @GetMapping("/categories/decaissements")
    public ResponseEntity<Response> getCategoriesDecaissement(
            @NotNull Authentication authentication,
            HttpServletRequest request) {
        try {
            var categories = analyseService.getCategoriesDecaissement();
            return ok(getResponse(request, Map.of("categoriesDecaissement", categories),
                    "Catégories de décaissement récupérées", OK));
        } catch (Exception e) {
            log.error("Erreur récupération catégories décaissement: ", e);
            return status(INTERNAL_SERVER_ERROR).body(
                    handleErrorResponse("Error message", e.getMessage(), request, BAD_REQUEST)
            );
        }
    }

    // ========== IMPORT/EXPORT ==========
    @PostMapping("/dossiers/{dossierId}/import-excel")
    public ResponseEntity<Response> importExcel(
            @NotNull Authentication authentication,
            @PathVariable(name = "dossierId") Long dossierId,
            @RequestParam("file") MultipartFile file,
            HttpServletRequest request) {
        try {
            var result = analyseService.importExcel(dossierId, file);
            return ok(getResponse(request, Map.of("importResult", result),
                    "Import Excel réussi", OK));
        } catch (Exception e) {
            log.error("Erreur import Excel dossier {}: ", dossierId, e);
            return badRequest().body(
                    handleErrorResponse("Error message", e.getMessage(), request, BAD_REQUEST)
            );
        }
    }

    @GetMapping("/dossiers/{dossierId}/export-excel")
    public ResponseEntity<byte[]> exportExcel(
            @NotNull Authentication authentication,
            @PathVariable(name = "dossierId") Long dossierId,
            HttpServletRequest request) {
        try {
            byte[] data = analyseService.exportExcel(dossierId);
            return ResponseEntity.ok()
                    .header("Content-Disposition", "attachment; filename=previsions.xlsx")
                    .header("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
                    .body(data);
        } catch (Exception e) {
            log.error("Erreur export Excel dossier {}: ", dossierId, e);
            return ResponseEntity.status(INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/dossiers/{dossierId}/export-pdf")
    public ResponseEntity<byte[]> exportPdf(
            @NotNull Authentication authentication,
            @PathVariable(name = "dossierId") Long dossierId,
            HttpServletRequest request) {
        try {
            byte[] data = analyseService.exportPdf(dossierId);
            return ResponseEntity.ok()
                    .header("Content-Type", "application/pdf")
                    .header("Content-Disposition", "attachment; filename=analyse.pdf")
                    .body(data);
        } catch (Exception e) {
            log.error("Erreur export PDF dossier {}: ", dossierId, e);
            return ResponseEntity.status(INTERNAL_SERVER_ERROR).build();
        }
    }

    // ========== TABLEAUX DE BORD ==========
    @GetMapping("/dashboard/stats")
    public ResponseEntity<Response> getDashboardStats(
            @NotNull Authentication authentication,
            HttpServletRequest request) {
        try {
            var stats = analyseService.getDashboardStats();
            return ok(getResponse(request, Map.of("dashboardStats", stats),
                    "Statistiques du tableau de bord récupérées", OK));
        } catch (Exception e) {
            log.error("Erreur récupération stats dashboard: ", e);
            return status(INTERNAL_SERVER_ERROR).body(
                    handleErrorResponse("Error message", e.getMessage(), request, BAD_REQUEST)
            );
        }
    }

    @GetMapping("/dashboard/stats-par-mois")
    public ResponseEntity<Response> getStatsMensuels(
            @NotNull Authentication authentication,
            @RequestParam(required = false) Integer annee,
            HttpServletRequest request) {
        try {
            var stats = analyseService.getStatsMensuels(annee);
            return ok(getResponse(request, Map.of("statsMensuels", stats),
                    "Statistiques mensuelles récupérées", OK));
        } catch (Exception e) {
            log.error("Erreur récupération stats mensuelles: ", e);
            return status(INTERNAL_SERVER_ERROR).body(
                    handleErrorResponse("Error message", e.getMessage(), request, BAD_REQUEST)
            );
        }
    }

    @GetMapping("/dashboard/top-clients")
    public ResponseEntity<Response> getTopClients(
            @NotNull Authentication authentication,
            @RequestParam(defaultValue = "10") Integer limit,
            HttpServletRequest request) {
        try {
            var topClients = analyseService.getTopClients(limit);
            return ok(getResponse(request, Map.of("topClients", topClients),
                    "Top clients récupérés", OK));
        } catch (Exception e) {
            log.error("Erreur récupération top clients: ", e);
            return status(INTERNAL_SERVER_ERROR).body(
                    handleErrorResponse("Error message", e.getMessage(), request, BAD_REQUEST)
            );
        }
    }

    @PostMapping("/dossiers/{dossierId}/previsions")
    public ResponseEntity<Response> savePrevisions(
                                    @NotNull Authentication authentication,
                                    @PathVariable("dossierId") Long dossierId,
                                    @RequestBody List<PrevisionTresorerieDto> previsions,
                                    HttpServletRequest request)
    {
        try {
            // Vérifier que le dossierId n'est pas 0
            if (dossierId == null || dossierId == 0) {
                return badRequest().body(
                        handleErrorResponse("Erreur", "ID du dossier invalide", request, BAD_REQUEST)
                );
            }

            var savedPrevisions = analyseService.savePrevisions(dossierId, previsions);
            return ok(getResponse(request, Map.of("previsions", savedPrevisions),
                    "Prévisions sauvegardées avec succès", OK));
        } catch (Exception e) {
            log.error("Erreur sauvegarde prévisions dossier {}: ", dossierId, e);
            return badRequest().body(
                    handleErrorResponse("Error message", e.getMessage(), request, BAD_REQUEST)
            );
        }
    }

    // ================ Information sur les avis  ================//
    @PostMapping("/avis")
    public ResponseEntity<Response> avis(
            @NotNull Authentication authentication,
            @RequestBody AvisDto avisDto,
            HttpServletRequest request) {
        try {
            // Vérifier que le demandeIndividuelId n'est pas null
            if (avisDto.getDemandeIndividuelId() == null) {
                return badRequest().body(
                        handleErrorResponse("Erreur", "ID de la demande invalide", request, BAD_REQUEST)
                );
            }

            // Vérifier que le libele n'est pas vide
            if (avisDto.getLibele() == null || avisDto.getLibele().trim().isEmpty()) {
                return badRequest().body(
                        handleErrorResponse("Erreur", "Le contenu de l'avis est obligatoire", request, BAD_REQUEST)
                );
            }

            // Récupérer l'utilisateur connecté
            String username = authentication.getName();
            Long userId = userClient.getUserByUuid(authentication.getName()).getUserId();
            avisDto.setIdUser(userId);

            // Sauvegarder l'avis
            var savedAvis = analyseService.saveAvis(avisDto);

            return ok(getResponse(request,
                    Map.of("avis", savedAvis),
                    "Avis sauvegardé avec succès",
                    OK));

        } catch (Exception e) {
            log.error("Erreur sauvegarde avis pour la demande {}: ", avisDto.getDemandeIndividuelId(), e);
            return badRequest().body(
                    handleErrorResponse("Erreur", e.getMessage(), request, BAD_REQUEST)
            );
        }
    }

    // Méthode pour récupérer tous les avis d'une demande
    @GetMapping("/avis/demande/{demandeId}")
    public ResponseEntity<Response> getAvisByDemande(
            @PathVariable(name = "demandeId") Long demandeId,
            HttpServletRequest request) {
        try {
            var avisList = analyseService.getAvisByDemandeId(demandeId);
            return ok(getResponse(request,
                    Map.of("avis", avisList),
                    "Avis récupérés avec succès",
                    OK));
        } catch (Exception e) {
            log.error("Erreur récupération avis pour la demande {}: ", demandeId, e);
            return badRequest().body(
                    handleErrorResponse("Erreur", e.getMessage(), request, BAD_REQUEST)
            );
        }
    }


    /**
     * Modifier un avis existant
     */
    @PutMapping("/avis/{avisId}")
    public ResponseEntity<Response> updateAvis(
            @PathVariable(name = "avisId") Long avisId,
            @NotNull Authentication authentication,
            @RequestBody AvisDto avisDto,
            HttpServletRequest request) {
        try {
            // Validation des données
            if (avisDto.getLibele() == null || avisDto.getLibele().trim().isEmpty()) {
                return badRequest().body(
                        handleErrorResponse("Erreur", "Le contenu de l'avis est obligatoire", request, BAD_REQUEST)
                );
            }

            // Récupérer l'utilisateur connecté
            Long currentUserId = userClient.getUserByUuid(authentication.getName()).getUserId();

            // Récupérer l'avis existant pour vérifier les permissions
            AvisDto existingAvis = analyseService.getAvisById(avisId);

            if (existingAvis == null) {
                return badRequest().body(
                        handleErrorResponse("Erreur", "Avis non trouvé", request, NOT_FOUND)
                );
            }

            // Vérifier que l'utilisateur est bien l'auteur de l'avis
            if (!existingAvis.getIdUser().equals(currentUserId)) {
                return badRequest().body(
                        handleErrorResponse("Erreur",
                                "Vous n'êtes pas autorisé à modifier cet avis",
                                request, FORBIDDEN)
                );
            }

            // Mettre à jour l'avis
            avisDto.setAvisId(avisId);
            avisDto.setIdUser(currentUserId);
            avisDto.setDemandeIndividuelId(existingAvis.getDemandeIndividuelId());

            var updatedAvis = analyseService.updateAvis(avisId, avisDto);

            return ok(getResponse(request,
                    Map.of("avis", updatedAvis),
                    "Avis modifié avec succès",
                    OK));

        } catch (Exception e) {
            log.error("Erreur modification avis {}: ", avisId, e);
            return badRequest().body(
                    handleErrorResponse("Erreur", e.getMessage(), request, BAD_REQUEST)
            );
        }
    }

    /**
     * Supprimer un avis
     */
    @DeleteMapping("/avis/{avisId}")
    public ResponseEntity<Response> deleteAvis(
            @PathVariable(name = "avisId") Long avisId,
            @NotNull Authentication authentication,
            HttpServletRequest request) {
        try {
            // Récupérer l'utilisateur connecté
            Long currentUserId = userClient.getUserByUuid(authentication.getName()).getUserId();
            String userRole = userClient.getUserByUuid(authentication.getName()).getRole();

            // Récupérer l'avis existant pour vérifier les permissions
            AvisDto existingAvis = analyseService.getAvisById(avisId);

            if (existingAvis == null) {
                return badRequest().body(
                        handleErrorResponse("Erreur", "Avis non trouvé", request, NOT_FOUND)
                );
            }

            // Vérifier les permissions : seul l'auteur ou un admin peut supprimer
            boolean isAuthor = existingAvis.getIdUser().equals(currentUserId);
            boolean isAdmin = "ADMIN".equals(userRole) || "MANAGER".equals(userRole);

            if (!isAuthor && !isAdmin) {
                return badRequest().body(
                        handleErrorResponse("Erreur",
                                "Vous n'êtes pas autorisé à supprimer cet avis",
                                request, FORBIDDEN)
                );
            }

            // Supprimer l'avis
            analyseService.deleteAvis(avisId);

            return ok(getResponse(request,
                    Map.of("message", "Avis supprimé avec succès"),
                    "Avis supprimé avec succès",
                    OK));

        } catch (Exception e) {
            log.error("Erreur suppression avis {}: ", avisId, e);
            return badRequest().body(
                    handleErrorResponse("Erreur", e.getMessage(), request, BAD_REQUEST)
            );
        }
    }

    /**
     * Récupérer un avis spécifique
     */
    @GetMapping("/avis/{avisId}")
    public ResponseEntity<Response> getAvisById(
            @PathVariable(name = "avisId") Long avisId,
            HttpServletRequest request) {
        try {
            AvisDto avis = analyseService.getAvisById(avisId);

            if (avis == null) {
                return badRequest().body(
                        handleErrorResponse("Erreur", "Avis non trouvé", request, NOT_FOUND)
                );
            }

            return ok(getResponse(request,
                    Map.of("avis", avis),
                    "Avis récupéré avec succès",
                    OK));

        } catch (Exception e) {
            log.error("Erreur récupération avis {}: ", avisId, e);
            return badRequest().body(
                    handleErrorResponse("Erreur", e.getMessage(), request, BAD_REQUEST)
            );
        }
    }

    /**
     * Récupérer tous les avis d'un utilisateur
     */
    @GetMapping("/avis/user/{userId}")
    public ResponseEntity<Response> getAvisByUser(
            @PathVariable(name = "userId") Long userId,
            HttpServletRequest request) {
        try {
            List<AvisDto> avisList = analyseService.getAvisByUserId(userId);

            return ok(getResponse(request,
                    Map.of("avis", avisList),
                    "Avis de l'utilisateur récupérés avec succès",
                    OK));

        } catch (Exception e) {
            log.error("Erreur récupération avis de l'utilisateur {}: ", userId, e);
            return badRequest().body(
                    handleErrorResponse("Erreur", e.getMessage(), request, BAD_REQUEST)
            );
        }
    }

    // ========== MÉTHODES UTILITAIRES ==========
    private URI getUri() {
        return URI.create("/api/v1/ecredit");
    }
}