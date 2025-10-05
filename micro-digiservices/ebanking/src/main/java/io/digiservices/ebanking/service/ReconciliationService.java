package io.digiservices.ebanking.service;

import io.digiservices.ebanking.dto.DailySummaryDTO;
import io.digiservices.ebanking.dto.OperationReserveDTO;
import io.digiservices.ebanking.dto.ReconciliationResultDTO;
import io.digiservices.ebanking.dto.TransactionSafDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
public class ReconciliationService {

    private final JdbcTemplate productionJdbcTemplate;
    private final JdbcTemplate middlewareJdbcTemplate;

    @Autowired
    public ReconciliationService(
            @Qualifier("jdbcTemplate") JdbcTemplate productionJdbcTemplate,
            @Qualifier("middlewareJdbcTemplate") JdbcTemplate middlewareJdbcTemplate) {
        this.productionJdbcTemplate = productionJdbcTemplate;
        this.middlewareJdbcTemplate = middlewareJdbcTemplate;
    }

    /**
     * Effectue le rapprochement pour une période donnée
     */
    public ReconciliationResultDTO performReconciliationPeriod(
            String codeAgence,
            LocalDate dateDebut,
            LocalDate dateFin) {

        log.info("=== DÉBUT RAPPROCHEMENT BANCAIRE ===");
        log.info("Agence: {}, Période: {} au {}", codeAgence, dateDebut, dateFin);

        ReconciliationResultDTO result = new ReconciliationResultDTO();
        result.setCodeAgence(codeAgence);
        result.setDateDebut(dateDebut);
        result.setDateFin(dateFin);
        result.setNombreJours((int) (dateFin.toEpochDay() - dateDebut.toEpochDay() + 1));
        result.setDateRapprochement(LocalDateTime.now());

        try {
            LocalDateTime dateTimeDebut = dateDebut.atStartOfDay();
            LocalDateTime dateTimeFin = dateFin.atTime(23, 59, 59);

            // Étendre la période pour Production (décalage possible des dates)
            LocalDateTime dateTimeDebutProd = dateDebut.minusDays(3).atStartOfDay();
            LocalDateTime dateTimeFinProd = dateFin.plusDays(3).atTime(23, 59, 59);

            // 1. Récupérer les transactions Middleware
            List<TransactionSafDTO> middlewareTransactions = getMiddlewareTransactionsPeriod(
                    codeAgence, dateTimeDebut, dateTimeFin
            );

            // 2. Récupérer les opérations réserve
            List<OperationReserveDTO> reserveOperations = getReserveOperationsPeriod(
                    codeAgence, dateTimeDebut, dateTimeFin
            );

            // 3. Récupérer TOUTES les transactions Production (période étendue)
            List<Map<String, Object>> allProductionTransactions = getProductionTransactionsPeriod(
                    codeAgence, dateTimeDebutProd, dateTimeFinProd
            );

            // 4. Effectuer le rapprochement intelligent
            RapprochementResult rapprochement = performIntelligentMatching(
                    middlewareTransactions,
                    reserveOperations,
                    allProductionTransactions
            );

            // 5. Compiler les résultats
            compileResults(result, middlewareTransactions, reserveOperations,
                    allProductionTransactions, rapprochement);

            // 6. Générer le rapport détaillé
            result.setDetails(generateDetailedReport(result, rapprochement));

            log.info("=== RAPPROCHEMENT TERMINÉ ===");
            logFinalStatistics(result, rapprochement);

        } catch (Exception e) {
            log.error("ERREUR lors du rapprochement", e);
            result.setStatut("ERREUR");
            result.setMessageErreur(e.getMessage());
        }

        return result;
    }

