package io.digiservices.ebanking.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionSafDTO {

    private Long numTransaction;
    private LocalDateTime dateOperation;
    private String faitPar;
    private Long numEcritureComptable;
    private BigDecimal montant;
    private BigDecimal soldeAvantOperation;
    private BigDecimal soldeApresOperation;
    private BigDecimal soldeCaisseAvant;
    private BigDecimal soldeCaisseApres;
    private String typeOperation;
    private Long typeTransaction;
    private Long sousTypeTransaction;
    private String numCompte;
    private Long serialCaisse;
    private String codeAgence;
    private String etatSaf;
    private String codeClient;
    private String motifs;
    private String codeProduit;
    private LocalDateTime dateExecution;
    private String errors;
    private Long nbre;

}