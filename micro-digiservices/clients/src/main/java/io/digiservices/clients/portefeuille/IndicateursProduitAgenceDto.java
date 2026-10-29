package io.digiservices.clients.portefeuille;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * Indicateurs du portefeuille par agence SAF ET par type de credit, credits EN COURS seulement
 * (portefeuille a risque, lot 2). Une seule requete pour tout le reseau, sur le modele de
 * {@link IndicateursAgenceDto}.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class IndicateursProduitAgenceDto {
    private String codAgencia;
    private String desAgencia;
    private Long tipCredito;
    private String desTipCredito;
    private long nbCredits;
    private BigDecimal encours;
    private long nbEnRetard;
    private BigDecimal impaye;
    private BigDecimal encoursPar30;
    private long nbPar30;
    private BigDecimal encoursPar90;
    private long nbPar90;
}
