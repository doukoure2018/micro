package io.digiservices.ebanking.utils;

import java.math.BigDecimal;
import java.util.Locale;

/**
 * Determine le sens (DEPOT / RETRAIT) d'un mouvement de compte.
 *
 * Production (CC.CC_MOVIMTO_MENSUAL) : seul le libelle discrimine. Verification faite
 * sur BDCRG prod le 2026-10-10 : IND_APL_CARGO vaut 'N' sur les 21 579 792 mouvements
 * confirmes (dont 2 118 540 retraits au libelle), la colonne ne porte donc aucune
 * information debit/credit. La regle historique de digi (SafTertiaryRepository.COND_RETRAIT)
 * est conservee telle quelle ; la valeur brute reste exposee dans
 * TransactionCompteDTO.indicateurBrut a titre de trace.
 *
 * Middleware (TRANSACTIONSAF) : les soldes avant/apres operation sont deterministes ;
 * le libelle n'est utilise qu'a defaut.
 */
public final class SensMouvement {

    public static final String DEPOT = "DEPOT";
    public static final String RETRAIT = "RETRAIT";
    public static final String INCONNU = "INCONNU";

    private SensMouvement() {
    }

    public static String depuisSoldesOuLibelle(BigDecimal soldeAvant, BigDecimal soldeApres, String libelle) {
        if (soldeAvant != null && soldeApres != null) {
            int cmp = soldeApres.compareTo(soldeAvant);
            if (cmp < 0) {
                return RETRAIT;
            }
            if (cmp > 0) {
                return DEPOT;
            }
        }
        return depuisLibelle(libelle);
    }

    /** Regle historique : un libelle contenant RETRAIT ou RETIRO est un retrait, sinon un depot. */
    public static String depuisLibelle(String libelle) {
        if (libelle == null || libelle.isBlank()) {
            return INCONNU;
        }
        String l = libelle.toUpperCase(Locale.ROOT);
        return (l.contains("RETRAIT") || l.contains("RETIRO")) ? RETRAIT : DEPOT;
    }
}
