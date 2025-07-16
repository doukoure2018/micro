package io.digiservices.ecreditservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TraiterDemandeDto {
    private String statut; // ACCEPTEE, REFUSEE
    private String commentaire;
    private Long agentUserId;
    private String adresseIp;
    private List<ElementTraiteDto> elementsTraites;
}
