package io.digiservices.ecreditservice.utils;

import io.digiservices.clients.portefeuille.PortefeuilleCreditDto;
import io.digiservices.ecreditservice.dto.PortefeuilleAffectationDtos.AffectationDto;
import io.digiservices.ecreditservice.dto.PortefeuilleAffectationDtos.CreditAffecteDto;
import io.digiservices.ecreditservice.dto.PortefeuilleAffectationDtos.PortefeuilleAffectationDto;
import io.digiservices.ecreditservice.dto.PortefeuilleAffectationDtos.SynthesePointServiceDto;
import io.digiservices.ecreditservice.repository.PortefeuillePerimetreRepository.PointVenteHierarchie;
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
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * Exports Excel de l'affectation des credits aux agents (V159, lot 2).
 * Feuille par point de service au format demande par la DSIG : DR, Agence, PS, credit, type,
 * octroi, montant, encours, retard, usager de mise en place, gestionnaire SAF (code, nom,
 * statut) puis le gestionnaire designe (agent digi affecte).
 */
public final class PortefeuilleAffectationExcelUtils {

    private PortefeuilleAffectationExcelUtils() {
    }

    private static final DateTimeFormatter FMT_DATE = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private static final DateTimeFormatter FMT_HORODATAGE = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    private static final String[] ENTETES_CREDITS = {
            "DR", "Agence", "Point de service", "N° crédit", "Client", "Code client", "Type", "État",
            "Date octroi", "Montant octroyé", "Encours", "Retard (jours)", "Date du retard", "Montant en retard",
            "Usager de mise en place", "Gestionnaire SAF", "Usager du gestionnaire", "Statut du gestionnaire",
            "Gestionnaire désigné", "Affecté le", "Affecté par", "À réaffecter"
    };

    /** Classeur d'un point de service : feuille Synthèse puis feuille Crédits. */
    public static byte[] classeurPointService(PortefeuilleAffectationDto p, PointVenteHierarchie h) throws IOException {
        try (Workbook wb = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            CellStyle titre = styleTitre(wb), entete = styleEntete(wb), montant = styleMontant(wb), pourcent = stylePourcent(wb);

            Sheet s = wb.createSheet("Synthèse");
            int r = 0;
            Cell ct = s.createRow(r++).createCell(0);
            ct.setCellValue("Portefeuille par agent — " + nvl(p.getDesAgencia()) + " (" + p.getCodAgencia() + ")");
            ct.setCellStyle(titre);
            ligne(s, r++, "Exporté le", LocalDateTime.now().format(FMT_HORODATAGE));
            ligne(s, r++, "Délégation", h == null ? "" : nvl(h.delegation()));
            ligne(s, r++, "Agence", h == null ? "" : nvl(h.agence()));
            r++;
            var ind = p.getIndicateurs();
            ligneNombre(s, r++, "Crédits vivants", ind.getNbCredits(), null);
            ligneNombre(s, r++, "Encours (GNF)", ind.getEncours(), montant);
            ligneNombre(s, r++, "Affectés", ind.getNbAffectes(), null);
            ligneNombre(s, r++, "Non affectés", ind.getNbNonAffectes(), null);
            ligneNombre(s, r++, "Encours non affecté (GNF)", ind.getEncoursNonAffecte(), montant);
            ligneNombre(s, r++, "À réaffecter", ind.getNbAReaffecter(), null);
            ligneNombre(s, r++, "Taux d'affectation", ind.getNbCredits() == 0 ? 0 : (double) ind.getNbAffectes() / ind.getNbCredits(), pourcent);
            r++;
            Row ra = s.createRow(r++);
            String[] ea = {"Agent", "Rattaché au PS", "Crédits", "Encours (GNF)", "En retard"};
            for (int i = 0; i < ea.length; i++) { Cell c = ra.createCell(i); c.setCellValue(ea[i]); c.setCellStyle(entete); }
            for (var a : p.getAgents()) {
                Row row = s.createRow(r++);
                row.createCell(0).setCellValue(nvl(a.getNom()));
                row.createCell(1).setCellValue(a.isDisponible() ? "oui" : "non (parti ou désactivé)");
                row.createCell(2).setCellValue(a.getNbCredits());
                cellMontant(row, 3, a.getEncours(), montant);
                row.createCell(4).setCellValue(a.getNbEnRetard());
            }
            s.setColumnWidth(0, 34 * 256);
            for (int i = 1; i <= 4; i++) s.setColumnWidth(i, 22 * 256);

            Sheet f = wb.createSheet("Crédits");
            Row re = f.createRow(0);
            for (int i = 0; i < ENTETES_CREDITS.length; i++) { Cell c = re.createCell(i); c.setCellValue(ENTETES_CREDITS[i]); c.setCellStyle(entete); }
            int i = 1;
            for (CreditAffecteDto l : p.getCredits()) {
                ligneCredit(f.createRow(i++), l, h, montant);
            }
            f.createFreezePane(0, 1);
            int[] largeurs = {18, 22, 24, 12, 30, 14, 20, 12, 16, 16, 12, 20, 22, 30, 12, 26, 12, 24, 30};
            for (int c = 0; c < largeurs.length; c++) f.setColumnWidth(c, largeurs[c] * 256);

            wb.write(out);
            return out.toByteArray();
        }
    }

