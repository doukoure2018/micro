package io.digiservices.ecreditservice.utils;

import io.digiservices.ecreditservice.dto.PhotoEcartDtos.ExplicationRecue;
import io.digiservices.ecreditservice.dto.PhotoEcartDtos.PointExcluDto;
import io.digiservices.ecreditservice.dto.PhotoEcartDtos.VariationCompteDto;
import io.digiservices.ecreditservice.dto.PhotoEcartDtos.VariationCoupleDto;
import io.digiservices.ecreditservice.dto.PhotoEcartDtos.VariationsDto;
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
import java.util.Map;

/**
 * Le classeur de l'onglet « Variations » : ce qui a bouge entre deux photos, par compte comptable
 * puis par couple (point de service, compte), les points de service exclus, et le resume des
 * operations quand l'outil l'a lu. Feuille de travail de la comptabilite et de la DSIG.
 *
 * <p>Pas d'{@code autoSizeColumn} : aucune police dans les images de production, l'appel fait
 * tomber tout l'export ({@link ExcelLargeurs}).</p>
 */
public final class VariationEcartsExcelUtils {

    private VariationEcartsExcelUtils() {
    }

    private static final DateTimeFormatter FMT = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private static final DateTimeFormatter FMT_HEURE = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
    private static final Map<String, String> MODULES = Map.of(
            "COMPTES", "Comptes clients", "CREDITS", "Crédits", "DAT", "Dépôts à terme");
    private static final Map<String, String> ETATS_SUIVI = Map.of(
            "A_INSTRUIRE", "À instruire", "EXPLIQUEE", "Expliquée", "CORRIGEE_SAF", "Corrigée dans SAF",
            "CONFIRMEE", "Confirmée par la photo", "STRUCTUREL", "Écart structurel accepté");

    private static final String[] ENTETES_COMPTE = {
            "Compte comptable", "Produits", "PS qui bougent", "Variation nette (GNF)", "Variation absolue (GNF)",
            "Côté dominant", "Apparus", "Aggravés", "Réduits", "Résolus", "Lignes nouvelles", "Lignes disparues", "Mouvements"
    };
    private static final String[] ENTETES_COUPLE = {
            "Délégation", "Agence", "Point de service", "Code PS", "Compte comptable", "Produits",
            "Écart référence (GNF)", "Écart du jour (GNF)", "Variation (GNF)", "Δ solde client (GNF)",
            "Δ solde comptable (GNF)", "État référence", "État du jour", "Statut", "Côté", "Explication",
            "Suivi", "Opérations de la fenêtre", "Anomalies", "Poids des anomalies (GNF)",
            "Sans écriture", "Montant sans écriture (GNF)", "Écritures sans mouvement",
            "Montant sans mouvement (GNF)", "Opération dominante", "Comptes clients touchés",
            "Mouvements nets du flux (GNF)", "Δ client − mouvements nets (GNF)", "Soldes divergents", "Somme des restes (GNF)"
    };

