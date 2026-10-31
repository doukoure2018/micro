package io.digiservices.ecreditservice.utils;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;

/**
 * Calibre la largeur des colonnes d'une feuille Excel SANS mesurer de police.
 *
 * <p>{@code Sheet.autoSizeColumn} demande a AWT la largeur reelle du texte, donc une police. Les
 * images de production n'embarquent ni police ni fontconfig : l'appel y echoue par
 * {@code NoClassDefFoundError: Could not initialize class sun.awt.X11FontManager}, et l'export
 * entier part en erreur. Constate le 31/10/2026 sur l'export des comptes mal adosses, puis
 * verifie : zero police dans les conteneurs ecreditservice et userservice.</p>
 *
 * <p>Le piege etait deja connu — un commentaire de l'export des salaires dit « evite
 * autoSizeColumn qui peut echouer en prod » — mais rien n'empechait de le refaire. Un test de
 * garde interdit desormais cet appel dans tout le module.</p>
 *
 * <p>La largeur est donc deduite du NOMBRE DE CARACTERES, ce qui ne demande rien a personne. Les
 * lignes de titre, reconnaissables a leur cellule unique, sont ignorees : sans cela, un titre de
 * cent caracteres imposerait sa largeur a la premiere colonne.</p>
 */
public final class ExcelLargeurs {

    private ExcelLargeurs() {
    }

    /** Un caractere vaut 256 unites de largeur dans le format Excel. */
    private static final int UNITE = 256;
    private static final int MIN_CARACTERES = 10;
    private static final int MAX_CARACTERES = 60;
    /** Un montant mis en forme avec ses separateurs de milliers. */
    private static final int LARGEUR_NOMBRE = 14;

    public static void ajuster(Sheet feuille, int colonnes) {
        for (int c = 0; c < colonnes; c++) {
            int caracteres = MIN_CARACTERES;
            for (Row ligne : feuille) {
                if (ligne.getPhysicalNumberOfCells() <= 1) {
                    continue;   // banniere : une seule cellule, souvent tres longue
                }
                Cell cellule = ligne.getCell(c);
                if (cellule == null) {
                    continue;
                }
                caracteres = Math.max(caracteres, switch (cellule.getCellType()) {
                    case STRING -> cellule.getStringCellValue().length();
                    case NUMERIC -> LARGEUR_NOMBRE;
                    case BOOLEAN -> 5;
                    default -> 0;
                });
            }
            feuille.setColumnWidth(c, Math.min(caracteres + 3, MAX_CARACTERES) * UNITE);
        }
    }
}
