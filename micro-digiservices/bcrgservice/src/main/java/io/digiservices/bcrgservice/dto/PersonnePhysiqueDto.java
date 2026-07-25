package io.digiservices.bcrgservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

/**
 * Personne physique au format de declaration BCRG (module M1).
 *
 * <p>Noms de champs alignes sur le fichier MAPPING_PERSONNE_PHYSIQUES. Les champs
 * non disponibles dans SAF (nomPere, prenomPere, nomNaiMere, datNai, nin...) sont
 * exposes null en attendant l'arbitrage metier (regle ND / source annexe).</p>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PersonnePhysiqueDto {
    private String idInterneClt;   // COD_CLIENTE
    private String natClient;      // 0=client / 1=tiers (IND_RELACION)
    private String nin;            // Numero d'identification national (a consolider)
    private LocalDate datCreaPart; // FEC_INGRESO
    private String nomNaiClt;      // PRIMER_APELLIDO (+ SEGUNDO_APELLIDO)
    private String prenomClt;      // PRIMER_NOMBRE (+ SEGUNDO_NOMBRE)
    private String nomComp;        // NOM_CLIENTE
    private String sexe;           // M / F (mappe depuis IND_SEXO)
    private String etatCivil;      // 1..4 (mappe depuis EST_CIVIL)
    private String villeNai;       // LUGAR_NACIMIENTO
    private String natClt;         // NACIONALIDAD
    private String mobile;         // TEL_PRINCIPAL
    private String profession;     // DES_PROFESION
    private String secActEcon;     // COD_ACTIVIDAD (+ libelle)
    private String secActEconLibelle;
    private String sectInst;       // '032' Particuliers (defaut PP)
    private String statutClt;      // 0=Actif (defaut)
    private String codAgce;        // COD_AGENCIA
    private String agenceLibele;   // DES_AGENCIA

    private List<CompteAssocieDto> comptesAssocies;
    private List<PieceDto> pieces;
    private List<AdresseDto> adresses;
}