    /**
     * Rapprochement intelligent basé sur NUMCOMPTE → NUM_MOV_ENTE
     */
    private RapprochementResult performIntelligentMatching(
            List<TransactionSafDTO> middlewareTransactions,
            List<OperationReserveDTO> reserveOperations,
            List<Map<String, Object>> productionTransactions) {

        RapprochementResult result = new RapprochementResult();
        Set<Integer> usedProductionIndices = new HashSet<>();

        log.info("=== DÉBUT RAPPROCHEMENT PAR COMPTE ===");
        log.info("Middleware: {} transactions clients + {} opérations réserve",
                middlewareTransactions.size(), reserveOperations.size());
        log.info("Production: {} transactions disponibles", productionTransactions.size());

        // 1. RAPPROCHER LES TRANSACTIONS CLIENTS PAR COMPTE
        for (TransactionSafDTO mwTrans : middlewareTransactions) {
            boolean matched = false;

            // Recherche par NUMCOMPTE → NUM_MOV_ENTE uniquement
            for (int i = 0; i < productionTransactions.size(); i++) {
                if (usedProductionIndices.contains(i)) continue;

                Map<String, Object> prodTrans = productionTransactions.get(i);

                if (matchClientTransactionByAccount(mwTrans, prodTrans)) {
                    usedProductionIndices.add(i);
                    result.addMatchedProductionIndex(i);
                    result.incrementRapprochements();
                    matched = true;

                    log.debug("✓ Match trouvé: MW#{} | Compte: {} | Montant: {} → PROD",
                            mwTrans.getNumTransaction(),
                            mwTrans.getNumCompte(),
                            mwTrans.getMontant());
                    break;
                }
            }

            if (!matched) {
                result.addTransactionNonRapprochee(mwTrans);
                log.warn("✗ Transaction MANQUANTE: MW#{} | {} | {} GNF | Compte: {} | Client: {} | Cajero: {}",
                        mwTrans.getNumTransaction(),
                        mwTrans.getDateOperation(),
                        mwTrans.getMontant(),
                        mwTrans.getNumCompte(),
                        mwTrans.getCodeClient(),
                        mwTrans.getFaitPar());
            }
        }

        // 2. RAPPROCHER LES OPÉRATIONS RÉSERVE
        for (OperationReserveDTO resOp : reserveOperations) {
            boolean matched = false;

            for (int i = 0; i < productionTransactions.size(); i++) {
                if (usedProductionIndices.contains(i)) continue;

                Map<String, Object> prodTrans = productionTransactions.get(i);

                if (matchReserveOperation(resOp, prodTrans)) {
                    usedProductionIndices.add(i);
                    result.addMatchedProductionIndex(i);
                    result.incrementRapprochements();
                    matched = true;

                    log.debug("✓ Match réserve: #{} → PROD (Cajero: {}, Montant: {})",
                            resOp.getNumero(),
                            resOp.getCodeUser(),
                            resOp.getMontant());
                    break;
                }
            }

            if (!matched) {
                result.addOperationReserveNonRapprochee(resOp);
                log.warn("✗ Opération réserve MANQUANTE: #{} | {} | {} GNF | Cajero: {}",
                        resOp.getNumero(),
                        resOp.getDateOperation(),
                        resOp.getMontant(),
                        resOp.getCodeUser());
            }
        }

        // Log du résumé
        log.info("=== RÉSULTAT RAPPROCHEMENT ===");
        log.info("✅ Transactions clients rapprochées: {}/{}",
                middlewareTransactions.size() - result.getTransactionsNonRapprochees().size(),
                middlewareTransactions.size());
        log.info("❌ Transactions clients MANQUANTES: {}",
                result.getTransactionsNonRapprochees().size());
        log.info("✅ Opérations réserve rapprochées: {}/{}",
                reserveOperations.size() - result.getOperationsReserveNonRapprochees().size(),
                reserveOperations.size());
        log.info("❌ Opérations réserve MANQUANTES: {}",
                result.getOperationsReserveNonRapprochees().size());

        return result;
    }

