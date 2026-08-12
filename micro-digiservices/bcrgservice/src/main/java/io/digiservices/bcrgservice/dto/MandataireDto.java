package io.digiservices.bcrgservice.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/** Mandataire d'une personne morale — non porté par le SI CRG (liste vide). */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MandataireDto {
    @JsonProperty("IdInterneClt") private String idInterneClt;
    @JsonProperty("IdInterneMdt") private String idInterneMdt;
    @JsonProperty("Qualite")      private String qualite;   // référentiel F.8
    @JsonProperty("DatDebMdt")    private String datDebMdt;
    @JsonProperty("DatFinMdt")    private String datFinMdt;
}
