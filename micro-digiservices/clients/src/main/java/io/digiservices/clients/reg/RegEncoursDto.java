package io.digiservices.clients.reg;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Encours d'un engagement a une periode d'arrete (source SAF : PR.PR_CREDITOS + PR.PR_PLAN_PAGOS).
 * Contrat ebanking &lt;-&gt; bcrgservice.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegEncoursDto {
    private String codAgencia;
    private Long numCredito;
    private String codCliente;
    private String nomCliente;
    private String codMoneda;

    private BigDecimal monCredito;     // montant initial
    private BigDecimal monSaldo;       // capital restant du (MntCRDU)
    private BigDecimal monCuota;       // montant de l'echeance
    private Long cantCuotas;
    private String indEstado;
    private LocalDate fecVencimiento;

    private Long nbEchPayees;          // NbrEchPay
    private Long nbEchImpayees;        // NbrEchImp
    private Long nbEchRestantes;       // NbrEchRest
    private BigDecimal mntCapImpaye;   // MntCapImp
}