    /**
     * Match transaction client par NUM_MOV_ENTE (compte) + montant + client
     * CRITÈRES SIMPLIFIÉS DE RAPPROCHEMENT
     */
    private boolean matchClientTransactionByAccount(
            TransactionSafDTO mwTrans,
            Map<String, Object> prodTrans) {

        // 1. VÉRIFIER LE NUMÉRO DE COMPTE (CRITÈRE PRINCIPAL)
        String prodNumMovEnte = (String) prodTrans.get("NUM_MOV_ENTE");
        String mwNumCompte = mwTrans.getNumCompte();

        if (prodNumMovEnte == null || mwNumCompte == null) {
            return false;
        }

        // Normaliser les numéros de compte (enlever espaces, tirets)
        String prodCompteNorm = prodNumMovEnte.trim().replaceAll("[\\s-]", "");
        String mwCompteNorm = mwNumCompte.trim().replaceAll("[\\s-]", "");

        if (!prodCompteNorm.equals(mwCompteNorm)) {
            return false;
        }

        // 2. VÉRIFIER LE MONTANT (CRITÈRE OBLIGATOIRE)
        BigDecimal mwMontant = mwTrans.getMontant();
        BigDecimal prodMontant = getBigDecimalValue(prodTrans.get("MTO_MOVIMIENTO"));

        if (mwMontant == null || prodMontant == null ||
                mwMontant.compareTo(prodMontant) != 0) {
            return false;
        }

        // 3. VÉRIFIER LE CODE CLIENT (CRITÈRE OBLIGATOIRE)
        String mwClient = mwTrans.getCodeClient();
        String prodClient = (String) prodTrans.get("COD_CLIENTE");

        if (mwClient == null || prodClient == null || !mwClient.equals(prodClient)) {
            return false;
        }

        // 4. VÉRIFIER LE TYPE DE TRANSACTION (5=Dépôt, 6=Retrait)
        String tipTransaccion = String.valueOf(prodTrans.get("TIP_TRANSACCION"));

        if ("Depot".equalsIgnoreCase(mwTrans.getTypeOperation()) ||
                mwTrans.getTypeTransaction() == 16) {
            if (!"5".equals(tipTransaccion)) {
                return false;
            }
        } else if ("Retrait".equalsIgnoreCase(mwTrans.getTypeOperation()) ||
                mwTrans.getTypeTransaction() == 44) {
            if (!"6".equals(tipTransaccion)) {
                return false;
            }
        } else {
            // Type non reconnu
            return false;
        }

        // Tous les critères correspondent
        log.debug("Match confirmé: Compte={}, Montant={}, Client={}, Type={}",
                mwNumCompte, mwMontant, mwClient, mwTrans.getTypeOperation());

        return true;
    }

    /**
     * Match opération réserve (TIP_TRANSACCION = 3)
     */
    private boolean matchReserveOperation(
            OperationReserveDTO resOp,
            Map<String, Object> prodTrans) {

        // 1. Vérifier que c'est une opération de type 3
        String tipTransaccion = String.valueOf(prodTrans.get("TIP_TRANSACCION"));
        if (!"3".equals(tipTransaccion)) {
            return false;
        }

        // 2. Vérifier le montant
        BigDecimal resMontant = resOp.getMontant();
        BigDecimal prodMontant = getBigDecimalValue(prodTrans.get("MTO_MOVIMIENTO"));

        if (resMontant == null || prodMontant == null ||
                resMontant.compareTo(prodMontant) != 0) {
            return false;
        }

        // 3. Vérifier le cajero
        String resCajero = resOp.getCodeUser();
        String prodCajero = (String) prodTrans.get("COD_CAJERO");

        if (!Objects.equals(resCajero, prodCajero)) {
            return false;
        }

        // 4. Vérifier le sens de l'opération
        String numMovEnte = (String) prodTrans.get("NUM_MOV_ENTE");
        long transactionOp = resOp.getTransactionOp();

        // TRANSACTIONOP: 1 = Retrait → NUM_MOV_ENTE = 'D'
        // TRANSACTIONOP: 2 = Dépôt → NUM_MOV_ENTE = 'A'
        if (transactionOp == 1 && !"D".equals(numMovEnte)) {
            return false;
        }
        if (transactionOp == 2 && !"A".equals(numMovEnte)) {
            return false;
        }

        return true;
    }

