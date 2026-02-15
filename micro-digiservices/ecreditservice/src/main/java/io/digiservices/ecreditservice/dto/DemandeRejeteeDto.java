package io.digiservices.ecreditservice.dto;

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
public class DemandeRejeteeDto {
    private Long validationDaId;
    private Long demandeindividuelId;
    private String typeValidation;
    private String motifRejet;
    private String sectionsARevoir;
    private String instructionsAc;
    private String valideParNom;
    private LocalDateTime dateRejet;
    private String nom;
    private String prenom;
    private String numeroMembre;
    private BigDecimal montantDemande;
    private String objectCredit;
    private String telephone;
    private String statutAnalyse;
    private LocalDateTime dateSoumission;
    private LocalDateTime analyseUpdatedAt;
    private String statutCorrection;
}
