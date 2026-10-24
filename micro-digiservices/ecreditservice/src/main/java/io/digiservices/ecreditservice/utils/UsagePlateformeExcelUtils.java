package io.digiservices.ecreditservice.utils;

import io.digiservices.ecreditservice.dto.UsagePlateformeDtos.DelegationDto;
import io.digiservices.ecreditservice.dto.UsagePlateformeDtos.ExecutionDto;
import io.digiservices.ecreditservice.dto.UsagePlateformeDtos.JourDto;
import io.digiservices.ecreditservice.dto.UsagePlateformeDtos.ResumeDto;
import io.digiservices.ecreditservice.dto.UsagePlateformeDtos.RoleDto;
import io.digiservices.ecreditservice.dto.UsagePlateformeDtos.UsageSemaineDto;
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
import java.time.format.DateTimeFormatter;

/**
 * Export Excel du barometre d'usage (V174) : une feuille de synthese, une par jour, une par
 * delegation, une pour les alertes.
 */
public final class UsagePlateformeExcelUtils {

    private UsagePlateformeExcelUtils() {
    }

    private static final DateTimeFormatter FMT = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    public static byte[] classeur(UsageSemaineDto d) throws IOException {
        try (Workbook wb = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            CellStyle titre = styleTitre(wb), entete = styleEntete(wb), nombre = styleNombre(wb),
                    texte = styleTexte(wb), montant = styleMontant(wb);
            synthese(wb, d, titre, entete, texte, nombre, montant);
            parJour(wb, d, titre, entete, texte, nombre);
            parDelegation(wb, d, titre, entete, texte, nombre);
            alertes(wb, d, titre, entete, texte, nombre);
            wb.write(out);
            return out.toByteArray();
        }
    }

    // ==================== Feuilles ====================

    private static void synthese(Workbook wb, UsageSemaineDto d, CellStyle titre, CellStyle entete,
                                 CellStyle texte, CellStyle nombre, CellStyle montant) {
        Sheet f = wb.createSheet("Synthèse");
        int l = 0;
        cellule(f, l++, 0, "Baromètre d'usage de digi — " + d.getLibellePeriode(), titre);
        cellule(f, l++, 0, "Périmètre : " + d.getPerimetre(), texte);
        l++;
        ResumeDto p = d.getPrecedente();
        ligneEntete(f, l++, entete, "Famille", "Indicateur", "Semaine", "Semaine précédente");

        l = bloc(f, l, texte, nombre, "Adoption", new Object[][]{
                {"Connexions", d.getConnexions(), p == null ? null : p.getConnexions()},
                {"Utilisateurs actifs", d.getUtilisateursActifs(), p == null ? null : p.getUtilisateursActifs()},
                {"Agents de crédit actifs", d.getAgentsActifs(), p == null ? null : p.getAgentsActifs()},
                {"Comptes actifs du périmètre", d.getComptesActifs(), null},
                {"Comptes jamais connectés", d.getJamaisConnectes(), null}});

        l = bloc(f, l, texte, nombre, "Couverture", new Object[][]{
                {"Points de service ayant créé un dossier", d.getPsProducteurs(), p == null ? null : p.getPsProducteurs()},
                {"Points de service du périmètre", d.getPsTotal(), null}});

        l = bloc(f, l, texte, nombre, "Activité crédit", new Object[][]{
                {"Dossiers créés", d.getDossiersCrees(), p == null ? null : p.getDossiersCrees()},
                {"dont crédits de groupe", d.getDossiersGroupe(), null},
                {"dont crédits fonctionnaire", d.getDossiersFonctionnaire(), null},
                {"Validés en dernière instance", d.getDossiersValides(), p == null ? null : p.getDossiersValides()}});
        if (d.getMontantValide() != null) {
            cellule(f, l, 1, "Montant validé (GNF)", texte);
            Cell c = ligne(f, l).createCell(2);
            c.setCellValue(d.getMontantValide().doubleValue());
            c.setCellStyle(montant);
            l++;
        }

        l = bloc(f, l, texte, nombre, "Fluidité du circuit", new Object[][]{
                {"Événements du circuit", d.getEvenements(), null},
                {"Acteurs du circuit", d.getActeurs(), null},
                {"Délai médian création → validation finale (jours)", valeur(d.getDelaiMedianJours()), null},
                {"Délai moyen (jours)", valeur(d.getDelaiMoyenJours()), null},
                {"Rejets", d.getRejets(), null},
                {"Annulations", d.getAnnulations(), null},
                {"Réattributions", d.getReattributions(), null}});

        l = bloc(f, l, texte, nombre, "Suivi du portefeuille", new Object[][]{
                {"Affectations faites", d.getAffectations(), p == null ? null : p.getAffectations()},
                {"Directeurs d'agence ayant affecté", d.getDaAyantAffecte(), null},
                {"Affectations closes", d.getAffectationsCloses(), null},
                {"Crédits affectés au terme de la semaine", d.getAffectationsActives(), null},
                {"Agents porteurs d'un portefeuille", d.getAgentsPorteurs(), null},
                {"Agents notés", d.getAgentsNotes(), null}});

        l = bloc(f, l, texte, nombre, "Alertes du portefeuille", new Object[][]{
                {"Digests aux agents", d.getAlertesAgents(), null},
                {"Synthèses aux DA", d.getAlertesDa(), null},
                {"Synthèses aux DR", d.getAlertesDr(), null},
                {"Synthèses à la DE", d.getAlertesDe(), null},
                {"Alertes techniques", d.getAlertesTechniques(), null},
                {"Total publié", d.getAlertesEnvoyees(), p == null ? null : p.getAlertesEnvoyees()},
                {"Jours avec digest envoyé", d.getJoursAvecDigest(), null}});

        l = bloc(f, l, texte, nombre, "Qualité des données", new Object[][]{
                {"Fiches sociétaires corrigées", d.getFichesCorrigees(), null},
                {"Corrections annulées", d.getCorrectionsAnnulees(), null},
                {"Demandes de changement de téléphone", d.getTelephonesDemandes(), null},
                {"Signalements de numéro", d.getSignalements(), null}});

        if (d.getAvertissement() != null) {
            l++;
            cellule(f, l, 0, d.getAvertissement(), texte);
        }
        largeurs(f, 24, 46, 16, 20);
    }

