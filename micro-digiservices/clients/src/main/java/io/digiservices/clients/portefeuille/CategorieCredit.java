package io.digiservices.clients.portefeuille;

/**
 * Categorie de gestion d'un credit SAF, derivee de PR.PR_CREDITOS.IND_ESTADO.
 *
 * <p>Demande DSIG du 2026-10-07 : seuls les credits qui courent encore peuvent etre confies
 * a un agent de credit. Mesure faite le meme jour sur les 185 points de service de
 * production, sur les 44 941 credits que l'ecran d'affectation proposait alors :</p>
 *
 * <pre>
 *   D  en cours      30 787 credits   228,1 Mds GNF   retard moyen  51 j
 *   I  radie         13 900 credits    21,3 Mds GNF   retard moyen 226 j
 *   J  contentieux      253 credits     1,87 Mds GNF  retard moyen  89 j
 *   A  actif              2 credits    15,0 M GNF     retard moyen 282 j
 * </pre>
 *
 * <p>Le code {@code I} n'est documente dans aucune table de correspondance du systeme
 * ({@code SafTranslator} et {@code BcrgTranslator} ne connaissent que A, D, C, T, V, J, X).
 * Sa nature a ete etablie par le comportement de ses 13 900 credits : TOUS ont depasse leur
 * date de terme et n'ont plus aucune echeance restante, aucun n'a d'echeance a venir, 13 654
 * ont un terme anterieur a 2024, et 11 981 n'ont plus aucun impaye ouvert alors qu'un solde
 * subsiste — leur echeancier a ete solde ligne a ligne en laissant un reliquat. La Direction
 * Exploitation a confirme le 2026-10-07 qu'il s'agit de credits irrecouvrables, radies, et
 * retenu le libelle « Apure ».</p>
 *
 * <p><b>Code inconnu = EN_COURS.</b> Si SAF introduit demain un nouvel etat, le credit reste
 * affectable et un avertissement est trace. C'est volontaire : rendre un credit vivant
 * invisible priverait son recouvrement de responsable, ce qui est plus grave que de laisser
 * passer un dossier inerte dans la liste.</p>
 *
 * <p>Cette enumeration vit dans le module {@code clients} pour que la regle soit ecrite UNE
 * seule fois : ecreditservice l'applique ligne a ligne, ebanking l'utilise pour ventiler la
 * synthese reseau en SQL via {@link #codesSql()}.</p>
 */
public enum CategorieCredit {

    /** Le credit court : echeancier ouvert, ou solde encore recouvrable dans le cycle normal. */
    EN_COURS("En cours", true),

    /** Dossier passe au judiciaire : ne releve plus de l'agent de credit. */
    CONTENTIEUX("Contentieux", false, "J"),

    /** Sorti du cycle : terme depasse, plus aucune echeance, irrecouvrable ou radie. */
    APURE("Apuré", false, "I");

    private final String libelle;
    private final boolean affectable;
    private final String[] codes;

    CategorieCredit(String libelle, boolean affectable, String... codes) {
        this.libelle = libelle;
        this.affectable = affectable;
        this.codes = codes;
    }

    public String getLibelle() {
        return libelle;
    }

    /** Un credit de cette categorie peut-il etre confie a un agent ? */
    public boolean isAffectable() {
        return affectable;
    }

    /**
     * Categorie d'un credit d'apres son IND_ESTADO. Tout code non reconnu, y compris null,
     * donne EN_COURS : voir la note de classe.
     */
    public static CategorieCredit depuis(String indEstado) {
        if (indEstado == null) {
            return EN_COURS;
        }
        String code = indEstado.trim().toUpperCase();
        for (CategorieCredit c : values()) {
            for (String connu : c.codes) {
                if (connu.equals(code)) {
                    return c;
                }
            }
        }
        return EN_COURS;
    }

    /**
     * Les codes IND_ESTADO de cette categorie, prets a etre insers dans un IN SQL
     * (par exemple {@code 'I'}). Vide pour EN_COURS, qui se definit par difference.
     */
    public String codesSql() {
        StringBuilder sb = new StringBuilder();
        for (String code : codes) {
            if (!sb.isEmpty()) {
                sb.append(", ");
            }
            sb.append('\'').append(code).append('\'');
        }
        return sb.toString();
    }

    /** Tous les codes NON affectables, pour la clause SQL qui definit EN_COURS par difference. */
    public static String codesNonAffectablesSql() {
        StringBuilder sb = new StringBuilder();
        for (CategorieCredit c : values()) {
            if (c.affectable) {
                continue;
            }
            if (!sb.isEmpty()) {
                sb.append(", ");
            }
            sb.append(c.codesSql());
        }
        return sb.toString();
    }
}