    /** Classeur de synthese : une ligne par point de service du perimetre. */
    public static byte[] classeurSynthese(String perimetre, List<SynthesePointServiceDto> lignes) throws IOException {
        try (Workbook wb = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            CellStyle titre = styleTitre(wb), entete = styleEntete(wb), montant = styleMontant(wb), pourcent = stylePourcent(wb);
            Sheet s = wb.createSheet("Synthèse");
            Cell ct = s.createRow(0).createCell(0);
            ct.setCellValue("Portefeuille par agent — synthèse " + nvl(perimetre) + " — exporté le " + LocalDateTime.now().format(FMT_HORODATAGE));
            ct.setCellStyle(titre);
            String[] e = {"DR", "Agence", "Point de service", "Code SAF", "Crédits en cours", "Encours (GNF)", "En retard",
                    "Encours PAR 30 (GNF)", "PAR 30", "Encours PAR 90 (GNF)", "PAR 90",
                    "Affectés", "Non affectés", "À réaffecter", "Agents de crédit", "Taux d'affectation",
                    "Apurés", "Encours apuré (GNF)", "Contentieux", "Encours contentieux (GNF)"};
            Row re = s.createRow(2);
            for (int i = 0; i < e.length; i++) { Cell c = re.createCell(i); c.setCellValue(e[i]); c.setCellStyle(entete); }
            int r = 3;
            for (SynthesePointServiceDto l : lignes) {
                Row row = s.createRow(r++);
                row.createCell(0).setCellValue(nvl(l.getDelegation()));
                row.createCell(1).setCellValue(nvl(l.getAgence()));
                row.createCell(2).setCellValue(nvl(l.getPointVente()));
                row.createCell(3).setCellValue(nvl(l.getCodAgencia()));
                row.createCell(4).setCellValue(l.getNbCredits());
                cellMontant(row, 5, l.getEncours(), montant);
                row.createCell(6).setCellValue(l.getNbEnRetard());
                cellMontant(row, 7, l.getEncoursPar30(), montant);
                cellRatio(row, 8, l.getEncoursPar30(), l.getEncours(), pourcent);
                cellMontant(row, 9, l.getEncoursPar90(), montant);
                cellRatio(row, 10, l.getEncoursPar90(), l.getEncours(), pourcent);
                row.createCell(11).setCellValue(l.getNbAffectes());
                row.createCell(12).setCellValue(l.getNbNonAffectes());
                row.createCell(13).setCellValue(l.getNbAReaffecter());
                row.createCell(14).setCellValue(l.getNbAgents());
                Cell tx = row.createCell(15); tx.setCellValue(l.getTauxAffectation()); tx.setCellStyle(pourcent);
                row.createCell(16).setCellValue(l.getNbApures());
                cellMontant(row, 17, l.getEncoursApure(), montant);
                row.createCell(18).setCellValue(l.getNbContentieux());
                cellMontant(row, 19, l.getEncoursContentieux(), montant);
            }
            s.createFreezePane(0, 3);
            int[] largeurs = {18, 22, 26, 10, 14, 18, 10, 18, 9, 18, 9, 10, 12, 12, 14, 16};
            for (int c = 0; c < largeurs.length; c++) s.setColumnWidth(c, largeurs[c] * 256);
            wb.write(out);
            return out.toByteArray();
        }
    }

