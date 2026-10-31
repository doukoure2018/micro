package io.digiservices.ecreditservice.utils;

import io.digiservices.ecreditservice.dto.PortefeuilleRisqueDtos.LigneRisqueDto;
import io.digiservices.ecreditservice.dto.PortefeuilleRisqueDtos.PortefeuilleRisqueDto;
import io.digiservices.ecreditservice.dto.PortefeuilleRisqueDtos.RisqueReseauDto;
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
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.function.Function;

/**
 * Classeurs du portefeuille a risque. Chaque feuille porte le total en premiere ligne pour que
 * le lecteur verifie d'un coup d'oeil que la ventilation retombe sur l'ensemble.
 */
public final class PortefeuilleRisqueExcelUtils {

    private PortefeuilleRisqueExcelUtils() {
    }

    private static final DateTimeFormatter FMT_DATE = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private static final DateTimeFormatter FMT_HORODATAGE = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    private static final String[] ENTETES = {
            "Crédits", "Encours (GNF)", "Part de l'encours", "En retard", "Impayés (GNF)",
            "PAR 30 (GNF)", "PAR 30 (%)", "Crédits à 30 j et plus",
            "PAR 60 (GNF)", "PAR 60 (%)", "Crédits à 60 j et plus",
            "PAR 90 (GNF)", "PAR 90 (%)", "Crédits à 90 j et plus",
            "PAR 120 (GNF)", "PAR 120 (%)", "Crédits à 120 j et plus", "Contentieux déclarés"
    };

    private static final String DEFINITION = "PAR 30 : encours des crédits en cours dont la plus ancienne échéance impayée a 30 jours ou plus, rapporté à l'encours des crédits en cours. Même règle que le bandeau du portefeuille et que la déclaration BCRG.";

    /** Un point de service (lot 1) : Par produit, Par famille, Par agent, Croisement. */
    public static byte[] classeur(PortefeuilleRisqueDto p) throws IOException {
        try (Workbook wb = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Styles st = new Styles(wb);
            String titre = "Portefeuille à risque — " + nvl(p.getDesAgencia()) + " (" + p.getCodAgencia() + ")";
            String sousTitre = cartouche(p.getDateLecture(), p.getSeuilPar30(), p.getSeuilPar90(), null);
            feuille(wb, st, titre, sousTitre, "Par produit", "Produit (type de crédit SAF)", "Famille",
                    LigneRisqueDto::getFamille, p.getTotal(), "Total du point de service", p.getParProduit());
            feuille(wb, st, titre, sousTitre, "Par famille", "Famille", null, null,
                    p.getTotal(), "Total du point de service", p.getParFamille());
            feuille(wb, st, titre, sousTitre, "Par agent", "Gestionnaire désigné", "Statut",
                    PortefeuilleRisqueExcelUtils::statutAgent, p.getTotal(), "Total du point de service", p.getParAgent());
            feuille(wb, st, titre, sousTitre, "Croisement", "Agent", "Produit",
                    LigneRisqueDto::getProduit, p.getTotal(), "Total du point de service", p.getCroisement());
            wb.write(out);
            return out.toByteArray();
        }
    }

    /** Un perimetre (lot 2) : Par niveau, Par produit, Par famille, Par agent (photo). */
    public static byte[] classeurReseau(RisqueReseauDto r) throws IOException {
        try (Workbook wb = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Styles st = new Styles(wb);
            String perimetre = r.getAgence() != null ? "Agence " + r.getAgence()
                    : r.getDelegation() != null ? "Délégation " + r.getDelegation()
                    : "Tout le périmètre";
            String titre = "Portefeuille à risque — " + perimetre + " (" + r.getNbPointsService() + " points de service)";
            String sousTitre = cartouche(r.getDateLecture(), r.getSeuilPar30(), r.getSeuilPar90(), null);
            String niveau = switch (r.getNiveau()) {
                case "delegation" -> "Délégation";
                case "agence" -> "Agence";
                default -> "Point de service";
            };
            feuille(wb, st, titre, sousTitre, "Par niveau", niveau, "Rattachement",
                    l -> l.getRattachement() == null ? "" : l.getRattachement(), r.getTotal(), "Total du périmètre", r.getParNiveau());
            feuille(wb, st, titre, sousTitre, "Par produit", "Produit (type de crédit SAF)", "Famille",
                    LigneRisqueDto::getFamille, r.getTotal(), "Total du périmètre", r.getParProduit());
            feuille(wb, st, titre, sousTitre, "Par famille", "Famille", null, null,
                    r.getTotal(), "Total du périmètre", r.getParFamille());
            String sousTitrePhoto = r.getDatePhoto() == null
                    ? "Aucune photo disponible : la ventilation par agent est prise chaque matin à 08h40 GMT."
                    : "Photo du " + r.getDatePhoto().format(FMT_DATE) + " à 08h40 GMT : SAF ne connaît pas les affectations digi, la ventilation par agent se lit dans la photo du matin."
                      + " Seuils d'attention : PAR 30 ≥ " + r.getSeuilPar30() + " %, PAR 90 ≥ " + r.getSeuilPar90() + " %.";
            feuille(wb, st, titre, sousTitrePhoto, "Par agent (photo)", "Gestionnaire désigné", "Statut",
                    PortefeuilleRisqueExcelUtils::statutAgent, null, null, r.getParAgent());
            wb.write(out);
            return out.toByteArray();
        }
    }

