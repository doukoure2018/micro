package io.digiservices.ecreditservice.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MotifBonCmdRequest {
    private Long userId;
    private Long idBonCmd;
    private String statut; // ACCEPTER ou REJETTER
    private String motif;
    private Integer qteActuelle;
    private Integer qteSuggere;
}