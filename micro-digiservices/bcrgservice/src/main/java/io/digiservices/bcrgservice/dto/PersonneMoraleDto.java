package io.digiservices.bcrgservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

/**
 * Personne morale au format de declaration BCRG (module M1).
 *
 * <p>Noms de champs alignes sur le fichier MAPPING_PERSONNES_MORALE. Les champs non
 * disponibles dans SAF (RCCM, NIF, NumAgrement, dateCreation...) sont exposes null
 * en attendant l'arbitrage metier.</p>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PersonneMoraleDto {
    private String idInterneClt;   // COD_CLIENTE
    private String natClient;      // IND_RELACION
    private String denomSocial;    // RAZON_SOCIAL
    private String sigle;          // NOM_COMERCIAL
    private String formeJuridique; // CLASE_SOCIEDAD (mappe)
    private LocalDate datCreaPart; // FEC_INGRESO
    private String mobile;         // TEL_PRINCIPAL
    private String actEcon;        // COD_ACTIVIDAD (+ libelle)
    private String actEconLibelle;
    private String rccm;           // non dispo SAF (a consolider)
    private String nif;            // non dispo SAF (a consolider)
    private String sectInst;       // secteur institutionnel (a arbitrer)
    private String codAgce;        // COD_AGENCIA
    private String agenceLibele;   // DES_AGENCIA

    private List<CompteAssocieDto> comptesAssocies;
    private List<PieceDto> pieces;
    private List<AdresseDto> adresses;
}
