package io.digiservices.clients.portefeuille;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

/** Ligne d'echeancier d'un credit SAF (PR.PR_PLAN_PAGOS). */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PortefeuilleEcheanceDto {
    private Long numCuota;
    private LocalDate fecCuota;          // date d'echeance
    private BigDecimal monCuota;         // montant de l'echeance
    private BigDecimal monInt;           // part interets prevue
    private BigDecimal salPrincipal;     // capital restant a payer sur l'echeance
    private BigDecimal salInt;           // interets restant a payer sur l'echeance
    private LocalDate fecCancelacion;    // date de paiement (null = non payee)
}
