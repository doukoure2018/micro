package io.digiservices.ecreditservice.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class AnalyseFinanciereDto {
    private Long analyseId;
    private Long demandeindividuelId;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dateEvaluation;

    private String analysteCodUsuario;
    private String analysteNom;

    // Cycle parameters
    private String cycleAffaires;
    private Integer facteurCycle;

    // Hypothesis parameters
    private String hypotheseCa;
    private String typeMarge;
    private BigDecimal tauxMargeRetenu;

    // Repayment capacity
    private String typeCdr;
    private BigDecimal capaciteRembDeclaree;

    // Guarantees
    private BigDecimal valeurGarantie;

    private String commentaireOrientation;

    // Workflow status
    private String statut;  // BROUILLON, SOUMISE, VALIDEE, REJETEE

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime dateSoumission;

    private String soumisPar;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;
}
