package io.digiservices.ecreditservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.time.ZonedDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DocumentCartePrepaidDto {
    private Long id;
    @NotNull(message = "L'ID de l'état du document est obligatoire")
    private Long idEtatDoc;
    @NotBlank(message = "Le document est obligatoire")
    private String doc;
    // Facultatif : NULL pour les remontées publiques (sans compte connecté)
    private Long userId;
    private ZonedDateTime createdAt;
    private ZonedDateTime updatedAt;
    private EtatDocumentDto etatDocument;
}