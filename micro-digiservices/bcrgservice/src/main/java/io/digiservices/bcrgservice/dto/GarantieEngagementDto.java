package io.digiservices.bcrgservice.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Garantie d'un engagement (sous-objet FACULTATIF du module M2) — les garanties ne
 * sont pas portées par SAF2000 : liste vide en attendant une source (plateforme crédit).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GarantieEngagementDto {
    @JsonProperty("RefIntEng")      private String refIntEng;
    @JsonProperty("RefIntGar")      private String refIntGar;
    @JsonProperty("TypGar")         private String typGar;
    @JsonProperty("DesGar")         private String desGar;
    @JsonProperty("CodDev")         private String codDev;
    @JsonProperty("MntGar")         private String mntGar;
    @JsonProperty("TypIdent")       private String typIdent;
    @JsonProperty("CodIdent")       private String codIdent;
    @JsonProperty("DatEval")        private String datEval;
    @JsonProperty("DatExp")         private String datExp;
    @JsonProperty("MntAffecGar")    private String mntAffecGar;
    @JsonProperty("StatutGarantie") private String statutGarantie;
    @JsonProperty("IdIntGarant")    private String idIntGarant;
}
