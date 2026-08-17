package io.digiservices.bcrgservice.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * Encours d'engagement au format de déclaration BCRG (module M4) — contrat v1.3,
 * aligné sur le retour BCRG « RETOUR-API-ENCOURS » : champs calculés à la date
 * d'arrêté depuis le plan de remboursement SAF2000, montants en GNF.
 *
 * <p>Tous les crédits du CRG relèvent de la catégorie d'engagement 01 (amortissables) :
 * les champs conditionnés « catégorie 01 » sont systématiquement servis. Provisions,
 * pertes et créances rattachées (comptabilité, hors module crédit SAF) sont émises à 0
 * en régime transitoire documenté. Un encours n'est jamais émis pour un engagement
 * clôturé (règle BCRG).</p>
 */
@Data
@NoArgsConstructor
public class EncoursDto {
    @JsonProperty("RefIntEng")  private String refIntEng;      // NUM_CREDITO
    @JsonProperty("CodDev")     private String codDev;         // 'GNF'
    @JsonProperty("DatEch")     private String datEch;         // dernière tombée d'échéance (JJMMAAAA)
    @JsonProperty("MntDerEch")  private BigDecimal mntDerEch;  // montant de cette échéance
    @JsonProperty("MonPai")     private BigDecimal monPai;     // dernier paiement (0 si aucun)
    @JsonProperty("DatPai")     private String datPai;         // date du dernier paiement (JJMMAAAA)
    @JsonProperty("MntHBil")    private BigDecimal mntHBil;    // hors bilan = montant non décaissé
    @JsonProperty("MntRemAnt")  private String mntRemAnt;      // facultatif, non porté → null
    @JsonProperty("MntCRDU")    private BigDecimal mntCRDU;    // capital restant dû (MON_SALDO)
    @JsonProperty("MntCreRat")  private BigDecimal mntCreRat;  // créances rattachées → 0 (transitoire)
    @JsonProperty("MntUtilise") private BigDecimal mntUtilise; // montant décaissé
    @JsonProperty("MntAgi")     private String mntAgi;         // catégorie 02 uniquement → null
    @JsonProperty("MntCapImp")  private BigDecimal mntCapImp;  // capital impayé (0 si aucun)
    @JsonProperty("MntTotImp")  private BigDecimal mntTotImp;  // capital + intérêts impayés
    @JsonProperty("DatDefaill") private String datDefaill;     // plus ancienne échéance impayée (JJMMAAAA)
    @JsonProperty("MntPro")     private BigDecimal mntPro;     // provisions → 0 (transitoire)
    @JsonProperty("MntPerte")   private BigDecimal mntPerte;   // pertes/radiations → 0 (transitoire)
    @JsonProperty("NbrEchPay")  private Long nbrEchPay;
    @JsonProperty("NbrEchImp")  private Long nbrEchImp;
    @JsonProperty("NbrEchRest") private Long nbrEchRest;
    @JsonProperty("QualiCre")   private String qualiCre;       // dérivée des jours de retard (référentiel IMF en attente)
    @JsonProperty("PD")         private String pd;             // non produit → null
    @JsonProperty("LGD")        private String lgd;            // facultatif → null
    @JsonProperty("CCF")        private String ccf;            // facultatif → null
    @JsonProperty("IFRSStage")  private String ifrsStage;      // facultatif → null
    @JsonProperty("DatEvent")   private String datEvent;       // date de session (JJMMAAAA)
}
