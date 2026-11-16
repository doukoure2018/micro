package io.digiservices.ecreditservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/** Rapport d'import d'un fichier de numéros dans une campagne SMS. */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SmsImportResultDto {
    private int totalLignes;
    private int importes;
    private int doublons;
    private int invalides;
    private List<String> numerosInvalides;
    /** Repartition par operateur : sans elle, aucun cout n'est estimable avant l'envoi. */
    private java.util.Map<String, Integer> parOperateur;
    /** Numeros importes qui figurent sur la liste de desinscription. */
    private int exclus;
}
