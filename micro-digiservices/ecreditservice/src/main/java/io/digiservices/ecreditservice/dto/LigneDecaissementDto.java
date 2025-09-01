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
public class LigneDecaissementDto {
    private Long id;
    private Long previsionId;
    private String categorie; // ACHAT_MARCHANDISES, SALAIRES, LOYER, etc.
    private String libelle;
    private BigDecimal montant;
}