package io.digiservices.ecreditservice.utils;

import io.digiservices.ecreditservice.dto.CreditNegatifDtos.EtatDto;
import io.digiservices.ecreditservice.dto.CreditNegatifDtos.LigneDto;
import io.digiservices.ecreditservice.dto.CreditNegatifDtos.SituationDto;
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
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/** Export Excel des credits negatifs (V177) : feuille de travail pour la correction dans SAF. */
public final class CreditNegatifExcelUtils {

    private CreditNegatifExcelUtils() {
    }

    private static final DateTimeFormatter FMT = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private static final DateTimeFormatter FMT_HEURE = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    private static final String[] ENTETES = {
            "Code PS", "Point de service", "N° crédit", "Code client", "Client", "Type",
            "Montant octroyé (GNF)", "Solde (GNF)", "Pire solde vu (GNF)", "Ouvert le",
            "État SAF", "État", "Agent SAF", "Détecté le", "Signalé le", "Corrigé le",
            "Solde corrigé (GNF)", "Figé le", "Source", "Écart régularisé (GNF)",
            "Dernier solde lu dans SAF (GNF)", "Lu le", "Conclusion",
            "Pris en charge par", "Le", "Commentaire"
    };

    public static byte[] classeur(SituationDto d) throws IOException {
        try (Workbook wb = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            CellStyle titre = styleTitre(wb), entete = styleEntete(wb), texte = styleTexte(wb),
                    nombre = styleNombre(wb), negatif = styleNegatif(wb);
            Sheet f = wb.createSheet("Crédits négatifs");
            int l = 0;
            cellule(f, l++, 0, "Crédits négatifs SAF — situation au "
                    + LocalDateTime.now().format(FMT_HEURE), titre);
            cellule(f, l++, 0, d.getNbOuverts() + " crédit(s) ouvert(s) pour "
                    + montant(d.getMontantOuvert()) + " GNF, dont " + d.getNbNonTraites()
                    + " sans prise en charge", texte);
            l++;

            cellule(f, l++, 0, "Répartition par état", titre);
            Row rEtat = ligne(f, l++);
            cel(rEtat, 0, "État", entete);
            cel(rEtat, 1, "Crédits", entete);
            cel(rEtat, 2, "Montant (GNF)", entete);
            for (EtatDto e : d.getParEtat()) {
                Row r = ligne(f, l++);
                cel(r, 0, e.getLibelle(), texte);
                num(r, 1, e.getNb(), nombre);
                num(r, 2, e.getMontant() == null ? 0 : e.getMontant().doubleValue(), negatif);
            }
            l++;

            Row entetes = ligne(f, l++);
            for (int i = 0; i < ENTETES.length; i++) {
                cel(entetes, i, ENTETES[i], entete);
            }
            for (LigneDto c : d.getLignes()) {
                Row r = ligne(f, l++);
                cel(r, 0, nvl(c.getCodAgencia()), texte);
                cel(r, 1, nvl(c.getDesAgencia()), texte);
                cel(r, 2, c.getNumCredito() == null ? "" : String.valueOf(c.getNumCredito()), texte);
                cel(r, 3, nvl(c.getCodCliente()), texte);
                cel(r, 4, nvl(c.getNomCliente()), texte);
                cel(r, 5, c.getTipCredito() == null ? "" : String.valueOf(c.getTipCredito()), texte);
                num(r, 6, c.getMonCredito() == null ? 0 : c.getMonCredito().doubleValue(), nombre);
                num(r, 7, c.getMonSaldo() == null ? 0 : c.getMonSaldo().doubleValue(), negatif);
                num(r, 8, c.getPireSolde() == null ? 0 : c.getPireSolde().doubleValue(), negatif);
                cel(r, 9, c.getFecApertura() == null ? "" : c.getFecApertura().format(FMT), texte);
                cel(r, 10, nvl(c.getIndEstado()), texte);
                cel(r, 11, nvl(c.getEtat()), texte);
                cel(r, 12, nvl(c.getCodEjecutivo()), texte);
                cel(r, 13, c.getDetecteAt() == null ? "" : c.getDetecteAt().format(FMT_HEURE), texte);
                cel(r, 14, c.getSignaleAt() == null ? "" : c.getSignaleAt().format(FMT_HEURE), texte);
                cel(r, 15, c.getCorrigeAt() == null ? "" : c.getCorrigeAt().format(FMT_HEURE), texte);
                // Solde corrige (V193) : fige a la regularisation. Vide quand il n'y a rien eu a
                // figer, plutot qu'un zero qui se confondrait avec un solde ramene a zero.
                if (c.getSoldeCorrige() != null) {
                    num(r, 16, c.getSoldeCorrige().doubleValue(), nombre);
                } else {
                    cel(r, 16, "", texte);
                }
                cel(r, 17, c.getSoldeCorrigeAt() == null ? "" : c.getSoldeCorrigeAt().format(FMT_HEURE), texte);
                cel(r, 18, "REPRISE".equals(c.getSoldeCorrigeSource()) ? "reconstitué"
                        : "SAF".equals(c.getSoldeCorrigeSource()) ? "lu dans SAF" : "", texte);
                if (c.getEcartRegularise() != null) {
                    num(r, 19, c.getEcartRegularise().doubleValue(), nombre);
                } else {
                    cel(r, 19, "", texte);
                }
                if (c.getSoldeApres() != null) {
                    num(r, 20, c.getSoldeApres().doubleValue(), nombre);
                } else {
                    cel(r, 20, "", texte);
                }
                cel(r, 21, c.getVerifieSafAt() == null ? "" : c.getVerifieSafAt().format(FMT_HEURE), texte);
                cel(r, 22, nvl(c.getConclusionLibelle()), texte);
                cel(r, 23, nvl(c.getTraitePar()), texte);
                cel(r, 24, c.getTraiteAt() == null ? "" : c.getTraiteAt().format(FMT), texte);
                cel(r, 25, nvl(c.getCommentaire()), texte);
            }
            int[] largeurs = {10, 26, 13, 16, 30, 8, 20, 18, 20, 14, 11, 14, 16, 18, 18, 18,
                    20, 18, 14, 22, 26, 18, 20, 24, 13, 40};
            for (int i = 0; i < largeurs.length; i++) {
                f.setColumnWidth(i, largeurs[i] * 256);
            }
            wb.write(out);
            return out.toByteArray();
        }
    }

