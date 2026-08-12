package io.digiservices.bcrgservice.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Personne physique au format de déclaration BCRG (module M1) — contrat COMPLET :
 * les 36 champs de la feuille PersonnePhysique du classeur MAPPING_PERSONNE_PHYSIQUES
 * sont toujours présents dans le JSON (retour BCRG d'août 2026).
 *
 * <p>Politique de complétude : champ sans source dans le SI CRG → {@code "ND"} ;
 * champ sourcé mais vide pour ce client → {@code null} ; champ conditionnel non
 * applicable (« doit rester vide sinon ») → {@code null}. Dates au format JJMMAAAA.</p>
 */
@Data
@NoArgsConstructor
public class PersonnePhysiqueDto {
    @JsonProperty("IdInterneClt")  private String idInterneClt;   // COD_CLIENTE
    @JsonProperty("NatDec")        private String natDec;         // géré par le middleware BCRG (null)
    @JsonProperty("NatClient")     private String natClient;      // 0=client / 1=tiers (IND_RELACION)
    @JsonProperty("NIN")           private String nin;            // non porté par le SI → ND
    @JsonProperty("DatCreaPart")   private String datCreaPart;    // FEC_INGRESO (JJMMAAAA)
    @JsonProperty("NomNaiClt")     private String nomNaiClt;      // PRIMER/SEGUNDO_APELLIDO
    @JsonProperty("NomMtlClt")     private String nomMtlClt;      // NOM_CONYUGUE si F mariée, sinon null
    @JsonProperty("PrenomClt")     private String prenomClt;      // PRIMER/SEGUNDO_NOMBRE
    @JsonProperty("NomComp")       private String nomComp;        // NOM_CLIENTE
    @JsonProperty("Sexe")          private String sexe;           // M / F
    @JsonProperty("DatNai")        private String datNai;         // non porté par le SI → ND
    @JsonProperty("EtatCivil")     private String etatCivil;      // 1..4
    @JsonProperty("NomPere")       private String nomPere;        // non porté → ND (exigé par la BCRG)
    @JsonProperty("PrenomPere")    private String prenomPere;     // non porté → ND
    @JsonProperty("NomNaiMere")    private String nomNaiMere;     // non porté → ND
    @JsonProperty("PrmMre")        private String prmMre;         // non porté → ND
    @JsonProperty("VilleNai")      private String villeNai;       // LUGAR_NACIMIENTO
    @JsonProperty("PaysNai")       private String paysNai;        // non porté → ND
    @JsonProperty("NatClt")        private String natClt;         // NACIONALIDAD
    @JsonProperty("Resident")      private String resident;       // '1' (réseau domestique)
    @JsonProperty("PaysRes")       private String paysRes;        // 'GN'
    @JsonProperty("Mobile")        private String mobile;         // TEL_PRINCIPAL normalisé +224...
    @JsonProperty("Email")         private String email;          // non porté, facultatif → null (consigne BCRG)
    @JsonProperty("Adress")        private String adress;         // DET_DIRECCION (1re adresse), obligatoire
    @JsonProperty("CommuneAdress") private String communeAdress;  // facultatif → null (consigne BCRG)
    @JsonProperty("CodePostal")    private String codePostal;     // COD_POSTAL (1re adresse)
    @JsonProperty("Profession")    private String profession;     // DES_PROFESION
    @JsonProperty("SecActEcon")    private String secActEcon;     // NAEMA A..Q (transcodé) ou null
    @JsonProperty("SectInst")      private String sectInst;       // '032' Particuliers
    @JsonProperty("NumSecSoc")     private String numSecSoc;      // facultatif → null (consigne BCRG)
    @JsonProperty("STutelle")      private String sTutelle;       // '0' par défaut
    @JsonProperty("StatutClt")     private String statutClt;      // '0' Actif
    @JsonProperty("DateDeces")     private String dateDeces;      // conditionnel → null
    @JsonProperty("SitBancaire")   private String sitBancaire;    // réservé aux banques → null
    @JsonProperty("DateDebIB")     private String dateDebIB;      // conditionnel → null
    @JsonProperty("DateFinIB")     private String dateFinIB;      // conditionnel → null

    @JsonProperty("ComptesAssocies")      private List<CompteAssocieDto> comptesAssocies;
    @JsonProperty("Pieces")               private List<PieceDto> pieces;
    @JsonProperty("DonneeComplementaire") private DonneeComplementaireDto donneeComplementaire;
    @JsonProperty("TuteurCurateur")       private List<TuteurCurateurDto> tuteurCurateur;
    @JsonProperty("Employeurs")           private List<EmployeurDto> employeurs;
    @JsonProperty("DonneesAdditionelles") private List<DonneeAdditionnelleDto> donneesAdditionelles;
}
