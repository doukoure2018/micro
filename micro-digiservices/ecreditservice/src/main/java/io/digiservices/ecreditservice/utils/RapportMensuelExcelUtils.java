package io.digiservices.ecreditservice.utils;

import io.digiservices.ecreditservice.dto.RapportMensuelDtos.AgregatDto;
import io.digiservices.ecreditservice.dto.RapportMensuelDtos.LigneDto;
import io.digiservices.ecreditservice.dto.RapportMensuelDtos.RapportMensuelDto;
import io.digiservices.ecreditservice.dto.RapportMensuelDtos.RubriqueDto;
import io.digiservices.ecreditservice.dto.RapportMensuelDtos.ValeurDto;
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
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

/**
 * Export Excel du rapport « Indicateurs mensuels » (V167) au format du fichier de la Direction
 * de l'Exploitation : N° d'ordre, point de service, les 17 rubriques dans l'ordre des colonnes
 * C a S, un total par agence, un total par delegation. Une seconde feuille met la saisie en
 * regard du controle SAF.
 */
public final class RapportMensuelExcelUtils {

    private RapportMensuelExcelUtils() {
    }

    public static final String[] MOIS = {"JANVIER", "FEVRIER", "MARS", "AVRIL", "MAI", "JUIN",
            "JUILLET", "AOUT", "SEPTEMBRE", "OCTOBRE", "NOVEMBRE", "DECEMBRE"};

    private static final DateTimeFormatter FMT_HORODATAGE = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    public static byte[] classeur(RapportMensuelDto d) throws IOException {
        try (Workbook wb = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Styles st = new Styles(wb);
            feuilleMois(wb, d, st);
            feuilleControle(wb, d, st);
            wb.write(out);
            return out.toByteArray();
        }
    }

    private static void feuilleMois(Workbook wb, RapportMensuelDto d, Styles st) {
        Sheet s = wb.createSheet(MOIS[d.getMois() - 1] + " " + d.getAnnee());
        List<RubriqueDto> rubriques = d.getRubriques();
        int nbCol = 2 + rubriques.size() + 1;
        int r = 0;
        titre(s, r++, "CREDIT RURAL DE GUINEE", st, nbCol);
        titre(s, r++, "DIRECTION DE L'EXPLOITATION", st, nbCol);
        titre(s, r++, "INDICATEURS MENSUELS " + d.getAnnee() + " — " + MOIS[d.getMois() - 1]
                + " — " + nvl(d.getTotal() == null ? null : d.getTotal().getLibelle()), st, nbCol);
        s.createRow(r++).createCell(0).setCellValue("Exporte le " + LocalDateTime.now().format(FMT_HORODATAGE)
                + " — valeurs saisies par les agences ; les taux de retards, de realisation, de couverture et de PAR sont calcules");
        Row h = s.createRow(r++);
        entete(h, 0, "N° D'ORDRE", st);
        entete(h, 1, "POINTS DE SERVICES PAR AGENCE", st);
        for (int i = 0; i < rubriques.size(); i++) {
            entete(h, 2 + i, rubriques.get(i).getLibelleCourt(), st);
        }
        entete(h, 2 + rubriques.size(), "ETAT", st);

        // Delegations, puis agences, puis points de service : l'ordre du fichier.
        List<AgregatDto> delegations = d.getDelegations().isEmpty() && d.getTotal() != null ? List.of(d.getTotal()) : d.getDelegations();
        for (AgregatDto del : delegations) {
            List<AgregatDto> agences = d.getAgences().stream()
                    .filter(a -> del.getId() == null || del.getId().equals(a.getParentId())).toList();
            for (AgregatDto ag : agences) {
                int ordre = 1;
                for (LigneDto l : d.getLignes()) {
                    if (!ag.getId().equals(l.getAgenceId())) continue;
                    Row row = s.createRow(r++);
                    row.createCell(0).setCellValue(ordre++);
                    row.createCell(1).setCellValue(nvl(l.getPointService()));
                    for (int i = 0; i < rubriques.size(); i++) {
                        RubriqueDto rub = rubriques.get(i);
                        BigDecimal v = "CALCUL".equals(rub.getNature()) ? l.getCalcules().get(rub.getCode())
                                : valeur(l.getValeurs().get(rub.getCode()));
                        nombre(row, 2 + i, v, rub, st, false);
                    }
                    row.createCell(2 + rubriques.size()).setCellValue(libelleEtat(l.getEtat()));
                }
                ligneTotal(s, r++, "TOTAL AGENCE " + nvl(ag.getLibelle()).toUpperCase(), ag, rubriques, st);
            }
            if (!d.getDelegations().isEmpty()) {
                ligneTotal(s, r++, "DR " + nvl(del.getLibelle()).toUpperCase(), del, rubriques, st);
            }
        }
        if (d.getDelegations().size() > 1 && d.getTotal() != null) {
            ligneTotal(s, r++, "RESEAU", d.getTotal(), rubriques, st);
        }
        s.setColumnWidth(0, 10 * 256);
        s.setColumnWidth(1, 30 * 256);
        for (int i = 0; i < rubriques.size(); i++) {
            s.setColumnWidth(2 + i, 18 * 256);
        }
        s.setColumnWidth(2 + rubriques.size(), 16 * 256);
        s.createFreezePane(2, 5);
    }

