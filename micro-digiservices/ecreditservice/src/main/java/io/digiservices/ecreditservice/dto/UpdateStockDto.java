package io.digiservices.ecreditservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateStockDto {
    private String service;
    private String detailBonCommande;
    private Long pointventeId;
    private Long agenceId;
    private Long delegationId;
    private Long categorieId;
    private String observations;
}