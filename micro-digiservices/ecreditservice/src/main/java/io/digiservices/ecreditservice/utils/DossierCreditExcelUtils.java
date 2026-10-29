package io.digiservices.ecreditservice.utils;

import io.digiservices.clients.portefeuille.DossierCreditDto;
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
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Le dossier d'un credit en cinq feuilles, aux memes noms et avec les memes colonnes que le
 * script d'extraction de la DSIG : la DSIG doit retrouver exactement ce qu'elle avait.
 */
public final class DossierCreditExcelUtils {

    private DossierCreditExcelUtils() {
    }

    private static final DateTimeFormatter FMT_JOUR = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private static final DateTimeFormatter FMT_HEURE = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");

    public static byte[] classeur(DossierCreditDto d) throws IOException {
        try (Workbook wb = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            CellStyle entete = styleEntete(wb);
            feuille(wb, "PR_CREDITOS", d.getFiche() == null ? List.of() : List.of(d.getFiche()), entete);
            feuille(wb, "PR_PLAN_PAGOS", d.getEcheancier(), entete);
            feuille(wb, "PR_MOVIMIENTOS", d.getMouvements(), entete);
            feuille(wb, "CC_MOVIMTO_MENSUAL", d.getMouvementsCompte(), entete);
            feuille(wb, "CG_ASTO_DETALLE", d.getEcritures(), entete);
            wb.write(out);
            return out.toByteArray();
        }
    }

    /**
     * Une feuille par table. Les colonnes sont celles des lignes rendues par SAF, dans leur
     * ordre ; une table vide garde sa feuille, avec une seule cellule qui le dit, pour qu'une
     * absence de mouvement se distingue d'une lecture qui a echoue.
     */
    private static void feuille(Workbook wb, String nom, List<Map<String, Object>> lignes, CellStyle entete) {
        Sheet f = wb.createSheet(nom);
        if (lignes == null || lignes.isEmpty()) {
            f.createRow(0).createCell(0).setCellValue("Aucune ligne pour ce crédit");
            f.setColumnWidth(0, 40 * 256);
            return;
        }
        Set<String> colonnes = new LinkedHashSet<>();
        lignes.forEach(l -> colonnes.addAll(l.keySet()));
        List<String> noms = new ArrayList<>(colonnes);

        Row ligneEntete = f.createRow(0);
        for (int c = 0; c < noms.size(); c++) {
            Cell cell = ligneEntete.createCell(c);
            cell.setCellValue(noms.get(c));
            cell.setCellStyle(entete);
        }
        int r = 1;
        for (Map<String, Object> l : lignes) {
            Row row = f.createRow(r++);
            for (int c = 0; c < noms.size(); c++) {
                ecrire(row.createCell(c), l.get(noms.get(c)));
            }
        }
        for (int c = 0; c < noms.size(); c++) {
            f.setColumnWidth(c, Math.min(Math.max(noms.get(c).length() + 4, 12), 40) * 256);
        }
        f.createFreezePane(0, 1);
    }

    /**
     * Les nombres partent en nombres, pour rester calculables ; les dates en texte lisible. Un
     * numero de credit ou de compte reste du texte : passe en nombre, il perdrait ses chiffres
     * de poids faible, piege que le script de la DSIG evitait deja.
     */
    private static void ecrire(Cell cell, Object v) {
        if (v == null) {
            cell.setCellValue("");
        } else if (v instanceof LocalDateTime t) {
            cell.setCellValue(t.format(t.getHour() == 0 && t.getMinute() == 0 && t.getSecond() == 0 ? FMT_JOUR : FMT_HEURE));
        } else if (v instanceof LocalDate j) {
            cell.setCellValue(j.format(FMT_JOUR));
        } else if (v instanceof BigDecimal n) {
            cell.setCellValue(n.doubleValue());
        } else if (v instanceof Number n) {
            cell.setCellValue(n.doubleValue());
        } else if (v instanceof Boolean b) {
            cell.setCellValue(b);
        } else {
            cell.setCellValue(String.valueOf(v));
        }
    }

    private static CellStyle styleEntete(Workbook wb) {
        CellStyle style = wb.createCellStyle();
        Font f = wb.createFont();
        f.setBold(true);
        f.setColor(IndexedColors.WHITE.getIndex());
        style.setFont(f);
        style.setFillForegroundColor(IndexedColors.DARK_GREEN.getIndex());
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        style.setBorderBottom(BorderStyle.THIN);
        return style;
    }
}
