package io.digiservices.clients.agri;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/** Comptes de credit et de remboursement d'un membre, avec le message d'absence le cas echeant. */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ComptesMembreDto {

    private String codeMembre;
    private String nomMembre;
    private List<CompteMembreDto> comptes;
    /** Credits en cours de remboursement, avec leurs prochaines echeances. */
    private List<CreditEnCoursDto> creditsEnCours;
    /** Renseigne uniquement quand aucun compte n'est trouve : « Compte non disponible ». */
    private String message;
}
