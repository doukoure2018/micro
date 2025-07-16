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
public class ElementModificationDto {
    private String sectionType;
    private String champNom;
    private String champLibelle;
    private BigDecimal valeurActuelle;
    private BigDecimal valeurSuggeree;
    private String justification;
    private String typeModification;
    private boolean obligatoire;
    private Integer ordreAffichage;
}