    /**
     * Récupère les transactions Middleware
     */
    private List<TransactionSafDTO> getMiddlewareTransactionsPeriod(
            String codeAgence, LocalDateTime dateDebut, LocalDateTime dateFin) {

        String sql = """
            SELECT NUMTRANSACTION, DATEOPERATION, FAITPAR, MONTANT, 
                   TYPEOPERATION, NUMCOMPTE, SERIALCAISSE, CODEAGENCE, 
                   ETATSAF, CODECLIENT, CODEPRODUIT, MOTIFS,
                   NUMECRITURECOMPTABLE, SOLDEAVANTOPERATION, SOLDEAPRESOPERATION,
                   SOLDECAISSEAVANT, SOLDECAISSEAPRES, TYPETRANSACTION,
                   SOUSTYOETRANSACTION, DATEEXECUTION, ERRORS, NBRE
            FROM TRANSACTIONSAF 
            WHERE CODEAGENCE = ? 
            AND DATEOPERATION >= ? 
            AND DATEOPERATION <= ?
            AND (ETATSAF = 'Success' OR ETATSAF IS NULL)
            ORDER BY DATEOPERATION, NUMTRANSACTION
        """;

        List<TransactionSafDTO> transactions = middlewareJdbcTemplate.query(sql,
                new Object[]{codeAgence, Timestamp.valueOf(dateDebut), Timestamp.valueOf(dateFin)},
                (rs, rowNum) -> {
                    TransactionSafDTO dto = new TransactionSafDTO();
                    dto.setNumTransaction(rs.getLong("NUMTRANSACTION"));

                    Timestamp timestamp = rs.getTimestamp("DATEOPERATION");
                    if (timestamp != null) {
                        dto.setDateOperation(timestamp.toLocalDateTime());
                    }

                    dto.setFaitPar(rs.getString("FAITPAR"));
                    dto.setNumEcritureComptable(rs.getLong("NUMECRITURECOMPTABLE"));
                    dto.setMontant(rs.getBigDecimal("MONTANT"));
                    dto.setTypeOperation(rs.getString("TYPEOPERATION"));
                    dto.setTypeTransaction(rs.getLong("TYPETRANSACTION"));
                    dto.setNumCompte(rs.getString("NUMCOMPTE"));
                    dto.setCodeAgence(rs.getString("CODEAGENCE"));
                    dto.setEtatSaf(rs.getString("ETATSAF"));
                    dto.setCodeClient(rs.getString("CODECLIENT"));
                    dto.setMotifs(rs.getString("MOTIFS"));
                    dto.setCodeProduit(rs.getString("CODEPRODUIT"));

                    return dto;
                });

        log.info("Transactions Middleware récupérées: {}", transactions.size());
        return transactions;
    }

    /**
     * Récupère les opérations réserve
     */
    private List<OperationReserveDTO> getReserveOperationsPeriod(
            String codeAgence, LocalDateTime dateDebut, LocalDateTime dateFin)
    {

        String sql = """
            SELECT NUMERO, DATEOPERATION, CODEAGENCE, CODEUSER, MONTANT,
                   TRANSACTIONOP, LIBELLEOP, COMPTECAISSE, COMPTERESERVE,
                   ETATOP, VALIDERPAR, ERRORS, DATEEXECUTION, NBRE
            FROM OPERATIONSRESERVE
            WHERE CODEAGENCE = ?
            AND DATEOPERATION >= ?
            AND DATEOPERATION <= ?
            AND ETATOP = 'Success'
            ORDER BY DATEOPERATION, NUMERO
        """;

        List<OperationReserveDTO> operations = middlewareJdbcTemplate.query(sql,
                new Object[]{codeAgence, Timestamp.valueOf(dateDebut), Timestamp.valueOf(dateFin)},
                (rs, rowNum) -> {
                    OperationReserveDTO dto = new OperationReserveDTO();
                    dto.setNumero(rs.getLong("NUMERO"));

                    Timestamp timestamp = rs.getTimestamp("DATEOPERATION");
                    if (timestamp != null) {
                        dto.setDateOperation(timestamp.toLocalDateTime());
                    }

                    dto.setCodeAgence(rs.getString("CODEAGENCE"));
                    dto.setCodeUser(rs.getString("CODEUSER"));
                    dto.setMontant(rs.getBigDecimal("MONTANT"));
                    dto.setTransactionOp(rs.getLong("TRANSACTIONOP"));
                    dto.setLibelleOp(rs.getString("LIBELLEOP"));
                    dto.setEtatOp(rs.getString("ETATOP"));
                    dto.setValiderPar(rs.getString("VALIDERPAR"));

                    return dto;
                });

        log.info("Opérations réserve récupérées: {}", operations.size());
        return operations;
    }

