package io.digiservices.ebanking.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "TRANSACTIONSAF", schema = "dbo")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionSaf {

    @Id
    @Column(name = "NUMTRANSACTION")
    private Long numTransaction;

    @Column(name = "DATEOPERATION")
    private LocalDateTime dateOperation;

    @Column(name = "FAITPAR")
    private String faitPar;

    @Column(name = "NUMECRITURECOMPTABLE")
    private Long numEcritureComptable;

    @Column(name = "MONTANT")
    private BigDecimal montant;

    @Column(name = "SOLDEAVANTOPERATION")
    private BigDecimal soldeAvantOperation;

    @Column(name = "SOLDEAPRESOPERATION")
    private BigDecimal soldeApresOperation;

    @Column(name = "SOLDECAISSEAVANT")
    private BigDecimal soldeCaisseAvant;

    @Column(name = "SOLDECAISSEAPRES")
    private BigDecimal soldeCaisseApres;

    @Column(name = "TYPEOPERATION")
    private String typeOperation;

    @Column(name = "TYPETRANSACTION")
    private Long typeTransaction;

    @Column(name = "SOUSTYOETRANSACTION")
    private Long sousTypeTransaction;

    @Column(name = "NUMCOMPTE")
    private String numCompte;

    @Column(name = "SERIALCAISSE")
    private Long serialCaisse;

    @Column(name = "CODEAGENCE")
    private String codeAgence;

    @Column(name = "ETATSAF")
    private String etatSaf;

    @Column(name = "CODECLIENT")
    private String codeClient;

    @Column(name = "MOTIFS")
    private String motifs;

    @Column(name = "CODEPRODUIT")
    private String codeProduit;

    @Column(name = "DATEEXECUTION")
    private LocalDateTime dateExecution;

    @Column(name = "ERRORS")
    private String errors;

    @Column(name = "NBRE")
    private Long nbre;
}