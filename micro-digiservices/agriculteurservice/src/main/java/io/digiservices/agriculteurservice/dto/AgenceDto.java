package io.digiservices.agriculteurservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Agence (contrat public AgriPilot).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AgenceDto {

    private String codeEntreprise;
    private String codeAgence;
    private String libelleAgence;
}