    public static byte[] classeur(String module, VariationsDto v) throws IOException {
        try (Workbook wb = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            CellStyle titre = styleTitre(wb), entete = styleEntete(wb), texte = styleTexte(wb),
                    nombre = styleNombre(wb), signe = styleSigne(wb), entier = styleEntier(wb);

            // ---- Feuille 1 : par compte comptable
            Sheet f = wb.createSheet("Par compte");
            int l = 0;
            cellule(f, l++, 0, "Variations des écarts de rapprochement — " + MODULES.getOrDefault(module, module), titre);
            String periode = v.reference() == null || v.photo() == null ? "une seule photo : rien à comparer"
                    : "du " + v.reference().jour().format(FMT) + " au " + v.photo().jour().format(FMT);
            cellule(f, l++, 0, periode + " · " + v.pointsCompares() + " point(s) de service comparés · variations sous "
                    + montant(v.seuil()) + " GNF masquées · " + v.nbCouples() + " couple(s) qui bougent", texte);
            cellule(f, l++, 0, "Écarts qui se creusent : " + montant(v.sommeAggravations()) + " GNF · qui se résorbent : "
                    + montant(v.sommeResolutions()) + " GNF · part des 5 premiers comptes : "
                    + (v.partCinqPremiers() == null ? "—" : v.partCinqPremiers().movePointRight(2).setScale(0, java.math.RoundingMode.HALF_UP) + " %")
                    + " · exporté le " + LocalDateTime.now().format(FMT_HEURE), texte);
            l++;
            Row e1 = ligne(f, l++);
            for (int i = 0; i < ENTETES_COMPTE.length; i++) {
                cel(e1, i, ENTETES_COMPTE[i], entete);
            }
            for (VariationCompteDto c : v.comptes()) {
                Row r = ligne(f, l++);
                cel(r, 0, nvl(c.compteComptable()), texte);
                cel(r, 1, nvl(c.produits()), texte);
                num(r, 2, c.nbPoints(), entier);
                num(r, 3, c.variationNette(), signe);
                num(r, 4, c.variationAbsolue(), nombre);
                cel(r, 5, nvl(c.coteDominant()), texte);
                num(r, 6, c.nbApparus(), entier);
                num(r, 7, c.nbAggraves(), entier);
                num(r, 8, c.nbReduits(), entier);
                num(r, 9, c.nbResolus(), entier);
                num(r, 10, c.nbNouvelles(), entier);
                num(r, 11, c.nbDisparues(), entier);
                num(r, 12, c.nbMouvements(), entier);
            }
            ExcelLargeurs.ajuster(f, ENTETES_COMPTE.length);

            // ---- Feuille 2 : par couple (point de service, compte)
            Sheet g = wb.createSheet("Par point de service");
            int m = 0;
            Row e2 = ligne(g, m++);
            for (int i = 0; i < ENTETES_COUPLE.length; i++) {
                cel(e2, i, ENTETES_COUPLE[i], entete);
            }
            for (VariationCoupleDto c : v.couples()) {
                Row r = ligne(g, m++);
                cel(r, 0, nvl(c.libelleDelegation()), texte);
                cel(r, 1, nvl(c.libelleAgence()), texte);
                cel(r, 2, nvl(c.libellePoint()), texte);
                cel(r, 3, nvl(c.codAgencia()), texte);
                cel(r, 4, nvl(c.compteComptable()), texte);
                cel(r, 5, nvl(c.produits()), texte);
                num(r, 6, c.ecartReference(), signe);
                num(r, 7, c.ecartJour(), signe);
                num(r, 8, c.variation(), signe);
                num(r, 9, c.variationClient(), signe);
                num(r, 10, c.variationComptable(), signe);
                cel(r, 11, nvl(c.etatReference()), texte);
                cel(r, 12, nvl(c.etatJour()), texte);
                cel(r, 13, nvl(c.statut()), texte);
                cel(r, 14, nvl(c.cote()), texte);
                cel(r, 15, nvl(c.explication()), texte);
                cel(r, 16, c.suiviEtat() == null ? "" : ETATS_SUIVI.getOrDefault(c.suiviEtat(), c.suiviEtat())
                        + (c.suiviId() == null ? "" : " (fiche " + c.suiviId() + ")"), texte);
                ExplicationRecue o = c.operations();
                if (o == null) {
                    cel(r, 17, "non lu", texte);
                } else {
                    cel(r, 17, (o.fenetreDu() == null ? "" : o.fenetreDu().format(FMT)) + " → veille du "
                            + (o.fenetreAu() == null ? "" : o.fenetreAu().format(FMT)) + " · "
                            + nvl(o.nbOperations()) + " mouvement(s)", texte);
                    num(r, 18, o.nbAnomalies(), entier);
                    num(r, 19, o.montantAnomalies(), signe);
                    num(r, 20, o.nbSansEcriture(), entier);
                    num(r, 21, o.montantSansEcriture(), signe);
                    num(r, 22, o.nbSansMouvement(), entier);
                    num(r, 23, o.montantSansMouvement(), signe);
                    cel(r, 24, nvl(o.operationDominante()), texte);
                    num(r, 25, o.nbComptesClients(), entier);
                    num(r, 26, o.montantNetFlux(), signe);
                    if (o.montantNetFlux() != null && c.variationClient() != null) {
                        // Quand tout est apparie et que ce reste n'est pas nul, ce sont les soldes
                        // clients qui ne suivent pas leurs mouvements (Sinko, 25→26/11/2026).
                        num(r, 27, c.variationClient().subtract(o.montantNetFlux()), signe);
                    }
                    num(r, 28, o.nbDivergences(), entier);
                    num(r, 29, o.montantDivergences(), signe);
                }
            }
            ExcelLargeurs.ajuster(g, ENTETES_COUPLE.length);

            // ---- Feuille 3 : points de service exclus
            if (v.pointsExclus() != null && !v.pointsExclus().isEmpty()) {
                Sheet h = wb.createSheet("Points exclus");
                int n = 0;
                cellule(h, n++, 0, "Points de service présents dans une seule des deux photos : comparés à rien, "
                        + "une disparition due à une photo incomplète n'est pas une correction", texte);
                Row e3 = ligne(h, n++);
                String[] entetes = {"Code PS", "Point de service", "Présent le jour", "Présent en référence"};
                for (int i = 0; i < entetes.length; i++) {
                    cel(e3, i, entetes[i], entete);
                }
                for (PointExcluDto p : v.pointsExclus()) {
                    Row r = ligne(h, n++);
                    cel(r, 0, nvl(p.codAgencia()), texte);
                    cel(r, 1, nvl(p.libellePoint()), texte);
                    cel(r, 2, p.dansJour() ? "oui" : "non", texte);
                    cel(r, 3, p.dansReference() ? "oui" : "non", texte);
                }
                ExcelLargeurs.ajuster(h, entetes.length);
            }
            wb.write(out);
            return out.toByteArray();
        }
    }

