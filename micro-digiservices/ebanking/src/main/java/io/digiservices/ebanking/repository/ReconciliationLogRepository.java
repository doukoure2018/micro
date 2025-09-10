package io.digiservices.ebanking.repository;

import io.digiservices.ebanking.entity.ReconciliationLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ReconciliationLogRepository extends JpaRepository<ReconciliationLog, Long> {

    @Query("SELECT r FROM ReconciliationLog r WHERE r.codeAgence = ?1 AND r.serialCaisse = ?2 " +
            "ORDER BY r.reconciliationDate DESC")
    List<ReconciliationLog> findByCaisseHistory(String codeAgence, Long serialCaisse);

    List<ReconciliationLog> findByReconciliationDateBetween(LocalDate startDate, LocalDate endDate);
}