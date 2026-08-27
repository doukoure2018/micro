package io.digiservices.ecreditservice.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Extension groupe solidaire d'une demande individuelle (nature client Groupe Solidaire).
 * Types : CAS, CAS_R, CCS, CRS, CFE, MCK, ACM. La cascade activités et les modalités
 * du prêt restent portées par la demande socle.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class DemandeGroupe {
    private Long demandeGroupeId;
    private Long demandeindividuelId;

    private String typeGroupe;
    private String nomGroupe;
    private LocalDate dateAdhesion;
    private String districtQuartier;
    private String secteur;

    // Mandataires
    private String mandataire1;
    private String contactMandataire1;
    private String mandataire2;
    private String contactMandataire2;

    private Integer nombreMembres;

    // Généré côté backend (lecture seule) : GRP-AAAA-NNNNN
    private String numeroDemande;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