    public static String nomFichier(String module, VariationsDto v) {
        LocalDate ref = v.reference() == null ? null : v.reference().jour();
        LocalDate jour = v.photo() == null ? LocalDate.now() : v.photo().jour();
        return "Variations_ecarts_" + module + "_" + (ref == null ? "" : ref + "_") + jour + ".xlsx";
    }

    // ---- outils

    private static Row ligne(Sheet f, int l) {
        Row r = f.getRow(l);
        return r == null ? f.createRow(l) : r;
    }

    private static void cellule(Sheet f, int l, int c, String v, CellStyle style) {
        cel(ligne(f, l), c, v, style);
    }

    private static void cel(Row r, int c, String v, CellStyle style) {
        Cell cell = r.createCell(c);
        cell.setCellValue(v == null ? "" : v);
        cell.setCellStyle(style);
    }

    private static void num(Row r, int c, Number v, CellStyle style) {
        Cell cell = r.createCell(c);
        if (v != null) {
            cell.setCellValue(v.doubleValue());
        }
        cell.setCellStyle(style);
    }

    private static String montant(BigDecimal v) {
        return v == null ? "—" : String.format("%,.2f", v).replace(',', ' ').replace('.', ',');
    }

    private static String nvl(Object s) {
        return s == null ? "" : String.valueOf(s);
    }

    private static CellStyle styleTitre(Workbook wb) {
        CellStyle s = wb.createCellStyle();
        Font f = wb.createFont();
        f.setBold(true);
        f.setFontHeightInPoints((short) 12);
        s.setFont(f);
        return s;
    }

    private static CellStyle styleEntete(Workbook wb) {
        CellStyle s = base(wb);
        Font f = wb.createFont();
        f.setBold(true);
        f.setFontHeightInPoints((short) 10);
        s.setFont(f);
        s.setFillForegroundColor(IndexedColors.PALE_BLUE.getIndex());
        s.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        s.setWrapText(true);
        return s;
    }

    private static CellStyle styleTexte(Workbook wb) {
        return base(wb);
    }

    private static CellStyle styleNombre(Workbook wb) {
        CellStyle s = base(wb);
        s.setDataFormat(wb.createDataFormat().getFormat("#,##0.00"));
        return s;
    }

    private static CellStyle styleSigne(Workbook wb) {
        CellStyle s = base(wb);
        s.setDataFormat(wb.createDataFormat().getFormat("#,##0.00;[Red]-#,##0.00"));
        return s;
    }

    private static CellStyle styleEntier(Workbook wb) {
        CellStyle s = base(wb);
        s.setDataFormat(wb.createDataFormat().getFormat("#,##0"));
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
