package io.digiservices.ebanking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * Score tel qu'il aurait ete a une date PASSEE, accompagne de ce qui s'est reellement produit
 * dans les douze mois suivants. C'est la matiere du test de calibrage : un score qui n'a
 * jamais ete confronte aux faits ne vaut rien.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EvaluationRetrospectiveDTO {
    private String codCliente;
    private LocalDate dateReference;
    /** Le score tel qu'il se serait affiche a cette date. */
    private EvaluationRisqueDTO evaluation;
    /** Le membre a-t-il laisse une echeance au-dela de 90 jours dans les douze mois suivants. */
    private Boolean defaut12Mois;
    /** Nombre d'echeances dues dans la fenetre : zero = aucune observation possible. */
    private Integer echeancesSuivantes;
    private String message;
}
