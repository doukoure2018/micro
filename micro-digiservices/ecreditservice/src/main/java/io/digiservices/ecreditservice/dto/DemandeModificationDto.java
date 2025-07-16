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
public class DemandeModificationDto {
    private Integer demandeCreditId;
    private Long managerUserId;
    private Long agentUserId;
    private String motif;
    private String justification;
    private String priorite;
    private String dateLimite;
    private String commentaireManager;
    private List<ElementModificationDto> elements;
}