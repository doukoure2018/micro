package io.digiservices.ecreditservice.utils;

import io.digiservices.ecreditservice.dto.PortefeuilleScoreDtos.ScoreAgentDto;
import io.digiservices.ecreditservice.dto.PortefeuilleScoreDtos.ScoresDto;
import io.digiservices.ecreditservice.dto.PortefeuilleScoreDtos.SyntheseScoreDto;
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

/** Export Excel de l'appreciation des agents (V164) : Synthese par delegation, puis un agent par ligne. */
public final class PortefeuilleScoreExcelUtils {

    private PortefeuilleScoreExcelUtils() {
    }

    private static final DateTimeFormatter FMT_DATE = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private static final DateTimeFormatter FMT_HORODATAGE = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    private static final String[] ENTETES_AGENTS = {
            "Délégation", "Agence", "Point de service", "Code", "Agent", "Actif", "Affecté depuis",
            "Crédits", "Encours (GNF)", "En retard", "Montant en retard (GNF)", "Dont hérités (hors calcul)",
            "PAR 30", "Régularité", "Part en retard", "Poids du retard", "Charge / médiane",
            "Pts PAR 30 /30", "Pts régularité /20", "Pts part retard /15", "Pts poids retard /15", "Pts charge /10",
            "Score /100", "Classe", "Motif non noté"
    };

    public static byte[] classeur(ScoresDto d) throws IOException {
        try (Workbook wb = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            CellStyle titre = styleTitre(wb), entete = styleEntete(wb), montant = styleMontant(wb),
                    pourcent = stylePourcent(wb), decimal = styleDecimal(wb);

            Sheet s = wb.createSheet("Synthèse");
            int r = 0;
            Cell ct = s.createRow(r++).createCell(0);
            ct.setCellValue("Appréciation des agents de crédit — " + (d.getReseau() == null ? "" : d.getReseau().getDelegation()));
            ct.setCellStyle(titre);
            ligne(s, r++, "Exporté le", LocalDateTime.now().format(FMT_HORODATAGE));
            ligne(s, r++, "Calculé le", d.getDateCalcul() == null ? "jamais" : d.getDateCalcul().format(FMT_DATE));
            var b = d.getBornes();
            ligne(s, r++, "Grille", "PAR 30 (30 pts, 0 → " + pct(b.getPar30Mauvais()) + "), régularité (20 pts, 100 % → "
                    + pct(b.getRegulariteMauvais()) + "), part en retard (15 pts, 0 → " + pct(b.getTauxRetardMauvais())
                    + "), poids du retard (15 pts, 0 → " + pct(b.getPoidsRetardMauvais()) + "), charge (10 pts, médiane réseau) ; "
                    + "score sur 90 ramené à 100 ; A ≥ 80, B ≥ 65, C ≥ 50, D en dessous");
            ligne(s, r++, "Non noté", "moins de " + b.getMinCredits() + " crédits ou affecté depuis moins de "
                    + b.getMinJoursAffectation() + " jours ; retard hérité hors calcul pendant " + b.getJoursFranchiseHerite() + " jours");
            r++;
            Row ra = s.createRow(r++);
            String[] es = {"Délégation", "Agents", "Notés", "A", "B", "C", "D", "Non notés", "Score moyen", "PAR 30 moyen"};
            for (int i = 0; i < es.length; i++) { Cell c = ra.createCell(i); c.setCellValue(es[i]); c.setCellStyle(entete); }
            if (d.getReseau() != null) ligneSynthese(s.createRow(r++), d.getReseau(), pourcent);
            for (SyntheseScoreDto sy : d.getDelegations()) ligneSynthese(s.createRow(r++), sy, pourcent);
            s.setColumnWidth(0, 30 * 256);
            for (int i = 1; i < es.length; i++) s.setColumnWidth(i, 14 * 256);

            Sheet f = wb.createSheet("Agents");
            Row re = f.createRow(0);
            for (int i = 0; i < ENTETES_AGENTS.length; i++) { Cell c = re.createCell(i); c.setCellValue(ENTETES_AGENTS[i]); c.setCellStyle(entete); }
            int i = 1;
            for (ScoreAgentDto a : d.getAgents()) {
                Row row = f.createRow(i++);
                int k = 0;
                row.createCell(k++).setCellValue(nvl(a.getDelegation()));
                row.createCell(k++).setCellValue(nvl(a.getAgence()));
                row.createCell(k++).setCellValue(nvl(a.getPointVente()));
                row.createCell(k++).setCellValue(nvl(a.getCodAgencia()));
                row.createCell(k++).setCellValue(nvl(a.getAgentNom()));
                row.createCell(k++).setCellValue(Boolean.FALSE.equals(a.getAgentActif()) ? "non" : "oui");
                row.createCell(k++).setCellValue(date(a.getDatePremiereAffectation()));
                row.createCell(k++).setCellValue(a.getNbCredits());
                cellMontant(row, k++, a.getEncours(), montant);
                row.createCell(k++).setCellValue(a.getNbEnRetard());
                cellMontant(row, k++, a.getMontantRetard(), montant);
                row.createCell(k++).setCellValue(a.getNbHerites());
                cellPct(row, k++, a.getPar30(), pourcent);
                cellPct(row, k++, a.getRegularite(), pourcent);
                cellPct(row, k++, a.getTauxRetard(), pourcent);
                cellPct(row, k++, a.getPoidsRetard(), pourcent);
                cellPct(row, k++, a.getCharge(), pourcent);
                cellDec(row, k++, a.getPtsPar30(), decimal);
                cellDec(row, k++, a.getPtsRegularite(), decimal);
                cellDec(row, k++, a.getPtsTauxRetard(), decimal);
                cellDec(row, k++, a.getPtsPoidsRetard(), decimal);
                cellDec(row, k++, a.getPtsCharge(), decimal);
                if (a.getScore() != null) row.createCell(k).setCellValue(a.getScore());
                k++;
                row.createCell(k++).setCellValue("NN".equals(a.getClasse()) ? "non noté" : nvl(a.getClasse()));
                row.createCell(k).setCellValue(nvl(a.getMotifNonNote()));
            }
            f.createFreezePane(5, 1);
            int[] largeurs = {18, 20, 26, 8, 30, 8, 14, 10, 18, 10, 20, 12, 10, 11, 12, 12, 12, 10, 10, 10, 10, 10, 10, 10, 36};
            for (int c = 0; c < largeurs.length; c++) f.setColumnWidth(c, largeurs[c] * 256);

            wb.write(out);
            return out.toByteArray();
        }
    }

