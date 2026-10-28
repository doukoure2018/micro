package io.digiservices.agriculteurservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Demande de credit saisie dans digi (point 9 du tableau de bord DE).
 *
 * <p>{@code etape} vaut RECU, EN_INSTRUCTION, ACCORDE, REFUSE ou ANNULE ; {@code etatDetaille}
 * garde l'etat exact du circuit interne, pour que la simplification ne perde rien.
 * {@code sourceDateDecision} dit d'ou vient la date : JOURNAL (journal horodate des changements
 * d'etat, en place depuis le 19/09/2026) ou DOSSIER (dates portees par le dossier, pour les
 * demandes anterieures).</p>
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DemandeCreditDto {
    private Long numeroDossier;
    private String nomClient;
    private String numeroMembre;
    private String typeClient;
    private BigDecimal montantDemande;
    private BigDecimal montantPropose;
    private Integer dureeMois;
    private Integer typeCredit;
    private String objetCredit;
    private String etape;
    private String etatDetaille;
    private LocalDate dateCreation;
    private LocalDate dateDecision;
    private String sourceDateDecision;
    private Long delegationId;
    private Long agenceId;
    private String codeAgence;
    private Long agentId;
    private String nomAgent;
}
