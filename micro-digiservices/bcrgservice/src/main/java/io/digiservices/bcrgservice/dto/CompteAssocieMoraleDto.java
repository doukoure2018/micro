package io.digiservices.bcrgservice.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Compte associé d'une personne morale (feuille CompteAssocie du classeur PM) :
 * identique au compte PP mais SANS TypCpt (suppression demandée par la BCRG).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CompteAssocieMoraleDto {
    @JsonProperty("IdInterneClt") private String idInterneClt;
    @JsonProperty("CodAgce")      private String codAgce;
    @JsonProperty("NumCpt")       private String numCpt;
    @JsonProperty("CleRib")       private String cleRib;
    @JsonProperty("StatCpt")      private String statCpt;
}
