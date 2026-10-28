package io.digiservices.clients.agri;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Demande de credit saisie dans digi (point 9 de la demande KUMY). Le circuit interne compte
 * seize etats ; ils sont ramenes a cinq etapes lisibles, et l'etat brut reste expose pour que
 * rien ne soit perdu par la simplification.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DemandeCreditPartenaireDto {

    private Long numeroDossier;
    private String nomClient;
    private String numeroMembre;
    /** PHYSIQUE ou MORALE. */
    private String typeClient;
    private BigDecimal montantDemande;
    /** Montant retenu par le dernier niveau de decision, quand il differe du demande. */
    private BigDecimal montantPropose;
    private Integer dureeMois;
    private Integer typeCredit;
    private String objetCredit;
    /** RECU, EN_INSTRUCTION, ACCORDE, REFUSE, ANNULE. */
    private String etape;
    /** L'etat interne exact du circuit digi (VALIDATED_FINAL, CORRECTION_DR…). */
    private String etatDetaille;
    private LocalDate dateCreation;
    /** Date de la decision terminale (accord, refus, annulation) ; null si en cours. */
    private LocalDate dateDecision;
    /** JOURNAL (journal horodate des etats) ou DOSSIER (dates portees par le dossier). */
    private String sourceDateDecision;
    private Long delegationId;
    private Long agenceId;
    /** Code SAF du point de vente. */
    private String codeAgence;
    private Long agentId;
    private String nomAgent;
}