    private static void ligneCredit(Row row, CreditAffecteDto l, PointVenteHierarchie h, CellStyle montant) {
        PortefeuilleCreditDto c = l.getCredit();
        AffectationDto a = l.getAffectation();
        int i = 0;
        row.createCell(i++).setCellValue(h == null ? "" : nvl(h.delegation()));
        row.createCell(i++).setCellValue(h == null ? "" : nvl(h.agence()));
        row.createCell(i++).setCellValue(h == null ? nvl(c.getDesAgencia()) : nvl(h.libelle()));
        row.createCell(i++).setCellValue(c.getNumCredito() == null ? 0 : c.getNumCredito());
        row.createCell(i++).setCellValue(nvl(c.getNomCliente()));
        row.createCell(i++).setCellValue(nvl(c.getCodCliente()));
        row.createCell(i++).setCellValue(c.getDesTipCredito() != null ? c.getDesTipCredito() : String.valueOf(c.getTipCredito()));
        row.createCell(i++).setCellValue(nvl(l.getCategorieLibelle()));
        row.createCell(i++).setCellValue(date(c.getFecApertura()));
        cellMontant(row, i++, c.getMonCredito(), montant);
        cellMontant(row, i++, c.getMonSaldo(), montant);
        row.createCell(i++).setCellValue(c.getJoursRetard() == null ? 0 : c.getJoursRetard());
        row.createCell(i++).setCellValue(date(c.getDatPremiereImpayee()));
        java.math.BigDecimal retard = (c.getMntCapImpaye() == null ? java.math.BigDecimal.ZERO : c.getMntCapImpaye())
                .add(c.getMntIntImpaye() == null ? java.math.BigDecimal.ZERO : c.getMntIntImpaye());
        cellMontant(row, i++, retard, montant);
        row.createCell(i++).setCellValue(nvl(c.getUsagerMiseEnPlace()));
        row.createCell(i++).setCellValue(nvl(c.getCodGestionnaireSaf()));
        row.createCell(i++).setCellValue(nvl(c.getNomGestionnaireSaf()));
        row.createCell(i++).setCellValue("A".equals(c.getStatutGestionnaireSaf()) ? "actif" : c.getStatutGestionnaireSaf() == null ? "" : "inactif");
        row.createCell(i++).setCellValue(a == null ? "NON AFFECTÉ" : nvl(a.getAgentNom()));
        row.createCell(i++).setCellValue(a == null ? "" : date(a.getDateAffectation()));
        row.createCell(i++).setCellValue(a == null ? "" : nvl(a.getAffecteParNom()));
        row.createCell(i).setCellValue(l.isAReaffecter() ? nvl(l.getMotifReaffectation()) : "");
    }

    private static void ligne(Sheet s, int r, String label, String valeur) {
        Row row = s.createRow(r);
        row.createCell(0).setCellValue(label);
        row.createCell(1).setCellValue(valeur);
    }

    private static void ligneNombre(Sheet s, int r, String label, Number valeur, CellStyle style) {
        Row row = s.createRow(r);
        row.createCell(0).setCellValue(label);
        Cell c = row.createCell(1);
        c.setCellValue(valeur != null ? valeur.doubleValue() : 0);
        if (style != null) c.setCellStyle(style);
    }

    private static void cellMontant(Row row, int col, BigDecimal valeur, CellStyle style) {
        Cell c = row.createCell(col);
        c.setCellValue(valeur != null ? valeur.doubleValue() : 0);
        c.setCellStyle(style);
    }

    private static void cellRatio(Row row, int col, BigDecimal part, BigDecimal total, CellStyle style) {
        Cell c = row.createCell(col);
        c.setCellValue(part == null || total == null || total.signum() == 0 ? 0 : part.doubleValue() / total.doubleValue());
        c.setCellStyle(style);
    }

    private static String date(LocalDate d) {
        return d != null ? d.format(FMT_DATE) : "";
    }

    private static String date(OffsetDateTime d) {
        return d != null ? d.format(FMT_DATE) : "";
    }

    private static String nvl(String s) {
        return s != null ? s : "";
    }

    private static CellStyle styleTitre(Workbook wb) {
        CellStyle style = wb.createCellStyle();
        Font f = wb.createFont();
        f.setBold(true);
        f.setFontHeightInPoints((short) 13);
        style.setFont(f);
        return style;
    }

    private static CellStyle styleEntete(Workbook wb) {
        CellStyle style = wb.createCellStyle();
        Font f = wb.createFont();
        f.setBold(true);
        f.setColor(IndexedColors.WHITE.getIndex());
        style.setFont(f);
        style.setFillForegroundColor(IndexedColors.DARK_GREEN.getIndex());
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        style.setAlignment(HorizontalAlignment.CENTER);
        style.setBorderBottom(BorderStyle.THIN);
        return style;
    }

    private static CellStyle styleMontant(Workbook wb) {
        CellStyle style = wb.createCellStyle();
        style.setDataFormat(wb.createDataFormat().getFormat("#,##0"));
        return style;
    }

    private static CellStyle stylePourcent(Workbook wb) {
        CellStyle style = wb.createCellStyle();
        style.setDataFormat(wb.createDataFormat().getFormat("0.0%"));
        return style;
    }
}
