package io.digiservices.ecreditservice.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class MargeBruteDto {
    private Long margeId;
    private Long collecteId;

    private Boolean connaitTauxMarge;
    private BigDecimal tauxMargeDeclare;
    private Boolean calculerTauxMarge;
    private String frequenceVentes;

    private BigDecimal totalCaCalcule;
    private BigDecimal totalCoutCalcule;
    private BigDecimal tauxMargeCalcule;

    private List<ProduitDto> produits;
}
