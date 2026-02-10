package io.digiservices.ecreditservice.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class ProduitDto {
    private Long produitId;
    private Long collecteId;

    private Integer ordre;
    private String nomProduit;
    private BigDecimal prixVente;
    private BigDecimal coutAchat;
    private Integer quantite;

    // Generated columns (read-only)
    private BigDecimal chiffreAffaires;
    private BigDecimal coutTotal;
    private BigDecimal margeUnitaire;
}
