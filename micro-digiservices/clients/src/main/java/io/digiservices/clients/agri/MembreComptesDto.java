package io.digiservices.clients.agri;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Un membre trouve par son numero de telephone, avec ses comptes de credit et de remboursement
 * et ses credits en cours — la meme matiere que {@link ComptesMembreDto}, un membre parmi
 * ceux qui partagent le numero.
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
    /** Vides quand le numero est partage par trop de membres : seule l'identite est servie. */
    private List<CompteMembreDto> comptes;
    private List<CreditEnCoursDto> creditsEnCours;
}
