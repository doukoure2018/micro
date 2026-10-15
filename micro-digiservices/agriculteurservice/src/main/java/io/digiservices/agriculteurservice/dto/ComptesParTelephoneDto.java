package io.digiservices.agriculteurservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Réponse de {@code GET /agriculteurs/telephones/{telephone}/comptes} : les membres dont le
 * téléphone principal est ce numéro, chacun avec ses comptes et ses crédits en cours. Un
 * numéro peut être porté par plusieurs membres : la réponse est une liste. Aucun membre, ou
 * numéro partagé au-delà du seuil : {@code 200} avec un {@code message} — ce n'est pas une erreur.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ComptesParTelephoneDto {

    /** Le numéro cherché, normalisé : 9 chiffres, sans indicatif ni séparateur. */
    private String telephone;
    private int nombreMembres;
    /** Vrai quand les comptes n'ont pas été lus parce que le numéro est partagé par trop de membres. */
    private boolean comptesNonLus;
    private List<MembreComptesDto> membres;
    private String message;
}
