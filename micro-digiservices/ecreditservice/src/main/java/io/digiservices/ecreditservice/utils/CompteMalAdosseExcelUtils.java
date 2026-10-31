package io.digiservices.ecreditservice.utils;

import io.digiservices.ecreditservice.dto.CompteMalAdosseDtos.CompteurDto;
import io.digiservices.ecreditservice.dto.CompteMalAdosseDtos.LigneDto;
import org.apache.poi.ss.usermodel.BorderStyle;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * Le classeur des comptes de remboursement mal adosses : la feuille de travail des corrections.
 *
 * <p>Quatre feuilles. Le detail d'abord, parce que c'est lui qu'on corrige ; puis les trois
 * synthèses qui disent ou commencer — par nature d'anomalie, par point de service, et par
 * usager ayant saisi, qui est celle ou se voit une habitude de saisie.</p>
 */
public final class CompteMalAdosseExcelUtils {

    private CompteMalAdosseExcelUtils() {
    }

    private static final DateTimeFormatter FMT_JOUR = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private static final DateTimeFormatter FMT_HEURE = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    public static byte[] classeur(List<LigneDto> lignes, List<CompteurDto> parFamille,
                                  List<CompteurDto> parAgence, List<CompteurDto> parUsager,
                                  long totalStock) throws IOException {
        try (Workbook wb = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Styles st = new Styles(wb);

            Sheet f = wb.createSheet("Anomalies");
            int r = titre(f, st, lignes.size() + " compte(s) de remboursement mal adossé(s)",
                    "Stock complet : " + totalStock + " anomalie(s) ouvertes. Le compte de remboursement doit être "
                            + "un compte courant (014) ou d'épargne (011) du client lui-même, et actif. "
                            + "La correction se fait dans SAF : digi lit la base, il n'y écrit pas.");
            String[] entetes = {"Point de service", "Code PS", "Crédit", "Client", "N° membre",
                    "Nature de l'anomalie", "Compte saisi", "Type", "Propriétaire du compte",
                    "État du compte", "Octroyé (GNF)", "Solde (GNF)", "État du crédit",
                    "Ouvert le", "Saisi par", "Saisi le", "Agent", "Détectée le",
                    "À traiter", "Prise en charge par", "Depuis (jours)", "Commentaire"};
            r = entetes(f, st, r, entetes);
            for (LigneDto l : lignes) {
                Row row = f.createRow(r++);
                int c = 0;
                cel(row, c++, l.getDesAgencia(), null);
                cel(row, c++, l.getCodAgencia(), null);
                nombre(row, c++, l.getNumCredito());
                cel(row, c++, l.getNomCliente(), null);
                cel(row, c++, l.getCodCliente(), null);
                cel(row, c++, l.getFamilleLibelle(), st.alerte);
                cel(row, c++, l.getIdCuenta() == null || l.getIdCuenta().isBlank()
                        ? "(aucun)" : l.getIdCuenta(), null);
                cel(row, c++, l.getTypeCompte(), null);
                cel(row, c++, l.getCompteClient(), null);
                cel(row, c++, l.getCompteEtat(), null);
                montant(row, c++, l.getMonCredito(), st.montant);
                montant(row, c++, l.getMonSaldo(), st.montant);
                cel(row, c++, l.getEtat(), null);
                cel(row, c++, jour(l.getFecApertura()), null);
                cel(row, c++, l.getSaisiPar(), null);
                cel(row, c++, heure(l.getDateSaisie()), null);
                cel(row, c++, l.getAgentCredit(), null);
                cel(row, c++, heure(l.getDetecteAt()), null);
                cel(row, c++, l.isATraiter() ? "Oui" : "Non", null);
                cel(row, c++, l.getTraitePar(), null);
                nombre(row, c++, l.getJoursDepuisPriseEnCharge());
                cel(row, c, l.getCommentaire(), null);
            }
            ajuster(f, entetes.length);

            feuilleSynthese(wb, st, "Par nature", "Nature de l'anomalie", parFamille,
                    "Les cinq natures d'anomalie. Seules les quatre premières déclenchent un courriel : "
                            + "un type de compte non autorisé peut relever d'un choix de gestion.");
            feuilleSynthese(wb, st, "Par point de service", "Point de service", parAgence,
                    "Les points de service les plus chargés en premier.");
            feuilleSynthese(wb, st, "Par usager de saisie", "Usager SAF", parUsager,
                    "L'usager qui a saisi le crédit dans SAF. C'est ici que se voit une habitude de saisie.");

            wb.write(out);
            return out.toByteArray();
        }
    }