    /**
     * Récupère les transactions Production
     */
    private List<Map<String, Object>> getProductionTransactionsPeriod(
            String codeAgence, LocalDateTime dateDebut, LocalDateTime dateFin) {

        String sql = """
            SELECT COD_EMPRESA, COD_AGENCIA, NUM_SECUENCIA_DOC, COD_CLIENTE,
                   COD_SISTEMA, TIP_TRANSACCION, SUB_TIP_TRANSAC,
                   FEC_TRANSACCION, IND_ESTADO, MTO_MOVIMIENTO, MTO_EFECTIVO,
                   COD_CAJERO, NUM_MOV_ENTE, OBSERVACIONES,
                   MON_SALDO_ANTERIOR, MON_SALDO_DISPONIBLE,
                   ASIENTO_CONTABLE, TIP_ENTE, COD_ENTE
            FROM CJ.CJ_TRAN_MENSUAL_ENCA 
            WHERE COD_AGENCIA = ? 
            AND FEC_TRANSACCION >= ? 
            AND FEC_TRANSACCION <= ?
            AND IND_ESTADO = 'A'
            ORDER BY FEC_TRANSACCION, NUM_SECUENCIA_DOC
        """;

        List<Map<String, Object>> transactions = productionJdbcTemplate.queryForList(sql,
                codeAgence,
                Timestamp.valueOf(dateDebut),
                Timestamp.valueOf(dateFin)
        );

        log.info("Transactions Production récupérées: {}", transactions.size());

        // Analyser les types de transactions
        if (!transactions.isEmpty()) {
            Map<String, Long> typeCount = transactions.stream()
                    .collect(Collectors.groupingBy(
                            t -> {
                                String type = String.valueOf(t.get("TIP_TRANSACCION"));
                                switch(type) {
                                    case "3": return "Opérations réserve";
                                    case "5": return "Dépôts clients";
                                    case "6": return "Retraits clients";
                                    default: return "Type " + type;
                                }
                            },
                            Collectors.counting()
                    ));
            log.info("Répartition Production: {}", typeCount);
        }

        return transactions;
    }

    /**
     * Compile les résultats du rapprochement
     */
    private void compileResults(
            ReconciliationResultDTO result,
            List<TransactionSafDTO> middlewareTransactions,
            List<OperationReserveDTO> reserveOperations,
            List<Map<String, Object>> productionTransactions,
            RapprochementResult rapprochement) {

        // Séparer par type
        separateMiddlewareTransactionsByType(middlewareTransactions, result);
        separateReserveOperationsByType(reserveOperations, result);

        // Récupérer uniquement les transactions Production rapprochées
        List<Map<String, Object>> matchedProduction = new ArrayList<>();
        for (Integer index : rapprochement.getMatchedProductionIndices()) {
            if (index < productionTransactions.size()) {
                matchedProduction.add(productionTransactions.get(index));
            }
        }

        separateProductionTransactionsByType(matchedProduction, result);

        // Calculer les totaux
        BigDecimal totalMiddleware = result.getMontantTotalDepotsMiddleware()
                .add(result.getMontantTotalRetraitsMiddleware())
                .add(result.getMontantTotalReserve());

        BigDecimal totalProductionRapproche = calculateTotalProduction(matchedProduction);

        // Définir les résultats
        result.setTotalMiddleware(middlewareTransactions.size() + reserveOperations.size());
        result.setTotalProduction(matchedProduction.size());
        result.setTransactionsCorrespondantes(rapprochement.getNombreRapprochements());
        result.setMontantTotalMiddleware(totalMiddleware);
        result.setMontantTotalProduction(totalProductionRapproche);
        result.setMontantEcart(totalMiddleware.subtract(totalProductionRapproche));

        // Ajouter les transactions manquantes
        result.setTransactionsManquantes(rapprochement.getTransactionsNonRapprochees());

        // Déterminer le statut
        boolean hasEcart = !result.getTransactionsManquantes().isEmpty() ||
                !rapprochement.getOperationsReserveNonRapprochees().isEmpty() ||
                Math.abs(result.getMontantEcart().doubleValue()) > 1000;

        result.setStatut(hasEcart ? "ECART_DETECTE" : "SYNCHRONISE");
    }

