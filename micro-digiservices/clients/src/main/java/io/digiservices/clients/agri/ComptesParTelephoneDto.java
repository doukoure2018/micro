package io.digiservices.clients.agri;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Reponse de la recherche par numero de telephone principal (CL_CLIENTES.TEL_PRINCIPAL) : un
 * numero peut etre porte par plusieurs membres, la reponse est donc une liste. Au-dela du seuil
 * parametre, les membres sont listes sans leurs comptes et {@code message} le dit.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ComptesParTelephoneDto {

    /** Le numero tel qu'il a ete cherche, normalise (9 chiffres). */
    private String telephone;
    private int nombreMembres;
    /** Vrai quand les comptes n'ont pas ete lus parce que le numero est partage par trop de membres. */
    private boolean comptesNonLus;
    private List<MembreComptesDto> membres;
    /** « Aucun membre avec ce numero », ou l'explication du seuil ; {@code null} sinon. */
    private String message;
}
