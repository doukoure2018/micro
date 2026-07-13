package io.digiservices.clients.agri;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Echeance de remboursement d'un credit (derivee de PR.PR_PLAN_PAGOS).
 *
 * <p>Les champs {@code status} et {@code daysLate} sont deja derives cote ebanking
 * a partir des dates SAF (FEC_CUOTA / FEC_CANCELACION) : le partenaire AgriScore
 * consomme directement le signal de remboursement (section 02 de leur spec).</p>
 *
 * <p>{@code status} : {@code pending} (a venir), {@code paid} (soldee),
 * {@code late} (impayee et en retard), {@code missed} (retard important).</p>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AgriInstallmentDto {

    private LocalDate dueDate;      // date d'echeance prevue (FEC_CUOTA)
    private BigDecimal amount;      // montant de l'echeance (MON_CUOTA)
    private String status;          // pending | paid | late | missed
    private LocalDate paidDate;     // date de solde effectif (FEC_CANCELACION), null si impayee
    private BigDecimal paidAmount;  // montant paye (null si impayee)
    private long daysLate;          // jours de retard (0 si a temps / a venir)
}
