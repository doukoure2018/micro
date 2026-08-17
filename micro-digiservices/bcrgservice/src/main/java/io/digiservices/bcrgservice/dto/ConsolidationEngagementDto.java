package io.digiservices.bcrgservice.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Consolidation d'engagements (sous-objet CONDITIONNÉ du module M2, obligatoire si
 * TypModif='02') — le CRG déclare TypModif='01' : liste vide.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConsolidationEngagementDto {
    @JsonProperty("RefIntEng")        private String refIntEng;
    @JsonProperty("RefIntEngCloture") private String refIntEngCloture;
}
