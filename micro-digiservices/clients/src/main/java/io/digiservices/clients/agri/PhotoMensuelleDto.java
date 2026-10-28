package io.digiservices.clients.agri;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Photo mensuelle du portefeuille agricole d'un point de vente (point 6).
 *
 * <p>{@code source} vaut PHOTO pour le mois en cours — l'encours est alors le MON_SALDO de SAF,
 * la mesure des ecrans de la plateforme — ou RECONSTITUTION pour un mois passe, et dans ce cas
 * <b>l'encours est nul a dessein</b> : l'echeancier ne reproduit pas MON_SALDO (-41 % mesure le
 * 28/10/2026, le differe etant la norme en credit agricole). Production, sorties datees et
 * retards, eux, se reconstituent fidelement : ils reposent sur des dates reelles.</p>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PhotoMensuelleDto {
    /** Premier jour du mois observe. */
    private LocalDate mois;
    private String codAgencia;
    private Integer nbCredits;
    /** Null en RECONSTITUTION. */
    private BigDecimal encours;
    private Integer nbPar30;
    private BigDecimal encoursPar30;
    private Integer nbPar90;
    private BigDecimal encoursPar90;
    /** Du et non regle a la date d'observation : capital + interets. */
    private BigDecimal montantImpaye;
    private Integer nbProduction;
    private BigDecimal montantProduction;
    private Integer nbSorties;
    private BigDecimal montantSorties;
    /** Reserve : clotures, transferts et apures que SAF ne date pas, donc insituables. */
    private Integer nbClosSansDate;
    /** PHOTO ou RECONSTITUTION. */
    private String source;
}
