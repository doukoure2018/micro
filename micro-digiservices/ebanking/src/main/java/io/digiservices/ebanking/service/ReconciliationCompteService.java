package io.digiservices.ebanking.service;


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
public class ReconciliationCompteService {

    private final JdbcTemplate productionJdbcTemplate;
    private final JdbcTemplate middlewareJdbcTemplate;

    @Autowired
    public ReconciliationCompteService(
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
     * Rapprochement intelligent basé sur NUM_CUENTA et autres critères
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

            // Recherche par NUM_CUENTA et autres critères
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
     * Match transaction client par NUM_CUENTA + montant
     * CONTRAINTE PRINCIPALE: NUMCOMPTE → NUM_CUENTA et MONTANT → MON_MOVIMIENTO
     * IGNORE les types 32 et 33
     */
    private boolean matchClientTransactionByAccount(
            TransactionSafDTO mwTrans,
            Map<String, Object> prodTrans) {

        // IGNORER les transactions de type 32 et 33
        String tipTransaccion = String.valueOf(prodTrans.get("TIP_TRANSACCION"));
        if ("32".equals(tipTransaccion) || "33".equals(tipTransaccion)) {
            return false; // Ignorer ces types
        }

        // 1. VÉRIFIER LE NUMÉRO DE COMPTE (CRITÈRE PRINCIPAL)
        String prodNumCuenta = (String) prodTrans.get("NUM_CUENTA");
        String mwNumCompte = mwTrans.getNumCompte();

        if (prodNumCuenta == null || mwNumCompte == null) {
            return false;
        }

        // Normaliser les numéros de compte (enlever espaces, tirets)
        String prodCompteNorm = prodNumCuenta.trim().replaceAll("[\\s-]", "");
        String mwCompteNorm = mwNumCompte.trim().replaceAll("[\\s-]", "");

        if (!prodCompteNorm.equals(mwCompteNorm)) {
            return false;
        }

        // 2. VÉRIFIER LE MONTANT (CRITÈRE PRINCIPAL)
        BigDecimal mwMontant = mwTrans.getMontant();
        BigDecimal prodMontant = getBigDecimalValue(prodTrans.get("MON_MOVIMIENTO"));

        if (mwMontant == null || prodMontant == null ||
                mwMontant.compareTo(prodMontant) != 0) {
            return false;
        }

        // 3. ANALYSER LE TYPE DE TRANSACTION
        long mwTypeTransaction = mwTrans.getTypeTransaction();

        // LOG pour diagnostic
        log.info("🔍 MATCH POTENTIEL TROUVÉ: MW Type:{} vs PROD TIP_TRANSACCION:'{}' | Compte:{} | Montant:{}",
                mwTypeTransaction, tipTransaccion, mwNumCompte, mwMontant);

        String typeDetecte = mwTypeTransaction == 16 ? "DÉPÔT" :
                mwTypeTransaction == 44 ? "RETRAIT" : "AUTRE";

        // Logging détaillé
        String prodUsuario = (String) prodTrans.get("COD_USUARIO");
        String mwCajero = mwTrans.getFaitPar();

        log.info("✓ Match accepté: Compte={}, Montant={} GNF, MW Type:{} vs PROD TIP:'{}' | MW Cajero:{} vs PROD User:{}",
                mwNumCompte, mwMontant, mwTypeTransaction, tipTransaccion, mwCajero, prodUsuario);

        return true;
    }

    /**
     * Match opération réserve - Basé sur MONTANT + UTILISATEUR
     * Pour les opérations réserve, on utilise le montant et le code utilisateur
     */
    private boolean matchReserveOperation(
            OperationReserveDTO resOp,
            Map<String, Object> prodTrans) {

        // 1. VÉRIFIER LE MONTANT (CRITÈRE PRINCIPAL)
        BigDecimal resMontant = resOp.getMontant();
        BigDecimal prodMontant = getBigDecimalValue(prodTrans.get("MON_MOVIMIENTO"));

        if (resMontant == null || prodMontant == null ||
                resMontant.compareTo(prodMontant) != 0) {
            return false;
        }

        // 2. VÉRIFIER L'UTILISATEUR/CAJERO (CRITÈRE PRINCIPAL pour les réserves)
        String resCajero = resOp.getCodeUser();
        String prodUsuario = (String) prodTrans.get("COD_USUARIO");

        if (!Objects.equals(resCajero, prodUsuario)) {
            return false;
        }

        // LES DEUX CRITÈRES PRINCIPAUX CORRESPONDENT
        // Vérifications supplémentaires pour cohérence et logging

        // Vérifier si c'est bien une opération de réserve via la description
        String description = (String) prodTrans.get("DES_MOVIMIENTO");
        boolean estReserve = (description != null && description.toLowerCase().contains("reserv"));

        // Information sur le type de transaction
        String tipTransaccion = String.valueOf(prodTrans.get("TIP_TRANSACCION"));
        long transactionOp = resOp.getTransactionOp();

        log.debug("✓ Match réserve confirmé sur MONTANT + USER: Montant={} GNF | User:{} | TransactionOp:{} | TIP_TRANSACCION:{} | Desc:{}",
                resMontant, resCajero,
                transactionOp == 1 ? "Retrait réserve" : "Dépôt réserve",
                tipTransaccion, description);

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
            String codeAgence, LocalDateTime dateDebut, LocalDateTime dateFin) {

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
     * Récupère les transactions Production depuis CC_MOVIMTO_MENSUAL
     */
    private List<Map<String, Object>> getProductionTransactionsPeriod(
            String codeAgence, LocalDateTime dateDebut, LocalDateTime dateFin) {

        // D'abord, vérifier s'il y a des données dans la table
        String countSql = "SELECT COUNT(*) FROM CC.CC_MOVIMTO_MENSUAL WHERE COD_AGENCIA = ?";
        Integer totalCount = productionJdbcTemplate.queryForObject(countSql, Integer.class, codeAgence);
        log.info("📊 Nombre total de transactions pour l'agence {} dans Production: {}", codeAgence, totalCount);

        // Vérifier les dates disponibles
        String dateSql = """
            SELECT MIN(FEC_MOVIMIENTO) as MIN_DATE, MAX(FEC_MOVIMIENTO) as MAX_DATE 
            FROM CC.CC_MOVIMTO_MENSUAL 
            WHERE COD_AGENCIA = ?
        """;
        Map<String, Object> dateRange = productionJdbcTemplate.queryForMap(dateSql, codeAgence);
        log.info("📅 Plage de dates disponibles dans Production: {} à {}",
                dateRange.get("MIN_DATE"), dateRange.get("MAX_DATE"));

        // Vérifier les statuts disponibles
        String statusSql = """
            SELECT EST_MOVIMIENTO, COUNT(*) as NOMBRE 
            FROM CC.CC_MOVIMTO_MENSUAL 
            WHERE COD_AGENCIA = ? 
            GROUP BY EST_MOVIMIENTO
        """;
        List<Map<String, Object>> statuts = productionJdbcTemplate.queryForList(statusSql, codeAgence);
        log.info("📊 Distribution des statuts (EST_MOVIMIENTO): {}", statuts);

        // UTILISER LE STATUT 'C' QUI EST LE STATUT MAJORITAIRE
        String sql = """
            SELECT COD_EMPRESA, NUM_MOVIMIENTO, NUM_CUENTA, COD_PRODUCTO,
                   TIP_TRANSACCION, SUBTIP_TRANSAC, COD_SISTEMA,
                   FEC_MOVIMIENTO, NUM_DOCUMENTO, EST_MOVIMIENTO,
                   IND_APL_CARGO, MON_MOVIMIENTO, DES_MOVIMIENTO,
                   SISTEMA_FUENTE, NUM_MOV_FUENTE, COD_AGENCIA,
                   COD_USUARIO, DES_REFERENCIA
            FROM CC.CC_MOVIMTO_MENSUAL 
            WHERE COD_AGENCIA = ? 
            AND FEC_MOVIMIENTO >= ? 
            AND FEC_MOVIMIENTO <= ?
            AND EST_MOVIMIENTO = 'C'
            ORDER BY FEC_MOVIMIENTO, NUM_MOVIMIENTO
        """;

        log.info("🔍 Recherche Production - Agence: {}, Période: {} à {}, Statut: 'C' (Confirmé)",
                codeAgence, dateDebut, dateFin);

        List<Map<String, Object>> transactions = productionJdbcTemplate.queryForList(sql,
                codeAgence,
                Timestamp.valueOf(dateDebut),
                Timestamp.valueOf(dateFin)
        );

        log.info("✅ Transactions Production récupérées avec EST_MOVIMIENTO='C': {}", transactions.size());

        // Si aucune transaction, essayer avec une période élargie
        if (transactions.isEmpty() && totalCount > 0) {
            log.warn("⚠️ Aucune transaction trouvée dans la période. Tentative avec TOP 100 sans filtre de date...");

            String sqlTop100 = """
                SELECT TOP 100 
                       COD_EMPRESA, NUM_MOVIMIENTO, NUM_CUENTA, COD_PRODUCTO,
                       TIP_TRANSACCION, SUBTIP_TRANSAC, COD_SISTEMA,
                       FEC_MOVIMIENTO, NUM_DOCUMENTO, EST_MOVIMIENTO,
                       IND_APL_CARGO, MON_MOVIMIENTO, DES_MOVIMIENTO,
                       SISTEMA_FUENTE, NUM_MOV_FUENTE, COD_AGENCIA,
                       COD_USUARIO, DES_REFERENCIA
                FROM CC.CC_MOVIMTO_MENSUAL 
                WHERE COD_AGENCIA = ? 
                AND EST_MOVIMIENTO = 'C'
                ORDER BY FEC_MOVIMIENTO DESC
            """;

            transactions = productionJdbcTemplate.queryForList(sqlTop100, codeAgence);

            log.info("✅ TOP 100 transactions Production récupérées (les plus récentes): {}", transactions.size());
        }

        // Analyser les types de transactions et afficher des exemples
        if (!transactions.isEmpty()) {
            // Afficher quelques exemples pour diagnostic
            log.info("=== ÉCHANTILLON DE TRANSACTIONS PRODUCTION ===");
            int count = 0;
            for (Map<String, Object> trans : transactions) {
                if (count++ < 5) { // Afficher les 5 premières
                    log.info("Exemple PROD #{}: TIP_TRANSACCION='{}', NUM_CUENTA='{}', MON_MOVIMIENTO={}, IND_APL_CARGO='{}', EST_MOVIMIENTO='{}', COD_USUARIO='{}', FEC_MOVIMIENTO={}",
                            trans.get("NUM_MOVIMIENTO"),
                            trans.get("TIP_TRANSACCION"),
                            trans.get("NUM_CUENTA"),
                            trans.get("MON_MOVIMIENTO"),
                            trans.get("IND_APL_CARGO"),
                            trans.get("EST_MOVIMIENTO"),
                            trans.get("COD_USUARIO"),
                            trans.get("FEC_MOVIMIENTO"));
                } else {
                    break;
                }
            }

            // Analyser la distribution des types
            Map<String, Long> typeCount = transactions.stream()
                    .collect(Collectors.groupingBy(
                            t -> {
                                Object tip = t.get("TIP_TRANSACCION");
                                return tip != null ? tip.toString() : "NULL";
                            },
                            Collectors.counting()
                    ));
            log.info("📊 Distribution des TIP_TRANSACCION: {}", typeCount);

            // Analyser aussi IND_APL_CARGO pour comprendre la structure
            Map<String, Long> indCount = transactions.stream()
                    .collect(Collectors.groupingBy(
                            t -> {
                                Object ind = t.get("IND_APL_CARGO");
                                return ind != null ? ind.toString() : "NULL";
                            },
                            Collectors.counting()
                    ));
            log.info("📊 Distribution des IND_APL_CARGO: {}", indCount);
        } else {
            log.error("❌ AUCUNE transaction Production trouvée pour l'agence {} entre {} et {}",
                    codeAgence, dateDebut, dateFin);
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
            List<Map<String, Object>> allProductionTransactions,
            RapprochementResult rapprochement) {

        // Séparer par type pour Middleware
        separateMiddlewareTransactionsByType(middlewareTransactions, result);
        separateReserveOperationsByType(reserveOperations, result);

        // Récupérer uniquement les transactions Production rapprochées
        List<Map<String, Object>> matchedProduction = new ArrayList<>();
        for (Integer index : rapprochement.getMatchedProductionIndices()) {
            if (index < allProductionTransactions.size()) {
                matchedProduction.add(allProductionTransactions.get(index));
            }
        }

        // Filtrer les transactions de type 32 et 33
        List<Map<String, Object>> filteredMatchedProduction = matchedProduction.stream()
                .filter(trans -> {
                    String tip = String.valueOf(trans.get("TIP_TRANSACCION"));
                    return !"32".equals(tip) && !"33".equals(tip);
                })
                .collect(Collectors.toList());

        log.info("=== VÉRIFICATION DES TRANSACTIONS PRODUCTION RAPPROCHÉES ===");
        log.info("Nombre de transactions Production rapprochées (total): {}", matchedProduction.size());
        log.info("Nombre après exclusion des types 32/33: {}", filteredMatchedProduction.size());

        // Debug: afficher quelques transactions pour vérifier le contenu
        if (!filteredMatchedProduction.isEmpty()) {
            Map<String, Object> sample = filteredMatchedProduction.get(0);
            log.info("Exemple de transaction rapprochée - TIP_TRANSACCION: {}, MON_MOVIMIENTO: {}, NUM_CUENTA: {}",
                    sample.get("TIP_TRANSACCION"), sample.get("MON_MOVIMIENTO"), sample.get("NUM_CUENTA"));
        }

        // Séparer les transactions Production rapprochées par type (excluant 32/33)
        separateProductionTransactionsByType(filteredMatchedProduction, result);

        // Calculer les totaux
        BigDecimal totalMiddleware = result.getMontantTotalDepotsMiddleware()
                .add(result.getMontantTotalRetraitsMiddleware())
                .add(result.getMontantTotalReserve());

        // Calculer le total Production uniquement pour types 16 et 44
        BigDecimal totalProductionRapproche = result.getMontantTotalDepotsProduction()
                .add(result.getMontantTotalRetraitsProduction());

        // Définir les résultats (utiliser filteredMatchedProduction.size())
        result.setTotalMiddleware(middlewareTransactions.size() + reserveOperations.size());
        result.setTotalProduction(filteredMatchedProduction.size());

        // IMPORTANT: Calculer les transactions manquantes correctement
        int transactionsRapprochees = filteredMatchedProduction.size() +
                (reserveOperations.size() - rapprochement.getOperationsReserveNonRapprochees().size());
        int transactionsManquantes = (middlewareTransactions.size() + reserveOperations.size()) - transactionsRapprochees;

        result.setTransactionsCorrespondantes(transactionsRapprochees);
        result.setMontantTotalMiddleware(totalMiddleware);
        result.setMontantTotalProduction(totalProductionRapproche);
        result.setMontantEcart(totalMiddleware.subtract(totalProductionRapproche));

        // Ajouter les transactions manquantes du middleware
        List<TransactionSafDTO> allTransactionsManquantes = new ArrayList<>(rapprochement.getTransactionsNonRapprochees());

        // Convertir les opérations réserve manquantes en TransactionSafDTO pour l'uniformité
        for (OperationReserveDTO resOp : rapprochement.getOperationsReserveNonRapprochees()) {
            TransactionSafDTO dto = new TransactionSafDTO();
            dto.setNumTransaction(resOp.getNumero());
            dto.setDateOperation(resOp.getDateOperation());
            dto.setMontant(resOp.getMontant());
            dto.setTypeOperation(resOp.getTransactionOp() == 1 ? "Retrait Réserve" : "Dépôt Réserve");
            dto.setFaitPar(resOp.getCodeUser());
            dto.setCodeAgence(resOp.getCodeAgence());
            allTransactionsManquantes.add(dto);
        }

        result.setTransactionsManquantes(allTransactionsManquantes);

        // Déterminer le statut
        boolean hasEcart = !allTransactionsManquantes.isEmpty() ||
                Math.abs(result.getMontantEcart().doubleValue()) > 1000;

        result.setStatut(hasEcart ? "ECART_DETECTE" : "SYNCHRONISE");

        log.info("=== RÉSUMÉ COMPILATION ===");
        log.info("Total MW: {} transactions (dont {} réserve), {} GNF",
                result.getTotalMiddleware(), reserveOperations.size(), result.getMontantTotalMiddleware());
        log.info("Total PROD rapproché (types 16/44 uniquement): {} transactions, {} GNF",
                result.getTotalProduction(), result.getMontantTotalProduction());
        log.info("Transactions manquantes: {} (dont {} clients et {} réserve)",
                transactionsManquantes,
                rapprochement.getTransactionsNonRapprochees().size(),
                rapprochement.getOperationsReserveNonRapprochees().size());
        log.info("Écart montant: {} GNF", result.getMontantEcart());
        log.info("Dépôts PROD: {} (montant: {}), Retraits PROD: {} (montant: {})",
                result.getTotalDepotsProduction(), result.getMontantTotalDepotsProduction(),
                result.getTotalRetraitsProduction(), result.getMontantTotalRetraitsProduction());
    }

    /**
     * Génère le rapport détaillé
     */
    private String generateDetailedReport(
            ReconciliationResultDTO result,
            RapprochementResult rapprochement) {

        StringBuilder sb = new StringBuilder();
        sb.append("╔════════════════════════════════════════════════════════╗\n");
        sb.append("║         RAPPORT DE RAPPROCHEMENT BANCAIRE              ║\n");
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
        sb.append(String.format("📊 TOTAL MW          : %4d ops = %,15.2f GNF\n\n",
                result.getTotalMiddleware(), result.getMontantTotalMiddleware()));

        sb.append("═══ PRODUCTION (Rapprochées) ═══\n");
        sb.append(String.format("📥 Dépôts            : %4d ops = %,15.2f GNF\n",
                result.getTotalDepotsProduction(), result.getMontantTotalDepotsProduction()));
        sb.append(String.format("📤 Retraits          : %4d ops = %,15.2f GNF\n",
                result.getTotalRetraitsProduction(), result.getMontantTotalRetraitsProduction()));
        sb.append(String.format("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"));
        sb.append(String.format("📊 TOTAL PROD        : %4d ops = %,15.2f GNF\n\n",
                result.getTotalProduction(), result.getMontantTotalProduction()));

        sb.append("═══ RÉSULTAT RAPPROCHEMENT ═══\n");
        sb.append(String.format("✅ Correspondances   : %d/%d\n",
                rapprochement.getNombreRapprochements(), result.getTotalMiddleware()));

        int nonRapprochees = rapprochement.getTransactionsNonRapprochees().size() +
                rapprochement.getOperationsReserveNonRapprochees().size();
        sb.append(String.format("❌ Non rapprochées   : %d\n", nonRapprochees));
        sb.append(String.format("💰 ÉCART MONTANT     : %,15.2f GNF\n", result.getMontantEcart()));
        sb.append(String.format("📌 STATUT            : %s\n\n", result.getStatut()));

        // Détail des transactions manquantes
        if (!rapprochement.getTransactionsNonRapprochees().isEmpty()) {
            sb.append("⚠️ TRANSACTIONS CLIENTS MANQUANTES:\n");
            sb.append("─────────────────────────────────\n");

            for (TransactionSafDTO t : rapprochement.getTransactionsNonRapprochees()) {
                sb.append(String.format("• #%d | %s | %,12.2f GNF | %s | Compte: %s\n",
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

            for (OperationReserveDTO op : rapprochement.getOperationsReserveNonRapprochees()) {
                sb.append(String.format("• #%d | %s | %,12.2f GNF | %s\n",
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
            // Utiliser TYPETRANSACTION: 16 = Dépôt, 44 = Retrait
            if (trans.getTypeTransaction() == 16) {
                // DÉPÔT
                deposits.add(trans);
                if (trans.getMontant() != null) {
                    totalDeposits = totalDeposits.add(trans.getMontant());
                }
            } else if (trans.getTypeTransaction() == 44) {
                // RETRAIT
                withdrawals.add(trans);
                if (trans.getMontant() != null) {
                    totalWithdrawals = totalWithdrawals.add(trans.getMontant());
                }
            } else {
                // Autre type de transaction - logger pour investigation
                log.warn("Transaction avec TYPETRANSACTION non reconnu: {} pour transaction #{}",
                        trans.getTypeTransaction(), trans.getNumTransaction());
            }
        }

        result.setDepositsMiddleware(deposits);
        result.setWithdrawalsMiddleware(withdrawals);
        result.setTotalDepotsMiddleware(deposits.size());
        result.setTotalRetraitsMiddleware(withdrawals.size());
        result.setMontantTotalDepotsMiddleware(totalDeposits);
        result.setMontantTotalRetraitsMiddleware(totalWithdrawals);

        log.info("Middleware - Dépôts (Type 16): {} transactions, Total: {} GNF",
                deposits.size(), totalDeposits);
        log.info("Middleware - Retraits (Type 44): {} transactions, Total: {} GNF",
                withdrawals.size(), totalWithdrawals);
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

        int ignoredCount = 0;

        log.debug("=== Séparation des {} transactions Production par type ===", transactions.size());

        for (Map<String, Object> trans : transactions) {
            Object tipTransaccionObj = trans.get("TIP_TRANSACCION");
            String tipTransaccion = tipTransaccionObj != null ? String.valueOf(tipTransaccionObj) : "null";
            BigDecimal montant = getBigDecimalValue(trans.get("MON_MOVIMIENTO"));

            // IGNORER les types 32 et 33
            if ("32".equals(tipTransaccion) || "33".equals(tipTransaccion)) {
                ignoredCount++;
                log.debug("Transaction IGNORÉE - Type: {}, NUM_MOVIMIENTO: {}, Montant: {}",
                        tipTransaccion, trans.get("NUM_MOVIMIENTO"), montant);
                continue;
            }

            log.debug("Transaction PROD - NUM_MOVIMIENTO: {}, TIP_TRANSACCION: {}, MON_MOVIMIENTO: {}",
                    trans.get("NUM_MOVIMIENTO"), tipTransaccion, montant);

            if ("16".equals(tipTransaccion)) { // Dépôt
                deposits.add(trans);
                if (montant != null) {
                    totalDeposits = totalDeposits.add(montant);
                }
            } else if ("44".equals(tipTransaccion)) { // Retrait
                withdrawals.add(trans);
                if (montant != null) {
                    totalWithdrawals = totalWithdrawals.add(montant);
                }
            }
        }

        result.setDepositsProduction(deposits);
        result.setWithdrawalsProduction(withdrawals);
        result.setTotalDepotsProduction(deposits.size());
        result.setTotalRetraitsProduction(withdrawals.size());
        result.setMontantTotalDepotsProduction(totalDeposits);
        result.setMontantTotalRetraitsProduction(totalWithdrawals);

        log.info("Production rapprochée - Dépôts (Type 16): {} transactions, Total: {} GNF",
                deposits.size(), totalDeposits);
        log.info("Production rapprochée - Retraits (Type 44): {} transactions, Total: {} GNF",
                withdrawals.size(), totalWithdrawals);

        if (ignoredCount > 0) {
            log.info("📊 Transactions IGNORÉES (Types 32, 33): {} transactions",
                    ignoredCount);
        }
    }

    private BigDecimal calculateTotalProduction(List<Map<String, Object>> transactions) {
        return transactions.stream()
                .map(t -> getBigDecimalValue(t.get("MON_MOVIMIENTO")))
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