    private static Row ligne(Sheet f, int l) {
        Row r = f.getRow(l);
        return r == null ? f.createRow(l) : r;
    }

    private static void cellule(Sheet f, int l, int c, String v, CellStyle style) {
        Cell cell = ligne(f, l).createCell(c);
        cell.setCellValue(v);
        cell.setCellStyle(style);
    }

    private static void cel(Row r, int c, String v, CellStyle style) {
        Cell cell = r.createCell(c);
        cell.setCellValue(v);
        cell.setCellStyle(style);
    }

    private static void num(Row r, int c, double v, CellStyle style) {
        Cell cell = r.createCell(c);
        cell.setCellValue(v);
        cell.setCellStyle(style);
    }

    private static String montant(BigDecimal v) {
        return v == null ? "0" : java.text.NumberFormat.getIntegerInstance(java.util.Locale.FRANCE)
                .format(v.longValue());
    }

    private static String nvl(String s) {
        return s == null ? "" : s;
    }

    private static CellStyle styleTitre(Workbook wb) {
        CellStyle s = wb.createCellStyle();
        Font f = wb.createFont();
        f.setBold(true);
        f.setFontHeightInPoints((short) 12);
        f.setColor(IndexedColors.DARK_RED.getIndex());
        s.setFont(f);
        return s;
    }

    private static CellStyle styleEntete(Workbook wb) {
        CellStyle s = base(wb);
        Font f = wb.createFont();
        f.setBold(true);
        f.setFontHeightInPoints((short) 10);
        s.setFont(f);
        s.setFillForegroundColor(IndexedColors.ROSE.getIndex());
        s.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        return s;
    }

    private static CellStyle styleTexte(Workbook wb) {
        return base(wb);
    }

    private static CellStyle styleNombre(Workbook wb) {
        CellStyle s = base(wb);
        s.setDataFormat(wb.createDataFormat().getFormat("#,##0"));
        return s;
    }

    private static CellStyle styleNegatif(Workbook wb) {
        CellStyle s = base(wb);
        s.setDataFormat(wb.createDataFormat().getFormat("#,##0;[Red]-#,##0"));
        return s;
    }

    private static CellStyle base(Workbook wb) {
        CellStyle s = wb.createCellStyle();
        s.setBorderBottom(BorderStyle.THIN);
        s.setBorderTop(BorderStyle.THIN);
        s.setBorderLeft(BorderStyle.THIN);
        s.setBorderRight(BorderStyle.THIN);
        return s;
    }
}
