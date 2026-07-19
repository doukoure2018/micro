package io.digiservices.userservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/** Rapport d'import Excel du reseau (remplacement complet). */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReseauImportReport {
    private int totalLignes;   // lignes de donnees lues (hors entete)
    private int importes;      // lignes inserees
    private int ignorees;      // lignes rejetees
    private List<String> erreurs; // motifs de rejet (ligne + raison)
}
