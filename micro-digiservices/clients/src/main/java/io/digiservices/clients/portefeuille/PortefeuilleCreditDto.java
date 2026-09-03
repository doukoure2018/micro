package io.digiservices.clients.portefeuille;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Credit SAF vu du module de suivi du portefeuille (source PR.PR_CREDITOS +
 * derivations PR.PR_PLAN_PAGOS a la date du jour). Contrat ebanking <-> ecreditservice.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PortefeuilleCreditDto {
    private String codAgencia;
    private String desAgencia;
    private Long numCredito;
    private String codCliente;
    private String nomCliente;
    private Long tipCredito;
    private String desTipCredito;
    private String indEstado;

    private BigDecimal monCredito;      // montant accorde
    private BigDecimal monSaldo;        // capital restant du
    private BigDecimal monCuota;        // montant d'echeance
    private Long cantCuotas;
    private LocalDate fecApertura;
    private LocalDate fecVencimiento;

    private LocalDate prochaineEcheance;      // premiere echeance a venir non payee
    private LocalDate datPremiereImpayee;     // plus ancienne echeance echue non payee
    private BigDecimal mntCapImpaye;          // capital echu impaye
    private BigDecimal mntIntImpaye;          // interets echus impayes
    private Long nbEchPayees;
    private Long nbEchImpayees;
    private Long nbEchRestantes;

    private Long joursRetard;                 // calcule cote ebanking (aujourd'hui - premiere impayee)
}
