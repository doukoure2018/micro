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
    private String desAgencia;       // libelle agence SAF (transcodage referentiel agences BCRG, v1.8)
    private Long numCredito;         // reference interne engagement
    private String codCliente;       // beneficiaire
    private String nomCliente;
    private String indPersona;

    private Long tipCredito;
    private String desTipCredito;    // libelle type de credit SAF (transcodage F.9, v1.8)
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
    private BigDecimal monDesembolsado;    // montant decaisse (MntUtilise / hors-bilan)
    private LocalDate fecCancelacionCredito; // date de solde du credit (DatClo)
    private LocalDate fecPremiereEcheance; // premiere echeance du plan (DatPremEch)
    private BigDecimal mntInteretsTotal;   // somme des interets prevus du plan (MntInt)
    private Integer joursEntreEcheances;   // ecart moyen en jours entre echeances (PeriodRemb, v1.6)
    private Integer nbEchPlan;             // nb d'echeances du plan de paiement (0 = credit sans echeancier, v1.10)
}
