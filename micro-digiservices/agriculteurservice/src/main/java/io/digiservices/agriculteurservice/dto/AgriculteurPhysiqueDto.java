package io.digiservices.agriculteurservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Details d'un agriculteur personne physique (contrat public AgriPilot).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AgriculteurPhysiqueDto {

    private String prenom;
    private String nomFamille;
    private String sexe;
    private String nationalite;
    private String lieuNaissance;
    private String profession;
}
