package io.digiservices.ecreditservice.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class AmortissementDto {
    private Long amortissementId;
    private Long collecteId;

    private Integer ordre;
    private String natureImmobilisation;
    private String typeImmobilisation;
    private LocalDate dateAcquisition;
    private Integer dureeAmortissementMois;
    private BigDecimal valeurAcquisition;

    // Calculated fields
    private BigDecimal amortissementMensuel;
    private BigDecimal amortissementCumule;
    private BigDecimal valeurNetteComptable;
    private String statutAmortissement;
}
