package io.digiservices.bcrgservice.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Personne morale au format de déclaration BCRG (module M1) — contrat COMPLET :
 * les 28 champs de la feuille PersonneMorale du classeur MAPPING_PERSONNES_MORALE
 * sont toujours présents dans le JSON (retour BCRG d'août 2026).
 *
 * <p>Même politique de complétude que la personne physique (ND / null / conditionnel).
 * Le TypCpt est retiré des comptes associés PM (demande explicite BCRG).</p>
 */
@Data
@NoArgsConstructor
public class PersonneMoraleDto {
    @JsonProperty("IdInterneClt")     private String idInterneClt;     // COD_CLIENTE
    @JsonProperty("NatDec")           private String natDec;           // géré par le middleware BCRG (null)
    @JsonProperty("NatClient")        private String natClient;        // IND_RELACION
    @JsonProperty("DenomSocial")      private String denomSocial;      // RAZON_SOCIAL
    @JsonProperty("Sigle")            private String sigle;            // NOM_COMERCIAL
    @JsonProperty("DatCreat")         private String datCreat;         // non porté par le SI → ND
    @JsonProperty("Statut")           private String statut;           // '01' en activité (défaut)
    @JsonProperty("DatCreaPart")      private String datCreaPart;      // FEC_INGRESO (JJMMAAAA)
    @JsonProperty("FormeJuridique")   private String formeJuridique;   // référentiel F.7 (transcodé)
    @JsonProperty("PaysSiegeSocial")  private String paysSiegeSocial;  // 'GN'
    @JsonProperty("VilleSiegeSocial") private String villeSiegeSocial; // PM V2 : DES_PROVINCIA (référentiel PA_PROVINCIAS)
    @JsonProperty("Mobile")           private String mobile;           // TEL_PRINCIPAL normalisé
    @JsonProperty("Email")            private String email;            // facultatif → null (consigne BCRG)
    @JsonProperty("SiteWeb")          private String siteWeb;          // facultatif → null (consigne BCRG)
    @JsonProperty("Adress")           private String adress;           // DET_DIRECCION (1re adresse), obligatoire
    @JsonProperty("CommuneAdresse")   private String communeAdresse;   // PM V2 : DES_DISTRITO (repli DES_CANTON), sinon null
    @JsonProperty("CodePostal")       private String codePostal;       // COD_POSTAL (1re adresse)
    @JsonProperty("Resident")         private String resident;         // '1'
    @JsonProperty("RCCM")             private String rccm;             // PM V2 : pièce SAF type RCCM, sinon ND (obligatoire BCRG)
    @JsonProperty("NIF")              private String nif;              // non porté → ND (obligatoire BCRG)
    @JsonProperty("NIFP")             private String nifp;             // non porté → ND
    @JsonProperty("NumAgrement")      private String numAgrement;      // non porté → ND
    @JsonProperty("NumSecSoc")        private String numSecSoc;        // facultatif → null
    @JsonProperty("ActEcon")          private String actEcon;          // NAEMA A..Q (transcodé) ou null
    @JsonProperty("SectInst")         private String sectInst;         // F.5 : '040' ISBL si association, sinon '022'
    @JsonProperty("SitBancaire")      private String sitBancaire;      // réservé aux banques → null
    @JsonProperty("DateDebIB")        private String dateDebIB;        // conditionnel → null
    @JsonProperty("DateFinIB")        private String dateFinIB;        // conditionnel → null

    @JsonProperty("ComptesAssocies")      private List<CompteAssocieMoraleDto> comptesAssocies;
    @JsonProperty("Mandataires")          private List<MandataireDto> mandataires;
    @JsonProperty("MandatairesComptes")   private List<MandataireCompteDto> mandatairesComptes;
    @JsonProperty("Actionnaires")         private List<ActionnaireDto> actionnaires;
    @JsonProperty("DonneesAdditionelles") private List<DonneeAdditionnelleDto> donneesAdditionelles;
}
