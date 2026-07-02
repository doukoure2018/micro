package io.digiservices.ecreditservice.dto;

import io.digiservices.ecreditservice.enumeration.StatutDocument;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EtatDocumentDto {
    private Long id;
    private StatutDocument statut;
    // Facultatif : NULL pour les remontées publiques (sans compte connecté)
    private Long userId;
    private String motif;
    // Localisation choisie sur le formulaire de remontée (sinon dérivée du user au backoffice)
    private Long delegationId;
    private Long agenceId;
    private Long pointventeId;
    private ZonedDateTime createdAt;
    private ZonedDateTime updatedAt;
}