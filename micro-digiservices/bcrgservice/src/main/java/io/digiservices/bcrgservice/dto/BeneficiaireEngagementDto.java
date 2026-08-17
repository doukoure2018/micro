package io.digiservices.bcrgservice.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Bénéficiaire d'un engagement (sous-objet OBLIGATOIRE du module M2).
 * Au CRG, chaque crédit a un titulaire unique : PourBenef = 100.00.
 * IdIntBen = COD_CLIENTE, cohérent avec IdInterneClt des modules M1.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BeneficiaireEngagementDto {
    @JsonProperty("RefIntEng") private String refIntEng;
    @JsonProperty("IdIntBen")  private String idIntBen;
    @JsonProperty("PourBenef") private String pourBenef; // NN.NN
}
