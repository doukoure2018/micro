package io.digiservices.clients.agri;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Une ligne de la serie mensuelle d'un point de vente (point 6), telle que digi la conserve.
 *
 * <p>{@code source} = PHOTO (mois observe par la plateforme : l'encours est celui de SAF) ou
 * RECONSTITUTION (mois recalcule depuis l'echeancier : production, sorties et retards fideles,
 * <b>encours nul a dessein</b> — l'echeancier ne reproduit pas le solde de SAF).</p>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HistoriqueMensuelDto {
    private LocalDate mois;
    private String codeAgence;
    private String libelleAgence;
    private Long delegationId;
    private Long nbCredits;
    private BigDecimal encours;
    private Long nbPar30;
    private BigDecimal encoursPar30;
    private Long nbPar90;
    private BigDecimal encoursPar90;
    private BigDecimal montantImpaye;
    private Long nbProduction;
    private BigDecimal montantProduction;
    private Long nbSorties;
    private BigDecimal montantSorties;
    private Long nbClosSansDate;
    private String source;
}