    private static void feuilleSynthese(Workbook wb, Styles st, String nom, String colonne,
                                        List<CompteurDto> lignes, String sous) {
        Sheet f = wb.createSheet(nom);
        int r = titre(f, st, nom, sous);
        String[] entetes = {colonne, "Anomalies", "Sur crédits vivants", "À traiter", "Encours (GNF)"};
        r = entetes(f, st, r, entetes);
        for (CompteurDto c : lignes) {
            Row row = f.createRow(r++);
            cel(row, 0, c.getLibelle(), null);
            nombre(row, 1, c.getNb());
            nombre(row, 2, c.getNbVivants());
            nombre(row, 3, c.getNbATraiter());
            montant(row, 4, c.getEncours(), st.montant);
        }
        ajuster(f, entetes.length);
    }

    // ------------------------------------------------------------------ interne

    private static int titre(Sheet f, Styles st, String titre, String sous) {
        Row r0 = f.createRow(0);
        cel(r0, 0, titre, st.titre);
        Row r1 = f.createRow(1);
        cel(r1, 0, sous, null);
        return 3;
    }

    private static int entetes(Sheet f, Styles st, int r, String[] noms) {
        Row row = f.createRow(r);
        for (int i = 0; i < noms.length; i++) {
            cel(row, i, noms[i], st.entete);
        }
        return r + 1;
    }

    private static void ajuster(Sheet f, int colonnes) {
        for (int i = 0; i < colonnes; i++) {
            f.autoSizeColumn(i);
            int largeur = f.getColumnWidth(i);
            f.setColumnWidth(i, Math.min(Math.max(largeur, 2200), 12000));
        }
    }

    private static void cel(Row row, int col, String v, CellStyle style) {
        Cell c = row.createCell(col);
        c.setCellValue(v == null ? "" : v);
        if (style != null) {
            c.setCellStyle(style);
        }
    }

    private static void nombre(Row row, int col, Number v) {
        Cell c = row.createCell(col);
        if (v != null) {
            c.setCellValue(v.doubleValue());
        }
    }

    private static void montant(Row row, int col, BigDecimal v, CellStyle style) {
        Cell c = row.createCell(col);
        if (v != null) {
            c.setCellValue(v.doubleValue());
        }
        c.setCellStyle(style);
    }

    private static String jour(LocalDate d) {
        return d == null ? "" : d.format(FMT_JOUR);
    }

    private static String heure(LocalDateTime d) {
        return d == null ? "" : d.format(FMT_HEURE);
    }

    private static String heure(OffsetDateTime d) {
        return d == null ? "" : d.format(FMT_HEURE);
    }

    private static final class Styles {
        final CellStyle titre, entete, montant, alerte;

        Styles(Workbook wb) {
            Font gras = wb.createFont();
            gras.setBold(true);
            Font grand = wb.createFont();
            grand.setBold(true);
            grand.setFontHeightInPoints((short) 13);

            titre = wb.createCellStyle();
            titre.setFont(grand);

            entete = wb.createCellStyle();
            entete.setFont(gras);
            entete.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
            entete.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            entete.setBorderBottom(BorderStyle.THIN);

            montant = wb.createCellStyle();
            montant.setDataFormat(wb.createDataFormat().getFormat("#,##0"));

            Font rouge = wb.createFont();
            rouge.setBold(true);
            rouge.setColor(IndexedColors.DARK_RED.getIndex());
            alerte = wb.createCellStyle();
            alerte.setFont(rouge);
        }
    }
}
