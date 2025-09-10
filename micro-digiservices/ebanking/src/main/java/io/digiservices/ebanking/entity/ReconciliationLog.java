package io.digiservices.ebanking.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "RECONCILIATION_LOGS", schema = "dbo")
@Data
public class ReconciliationLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;

    @Column(name = "RECONCILIATION_DATE")
    private LocalDate reconciliationDate;

    @Column(name = "COD_AGENCE")
    private String codeAgence;

    @Column(name = "COD_CAISSE")
    private String codeCaisse;

    @Column(name = "SERIAL_CAISSE")
    private Long serialCaisse;

    @Column(name = "TOTAL_MIDDLEWARE")
    private Integer totalMiddleware;

    @Column(name = "TOTAL_PRODUCTION")
    private Integer totalProduction;

    @Column(name = "TRANSACTIONS_MANQUANTES")
    private Integer transactionsManquantes;

    @Column(name = "MONTANT_MIDDLEWARE")
    private BigDecimal montantMiddleware;

    @Column(name = "MONTANT_PRODUCTION")
    private BigDecimal montantProduction;

    @Column(name = "MONTANT_ECART")
    private BigDecimal montantEcart;

    @Column(name = "STATUT")
    private String statut;

    @Column(name = "DETAILS_ECART", columnDefinition = "TEXT")
    private String detailsEcart;

    @Column(name = "CREATED_AT")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "CREATED_BY")
    private String createdBy;
}
