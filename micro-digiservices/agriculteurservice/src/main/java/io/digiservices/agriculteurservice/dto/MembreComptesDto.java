package io.digiservices.agriculteurservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Un membre trouvé par son numéro de téléphone principal, avec ses comptes de crédit et de
 * remboursement et ses crédits en cours — la même matière que {@link ComptesMembreDto}.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MembreComptesDto {

    private String codeMembre;
    private String nomMembre;
    private String codeAgence;
    private String libelleAgence;
    /** Sur quel telephone de la fiche le numero a ete trouve : principal, secondaire ou autre. */
    private String champTelephone;
    /** Vides quand le numéro est partagé par trop de membres : seule l'identité est servie. */
    private List<CompteDto> comptes;
    private List<CreditRemboursementDto> creditsEnCours;
}
