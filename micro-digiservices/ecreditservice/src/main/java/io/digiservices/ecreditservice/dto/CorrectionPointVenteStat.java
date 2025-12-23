package io.digiservices.ecreditservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CorrectionPointVenteStat {
    private Long pointVenteId;
    private String pointVenteCode;
    private String pointVenteLibele;
    private long enAttente;
    private long rejete;
    private long valide;
    private long total;
}
