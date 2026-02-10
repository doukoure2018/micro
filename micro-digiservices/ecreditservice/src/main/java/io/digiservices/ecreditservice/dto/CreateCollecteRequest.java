package io.digiservices.ecreditservice.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class CreateCollecteRequest {
    private Long demandeindividuelId;

    private LocalDate dateEvaluation;
    private String agentCollecteCod;
    private String agentCollecteNom;

    // Section 1: Activite
    private String activiteDescription;
    private String secteurActivite;
    private String sousSecteurActivite;
    private String sousSousSecteur;
}
