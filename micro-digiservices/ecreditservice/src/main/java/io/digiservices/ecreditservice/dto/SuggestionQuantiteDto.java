package io.digiservices.ecreditservice.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO pour la suggestion de modification de quantité par le DE (Directeur d'Exploitation)
 * Utilisé pour modifier la quantité d'un bon de commande validé par le DR
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SuggestionQuantiteDto {
    
    @NotNull(message = "La quantité suggérée est obligatoire")
    @Min(value = 1, message = "La quantité suggérée doit être supérieure à 0")
    private Integer qteSuggeree;
    
    /**
     * Motif du changement de quantité.
     * Obligatoire si qteSuggeree est différent de qteActuelle
     */
    private String motifQte;
    
    /**
     * Observations complémentaires (optionnel)
     */
    private String observations;
    
    /**
     * ID de l'utilisateur qui suggère la modification (sera rempli par le controller)
     */
    private Long suggerePar;
    
    /**
     * Indique si la quantité suggérée est identique à la quantité actuelle
     * Si true, le motif devient optionnel
     */
    private Boolean garderQuantite;
    
    /**
     * Méthode utilitaire pour vérifier si le motif est requis
     * Le motif est obligatoire si la quantité suggérée est différente de la quantité actuelle
     */
    public boolean isMotifRequired(Integer qteActuelle) {
        if (garderQuantite != null && garderQuantite) {
            return false;
        }
        return qteSuggeree != null && !qteSuggeree.equals(qteActuelle);
    }
}
