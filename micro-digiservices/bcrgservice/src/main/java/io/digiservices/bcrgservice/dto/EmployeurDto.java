package io.digiservices.bcrgservice.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/** Employeur d'une personne physique — non porté par le SI CRG (liste vide). */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployeurDto {
    @JsonProperty("IdInterneClt")       private String idInterneClt;
    @JsonProperty("IdInterneEmpl")      private String idInterneEmpl;
    @JsonProperty("DenominationSociale") private String denominationSociale;
    @JsonProperty("RCCM")               private String rccm;
    @JsonProperty("NIF")                private String nif;
    @JsonProperty("NIFP")               private String nifp;
    @JsonProperty("DateCreation")       private String dateCreation;
    @JsonProperty("DateEntree")         private String dateEntree;
}
