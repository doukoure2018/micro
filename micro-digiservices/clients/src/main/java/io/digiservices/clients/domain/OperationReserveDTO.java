package io.digiservices.clients.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OperationReserveDTO {
    private Long numero;
    private LocalDateTime dateOperation;
    private String codeAgence;
    private String codeUser;
    private BigDecimal montant;
    private Long transactionOp; // 1 = Retrait, 2 = Dépôt
    private String libelleOp;
    private String compteReserve;
    private String etatOp;
    private String validerPar;
    private LocalDateTime dateExecution;


}
