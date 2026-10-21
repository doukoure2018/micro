package io.digiservices.ecreditservice.utils;

import io.digiservices.ecreditservice.dto.RapportMensuelDtos.AnnuelDto;
import io.digiservices.ecreditservice.dto.RapportMensuelDtos.RubriqueDto;
import io.digiservices.ecreditservice.dto.RapportMensuelDtos.SectionDto;
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
import org.apache.poi.xssf.streaming.SXSSFWorkbook;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;

/**
 * Export du rapport d'activite (V168) au format du fichier « RAPPORT FORECARIAH » : une feuille
 * par point de service, une feuille « Total » par agence, chaque bloc rendu selon l'orientation
 * de sa section (mois en lignes, mois en colonnes, trimestres, photographies de fin de trimestre).
 */
public final class RapportActiviteExcelUtils {

    private RapportActiviteExcelUtils() {
    }

    private static final String[] MOIS = RapportMensuelExcelUtils.MOIS;
    private static final String[] TRIMESTRES = {"1er trimestre", "2e trimestre", "3e trimestre", "4e trimestre"};
    private static final String[] FIN_TRIMESTRE = {"31 mars", "30 juin", "30 septembre", "31 décembre"};

    /**
     * Classeur ecrit en flux (SXSSF, fenetre de 200 lignes) : le 20/10/2026 un export de tout le
     * reseau (185 feuilles) construit en memoire a epuise le tas du service et l'a rendu muet.
     */
    public static byte[] classeur(int annee, List<AnnuelDto> feuilles, List<SectionDto> sections, List<RubriqueDto> rubriques) throws IOException {
        try (SXSSFWorkbook wb = new SXSSFWorkbook(200); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Styles st = new Styles(wb);
            Map<String, List<RubriqueDto>> parSection = new LinkedHashMap<>();
            for (RubriqueDto r : rubriques) {
                parSection.computeIfAbsent(r.getSection() == null ? "" : r.getSection(), k -> new ArrayList<>()).add(r);
            }
            int n = 0;
            for (AnnuelDto f : feuilles) {
                String nom = nomFeuille(f.getLibelle(), ++n);
                Sheet s = wb.createSheet(nom);
                s.setColumnWidth(0, 8 * 256);
                s.setColumnWidth(1, 34 * 256);
                for (int c = 2; c < 30; c++) s.setColumnWidth(c, 17 * 256);
                int r = 0;
                ligneTexte(s, r++, "DELEGATION REGIONALE DE :", nvl(f.getDelegation()), st);
                ligneTexte(s, r++, "AGENCE :", nvl(f.getAgence()), st);
                ligneTexte(s, r++, f.getCodAgencia() == null ? "TOTAL :" : "POINT DE SERVICE :", nvl(f.getLibelle()), st);
                ligneTexte(s, r++, "EXERCICE :", String.valueOf(annee), st);
                r++;
                for (SectionDto sec : sections) {
                    List<RubriqueDto> rs = parSection.getOrDefault(sec.getCode(), List.of());
                    if (rs.isEmpty()) continue;
                    r = section(s, r, sec, rs, f, st);
                    r++;
                }
            }
            wb.write(out);
            wb.dispose();
            return out.toByteArray();
        }
    }

    private static int section(Sheet s, int r, SectionDto sec, List<RubriqueDto> rs, AnnuelDto f, Styles st) {
        Cell t = s.createRow(r++).createCell(0);
        t.setCellValue(sec.getLibelle().toUpperCase());
        t.setCellStyle(st.titreSection);
        return switch (sec.getOrientation()) {
            case "MOIS_COLONNES" -> moisColonnes(s, r, sec, rs, f, st);
            case "TRIMESTRE" -> trimestres(s, r, sec, rs, f, st);
            case "INSTANTANE" -> instantanes(s, r, rs, f, st);
            default -> moisLignes(s, r, sec, rs, f, st);
        };
    }

