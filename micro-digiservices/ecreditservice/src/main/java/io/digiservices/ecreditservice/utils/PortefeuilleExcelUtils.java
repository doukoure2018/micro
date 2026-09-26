package io.digiservices.ecreditservice.utils;

import io.digiservices.clients.portefeuille.EcheancePeriodeDto;
import io.digiservices.clients.portefeuille.EcheancesIndicateursDto;
import io.digiservices.clients.portefeuille.EcheancesSyntheseDto;
import io.digiservices.clients.portefeuille.PortefeuilleCreditDto;
import io.digiservices.clients.portefeuille.PortefeuilleIndicateursDto;
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
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * Construction du classeur Excel du portefeuille credits SAF :
 * feuille « Synthese » (indicateurs du perimetre exporte) + feuille « Credits »
 * (une ligne par credit, montants en nombres exploitables).
 */
public final class PortefeuilleExcelUtils {

    private static final DateTimeFormatter FMT_DATE = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private static final DateTimeFormatter FMT_HORODATAGE = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    private PortefeuilleExcelUtils() {
    }

    public static byte[] construireClasseur(String libelleAgence, String codAgencia, String statut,
                                            String recherche, PortefeuilleIndicateursDto indicateurs,
                                            List<PortefeuilleCreditDto> credits) throws IOException {
        try (Workbook wb = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            CellStyle titre = styleTitre(wb);
            CellStyle entete = styleEntete(wb);
            CellStyle montant = styleMontant(wb);
            CellStyle pourcent = stylePourcent(wb);

            // ==================== Feuille Synthese ====================
            Sheet synthese = wb.createSheet("Synthèse");
            int r = 0;
            Row rt = synthese.createRow(r++);
            Cell ct = rt.createCell(0);
            ct.setCellValue("Portefeuille crédits SAF — " + libelleAgence + " (" + codAgencia + ")");
            ct.setCellStyle(titre);
            ligne(synthese, r++, "Exporté le", LocalDateTime.now().format(FMT_HORODATAGE));
            ligne(synthese, r++, "Filtre", statut != null && statut.startsWith("retard") ? "Crédits en " + statut : "Tous les crédits actifs" + (statut != null && statut.contains("tranche") ? " — " + statut.substring(statut.indexOf("tranche")) : ""));
            if (recherche != null && !recherche.isBlank()) {
                ligne(synthese, r++, "Recherche", recherche);
            }
            r++;
            if (indicateurs != null) {
                ligneNombre(synthese, r++, "Crédits actifs", indicateurs.getNbCredits(), null);
                ligneNombre(synthese, r++, "Encours total (GNF)", indicateurs.getEncoursTotal(), montant);
                ligneNombre(synthese, r++, "Crédits en retard", indicateurs.getNbEnRetard(), null);
                ligneNombre(synthese, r++, "Impayés (capital + intérêts, GNF)", indicateurs.getMntImpaye(), montant);
                ligneNombre(synthese, r++, "Encours PAR 30 (GNF)", indicateurs.getEncoursPar30(), montant);
                ligneNombre(synthese, r++, "PAR 30", ratio(indicateurs.getEncoursPar30(), indicateurs.getEncoursTotal()), pourcent);
                ligneNombre(synthese, r++, "Encours PAR 90 (GNF)", indicateurs.getEncoursPar90(), montant);
                ligneNombre(synthese, r, "PAR 90", ratio(indicateurs.getEncoursPar90(), indicateurs.getEncoursTotal()), pourcent);
            }
            synthese.setColumnWidth(0, 34 * 256);
            synthese.setColumnWidth(1, 22 * 256);

            // ==================== Feuille Credits ====================
            Sheet feuille = wb.createSheet("Crédits");
            String[] colonnes = {"Client", "Code client", "N° crédit", "Type de crédit", "État SAF",
                    "Montant accordé", "Capital restant dû", "Éch. payées", "Éch. impayées", "Éch. restantes",
                    "Prochaine échéance", "Jours de retard", "Capital impayé", "Intérêts impayés",
                    "Qualité", "Ouverture", "Échéance finale"};
            Row head = feuille.createRow(0);
            for (int i = 0; i < colonnes.length; i++) {
                Cell c = head.createCell(i);
                c.setCellValue(colonnes[i]);
                c.setCellStyle(entete);
            }
            int lig = 1;
            for (PortefeuilleCreditDto cr : credits) {
                Row row = feuille.createRow(lig++);
                int col = 0;
                row.createCell(col++).setCellValue(nvl(cr.getNomCliente()));
                row.createCell(col++).setCellValue(nvl(cr.getCodCliente()));
                row.createCell(col++).setCellValue(cr.getNumCredito() != null ? cr.getNumCredito() : 0);
                row.createCell(col++).setCellValue(nvl(cr.getDesTipCredito()));
                row.createCell(col++).setCellValue(nvl(cr.getIndEstado()));
                cellMontant(row, col++, cr.getMonCredito(), montant);
                cellMontant(row, col++, cr.getMonSaldo(), montant);
                row.createCell(col++).setCellValue(cr.getNbEchPayees() != null ? cr.getNbEchPayees() : 0);
                row.createCell(col++).setCellValue(cr.getNbEchImpayees() != null ? cr.getNbEchImpayees() : 0);
                row.createCell(col++).setCellValue(cr.getNbEchRestantes() != null ? cr.getNbEchRestantes() : 0);
                row.createCell(col++).setCellValue(date(cr.getProchaineEcheance()));
                if (cr.getJoursRetard() != null) {
                    row.createCell(col).setCellValue(cr.getJoursRetard());
                }
                col++;
                cellMontant(row, col++, cr.getMntCapImpaye(), montant);
                cellMontant(row, col++, cr.getMntIntImpaye(), montant);
                row.createCell(col++).setCellValue(cr.getJoursRetard() == null ? "Sain"
                        : cr.getJoursRetard() > 30 ? "Retard > 30 j" : "Retard");
                row.createCell(col++).setCellValue(date(cr.getFecApertura()));
                row.createCell(col).setCellValue(date(cr.getFecVencimiento()));
            }
            for (int i = 0; i < colonnes.length; i++) {
                feuille.setColumnWidth(i, Math.min(28, Math.max(12, colonnes[i].length() + 4)) * 256);
            }
            feuille.createFreezePane(0, 1);

            wb.write(out);
            return out.toByteArray();
        }
    }