    private static void ligneSynthese(Row row, SyntheseScoreDto sy, CellStyle pourcent) {
        int k = 0;
        row.createCell(k++).setCellValue(nvl(sy.getDelegation()));
        row.createCell(k++).setCellValue(sy.getNbAgents());
        row.createCell(k++).setCellValue(sy.getNbNotes());
        row.createCell(k++).setCellValue(sy.getNbA());
        row.createCell(k++).setCellValue(sy.getNbB());
        row.createCell(k++).setCellValue(sy.getNbC());
        row.createCell(k++).setCellValue(sy.getNbD());
        row.createCell(k++).setCellValue(sy.getNbNonNotes());
        if (sy.getScoreMoyen() != null) row.createCell(k).setCellValue(sy.getScoreMoyen());
        k++;
        cellPct(row, k, sy.getPar30Moyen(), pourcent);
    }

    private static void ligne(Sheet s, int r, String libelle, String valeur) {
        Row row = s.createRow(r);
        row.createCell(0).setCellValue(libelle);
        row.createCell(1).setCellValue(valeur);
    }

    private static void cellMontant(Row row, int col, BigDecimal v, CellStyle style) {
        Cell c = row.createCell(col);
        if (v != null) { c.setCellValue(v.doubleValue()); c.setCellStyle(style); }
    }

    private static void cellPct(Row row, int col, BigDecimal v, CellStyle style) {
        Cell c = row.createCell(col);
        if (v != null) { c.setCellValue(v.doubleValue()); c.setCellStyle(style); }
    }

    private static void cellDec(Row row, int col, BigDecimal v, CellStyle style) {
        Cell c = row.createCell(col);
        if (v != null) { c.setCellValue(v.doubleValue()); c.setCellStyle(style); }
    }

    private static String pct(double v) {
        return Math.round(v * 100) + " %";
    }

    private static String date(LocalDate d) {
        return d == null ? "" : d.format(FMT_DATE);
    }

    private static String nvl(String s) {
        return s == null ? "" : s;
    }

    private static CellStyle styleTitre(Workbook wb) {
        CellStyle s = wb.createCellStyle();
        Font f = wb.createFont(); f.setBold(true); f.setFontHeightInPoints((short) 13);
        s.setFont(f);
        return s;
    }

    private static CellStyle styleEntete(Workbook wb) {
        CellStyle s = wb.createCellStyle();
        Font f = wb.createFont(); f.setBold(true); f.setColor(IndexedColors.WHITE.getIndex());
        s.setFont(f);
        s.setFillForegroundColor(IndexedColors.DARK_GREEN.getIndex());
        s.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        s.setBorderBottom(BorderStyle.THIN);
        return s;
    }

    private static CellStyle styleMontant(Workbook wb) {
        CellStyle s = wb.createCellStyle();
        s.setDataFormat(wb.createDataFormat().getFormat("#,##0"));
        return s;
    }

    private static CellStyle stylePourcent(Workbook wb) {
        CellStyle s = wb.createCellStyle();
        s.setDataFormat(wb.createDataFormat().getFormat("0.0%"));
        return s;
    }

    private static CellStyle styleDecimal(Workbook wb) {
        CellStyle s = wb.createCellStyle();
        s.setDataFormat(wb.createDataFormat().getFormat("0.0"));
        return s;
    }
}
