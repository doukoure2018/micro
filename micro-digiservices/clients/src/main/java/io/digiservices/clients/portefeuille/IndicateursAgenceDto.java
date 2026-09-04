package io.digiservices.clients.portefeuille;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/** Indicateurs du portefeuille par agence SAF (synthese hebdomadaire PAR). */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class IndicateursAgenceDto {
    private String codAgencia;
    private String desAgencia;
    private long nbCredits;
    private BigDecimal encoursTotal;
    private long nbEnRetard;
    private BigDecimal mntImpaye;
    private BigDecimal encoursPar30;
    private BigDecimal encoursPar90;
}
