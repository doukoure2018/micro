package io.digiservices.ecreditservice.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class ValidationDADto {
    private Long validationDaId;
    private Long demandeindividuelId;
    private String typeValidation;
    private String statut;
    private String motifRejet;
    private List<String> sectionsARevoir;
    private String instructionsAc;
    private Long valideParId;
    private String valideParNom;
    private LocalDateTime dateValidation;
    private LocalDateTime dateRejet;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