    /**
     * Génère le rapport détaillé
     */
    /**
     * Génère le rapport détaillé
     */
    private String generateDetailedReport(
            ReconciliationResultDTO result,
            RapprochementResult rapprochement) {

        StringBuilder sb = new StringBuilder();
        sb.append("╔════════════════════════════════════════════════════════╗\n");
        sb.append("║     RAPPORT DE RAPPROCHEMENT MIDDLEWARE / SAF 2000     ║\n");
        sb.append("╚════════════════════════════════════════════════════════╝\n\n");

        sb.append(String.format("📅 Période: %s au %s (%d jours)\n",
                result.getDateDebut(), result.getDateFin(), result.getNombreJours()));
        sb.append(String.format("🏦 Agence: %s\n", result.getCodeAgence()));
        sb.append(String.format("🕐 Date rapport: %s\n\n",
                result.getDateRapprochement().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"))));

        sb.append("═══ MIDDLEWARE ═══\n");
        sb.append(String.format("📥 Dépôts clients    : %4d ops = %,15.2f GNF\n",
                result.getTotalDepotsMiddleware(), result.getMontantTotalDepotsMiddleware()));
        sb.append(String.format("📤 Retraits clients  : %4d ops = %,15.2f GNF\n",
                result.getTotalRetraitsMiddleware(), result.getMontantTotalRetraitsMiddleware()));
        sb.append(String.format("🔄 Dépôts réserve   : %4d ops = %,15.2f GNF\n",
                result.getTotalDepotsReserve(), result.getMontantTotalDepotsReserve()));
        sb.append(String.format("🔄 Retraits réserve : %4d ops = %,15.2f GNF\n",
                result.getTotalRetraitsReserve(), result.getMontantTotalRetraitsReserve()));
        sb.append(String.format("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"));
        sb.append(String.format("📊 TOTAL MIDDLEWARE  : %4d ops = %,15.2f GNF\n\n",
                result.getTotalMiddleware(), result.getMontantTotalMiddleware()));

        sb.append("═══ OPERATIONS (Rapprochées) ═══\n");
        sb.append(String.format("📥 Dépôts            : %4d ops = %,15.2f GNF\n",
                result.getTotalDepotsProduction(), result.getMontantTotalDepotsProduction()));
        sb.append(String.format("📤 Retraits          : %4d ops = %,15.2f GNF\n",
                result.getTotalRetraitsProduction(), result.getMontantTotalRetraitsProduction()));
        sb.append(String.format("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"));
        sb.append(String.format("📊 TOTAL OPERATIONS  : %4d ops = %,15.2f GNF\n\n",
                result.getTotalProduction(), result.getMontantTotalProduction()));

        sb.append("═══ RÉSULTAT RAPPROCHEMENT ═══\n");
        sb.append(String.format("✅ Correspondances   : %d/%d\n",
                rapprochement.getNombreRapprochements(), result.getTotalMiddleware()));

        int nonRapprochees = rapprochement.getTransactionsNonRapprochees().size() +
                rapprochement.getOperationsReserveNonRapprochees().size();
        sb.append(String.format("❌ Non rapprochées   : %d\n", nonRapprochees));
        sb.append(String.format("💰 ÉCART MONTANT     : %,15.2f GNF\n", result.getMontantEcart()));
        sb.append(String.format("📌 STATUT            : %s\n\n", result.getStatut()));

        // Détail des transactions manquantes avec numérotation
        if (!rapprochement.getTransactionsNonRapprochees().isEmpty()) {
            sb.append("⚠️ TRANSACTIONS CLIENTS MANQUANTES:\n");
            sb.append("─────────────────────────────────\n");

            int numeroTransaction = 1;
            for (TransactionSafDTO t : rapprochement.getTransactionsNonRapprochees()) {
                sb.append(String.format("%2d. #%d | %s | %,12.2f GNF | %s | Compte: %s\n",
                        numeroTransaction++,
                        t.getNumTransaction(),
                        t.getDateOperation().format(DateTimeFormatter.ofPattern("dd/MM HH:mm")),
                        t.getMontant(),
                        t.getTypeOperation(),
                        t.getNumCompte()));
            }
            sb.append("\n");
        }

        if (!rapprochement.getOperationsReserveNonRapprochees().isEmpty()) {
            sb.append("⚠️ OPÉRATIONS RÉSERVE MANQUANTES:\n");
            sb.append("─────────────────────────────────\n");

            int numeroOperation = 1;
            for (OperationReserveDTO op : rapprochement.getOperationsReserveNonRapprochees()) {
                sb.append(String.format("%2d. #%d | %s | %,12.2f GNF | %s\n",
                        numeroOperation++,
                        op.getNumero(),
                        op.getDateOperation().format(DateTimeFormatter.ofPattern("dd/MM HH:mm")),
                        op.getMontant(),
                        op.getLibelleOp()));
            }
        }

        return sb.toString();
    }

    // ============= MÉTHODES UTILITAIRES =============

    private void separateMiddlewareTransactionsByType(
            List<TransactionSafDTO> transactions,
            ReconciliationResultDTO result) {

        List<TransactionSafDTO> deposits = new ArrayList<>();
        List<TransactionSafDTO> withdrawals = new ArrayList<>();
        BigDecimal totalDeposits = BigDecimal.ZERO;
        BigDecimal totalWithdrawals = BigDecimal.ZERO;

        for (TransactionSafDTO trans : transactions) {
            if ("Depot".equalsIgnoreCase(trans.getTypeOperation()) ||
                    trans.getTypeTransaction() == 16) {
                deposits.add(trans);
                if (trans.getMontant() != null) {
                    totalDeposits = totalDeposits.add(trans.getMontant());
                }
            } else if ("Retrait".equalsIgnoreCase(trans.getTypeOperation()) ||
                    trans.getTypeTransaction() == 44) {
                withdrawals.add(trans);
                if (trans.getMontant() != null) {
                    totalWithdrawals = totalWithdrawals.add(trans.getMontant());
                }
            }
        }

        result.setDepositsMiddleware(deposits);
        result.setWithdrawalsMiddleware(withdrawals);
        result.setTotalDepotsMiddleware(deposits.size());
        result.setTotalRetraitsMiddleware(withdrawals.size());
        result.setMontantTotalDepotsMiddleware(totalDeposits);
        result.setMontantTotalRetraitsMiddleware(totalWithdrawals);
    }

    private void separateReserveOperationsByType(
            List<OperationReserveDTO> reserveOperations,
            ReconciliationResultDTO result) {

        List<OperationReserveDTO> deposits = new ArrayList<>();
        List<OperationReserveDTO> withdrawals = new ArrayList<>();
        BigDecimal totalDepots = BigDecimal.ZERO;
        BigDecimal totalRetraits = BigDecimal.ZERO;

        for (OperationReserveDTO operation : reserveOperations) {
            if (operation.getTransactionOp() == 2) { // Dépôt
                deposits.add(operation);
                totalDepots = totalDepots.add(operation.getMontant());
            } else if (operation.getTransactionOp() == 1) { // Retrait
                withdrawals.add(operation);
                totalRetraits = totalRetraits.add(operation.getMontant());
            }
        }

        result.setDepositsReserve(deposits);
        result.setWithdrawalsReserve(withdrawals);
        result.setTotalDepotsReserve(deposits.size());
        result.setTotalRetraitsReserve(withdrawals.size());
        result.setMontantTotalDepotsReserve(totalDepots);
        result.setMontantTotalRetraitsReserve(totalRetraits);
        result.setOperationsReserve(reserveOperations);
        result.setTotalOperationsReserve(reserveOperations.size());
        result.setMontantTotalReserve(totalDepots.add(totalRetraits));
    }

    private void separateProductionTransactionsByType(
            List<Map<String, Object>> transactions,
            ReconciliationResultDTO result) {

        List<Map<String, Object>> deposits = new ArrayList<>();
        List<Map<String, Object>> withdrawals = new ArrayList<>();
        BigDecimal totalDeposits = BigDecimal.ZERO;
        BigDecimal totalWithdrawals = BigDecimal.ZERO;

        for (Map<String, Object> trans : transactions) {
            String tipTransaccion = String.valueOf(trans.get("TIP_TRANSACCION"));
            BigDecimal montant = getBigDecimalValue(trans.get("MTO_MOVIMIENTO"));

            if ("5".equals(tipTransaccion)) { // Dépôt
                deposits.add(trans);
                if (montant != null) {
                    totalDeposits = totalDeposits.add(montant);
                }
            } else if ("6".equals(tipTransaccion)) { // Retrait
                withdrawals.add(trans);
                if (montant != null) {
                    totalWithdrawals = totalWithdrawals.add(montant);
                }
            }
            // Type 3 (réserve) est traité séparément
        }

        result.setDepositsProduction(deposits);
        result.setWithdrawalsProduction(withdrawals);
        result.setTotalDepotsProduction(deposits.size());
        result.setTotalRetraitsProduction(withdrawals.size());
        result.setMontantTotalDepotsProduction(totalDeposits);
        result.setMontantTotalRetraitsProduction(totalWithdrawals);
    }

    private BigDecimal calculateTotalProduction(List<Map<String, Object>> transactions) {
        return transactions.stream()
                .map(t -> getBigDecimalValue(t.get("MTO_MOVIMIENTO")))
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private void logFinalStatistics(ReconciliationResultDTO result, RapprochementResult rapprochement) {
        log.info("╔════════════════════════════════════════════════════════╗");
        log.info("║               STATISTIQUES FINALES                     ║");
        log.info("╠════════════════════════════════════════════════════════╣");
        log.info("║ Transactions rapprochées    : {:>5} / {:<5}            ║",
                rapprochement.getNombreRapprochements(), result.getTotalMiddleware());
        log.info("║ Transactions manquantes     : {:>5}                    ║",
                rapprochement.getTransactionsNonRapprochees().size());
        log.info("║ Opérations réserve manquantes: {:>5}                    ║",
                rapprochement.getOperationsReserveNonRapprochees().size());
        log.info("║ Écart montant               : {:>15,.2f} GNF    ║",
                result.getMontantEcart());
        log.info("║ Statut                      : {:<20}     ║", result.getStatut());
        log.info("╚════════════════════════════════════════════════════════╝");
    }

    private Long getLongValue(Object value) {
        if (value == null) return null;
        if (value instanceof Number) {
            return ((Number) value).longValue();
        }
        try {
            return Long.parseLong(value.toString());
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private BigDecimal getBigDecimalValue(Object value) {
        if (value == null) return null;
        if (value instanceof BigDecimal) {
            return (BigDecimal) value;
        }
        if (value instanceof Number) {
            return new BigDecimal(value.toString());
        }
        try {
            return new BigDecimal(value.toString());
        } catch (NumberFormatException e) {
            return null;
        }
    }

    /**
     * Classe interne pour stocker les résultats du rapprochement
     */
    private static class RapprochementResult {
        private final List<TransactionSafDTO> transactionsNonRapprochees = new ArrayList<>();
        private final List<OperationReserveDTO> operationsReserveNonRapprochees = new ArrayList<>();
        private final Set<Integer> matchedProductionIndices = new HashSet<>();
        private int nombreRapprochements = 0;

        public void addTransactionNonRapprochee(TransactionSafDTO transaction) {
            transactionsNonRapprochees.add(transaction);
        }

        public void addOperationReserveNonRapprochee(OperationReserveDTO operation) {
            operationsReserveNonRapprochees.add(operation);
        }

        public void incrementRapprochements() {
            nombreRapprochements++;
        }

        public void addMatchedProductionIndex(int index) {
            matchedProductionIndices.add(index);
        }

        public Set<Integer> getMatchedProductionIndices() {
            return matchedProductionIndices;
        }

        public List<TransactionSafDTO> getTransactionsNonRapprochees() {
            return transactionsNonRapprochees;
        }

        public List<OperationReserveDTO> getOperationsReserveNonRapprochees() {
            return operationsReserveNonRapprochees;
        }

        public int getNombreRapprochements() {
            return nombreRapprochements;
        }
    }
}