package io.digiservices.agriculteurservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Echeance de remboursement (contrat public AgriPilot).
 *
 * <p>Correspondance avec la section 02 de la specification AgriScore :
 * {@code dateEcheance}=dueDate, {@code montant}=amount, {@code statut}=status,
 * {@code datePaiement}=paidDate, {@code montantPaye}=paidAmount,
 * {@code joursRetard}=daysLate. Les valeurs de {@code statut} restent normalisees
 * en {@code pending | paid | late | missed}.</p>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EcheanceDto {

    private LocalDate dateEcheance;
    private BigDecimal montant;
    private String statut;
    private LocalDate datePaiement;
    private BigDecimal montantPaye;
    private long joursRetard;
}
