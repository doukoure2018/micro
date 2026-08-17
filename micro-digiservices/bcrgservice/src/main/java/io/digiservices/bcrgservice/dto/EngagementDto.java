package io.digiservices.bcrgservice.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

/**
 * Engagement au format de déclaration BCRG (module M2) — contrat v1.3, aligné sur le
 * retour BCRG « RETOUR-API-ENGAGEMENTS » : champs du classeur MAPPING_ENGAGEMENTS,
 * bénéficiaires en sous-objet obligatoire, dates JJMMAAAA, taux NN.NN.
 *
 * <p>Le CRG ne pratique que des crédits amortissables à la clientèle (catégorie
 * d'engagement 01) à taux fixe : les champs conditionnels sont valorisés par des
 * conventions stables documentées (voir doc v1.3 §5). Champs sans source SI → "ND"
 * ou null selon la règle de complétude v1.1.</p>
 */
@Data
@NoArgsConstructor
public class EngagementDto {
    @JsonProperty("RefIntEng")        private String refIntEng;        // NUM_CREDITO
    @JsonProperty("TypEve")           private String typEve;           // '01' engagement accordé
    @JsonProperty("LigneParent")      private String ligneParent;      // '01' ne s'applique pas
    @JsonProperty("RefIntLigne")      private String refIntLigne;      // conditionnel → null
    @JsonProperty("RefDemandeEng")    private String refDemandeEng;    // facultatif → null
    @JsonProperty("DatDem")           private String datDem;           // conditionnel → null
    @JsonProperty("TypModif")         private String typModif;         // '01' aucune modification
    @JsonProperty("EstDout")          private String estDout;          // conditionnel → null
    @JsonProperty("Cloture")          private String cloture;          // '0'/'1' dérivé de l'état SAF
    @JsonProperty("MotifCloture")     private String motifCloture;     // '01' remboursé (si clôturé)
    @JsonProperty("DatClo")           private String datClo;           // FEC_CANCELACION (JJMMAAAA)
    @JsonProperty("DatAccord")        private String datAccord;        // FEC_APERTURA (JJMMAAAA)
    @JsonProperty("DateMEP")          private String dateMEP;          // FEC_PRIMER_DESEMBOLSO (JJMMAAAA)
    @JsonProperty("TypEng")           private String typEng;           // code SI (référentiel F.9 en attente)
    @JsonProperty("MntEng")           private BigDecimal mntEng;       // MON_CREDITO
    @JsonProperty("MntInt")           private BigDecimal mntInt;       // somme des intérêts du plan
    @JsonProperty("CodDev")           private String codDev;           // 'GNF'
    @JsonProperty("PeriodRemb")       private String periodRemb;       // référentiel en attente → ND
    @JsonProperty("TxIntEng")         private String txIntEng;         // NN.NN
    @JsonProperty("TypTxInt")         private String typTxInt;         // '00' fixe
    @JsonProperty("TxComm")           private String txComm;           // null (pas de commission)
    @JsonProperty("IndRef")           private String indRef;           // null (taux fixe)
    @JsonProperty("Sprd")             private String sprd;             // null (taux fixe)
    @JsonProperty("TxEffGlob")        private String txEffGlob;        // TEG non calculé → ND
    @JsonProperty("MoyRemb")          private String moyRemb;          // '01' débit de compte (convention)
    @JsonProperty("TypAmo")           private String typAmo;           // '05' échéance constante ('04' si unique)
    @JsonProperty("TypDiffAmo")       private String typDiffAmo;       // 'A' aucun différé (convention)
    @JsonProperty("UnitDur")          private String unitDur;          // conditionnel → null
    @JsonProperty("PerDiffAmo")       private String perDiffAmo;       // conditionnel → null
    @JsonProperty("MntEch")           private BigDecimal mntEch;       // MON_CUOTA
    @JsonProperty("NbrEch")           private Long nbrEch;             // CANT_CUOTAS
    @JsonProperty("DatPremEch")       private String datPremEch;       // 1re échéance du plan (JJMMAAAA)
    @JsonProperty("DatFin")           private String datFin;           // FEC_VENCIMIENTO (JJMMAAAA)
    @JsonProperty("MntFrais")         private BigDecimal mntFrais;     // 0 (convention)
    @JsonProperty("MntComm")          private BigDecimal mntComm;      // 0 (convention)
    @JsonProperty("CodAgce")          private String codAgce;          // code agence SI (référentiel en attente)
    @JsonProperty("EstRachatCreance") private String estRachatCreance; // '02' non
    @JsonProperty("ParCont")          private String parCont;          // conditionnel → null
    @JsonProperty("ValNom")           private String valNom;           // conditionnel → null
    @JsonProperty("ValCess")          private String valCess;          // conditionnel → null
    @JsonProperty("DatEvent")         private String datEvent;         // date de session (JJMMAAAA)

    @JsonProperty("Beneficiaires")    private List<BeneficiaireEngagementDto> beneficiaires;
    @JsonProperty("Garanties")        private List<GarantieEngagementDto> garanties;
    @JsonProperty("Consolidations")   private List<ConsolidationEngagementDto> consolidations;
}
