package io.digiservices.ecreditservice.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateStatusDto {
    private String status; // ENCOURS, REJET, ACCEPT - sera défini par le controller

    @NotNull(message = "L'action est obligatoire")
    private String stateValidation; // VALIDER, REJETER depuis frontend, puis VALIDE, REFUSE, ACCEPTE
    private String motif; // Pour le rejet/refus
    private String observations;
    private Long traitePar;

    // Méthode utilitaire pour vérifier si c'est un refus
    public boolean isRefus() {
        return "REFUSE".equals(stateValidation) || "REJET".equals(stateValidation);
    }
}