package io.digiservices.ecreditservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateStockDto {
    @NotNull(message = "L'ID utilisateur est obligatoire")
    private Long idUser;

    @NotBlank(message = "Le service est obligatoire")
    private String service;

    private String detailBonCommande;
    private Integer qte;
    private Long pointventeId;
    private Long agenceId;
    private Long delegationId;
    private Long categorieId;
    private String observations;
}
