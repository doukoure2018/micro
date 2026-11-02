package io.digiservices.clients.portefeuille;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Credit SAF a solde negatif (MON_SALDO &lt; 0). Lu dans la base de PRODUCTION : une imputation
 * fautive du matin doit se voir le matin meme, pas dans la sauvegarde de la veille.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreditNegatifDto {
    private String codAgencia;
    private String desAgencia;
    private Long numCredito;
    private String codCliente;
    private String nomCliente;
    private Integer tipCredito;
    private BigDecimal monCredito;
    private BigDecimal monSaldo;
    private LocalDate fecApertura;
    private LocalDate fecVencimiento;
    /** D en cours, I apure, J contentieux, C clos, T transfere ; vide ou inconnu = en cours. */
    private String indEstado;
    private String codEjecutivo;
    /**
     * Le nom de l'usager SAF derriere {@code codEjecutivo} ({@code SG.SG_USUARIOS.NOM_USUARIO}).
     * Vide quand le code ne correspond a aucun usager : un agent parti dont le compte a ete
     * supprime laisse son code sur les credits qu'il a portes.
     */
    private String nomEjecutivo;
}
