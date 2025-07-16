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
public class ElementTraiteDto {
    private Long elementId;
    private String sectionType;
    private String champNom;
    private BigDecimal valeurFinale;
    private String statutElement; // MODIFIE, REFUSE, IGNORE
    private String commentaire;
}