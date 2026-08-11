package io.digiservices.ecreditservice.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Extension fonctionnaire d'une demande individuelle (nature client Fonctionnaire).
 * La quotité cessible (salaire net x 35 %) plafonne l'échéance mensuelle ;
 * elle est recalculée côté backend, jamais reprise du front.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class DemandeFonctionnaire {
    private Long demandeFonctionnaireId;
    private Long demandeindividuelId;

    // Emploi
    private String serviceEmployeur;
    private String departementMinistere;
    private Integer ancienneteAnnees;
    private String typeContrat;
    private String matricule;

    // Revenus
    private BigDecimal salaireNetMensuel;
    private BigDecimal autresRevenus;

    // Situation familiale spécifique
    private Integer nombreEpouses;

    // Engagement obligatoire
    private Boolean domiciliationSalaire;

    // Calculé côté backend (lecture seule)
    private BigDecimal quotiteCessible;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
