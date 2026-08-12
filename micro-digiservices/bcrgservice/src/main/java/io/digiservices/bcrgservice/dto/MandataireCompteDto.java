package io.digiservices.bcrgservice.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/** Lien compte associé / mandataire d'une personne morale — non porté par le SI CRG (liste vide). */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MandataireCompteDto {
    @JsonProperty("IdInterneClt")    private String idInterneClt;
    @JsonProperty("CodAgce")         private String codAgce;
    @JsonProperty("NumCpt")          private String numCpt;
    @JsonProperty("CleRib")          private String cleRib;
    @JsonProperty("IdInterneMdtCpt") private String idInterneMdtCpt;
    @JsonProperty("DatDebMdtCpt")    private String datDebMdtCpt;
    @JsonProperty("DatFinMdtCpt")    private String datFinMdtCpt;
}
