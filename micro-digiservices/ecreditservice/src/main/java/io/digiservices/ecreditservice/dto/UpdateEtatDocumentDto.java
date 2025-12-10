package io.digiservices.ecreditservice.dto;

import io.digiservices.ecreditservice.enumeration.StatutDocument;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateEtatDocumentDto {
    @NotNull(message = "Le statut est obligatoire")
    private StatutDocument statut;
}