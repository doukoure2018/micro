package io.digiservices.bcrgservice.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Données complémentaires d'une personne physique (feuille DonneeComplementaire) :
 * NbPersCharge = NUM_HIJOS, PropLoc = TENENCIA_VIVIENDA (code SAF en attendant le
 * référentiel BCRG) ; revenus/dépenses moyens non portés par le SI → ND.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DonneeComplementaireDto {
    @JsonProperty("NbPersCharge") private Integer nbPersCharge;
    @JsonProperty("RevMensMoy")   private String revMensMoy;
    @JsonProperty("DepMensMoy")   private String depMensMoy;
    @JsonProperty("PropLoc")      private String propLoc;
}