    // ---- Mois en lignes : N°, MOIS, puis une colonne par rubrique (ligne d'ouverture, 12 mois, ligne annuelle)
    private static int moisLignes(Sheet s, int r, SectionDto sec, List<RubriqueDto> rs, AnnuelDto f, Styles st) {
        List<RubriqueDto> colonnes = rs.stream().filter(x -> !"OUVERTURE".equals(x.getPeriodicite())).toList();
        List<RubriqueDto> ouverture = rs.stream().filter(x -> "OUVERTURE".equals(x.getPeriodicite())).toList();
        boolean groupes = colonnes.stream().anyMatch(x -> x.getGroupe() != null);
        if (groupes) {
            Row rg = s.createRow(r++);
            for (int i = 0; i < colonnes.size(); i++) {
                entete(rg, 2 + i, nvl(colonnes.get(i).getGroupe()), st.groupe);
            }
        }
        Row h = s.createRow(r++);
        entete(h, 0, "N°", st.entete);
        entete(h, 1, "MOIS", st.entete);
        for (int i = 0; i < colonnes.size(); i++) {
            entete(h, 2 + i, colonnes.get(i).getLibelleCourt(), st.entete);
        }
        if (!ouverture.isEmpty()) {
            Row row = s.createRow(r++);
            row.createCell(1).setCellValue(nvl(ouverture.get(0).getGroupe()).toUpperCase());
            Map<String, BigDecimal> janvier = f.getParMois().getOrDefault(1, Map.of());
            for (int i = 0; i < colonnes.size(); i++) {
                String codeOuverture = codeOuverture(colonnes.get(i).getCode(), ouverture);
                nombre(row, 2 + i, codeOuverture == null ? null : janvier.get(codeOuverture), colonnes.get(i), st, false);
            }
        }
        boolean trimestriel = "TRIMESTRIEL".equals(sec.getPeriodicite());
        for (int mois = 1; mois <= 12; mois++) {
            if (trimestriel && mois % 3 != 0) continue;
            Row row = s.createRow(r++);
            row.createCell(0).setCellValue(mois);
            row.createCell(1).setCellValue(MOIS[mois - 1]);
            Map<String, BigDecimal> m = f.getParMois().getOrDefault(mois, Map.of());
            for (int i = 0; i < colonnes.size(); i++) {
                nombre(row, 2 + i, m.get(colonnes.get(i).getCode()), colonnes.get(i), st, false);
            }
        }
        if (sec.getLibelleAnnuel() != null) {
            Row row = s.createRow(r++);
            Cell c = row.createCell(1);
            c.setCellValue(sec.getLibelleAnnuel());
            c.setCellStyle(st.total);
            for (int i = 0; i < colonnes.size(); i++) {
                nombre(row, 2 + i, f.getAnnuel().get(colonnes.get(i).getCode()), colonnes.get(i), st, true);
            }
            // Bloc des apures : solde instantane = solde au 31/12 A-1 moins les recouvrements de l'annee.
            if (!ouverture.isEmpty() && "SOMME".equals(colonnes.get(0).getAgregatAnnuel())) {
                Row rs2 = s.createRow(r++);
                Cell c2 = rs2.createCell(1);
                c2.setCellValue("SOLDE INSTANTANE");
                c2.setCellStyle(st.total);
                Map<String, BigDecimal> janvier = f.getParMois().getOrDefault(1, Map.of());
                for (int i = 0; i < colonnes.size(); i++) {
                    String co = codeOuverture(colonnes.get(i).getCode(), ouverture);
                    BigDecimal init = co == null ? null : janvier.get(co);
                    BigDecimal total = f.getAnnuel().get(colonnes.get(i).getCode());
                    BigDecimal solde = init == null ? null : init.subtract(total == null ? BigDecimal.ZERO : total);
                    nombre(rs2, 2 + i, solde, colonnes.get(i), st, true);
                }
            }
        }
        return r;
    }

