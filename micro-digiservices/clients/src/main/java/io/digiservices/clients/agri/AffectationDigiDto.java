package io.digiservices.clients.agri;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * Affectation d'un credit SAF a un agent de credit, tenue par les directeurs d'agence dans
 * digi depuis septembre 2026 (point 8 de la demande KUMY). A distinguer du gestionnaire SAF
 * (COD_EJECUTIVO), qui reste porte par la ligne de portefeuille : les deux peuvent differer,
 * et c'est precisement ce que le pilotage veut voir.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AffectationDigiDto {

    private String codeAgence;
    private Long numeroCredit;
    private Long agentId;
    /** Identifiant de connexion de l'agent, en majuscules (voir AgentCreditDto#identifiant). */
    private String identifiant;
    /** Nom complet, nom de famille d'abord. */
    private String nom;
    private LocalDate dateAffectation;
    /** CREDIT (cas courant) ou CONTENTIEUX : un credit au judiciaire s'affecte separement. */
    private String type;
}
