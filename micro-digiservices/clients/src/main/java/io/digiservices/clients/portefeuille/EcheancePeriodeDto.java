package io.digiservices.clients.portefeuille;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Une echeance du plan de paiement SAF tombant dans une periode donnee : matiere de
 * l'etat TT1 (lot 1). Une ligne par echeance, contrairement au suivi du portefeuille
 * qui donne une ligne par credit.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EcheancePeriodeDto {

    private String codAgencia;
    private String desAgencia;
    private Long numCredito;
    private String codCliente;
    private String nomCliente;
    private String desTipCredito;
    private String indEstado;

    private Long numCuota;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate fecCuota;
    private BigDecimal monCuota;        // montant total de l'echeance
    private BigDecimal monPrincipal;    // part capital (montant - interets)
    private BigDecimal monInt;          // part interets
    private BigDecimal salPrincipal;    // capital restant du sur l'echeance
    private BigDecimal salInt;          // interets restant dus sur l'echeance
    private BigDecimal resteAPayer;     // salPrincipal + salInt
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate fecCancelacion;   // date de reglement (null = non reglee)

    /** REGLEE, A_ECHOIR ou IMPAYEE, deduit des soldes et de la date du jour. */
    private String etat;
    /** TRUE si une partie seulement a ete reglee. */
    private Boolean partielle;
    /** Jours de retard si IMPAYEE, sinon null. */
    private Long joursRetard;
}
