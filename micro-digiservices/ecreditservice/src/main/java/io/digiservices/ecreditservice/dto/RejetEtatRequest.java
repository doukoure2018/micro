package io.digiservices.ecreditservice.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RejetEtatRequest {
    @NotBlank(message = "Le motif de rejet est obligatoire")
    private String motif;
}