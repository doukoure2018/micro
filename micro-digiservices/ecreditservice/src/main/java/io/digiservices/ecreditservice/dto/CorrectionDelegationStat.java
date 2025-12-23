package io.digiservices.ecreditservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CorrectionDelegationStat {
    private Long delegationId;
    private String delegationLibele;
    private long enAttente;
    private long rejete;
    private long valide;
    private long total;
}
