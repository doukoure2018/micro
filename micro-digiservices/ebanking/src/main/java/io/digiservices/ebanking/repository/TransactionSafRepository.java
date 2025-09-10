package io.digiservices.ebanking.repository;

import io.digiservices.ebanking.entity.TransactionSaf;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransactionSafRepository extends JpaRepository<TransactionSaf, Long> {

    @Query("SELECT t FROM TransactionSaf t WHERE t.codeAgence = ?1 AND t.serialCaisse = ?2 " +
            "AND t.dateOperation BETWEEN ?3 AND ?4 AND t.etatSaf != 'ANNULE'")
    List<TransactionSaf> findByAgenceAndCaisseAndDateRange(
            String codeAgence, Long serialCaisse, LocalDateTime startDate, LocalDateTime endDate
    );

    @Query("SELECT t FROM TransactionSaf t WHERE t.etatSaf = 'EN_ATTENTE'")
    List<TransactionSaf> findPendingTransactions();
}