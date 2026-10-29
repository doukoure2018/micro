package io.digiservices.ecreditservice.utils;

import io.digiservices.ecreditservice.dto.PortefeuilleRisqueDtos.LigneRisqueDto;
import io.digiservices.ecreditservice.dto.PortefeuilleRisqueDtos.PortefeuilleRisqueDto;
import org.apache.poi.ss.usermodel.BorderStyle;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * Classeur du portefeuille a risque d'un point de service : trois feuilles, Par produit,
 * Par agent et Croisement, chacune avec le total du point de service en premiere ligne pour
 * que le lecteur verifie d'un coup d'oeil que la ventilation retombe sur l'ensemble.
 */
public final class PortefeuilleRisqueExcelUtils {

    private PortefeuilleRisqueExcelUtils() {
    }

    private static final DateTimeFormatter FMT_DATE = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private static final DateTimeFormatter FMT_HORODATAGE = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    private static final String[] ENTETES = {
            "Crédits", "Encours (GNF)", "Part de l'encours", "En retard", "Impayés (GNF)",
            "PAR 30 (GNF)", "PAR 30 (%)", "Crédits à 30 j et plus",
            "PAR 90 (GNF)", "PAR 90 (%)", "Crédits à 90 j et plus", "Contentieux déclarés"
    };

    public static byte[] classeur(PortefeuilleRisqueDto p) throws IOException {
        try (Workbook wb = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Styles st = new Styles(wb);
            feuille(wb, st, p, "Par produit", "Produit (type de crédit SAF)", p.getParProduit(), false);
            feuille(wb, st, p, "Par agent", "Gestionnaire désigné", p.getParAgent(), true);
            feuille(wb, st, p, "Croisement", "Agent · produit", p.getCroisement(), true);
            wb.write(out);
            return out.toByteArray();
        }
    }

    private static void feuille(Workbook wb, Styles st, PortefeuilleRisqueDto p, String nom, String premiereColonne,
                                List<LigneRisqueDto> lignes, boolean avecStatutAgent) {
        Sheet s = wb.createSheet(nom);
        int r = 0;
        Cell titre = s.createRow(r++).createCell(0);
        titre.setCellValue("Portefeuille à risque — " + nvl(p.getDesAgencia()) + " (" + p.getCodAgencia() + ")");
        titre.setCellStyle(st.titre);
        s.createRow(r++).createCell(0).setCellValue("Crédits en cours lus dans SAF le " + p.getDateLecture().format(FMT_DATE)
                + " — exporté le " + LocalDateTime.now().format(FMT_HORODATAGE)
                + " — seuils d'attention : PAR 30 ≥ " + p.getSeuilPar30() + " %, PAR 90 ≥ " + p.getSeuilPar90() + " %");
        s.createRow(r++).createCell(0).setCellValue("PAR 30 : encours des crédits en cours dont la plus ancienne échéance impayée a 30 jours ou plus, rapporté à l'encours des crédits en cours. Même règle que le bandeau du portefeuille et que la déclaration BCRG.");
        r++;

        Row entete = s.createRow(r++);
        int col = 0;
        cell(entete, col++, premiereColonne, st.entete);
        if (avecStatutAgent) cell(entete, col++, "Statut", st.entete);
        for (String e : ENTETES) cell(entete, col++, e, st.entete);

        BigDecimal encoursTotal = p.getTotal() == null ? BigDecimal.ZERO : p.getTotal().getEncours();
        if (p.getTotal() != null) {
            ligne(s.createRow(r++), p.getTotal(), "Total du point de service", avecStatutAgent ? "" : null, encoursTotal, st, true);
        }
        for (LigneRisqueDto l : lignes) {
            String statut = !avecStatutAgent ? null
                    : l.isNonAffecte() ? "sans gestionnaire"
                    : Boolean.FALSE.equals(l.getDisponible()) ? "parti ou désactivé" : "agent du point de service";
            ligne(s.createRow(r++), l, l.getLibelle(), statut, encoursTotal, st, false);
        }
        int nbCol = ENTETES.length + (avecStatutAgent ? 2 : 1);
        for (int c = 0; c < nbCol; c++) s.autoSizeColumn(c);
        s.createFreezePane(0, 5);
    }

