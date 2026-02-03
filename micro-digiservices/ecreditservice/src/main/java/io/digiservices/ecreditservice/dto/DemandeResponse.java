package io.digiservices.ecreditservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DemandeResponse {

    private Long demandeId;
    private String message;
    private boolean success; // primitive boolean pour générer isSuccess()

    /**
     * Crée une réponse de succès
     */
    public static DemandeResponse success(Long demandeId, String message) {
        return DemandeResponse.builder()
                .demandeId(demandeId)
                .message(message)
                .success(true)
                .build();
    }

    /**
     * Crée une réponse d'erreur
     */
    public static DemandeResponse error(String message) {
        return DemandeResponse.builder()
                .demandeId(0L)
                .message(message)
                .success(false)
                .build();
    }
}