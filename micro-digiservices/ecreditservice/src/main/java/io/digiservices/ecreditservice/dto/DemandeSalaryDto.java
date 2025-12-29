package io.digiservices.ecreditservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DemandeSalaryDto {
    private Long id;
    private Long idUser;
    private String matricule;
    private BigDecimal amount;
    private String numeroCompte;
    private String statut;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Informations jointes du personnel
    private String nomPersonnel;
    private String prenomPersonnel;
    private String phone;  // ✅ AJOUTER CE CHAMP
    private BigDecimal netAmount;
    private BigDecimal netAmountLimit;
}
