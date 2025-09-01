package io.digiservices.ecreditservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GarantiePropose {
    private Long garantieProposeId;
    private Long demandeIndividuelId;
    private String typeGarantie;
    private String descriptionGarantie;
    private BigDecimal valeurGarantie;
    private BigDecimal valeurEmprunte;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
