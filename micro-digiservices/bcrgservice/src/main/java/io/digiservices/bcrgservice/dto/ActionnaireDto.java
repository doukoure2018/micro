package io.digiservices.bcrgservice.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/** Actionnaire d'une personne morale — non porté par le SI CRG (liste vide). */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ActionnaireDto {
    @JsonProperty("IdInterneClt") private String idInterneClt;
    @JsonProperty("IdInterneAct") private String idInterneAct;
    @JsonProperty("PartAct")      private String partAct;   // NNN.NN
    @JsonProperty("DaEntrAct")    private String daEntrAct;
}
