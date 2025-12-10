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
    @NotNull(message = "L'ID utilisateur est obligatoire")
    private Long userId;
    private String motif;
    private ZonedDateTime createdAt;
    private ZonedDateTime updatedAt;
}