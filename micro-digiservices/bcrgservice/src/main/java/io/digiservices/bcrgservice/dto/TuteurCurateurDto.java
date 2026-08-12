package io.digiservices.bcrgservice.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/** Tuteur/curateur d'une personne physique — non porté par le SI CRG (liste vide). */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TuteurCurateurDto {
    @JsonProperty("IdInterneClt") private String idInterneClt;
    @JsonProperty("IdInterneMdt") private String idInterneMdt;
    @JsonProperty("Qualite")      private String qualite;
    @JsonProperty("DatDbtMdt")    private String datDbtMdt;
}
