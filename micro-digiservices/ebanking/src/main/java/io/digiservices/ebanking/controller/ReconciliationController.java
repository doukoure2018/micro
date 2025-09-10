package io.digiservices.ebanking.controller;

import io.digiservices.ebanking.dto.ReconciliationResultDTO;
import io.digiservices.ebanking.service.ReconciliationService;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/ebanking")
@Slf4j
@CrossOrigin(origins = "*")
public class ReconciliationController {

    private final ReconciliationService reconciliationService;

    @Qualifier("middlewareJdbcTemplate")
    private final JdbcTemplate middlewareJdbcTemplate;

    private final JdbcTemplate productionJdbcTemplate;


    // Constructeur avec injection correcte
    public ReconciliationController(
            ReconciliationService reconciliationService,
            @Qualifier("middlewareJdbcTemplate") JdbcTemplate middlewareJdbcTemplate,
            @Qualifier("jdbcTemplate") JdbcTemplate productionJdbcTemplate) {
        this.reconciliationService = reconciliationService;
        this.middlewareJdbcTemplate = middlewareJdbcTemplate;
        this.productionJdbcTemplate = productionJdbcTemplate;
    }

    @GetMapping("/reconciliation/verify-setup")
    public ResponseEntity<?> verifySetup() {
        Map<String, Object> result = new HashMap<>();

        // Vérifier quelle base est utilisée par le middleware template
        try {
            Map<String, Object> dbCheck = middlewareJdbcTemplate.queryForMap(
                    "SELECT DB_NAME() as database_name"
            );
            result.put("middleware_database", dbCheck.get("database_name"));

            // Chercher la table TRANSACTIONSAF
            List<Map<String, Object>> tables = middlewareJdbcTemplate.queryForList(
                    "SELECT TABLE_CATALOG, TABLE_SCHEMA, TABLE_NAME " +
                            "FROM INFORMATION_SCHEMA.TABLES " +
                            "WHERE TABLE_NAME LIKE '%TRANSACTIONSAF%'"
            );
            result.put("tables_found", tables);

        } catch (Exception e) {
            result.put("error", e.getMessage());
        }

        return ResponseEntity.ok(result);
    }

    /**
     * Endpoint pour effectuer le rapprochement sur une période
     */
    @PostMapping("/reconciliation/check")
    public ResponseEntity<ReconciliationResultDTO> checkReconciliation(
            @RequestParam(value = "codeAgence") String codeAgence,
            @RequestParam(value = "dateDebut") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateDebut,
            @RequestParam(value = "dateFin") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFin) {

        log.info("=== API Rapprochement appelée ===");
        log.info("Paramètres - Agence: {}, Période: {} au {}", codeAgence, dateDebut, dateFin);

        // Validation des dates
        if (dateDebut.isAfter(dateFin)) {
            return ResponseEntity.badRequest().body(
                    ReconciliationResultDTO.error("La date de début doit être antérieure à la date de fin")
            );
        }

        ReconciliationResultDTO result = reconciliationService.performReconciliationPeriod(
                codeAgence, dateDebut, dateFin
        );

        return ResponseEntity.ok(result);
    }

    /**
     * Endpoint pour vérifier les dates disponibles pour une agence
     */
    @GetMapping("/reconciliation/check-dates")
    public ResponseEntity<?> checkAvailableDates(@RequestParam(value = "codeAgence") String codeAgence) {
        log.info("Vérification des dates disponibles pour l'agence {}", codeAgence);

        try {
            String sql = """
                SELECT 
                    MIN(DATEOPERATION) as date_min,
                    MAX(DATEOPERATION) as date_max,
                    COUNT(*) as total_transactions
                FROM TRANSACTIONSAF
                WHERE CODEAGENCE = ?
            """;

            Map<String, Object> result = middlewareJdbcTemplate.queryForMap(sql, codeAgence);

            log.info("Résultat pour agence {}: {}", codeAgence, result);

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("Erreur lors de la vérification des dates", e);
            return ResponseEntity.internalServerError().body("Erreur: " + e.getMessage());
        }
    }

    /**
     * Endpoint pour lister les agences disponibles
     */
    @GetMapping("/reconciliation/agences")
    public ResponseEntity<?> getAvailableAgences() {
        log.info("Récupération des agences disponibles");

        try {
            String sql = """
                SELECT DISTINCT 
                    CODEAGENCE,
                    COUNT(*) as nb_transactions,
                    MIN(DATEOPERATION) as date_min,
                    MAX(DATEOPERATION) as date_max
                FROM TRANSACTIONSAF
                GROUP BY CODEAGENCE
                ORDER BY CODEAGENCE
            """;

            List<Map<String, Object>> agences = middlewareJdbcTemplate.queryForList(sql);

            log.info("Nombre d'agences trouvées: {}", agences.size());

            return ResponseEntity.ok(agences);
        } catch (Exception e) {
            log.error("Erreur lors de la récupération des agences", e);
            return ResponseEntity.internalServerError().body("Erreur: " + e.getMessage());
        }
    }


    /**
     * Endpoint pour effectuer le rapprochement du jour
     */
    @GetMapping("/reconciliation/today")
    public ResponseEntity<ReconciliationResultDTO> checkReconciliationToday(
            @RequestParam(name = "codeAgence") String codeAgence) {

        log.info("=== Rapprochement du jour - Agence: {} ===", codeAgence);

        LocalDate today = LocalDate.now();
        ReconciliationResultDTO result = reconciliationService.performReconciliationPeriod(
                codeAgence, today, today
        );

        return ResponseEntity.ok(result);
    }

    /**
     * Endpoint de test de connexion
     */
    @GetMapping("/reconciliation/test")
    public ResponseEntity<String> testConnection() {
        return ResponseEntity.ok("Service de rapprochement actif");
    }


}