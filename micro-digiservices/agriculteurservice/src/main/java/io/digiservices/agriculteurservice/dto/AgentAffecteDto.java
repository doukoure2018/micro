package io.digiservices.agriculteurservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * Agent a qui le credit est affecte dans digi (point 8). A ne pas confondre avec
 * {@code codeAgent}/{@code nomAgent} de la ligne de portefeuille, qui sont le gestionnaire
 * declare dans SAF : les deux peuvent differer, et l'ecart est une information de pilotage.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AgentAffecteDto {
    private Long agentId;
    private String identifiant;
    private String nom;
    private LocalDate dateAffectation;
    /** CREDIT ou CONTENTIEUX. */
    private String type;
}
