package io.digiservices.ecreditservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DelegationCreditDto {
    private Long delegationId;
    private String delegationLibele;
    private Integer totalDemandes;
    private BigDecimal montantTotal;
    private List<DemandeIndividuel> demandes;
}