    /** ENC_A1_CC repond a ENC_CC, APU_SOLDE_CC a APU_CC : la rubrique d'ouverture porte un marqueur dans son code. */
    private static String codeOuverture(String codeMensuel, List<RubriqueDto> ouverture) {
        for (RubriqueDto o : ouverture) {
            String c = o.getCode().replace("_A1_", "_").replace("_SOLDE_", "_");
            if (c.equals(codeMensuel)) return o.getCode();
        }
        return null;
    }

    // ---- Mois en colonnes : LIBELLES, TOTAL, JANVIER..DECEMBRE ; une ligne par rubrique
    private static int moisColonnes(Sheet s, int r, SectionDto sec, List<RubriqueDto> rs, AnnuelDto f, Styles st) {
        Row h = s.createRow(r++);
        entete(h, 1, "LIBELLES", st.entete);
        entete(h, 2, nvl(sec.getLibelleAnnuel(), "TOTAL"), st.entete);
        for (int mois = 1; mois <= 12; mois++) entete(h, 2 + mois, MOIS[mois - 1], st.entete);
        for (RubriqueDto rub : rs) {
            Row row = s.createRow(r++);
            Cell c = row.createCell(1);
            c.setCellValue(rub.getLibelle().toUpperCase());
            if ("CALCUL".equals(rub.getNature())) c.setCellStyle(st.total);
            nombre(row, 2, f.getAnnuel().get(rub.getCode()), rub, st, true);
            for (int mois = 1; mois <= 12; mois++) {
                nombre(row, 2 + mois, f.getParMois().getOrDefault(mois, Map.of()).get(rub.getCode()), rub, st, "CALCUL".equals(rub.getNature()));
            }
        }
        return r;
    }

    // ---- Trimestres : une ligne par trimestre, colonnes groupees, ligne MOYENNE
    private static int trimestres(Sheet s, int r, SectionDto sec, List<RubriqueDto> rs, AnnuelDto f, Styles st) {
        boolean groupes = rs.stream().anyMatch(x -> x.getGroupe() != null);
        if (groupes) {
            Row rg = s.createRow(r++);
            for (int i = 0; i < rs.size(); i++) entete(rg, 2 + i, nvl(rs.get(i).getGroupe()), st.groupe);
        }
        Row h = s.createRow(r++);
        entete(h, 1, "TRIMESTRE", st.entete);
        for (int i = 0; i < rs.size(); i++) {
            String texte = rs.get(i).getLibelleCourt();
            if (rs.get(i).getAide() != null && rs.get(i).getAide().startsWith("Norme")) texte += " (" + rs.get(i).getAide() + ")";
            entete(h, 2 + i, texte, st.entete);
        }
        for (int t = 0; t < 4; t++) {
            Row row = s.createRow(r++);
            row.createCell(1).setCellValue(TRIMESTRES[t]);
            Map<String, BigDecimal> m = f.getParMois().getOrDefault((t + 1) * 3, Map.of());
            for (int i = 0; i < rs.size(); i++) nombre(row, 2 + i, m.get(rs.get(i).getCode()), rs.get(i), st, false);
        }
        if (sec.getLibelleAnnuel() != null) {
            Row row = s.createRow(r++);
            Cell c = row.createCell(1);
            c.setCellValue(sec.getLibelleAnnuel());
            c.setCellStyle(st.total);
            for (int i = 0; i < rs.size(); i++) nombre(row, 2 + i, f.getAnnuel().get(rs.get(i).getCode()), rs.get(i), st, true);
        }
        return r;
    }

