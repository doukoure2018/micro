package io.digiservices.clients.portefeuille;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * Indicateurs du portefeuille par agence SAF (synthese hebdomadaire PAR).
 *
 * <p>Depuis le 2026-10-07, les six premiers indicateurs ne portent plus que sur les credits
 * AFFECTABLES, c'est-a-dire ceux qui courent encore ({@link CategorieCredit#EN_COURS}). Les
 * credits en contentieux et les credits apures sont comptes a part : ils restent visibles mais
 * ne sont la charge de personne, et les melanger faussait le taux d'affectation du directeur
 * d'agence d'environ un tiers.</p>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class IndicateursAgenceDto {
    private String codAgencia;
    private String desAgencia;
    /** Credits en cours, seuls affectables. */
    private long nbCredits;
    /** Encours des credits en cours. */
    private BigDecimal encoursTotal;
    private long nbEnRetard;
    private BigDecimal mntImpaye;
    private BigDecimal encoursPar30;
    private BigDecimal encoursPar90;
    /** Credits au judiciaire : hors charge d'agent. */
    private long nbContentieux;
    private BigDecimal encoursContentieux;
    /** Credits apures (irrecouvrables, radies) : hors charge d'agent. */
    private long nbApures;
    private BigDecimal encoursApure;
}