    // ------------------------------------------------------------------ interne

    private static String cartouche(LocalDate dateLecture, BigDecimal s30, BigDecimal s90, String complement) {
        return "Crédits en cours lus dans SAF le " + dateLecture.format(FMT_DATE)
                + " — exporté le " + LocalDateTime.now().format(FMT_HORODATAGE)
                + " — seuils d'attention : PAR 30 ≥ " + s30 + " %, PAR 90 ≥ " + s90 + " %"
                + (complement == null ? "" : " — " + complement);
    }

    private static String statutAgent(LigneRisqueDto l) {
        return l.isNonAffecte() ? "sans gestionnaire"
                : Boolean.FALSE.equals(l.getDisponible()) ? "parti ou désactivé" : "agent du point de service";
    }

    private static void feuille(Workbook wb, Styles st, String titre, String sousTitre, String nom,
                                String premiereColonne, String deuxiemeColonne, Function<LigneRisqueDto, String> valeur2,
                                LigneRisqueDto total, String libelleTotal, List<LigneRisqueDto> lignes) {
        Sheet s = wb.createSheet(nom);
        int r = 0;
        Cell ct = s.createRow(r++).createCell(0);
        ct.setCellValue(titre);
        ct.setCellStyle(st.titre);
        s.createRow(r++).createCell(0).setCellValue(sousTitre);
        s.createRow(r++).createCell(0).setCellValue(DEFINITION);
        r++;

        Row entete = s.createRow(r++);
        int col = 0;
        cell(entete, col++, premiereColonne, st.entete);
        if (deuxiemeColonne != null) cell(entete, col++, deuxiemeColonne, st.entete);
        for (String e : ENTETES) cell(entete, col++, e, st.entete);

        BigDecimal encoursTotal = total == null
                ? (lignes == null ? BigDecimal.ZERO : lignes.stream().map(LigneRisqueDto::getEncours).reduce(BigDecimal.ZERO, BigDecimal::add))
                : total.getEncours();
        if (total != null) {
            ligne(s.createRow(r++), total, libelleTotal, deuxiemeColonne == null ? null : "", encoursTotal, st, true);
        }
        if (lignes != null) {
            for (LigneRisqueDto l : lignes) {
                String v2 = deuxiemeColonne == null ? null : valeur2 == null ? "" : nvl(valeur2.apply(l));
                ligne(s.createRow(r++), l, l.getLibelle(), v2, encoursTotal, st, false);
            }
        }
        int nbCol = ENTETES.length + (deuxiemeColonne != null ? 2 : 1);
        ExcelLargeurs.ajuster(s, nbCol);
        s.createFreezePane(0, 5);
    }

    private static void ligne(Row row, LigneRisqueDto l, String libelle, String colonne2, BigDecimal encoursTotal,
                              Styles st, boolean gras) {
        int c = 0;
        cell(row, c++, libelle, gras ? st.gras : null);
        if (colonne2 != null) cell(row, c++, colonne2, null);
        nombre(row, c++, l.getNbCredits());
        montant(row, c++, l.getEncours(), st.montant);
        pourcent(row, c++, LigneRisqueDto.taux(l.getEncours(), encoursTotal), st.pourcent);
        nombre(row, c++, l.getNbEnRetard());
        montant(row, c++, l.getImpaye(), st.montant);
        montant(row, c++, l.getEncoursPar30(), st.montant);
        pourcent(row, c++, l.getTauxPar30(), st.pourcent);
        nombre(row, c++, l.getNbPar30());
        montant(row, c++, l.getEncoursPar60(), st.montant);
        pourcent(row, c++, l.getTauxPar60(), st.pourcent);
        nombre(row, c++, l.getNbPar60());
        montant(row, c++, l.getEncoursPar90(), st.montant);
        pourcent(row, c++, l.getTauxPar90(), st.pourcent);
        nombre(row, c++, l.getNbPar90());
        montant(row, c++, l.getEncoursPar120(), st.montant);
        pourcent(row, c++, l.getTauxPar120(), st.pourcent);
        nombre(row, c++, l.getNbPar120());
        nombre(row, c, l.getNbContentieuxDeclares());
    }

    /** Taux deja exprime en pourcentage (12.5 pour 12,5 %) : Excel attend une fraction. */
    private static void pourcent(Row row, int col, BigDecimal tauxPourcent, CellStyle style) {
        Cell cell = row.createCell(col);
        cell.setCellValue(tauxPourcent == null ? 0 : tauxPourcent.divide(BigDecimal.valueOf(100), 6, RoundingMode.HALF_UP).doubleValue());
        cell.setCellStyle(style);
    }

    private static void montant(Row row, int col, BigDecimal valeur, CellStyle style) {
        Cell cell = row.createCell(col);
        cell.setCellValue(valeur == null ? 0 : valeur.doubleValue());
        cell.setCellStyle(style);
    }

    private static void nombre(Row row, int col, long valeur) {
        row.createCell(col).setCellValue(valeur);
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