    // ---- Photographies de fin de trimestre : un bloc par trimestre, lignes = groupes, colonnes = mesures
    private static int instantanes(Sheet s, int r, List<RubriqueDto> rs, AnnuelDto f, Styles st) {
        LinkedHashSet<String> lignes = new LinkedHashSet<>();
        LinkedHashSet<String> mesures = new LinkedHashSet<>();
        for (RubriqueDto rub : rs) {
            lignes.add(nvl(rub.getGroupe()));
            mesures.add(rub.getLibelleCourt());
        }
        for (int t = 0; t < 4; t++) {
            Map<String, BigDecimal> m = f.getParMois().getOrDefault((t + 1) * 3, Map.of());
            Cell titre = s.createRow(r++).createCell(1);
            titre.setCellValue("STRUCTURE DES IMPAYES AU " + FIN_TRIMESTRE[t].toUpperCase() + " " + f.getAnnee());
            titre.setCellStyle(st.groupe);
            Row h = s.createRow(r++);
            entete(h, 1, "PERIODE", st.entete);
            int col = 2;
            for (String mes : mesures) entete(h, col++, mes, st.entete);
            for (String lig : lignes) {
                Row row = s.createRow(r++);
                Cell c = row.createCell(1);
                c.setCellValue(lig.toUpperCase());
                if ("Total".equals(lig)) c.setCellStyle(st.total);
                col = 2;
                for (String mes : mesures) {
                    RubriqueDto rub = rs.stream().filter(x -> lig.equals(nvl(x.getGroupe())) && mes.equals(x.getLibelleCourt())).findFirst().orElse(null);
                    if (rub != null) nombre(row, col, m.get(rub.getCode()), rub, st, "Total".equals(lig));
                    col++;
                }
            }
            r++;
        }
        return r;
    }

    // ---- Cellules et styles

    private static void nombre(Row row, int col, BigDecimal v, RubriqueDto rub, Styles st, boolean total) {
        Cell c = row.createCell(col);
        boolean taux = "TAUX".equals(rub.getFormat());
        c.setCellStyle(taux ? (total ? st.pourcentTotal : st.pourcent) : (total ? st.montantTotal : st.montant));
        if (v != null) c.setCellValue(v.doubleValue());
    }

    private static void entete(Row row, int col, String texte, CellStyle style) {
        Cell c = row.createCell(col);
        c.setCellValue(texte);
        c.setCellStyle(style);
    }

    private static void ligneTexte(Sheet s, int r, String label, String valeur, Styles st) {
        Row row = s.createRow(r);
        Cell a = row.createCell(0);
        a.setCellValue(label);
        a.setCellStyle(st.titreSection);
        row.createCell(2).setCellValue(valeur);
    }

    private static String nomFeuille(String libelle, int n) {
        String nom = nvl(libelle, "Feuille " + n).replaceAll("[\\\\/?*\\[\\]:]", " ").trim();
        return nom.length() > 31 ? nom.substring(0, 31) : nom;
    }

    private static String nvl(String s) {
        return s == null ? "" : s;
    }

    private static String nvl(String s, String defaut) {
        return s == null || s.isBlank() ? defaut : s;
    }

    private static final class Styles {
        final CellStyle titreSection, entete, groupe, montant, montantTotal, pourcent, pourcentTotal, total;

        Styles(Workbook wb) {
            Font gras = wb.createFont();
            gras.setBold(true);
            Font grasBlanc = wb.createFont();
            grasBlanc.setBold(true);
            grasBlanc.setColor(IndexedColors.WHITE.getIndex());

            titreSection = wb.createCellStyle();
            titreSection.setFont(gras);

            entete = wb.createCellStyle();
            entete.setFont(grasBlanc);
            entete.setFillForegroundColor(IndexedColors.DARK_TEAL.getIndex());
            entete.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            entete.setAlignment(HorizontalAlignment.CENTER);
            entete.setWrapText(true);
            entete.setBorderBottom(BorderStyle.THIN);

            groupe = wb.createCellStyle();
            groupe.setFont(gras);
            groupe.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
            groupe.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            groupe.setAlignment(HorizontalAlignment.CENTER);

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
        }
    }
}
