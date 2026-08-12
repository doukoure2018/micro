package io.digiservices.bcrgservice.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Compte associé d'une personne physique (feuille CompteAssocie du classeur PP) :
 * IdInterneClt, CodAgce, NumCpt, CleRib, TypCpt, StatCpt.
 *
 * <p>NumCpt : numéro SAF (14 positions) exposé tel quel — la règle de réduction
 * à 10 positions est en attente d'arbitrage BCRG. CleRib : non porté (le CRG
 * n'est pas une banque) → ND.</p>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CompteAssocieDto {
    @JsonProperty("IdInterneClt") private String idInterneClt;
    @JsonProperty("CodAgce")      private String codAgce;
    @JsonProperty("NumCpt")       private String numCpt;
    @JsonProperty("CleRib")       private String cleRib;
    @JsonProperty("TypCpt")       private String typCpt;   // 01..04 (défaut 01 individuel)
    @JsonProperty("StatCpt")      private String statCpt;  // 00..04
}
