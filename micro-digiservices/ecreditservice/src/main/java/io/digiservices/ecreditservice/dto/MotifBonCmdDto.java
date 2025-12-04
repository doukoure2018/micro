package io.digiservices.ecreditservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MotifBonCmdDto {
    private Long id;
    private Long userId;
    private Long idBonCmd;
    private String statut;
    private String motif;
    private Integer qteActuelle;
    private Integer qteSuggere;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Infos supplémentaires
    private String nomUtilisateur;
    private String numeroCommande;
}