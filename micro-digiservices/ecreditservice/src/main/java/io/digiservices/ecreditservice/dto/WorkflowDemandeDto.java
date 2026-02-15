package io.digiservices.ecreditservice.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class WorkflowDemandeDto {
    private Long demandeIndividuelId;
    private String nom;
    private String prenom;
    private String telephone;
    private String numeroMembre;
    private Long delegation;
    private Long agence;
    private Long pos;
    private BigDecimal montantDemande;
    private String objectCredit;
    private String validationState;
    private String statutDemande;
    private String codUsuarios;
    private String avisAgentCredit;
    private String avisDa;
    private String avisDr;
    private String validatedByDa;
    private String validatedByDr;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss.SSSSSS")
    private LocalDateTime dateValidationDa;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss.SSSSSS")
    private LocalDateTime dateValidationDr;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss.SSSSSS")
    private LocalDateTime createdAt;
    private String agenceLibele;
    private String delegationLibele;
    // Correction fields
    private String motifRejetDa;
    private String sectionsARevoirDa;
    private String instructionsAc;
    private String motifRejetDr;
    private String sectionsARevoirDr;
    private String instructionsDa;
    private String motifRejetDe;
    private String sectionsARevoirDe;
    private String instructionsDr;
}
