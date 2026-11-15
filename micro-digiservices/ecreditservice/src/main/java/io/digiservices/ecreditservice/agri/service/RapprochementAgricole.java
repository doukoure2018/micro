package io.digiservices.ecreditservice.agri.service;

import io.digiservices.ecreditservice.agri.dto.AgriDtos.Rapprochement;

import java.math.BigDecimal;
import java.math.RoundingMode;

/**
 * Le prévisionnel du dossier face au réalisé du terrain.
 *
 * <p>Classe pure, sans base ni Spring : c'est le cœur du lot 3, et la seule chose qui fasse de
 * la collecte autre chose qu'un carnet. L'écart entre ce qui était annoncé au bureau et ce que
 * la parcelle a donné est ce qui, répété sur deux campagnes, dit quelque chose d'un membre.</p>
 *
 * <p><b>Rien n'est calculé contre une valeur absente.</b> Un écart mesuré contre zéro, ou
 * contre une prévision vide, serait un chiffre faux présenté comme une mesure — et il
 * entrerait un jour dans une décision de crédit.</p>
 */
public final class RapprochementAgricole {

    private RapprochementAgricole() {
    }

    public static Rapprochement de(BigDecimal quantitePrevueKg, BigDecimal quantiteReelleKg,
                                   BigDecimal prixPrevu, BigDecimal prixReel) {
        if (quantitePrevueKg == null && quantiteReelleKg == null
                && prixPrevu == null && prixReel == null) {
            return null;
        }
        return new Rapprochement(quantitePrevueKg, quantiteReelleKg,
                ecartPct(quantitePrevueKg, quantiteReelleKg), prixPrevu, prixReel);
    }

    /**
     * L'écart en pourcentage, négatif quand la récolte est inférieure à l'annonce. Vide dès
     * qu'un des deux termes manque ou que la prévision est nulle.
     */
    public static BigDecimal ecartPct(BigDecimal prevue, BigDecimal reelle) {
        if (prevue == null || reelle == null || prevue.signum() <= 0) {
            return null;
        }
        return reelle.subtract(prevue)
                .multiply(BigDecimal.valueOf(100))
                .divide(prevue, 1, RoundingMode.HALF_UP);
    }
}