    private static void parJour(Workbook wb, UsageSemaineDto d, CellStyle titre, CellStyle entete,
                                CellStyle texte, CellStyle nombre) {
        Sheet f = wb.createSheet("Par jour");
        int l = 0;
        cellule(f, l++, 0, "Jour par jour — " + d.getLibellePeriode(), titre);
        ligneEntete(f, l++, entete, "Jour", "Date", "Connexions", "Utilisateurs", "Dossiers individuels",
                "Crédits de groupe", "Crédits fonctionnaire", "Agents notés");
        for (JourDto j : d.getJours()) {
            Row r = ligne(f, l++);
            cel(r, 0, j.getLibelle(), texte);
            cel(r, 1, j.getJour().format(FMT), texte);
            num(r, 2, j.getConnexions(), nombre);
            num(r, 3, j.getUtilisateurs(), nombre);
            num(r, 4, j.getDossiersIndividuels(), nombre);
            num(r, 5, j.getDossiersGroupe(), nombre);
            num(r, 6, j.getDossiersFonctionnaire(), nombre);
            num(r, 7, j.getAgentsNotes(), nombre);
        }
        largeurs(f, 12, 14, 14, 14, 20, 18, 20, 14);
    }

    private static void parDelegation(Workbook wb, UsageSemaineDto d, CellStyle titre, CellStyle entete,
                                      CellStyle texte, CellStyle nombre) {
        Sheet f = wb.createSheet("Par délégation");
        int l = 0;
        cellule(f, l++, 0, "Par délégation — " + d.getLibellePeriode(), titre);
        ligneEntete(f, l++, entete, "Délégation", "Comptes", "Actifs", "Part active (%)", "Connexions",
                "Dossiers créés", "Validés", "PS producteurs", "PS total", "Affectations");
        for (DelegationDto g : d.getDelegations()) {
            Row r = ligne(f, l++);
            cel(r, 0, g.getLibelle(), texte);
            num(r, 1, g.getComptes(), nombre);
            num(r, 2, g.getActifs(), nombre);
            num(r, 3, g.getPartActifs(), nombre);
            num(r, 4, g.getConnexions(), nombre);
            num(r, 5, g.getDossiersCrees(), nombre);
            num(r, 6, g.getDossiersValides(), nombre);
            num(r, 7, g.getPsProducteurs(), nombre);
            num(r, 8, g.getPsTotal(), nombre);
            num(r, 9, g.getAffectations(), nombre);
        }
        l++;
        cellule(f, l++, 0, "Adoption par rôle", titre);
        ligneEntete(f, l++, entete, "Rôle", "Comptes", "Actifs", "Connexions");
        for (RoleDto g : d.getRoles()) {
            Row r = ligne(f, l++);
            cel(r, 0, g.getLibelle() == null ? g.getRole() : g.getLibelle(), texte);
            num(r, 1, g.getComptes(), nombre);
            num(r, 2, g.getActifs(), nombre);
            num(r, 3, g.getConnexions(), nombre);
        }
        largeurs(f, 24, 12, 12, 16, 14, 16, 12, 16, 12, 14);
    }