    private static void ligneTotal(Sheet s, int r, String libelle, AgregatDto a, List<RubriqueDto> rubriques, Styles st) {
        Row row = s.createRow(r);
        Cell c = row.createCell(0);
        c.setCellValue(libelle);
        c.setCellStyle(st.total);
        row.createCell(1).setCellStyle(st.total);
        s.addMergedRegion(new CellRangeAddress(r, r, 0, 1));
        for (int i = 0; i < rubriques.size(); i++) {
            nombre(row, 2 + i, a.getValeurs().get(rubriques.get(i).getCode()), rubriques.get(i), st, true);
        }
        Cell e = row.createCell(2 + rubriques.size());
        e.setCellValue(a.getNbPointsService() + " PS, " + a.getNbComplets() + " complet(s)");
        e.setCellStyle(st.total);
    }

    private static void feuilleControle(Workbook wb, RapportMensuelDto d, Styles st) {
        Sheet s = wb.createSheet("Controle SAF");
        List<RubriqueDto> controlees = d.getRubriques().stream().filter(RubriqueDto::isControleSaf).toList();
        int r = 0;
        titre(s, r++, "Saisie des agences en regard des valeurs lues dans SAF — ecart signale au-dela de "
                + d.getSeuilEcartPct() + " % et " + format(d.getSeuilEcartMontant()) + " GNF", st, 3 + controlees.size() * 4);
        Row h = s.createRow(r++);
        entete(h, 0, "Delegation", st);
        entete(h, 1, "Agence", st);
        entete(h, 2, "Point de service", st);
        int col = 3;
        for (RubriqueDto rub : controlees) {
            entete(h, col++, rub.getLibelleCourt() + " — saisi", st);
            entete(h, col++, rub.getLibelleCourt() + " — SAF", st);
            entete(h, col++, "Ecart %", st);
            entete(h, col++, "Commentaire", st);
        }
        for (LigneDto l : d.getLignes()) {
            Row row = s.createRow(r++);
            row.createCell(0).setCellValue(nvl(l.getDelegation()));
            row.createCell(1).setCellValue(nvl(l.getAgence()));
            row.createCell(2).setCellValue(nvl(l.getPointService()));
            col = 3;
            for (RubriqueDto rub : controlees) {
                ValeurDto v = l.getValeurs().get(rub.getCode());
                nombre(row, col++, v == null ? null : v.getValeur(), rub, st, false);
                nombre(row, col++, v == null ? null : v.getValeurSaf(), rub, st, false);
                Cell e = row.createCell(col++);
                if (v != null && v.getEcartPct() != null) {
                    e.setCellValue(v.getEcartPct().doubleValue());
                    e.setCellStyle(v.isEcart() ? st.pourcentAlerte : st.pourcent);
                }
                row.createCell(col++).setCellValue(v == null ? "" : nvl(v.getCommentaire()));
            }
        }
        for (int i = 0; i < 3 + controlees.size() * 4; i++) {
            s.setColumnWidth(i, (i < 3 ? 22 : 18) * 256);
        }
        s.createFreezePane(3, 2);
    }

