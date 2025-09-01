package io.digiservices.ecreditservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LigneEncaissementDto {
    private Long id;
    private Long previsionId;
    private String categorie; // VENTES, AUTRES_REVENUS, PRET
    private String libelle;
    private BigDecimal montant;
}