    private static void ligne(Row row, LigneRisqueDto l, String libelle, String statut, BigDecimal encoursTotal,
                              Styles st, boolean gras) {
        int c = 0;
        cell(row, c++, libelle, gras ? st.gras : null);
        if (statut != null) cell(row, c++, statut, null);
        nombre(row, c++, l.getNbCredits(), null);
        montant(row, c++, l.getEncours(), st.montant);
        pourcent(row, c++, ratio(l.getEncours(), encoursTotal), st.pourcent);
        nombre(row, c++, l.getNbEnRetard(), null);
        montant(row, c++, l.getImpaye(), st.montant);
        montant(row, c++, l.getEncoursPar30(), st.montant);
        pourcent(row, c++, l.getTauxPar30(), st.pourcent);
        nombre(row, c++, l.getNbPar30(), null);
        montant(row, c++, l.getEncoursPar90(), st.montant);
        pourcent(row, c++, l.getTauxPar90(), st.pourcent);
        nombre(row, c++, l.getNbPar90(), null);
        nombre(row, c, l.getNbContentieuxDeclares(), null);
    }

    /** Taux deja exprime en pourcentage (12.5 pour 12,5 %) : Excel attend une fraction. */
    private static void pourcent(Row row, int col, BigDecimal tauxPourcent, CellStyle style) {
        Cell cell = row.createCell(col);
        cell.setCellValue(tauxPourcent == null ? 0 : tauxPourcent.divide(BigDecimal.valueOf(100), 6, RoundingMode.HALF_UP).doubleValue());
        cell.setCellStyle(style);
    }

    private static BigDecimal ratio(BigDecimal part, BigDecimal total) {
        return LigneRisqueDto.taux(part, total);
    }

    private static void montant(Row row, int col, BigDecimal valeur, CellStyle style) {
        Cell cell = row.createCell(col);
        cell.setCellValue(valeur == null ? 0 : valeur.doubleValue());
        cell.setCellStyle(style);
    }

    private static void nombre(Row row, int col, long valeur, CellStyle style) {
        Cell cell = row.createCell(col);
        cell.setCellValue(valeur);
        if (style != null) cell.setCellStyle(style);
    }

    private static void cell(Row row, int col, String valeur, CellStyle style) {
        Cell cell = row.createCell(col);
        cell.setCellValue(valeur == null ? "" : valeur);
        if (style != null) cell.setCellStyle(style);
    }

    private static String nvl(String s) {
        return s == null ? "" : s;
    }

    private static final class Styles {
        final CellStyle titre, entete, montant, pourcent, gras;

        Styles(Workbook wb) {
            titre = wb.createCellStyle();
            Font ft = wb.createFont();
            ft.setBold(true);
            ft.setFontHeightInPoints((short) 13);
            titre.setFont(ft);

            entete = wb.createCellStyle();
            Font fe = wb.createFont();
            fe.setBold(true);
            fe.setColor(IndexedColors.WHITE.getIndex());
            entete.setFont(fe);
            entete.setFillForegroundColor(IndexedColors.DARK_GREEN.getIndex());
            entete.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            entete.setAlignment(HorizontalAlignment.CENTER);
            entete.setBorderBottom(BorderStyle.THIN);

            montant = wb.createCellStyle();
            montant.setDataFormat(wb.createDataFormat().getFormat("#,##0"));

            pourcent = wb.createCellStyle();
            pourcent.setDataFormat(wb.createDataFormat().getFormat("0.0%"));

            gras = wb.createCellStyle();
            Font fg = wb.createFont();
            fg.setBold(true);
            gras.setFont(fg);
        }
    }
}