    // ==================== Cellules ====================

    private static void nombre(Row row, int col, BigDecimal v, RubriqueDto rub, Styles st, boolean total) {
        Cell c = row.createCell(col);
        boolean taux = "TAUX".equals(rub.getFormat());
        c.setCellStyle(taux ? (total ? st.pourcentTotal : st.pourcent) : (total ? st.montantTotal : st.montant));
        if (v != null) {
            c.setCellValue(v.doubleValue());
        }
    }

    private static void titre(Sheet s, int r, String texte, Styles st, int nbCol) {
        Cell c = s.createRow(r).createCell(0);
        c.setCellValue(texte);
        c.setCellStyle(st.titre);
        if (nbCol > 1) s.addMergedRegion(new CellRangeAddress(r, r, 0, nbCol - 1));
    }

    private static void entete(Row row, int col, String texte, Styles st) {
        Cell c = row.createCell(col);
        c.setCellValue(texte);
        c.setCellStyle(st.entete);
    }

    private static BigDecimal valeur(ValeurDto v) {
        return v == null ? null : v.getValeur();
    }

    private static String libelleEtat(String etat) {
        return switch (etat == null ? "" : etat) {
            case "BROUILLON" -> "Brouillon";
            case "SOUMIS" -> "Soumis";
            case "VALIDE" -> "Valide";
            case "RENVOYE" -> "Renvoye";
            case "CONSOLIDE" -> "Consolide";
            default -> etat == null ? "" : etat;
        };
    }

    private static String format(BigDecimal v) {
        return v == null ? "" : String.format("%,d", v.longValue()).replace(',', ' ');
    }

    private static String nvl(String s) {
        return s == null ? "" : s;
    }

    private static final class Styles {
        final CellStyle titre, entete, montant, montantTotal, pourcent, pourcentTotal, pourcentAlerte, total;

        Styles(Workbook wb) {
            Font gras = wb.createFont();
            gras.setBold(true);
            Font grasBlanc = wb.createFont();
            grasBlanc.setBold(true);
            grasBlanc.setColor(IndexedColors.WHITE.getIndex());
            Font grasTitre = wb.createFont();
            grasTitre.setBold(true);
            grasTitre.setFontHeightInPoints((short) 13);

            titre = wb.createCellStyle();
            titre.setFont(grasTitre);

            entete = wb.createCellStyle();
            entete.setFont(grasBlanc);
            entete.setFillForegroundColor(IndexedColors.DARK_TEAL.getIndex());
            entete.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            entete.setAlignment(HorizontalAlignment.CENTER);
            entete.setWrapText(true);
            entete.setBorderBottom(BorderStyle.THIN);

            montant = wb.createCellStyle();
            montant.setDataFormat(wb.createDataFormat().getFormat("#,##0"));

            pourcent = wb.createCellStyle();
            pourcent.setDataFormat(wb.createDataFormat().getFormat("0.0%"));

            total = wb.createCellStyle();
            total.setFont(gras);
            total.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
            total.setFillPattern(FillPatternType.SOLID_FOREGROUND);

            montantTotal = wb.createCellStyle();
            montantTotal.cloneStyleFrom(total);
            montantTotal.setDataFormat(wb.createDataFormat().getFormat("#,##0"));

            pourcentTotal = wb.createCellStyle();
            pourcentTotal.cloneStyleFrom(total);
            pourcentTotal.setDataFormat(wb.createDataFormat().getFormat("0.0%"));

            Font rouge = wb.createFont();
            rouge.setBold(true);
            rouge.setColor(IndexedColors.RED.getIndex());
            pourcentAlerte = wb.createCellStyle();
            pourcentAlerte.setDataFormat(wb.createDataFormat().getFormat("0.0%"));
            pourcentAlerte.setFont(rouge);
        }
    }
}