    private static void alertes(Workbook wb, UsageSemaineDto d, CellStyle titre, CellStyle entete,
                                CellStyle texte, CellStyle nombre) {
        Sheet f = wb.createSheet("Alertes");
        int l = 0;
        cellule(f, l++, 0, "Alertes du portefeuille — " + d.getLibellePeriode(), titre);
        if (d.getExecutions().isEmpty()) {
            cellule(f, l, 0, d.getAvertissement() == null
                    ? "Aucun passage du planificateur enregistré sur la période."
                    : d.getAvertissement(), texte);
            largeurs(f, 60);
            return;
        }
        ligneEntete(f, l++, entete, "Date", "Heure", "Tâche", "Statut", "Tentative", "Échéances",
                "Impayés", "Agents", "DA", "DR", "DE", "Précision");
        for (ExecutionDto e : d.getExecutions()) {
            Row r = ligne(f, l++);
            cel(r, 0, e.getJour().format(FMT), texte);
            cel(r, 1, e.getHeure(), texte);
            cel(r, 2, e.getJob(), texte);
            cel(r, 3, e.getStatut(), texte);
            num(r, 4, e.getTentative(), nombre);
            numOuVide(r, 5, e.getNbEcheances(), nombre);
            numOuVide(r, 6, e.getNbImpayes(), nombre);
            numOuVide(r, 7, e.getNbAgents(), nombre);
            numOuVide(r, 8, e.getNbDa(), nombre);
            numOuVide(r, 9, e.getNbDr(), nombre);
            numOuVide(r, 10, e.getNbDe(), nombre);
            cel(r, 11, e.getMessage() == null ? "" : e.getMessage(), texte);
        }
        largeurs(f, 14, 10, 22, 12, 12, 12, 12, 12, 8, 8, 8, 60);
    }

    // ==================== Outils ====================

    private static int bloc(Sheet f, int l, CellStyle texte, CellStyle nombre, String famille, Object[][] lignes) {
        boolean premier = true;
        for (Object[] ligne : lignes) {
            Row r = ligne(f, l++);
            cel(r, 0, premier ? famille : "", texte);
            cel(r, 1, String.valueOf(ligne[0]), texte);
            if (ligne[1] instanceof Number nb) {
                num(r, 2, nb.doubleValue(), nombre);
            } else {
                cel(r, 2, ligne[1] == null ? "" : String.valueOf(ligne[1]), texte);
            }
            if (ligne.length > 2 && ligne[2] instanceof Number nb2) {
                num(r, 3, nb2.doubleValue(), nombre);
            }
            premier = false;
        }
        return l;
    }

    private static Double valeur(BigDecimal v) {
        return v == null ? null : v.doubleValue();
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

    private static void numOuVide(Row r, int c, Integer v, CellStyle style) {
        if (v == null) {
            cel(r, c, "", style);
        } else {
            num(r, c, v, style);
        }
    }

    private static void ligneEntete(Sheet f, int l, CellStyle entete, String... titres) {
        Row r = ligne(f, l);
        for (int i = 0; i < titres.length; i++) {
            cel(r, i, titres[i], entete);
        }
    }

    private static void largeurs(Sheet f, int... c) {
        for (int i = 0; i < c.length; i++) {
            f.setColumnWidth(i, c[i] * 256);
        }
    }

    private static CellStyle styleTitre(Workbook wb) {
        CellStyle s = wb.createCellStyle();
        Font ft = wb.createFont();
        ft.setBold(true);
        ft.setFontHeightInPoints((short) 13);
        ft.setColor(IndexedColors.DARK_GREEN.getIndex());
        s.setFont(ft);
        return s;
    }

    private static CellStyle styleEntete(Workbook wb) {
        CellStyle s = base(wb);
        Font ft = wb.createFont();
        ft.setBold(true);
        ft.setFontHeightInPoints((short) 10);
        s.setFont(ft);
        s.setFillForegroundColor(IndexedColors.LIGHT_GREEN.getIndex());
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

    private static CellStyle styleMontant(Workbook wb) {
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
