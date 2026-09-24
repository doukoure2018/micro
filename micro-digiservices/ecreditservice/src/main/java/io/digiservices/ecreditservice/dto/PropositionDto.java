package io.digiservices.ecreditservice.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class PropositionDto {
    private Long demandeindividuelId;
    private BigDecimal montantPropose;
    private Integer dureeProposee;
    private Integer nombreEcheancePropose;
    private BigDecimal echeanceProposee;
    private BigDecimal tauxInteretPropose;
    private String periodiciteProposee;
    /** V152 : TRUE si saisie par l'agent, FALSE si reprise de la demande. */
    private Boolean propositionSaisie;
    // Valeurs de la demande (lecture seule, pour pre-remplir / calculer)
    private BigDecimal montantDemande;
    private Integer dureeDemande;
    private String periodiciteRemboursement;
    private BigDecimal tauxInteret;
}
