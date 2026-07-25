package io.digiservices.clients.reg;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Engagement (credit) au niveau brut SAF (source : PR.PR_CREDITOS).
 * Contrat ebanking &lt;-&gt; bcrgservice.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegEngagementDto {
    private String codEmpresa;
    private String codAgencia;
    private Long numCredito;         // reference interne engagement
    private String codCliente;       // beneficiaire
    private String nomCliente;
    private String indPersona;

    private Long tipCredito;
    private String codMoneda;
    private BigDecimal monCredito;   // montant de l'engagement
    private BigDecimal monSaldo;     // solde
    private BigDecimal monCuota;     // montant de l'echeance
    private Long cantCuotas;         // nombre d'echeances
    private BigDecimal tasaInteres;  // taux d'interet
    private String indEstado;        // etat SAF

    private String codActividad;
    private LocalDate fecCalificacion;
    private LocalDate fecApertura;         // date d'accord
    private LocalDate fecPrimerDesembolso; // date de mise en place (1er decaissement)
    private LocalDate fecVencimiento;      // date de fin
}
