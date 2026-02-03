package io.digiservices.ecreditservice.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class CreateAnalyseRequest {
    @NotNull(message = "L'ID de la demande est obligatoire")
    private Long demandeindividuelId;

    private String cycleAffaires;
    private Integer facteurCycle;
    private String hypotheseCa;
    private String typeMarge;
    private BigDecimal tauxMargeRetenu;
    private String typeCdr;
    private BigDecimal capaciteRembDeclaree;
    private BigDecimal valeurGarantie;
    private String commentaireOrientation;
}
