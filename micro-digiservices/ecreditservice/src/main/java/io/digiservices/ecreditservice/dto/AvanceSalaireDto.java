package io.digiservices.ecreditservice.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
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
public class AvanceSalaireDto {
    private Long id;
    private String matricule;
    private BigDecimal netAmount;
    private BigDecimal netAmountLimit;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Informations jointes du personnel
    private String nomPersonnel;
    private String prenomPersonnel;
    private String numeroCompte;
}
