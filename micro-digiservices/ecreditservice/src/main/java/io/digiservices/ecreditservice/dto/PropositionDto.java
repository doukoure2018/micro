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
}
