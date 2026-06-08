package io.digiservices.ebanking.constant;

/**
 * Filtre SQL identifiant le perimetre agricole dans SAF2000 (BDCRG).
 *
 * <p>Contrat d'utilisation : la table {@code PR.PR_CREDITOS} DOIT etre aliasee
 * {@code cr} dans toute requete utilisant cette constante (les colonnes sont
 * prefixees {@code cr.}).</p>
 *
 * <p>Regle metier :</p>
 * <ul>
 *   <li>Types de credit 100% agricoles : 1,2,5,10,11,24,26,27,32,34,35,36,37,38,42,43,44,48</li>
 *   <li>Types polyvalents restreints au secteur agricole (COD_ACTIVIDAD='101') : 3,4,6,9,49,50,51,52</li>
 *   <li>Tout credit portant des hectares (CANT_HECTAREAS &gt; 0)</li>
 * </ul>
 */
public final class AgriculturalFilter {

    private AgriculturalFilter() {
        // Classe utilitaire : pas d'instanciation
    }

    /**
     * Predicat SQL (sans le mot-cle WHERE) a injecter dans les requetes.
     * Necessite l'alias {@code cr} sur PR.PR_CREDITOS.
     */
    public static final String AGRICULTURAL_FILTER_CREDIT = """
            (
                cr.TIP_CREDITO IN (1,2,5,10,11,24,26,27,32,34,35,36,37,38,42,43,44,48)
                OR (cr.TIP_CREDITO IN (3,4,6,9,49,50,51,52) AND cr.COD_ACTIVIDAD = '101')
                OR cr.CANT_HECTAREAS > 0
            )
            """;
}