    // ==================== TT1 (lot 1) : echeances de la periode ====================

    /**
     * Classeur de l'etat TT1 : feuille « Synthese » (totaux de la periode) + feuille
     * « Echeances » (une ligne par echeance, montants en nombres exploitables).
     */
    public static byte[] construireClasseurEcheances(String perimetre, LocalDate du, LocalDate au, String etat,
                                                     String recherche, EcheancesIndicateursDto indicateurs,
                                                     List<EcheancesSyntheseDto> repartition,
                                                     List<EcheancePeriodeDto> echeances) throws IOException {
        try (Workbook wb = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            CellStyle titre = styleTitre(wb);
            CellStyle entete = styleEntete(wb);
            CellStyle montant = styleMontant(wb);
            CellStyle pourcent = stylePourcent(wb);

            Sheet synthese = wb.createSheet("Synthèse");
            int r = 0;
            Row rt = synthese.createRow(r++);
            Cell ct = rt.createCell(0);
            ct.setCellValue("Échéances de la période (TT1) — " + perimetre);
            ct.setCellStyle(titre);
            ligne(synthese, r++, "Période", du.format(FMT_DATE) + " au " + au.format(FMT_DATE));
            ligne(synthese, r++, "Exporté le", LocalDateTime.now().format(FMT_HORODATAGE));
            ligne(synthese, r++, "État des échéances", libelleEtat(etat));
            if (recherche != null && !recherche.isBlank()) {
                ligne(synthese, r++, "Recherche", recherche);
            }
            r++;
            if (indicateurs != null) {
                ligneNombre(synthese, r++, "Échéances", indicateurs.getNbEcheances(), null);
                ligneNombre(synthese, r++, "Crédits concernés", indicateurs.getNbCredits(), null);
                ligneNombre(synthese, r++, "Clients concernés", indicateurs.getNbClients(), null);
                ligneNombre(synthese, r++, "Montant attendu (GNF)", indicateurs.getMontantAttendu(), montant);
                ligneNombre(synthese, r++, "dont capital (GNF)", indicateurs.getCapitalAttendu(), montant);
                ligneNombre(synthese, r++, "dont intérêts (GNF)", indicateurs.getInteretsAttendus(), montant);
                ligneNombre(synthese, r++, "Réglé (GNF)", indicateurs.getMontantRegle(), montant);
                ligneNombre(synthese, r++, "Reste à encaisser (GNF)", indicateurs.getResteAEncaisser(), montant);
                ligneNombre(synthese, r++, "Taux de recouvrement", ratio(indicateurs.getMontantRegle(), indicateurs.getMontantAttendu()), pourcent);
                ligneNombre(synthese, r++, "Échéances réglées", indicateurs.getNbReglees(), null);
                ligneNombre(synthese, r++, "Échéances à échoir", indicateurs.getNbAEchoir(), null);
                ligneNombre(synthese, r++, "Échéances impayées", indicateurs.getNbImpayees(), null);
            }
            synthese.setColumnWidth(0, 34 * 256);
            synthese.setColumnWidth(1, 22 * 256);

            // Repartition par point de service (lot 2) quand le perimetre en compte plusieurs
            if (repartition != null && repartition.size() > 1) {
                r++;
                Row rr = synthese.createRow(r++);
                Cell cr = rr.createCell(0);
                cr.setCellValue("Répartition par point de service");
                cr.setCellStyle(titre);
                String[] colsRep = {"Point de service", "Code", "Agence", "Échéances", "Attendu (GNF)", "Réglé (GNF)",
                        "Reste à encaisser (GNF)", "Taux de recouvrement", "Impayées", "À échoir"};
                Row hr = synthese.createRow(r++);
                for (int c = 0; c < colsRep.length; c++) {
                    Cell cell = hr.createCell(c);
                    cell.setCellValue(colsRep[c]);
                    cell.setCellStyle(entete);
                }
                for (EcheancesSyntheseDto s : repartition) {
                    EcheancesIndicateursDto i = s.getIndicateurs();
                    Row row = synthese.createRow(r++);
                    int c = 0;
                    row.createCell(c++).setCellValue(nvl(s.getLibelle()));
                    row.createCell(c++).setCellValue(nvl(s.getCode()));
                    row.createCell(c++).setCellValue(nvl(s.getRattachement()));
                    row.createCell(c++).setCellValue(i == null ? 0 : i.getNbEcheances());
                    cellMontant(row, c++, i == null ? null : i.getMontantAttendu(), montant);
                    cellMontant(row, c++, i == null ? null : i.getMontantRegle(), montant);
                    cellMontant(row, c++, i == null ? null : i.getResteAEncaisser(), montant);
                    Cell ct2 = row.createCell(c++);
                    ct2.setCellValue(i == null ? 0 : ratio(i.getMontantRegle(), i.getMontantAttendu()));
                    ct2.setCellStyle(pourcent);
                    row.createCell(c++).setCellValue(i == null ? 0 : i.getNbImpayees());
                    row.createCell(c).setCellValue(i == null ? 0 : i.getNbAEchoir());
                }
                int[] largeursRep = {34, 22, 24, 12, 18, 18, 22, 20, 12, 12};
                for (int c = 2; c < largeursRep.length; c++) {
                    synthese.setColumnWidth(c, largeursRep[c] * 256);
                }
            }

            Sheet feuille = wb.createSheet("Échéances");
            String[] colonnes = {"Date d'échéance", "Point de service", "Code PS", "Client", "Code client", "N° crédit",
                    "Type de crédit", "N° éch.", "Montant (GNF)", "Capital (GNF)", "Intérêts (GNF)",
                    "Reste à payer (GNF)", "État", "Jours de retard", "Réglée le"};
            Row head = feuille.createRow(0);
            for (int c = 0; c < colonnes.length; c++) {
                Cell cell = head.createCell(c);
                cell.setCellValue(colonnes[c]);
                cell.setCellStyle(entete);
            }
            int lig = 1;
            for (EcheancePeriodeDto e : echeances) {
                Row row = feuille.createRow(lig++);
                int c = 0;
                row.createCell(c++).setCellValue(date(e.getFecCuota()));
                row.createCell(c++).setCellValue(nvl(e.getDesAgencia()));
                row.createCell(c++).setCellValue(nvl(e.getCodAgencia()));
                row.createCell(c++).setCellValue(nvl(e.getNomCliente()));
                row.createCell(c++).setCellValue(nvl(e.getCodCliente()));
                row.createCell(c++).setCellValue(e.getNumCredito() != null ? e.getNumCredito() : 0);
                row.createCell(c++).setCellValue(nvl(e.getDesTipCredito()));
                row.createCell(c++).setCellValue(e.getNumCuota() != null ? e.getNumCuota() : 0);
                cellMontant(row, c++, e.getMonCuota(), montant);
                cellMontant(row, c++, e.getMonPrincipal(), montant);
                cellMontant(row, c++, e.getMonInt(), montant);
                cellMontant(row, c++, e.getResteAPayer(), montant);
                row.createCell(c++).setCellValue(libelleEtatLigne(e));
                if (e.getJoursRetard() != null) {
                    row.createCell(c).setCellValue(e.getJoursRetard());
                }
                c++;
                row.createCell(c).setCellValue(date(e.getFecCancelacion()));
            }
            int[] largeurs = {14, 24, 9, 30, 14, 12, 22, 8, 16, 16, 16, 18, 20, 14, 12};
            for (int c = 0; c < largeurs.length; c++) {
                feuille.setColumnWidth(c, largeurs[c] * 256);
            }
            feuille.createFreezePane(0, 1);
            wb.write(out);
            return out.toByteArray();
        }
    }

    private static String libelleEtat(String etat) {
        return switch (etat == null ? "toutes" : etat) {
            case "reglees" -> "Réglées";
            case "aechoir" -> "À échoir";
            case "impayees" -> "Impayées";
            default -> "Toutes";
        };
    }

    private static String libelleEtatLigne(EcheancePeriodeDto e) {
        String base = switch (e.getEtat() == null ? "" : e.getEtat()) {
            case "REGLEE" -> "Réglée";
            case "IMPAYEE" -> "Impayée";
            case "A_ECHOIR" -> "À échoir";
            default -> "";
        };
        return Boolean.TRUE.equals(e.getPartielle()) ? base + " (partiellement réglée)" : base;
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

    private static double ratio(BigDecimal part, BigDecimal total) {
        if (part == null || total == null || total.signum() == 0) return 0;
        return part.doubleValue() / total.doubleValue();
    }

    private static String date(LocalDate d) {
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
