package io.digiservices.bcrgservice.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/** Donnée additionnelle clé/valeur (feuille DonneesAdditionelles) — liste vide par défaut. */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DonneeAdditionnelleDto {
    @JsonProperty("IdInterneClt") private String idInterneClt;
    @JsonProperty("Cle")          private String cle;
    @JsonProperty("Valeur")       private String valeur;
}
