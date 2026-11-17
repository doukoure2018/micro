package io.digiservices.ecreditservice.utils;

import io.digiservices.ecreditservice.dto.CompteHorsAgenceDtos.CompteurDto;
import io.digiservices.ecreditservice.dto.CompteHorsAgenceDtos.LigneDto;
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
import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * Le classeur des comptes ouverts hors de l'agence du client : la feuille de travail des
 * regularisations. Quatre feuilles : les comptes a traiter, tout le stock retenu par le filtre,
 * puis les synthèses par agence de l'agent et par usager — c'est la que se voit une habitude.
 *
 * <p>Largeurs par {@link ExcelLargeurs#ajuster} : {@code autoSizeColumn} echoue en production
 * (aucune police dans l'image), et cassait tout l'export.</p>
 */
public final class CompteHorsAgenceExcelUtils {

    private CompteHorsAgenceExcelUtils() {
    }

    private static final DateTimeFormatter FMT_JOUR = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private static final DateTimeFormatter FMT_HEURE = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    public static byte[] classeur(List<LigneDto> lignes, List<CompteurDto> parAgenceAgent,
                                  List<CompteurDto> parUsager, long totalStock) throws IOException {
        try (Workbook wb = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Styles st = new Styles(wb);
            List<LigneDto> aTraiter = lignes.stream().filter(LigneDto::isATraiter).toList();
            feuilleDetail(wb, st, "À traiter", aTraiter,
                    aTraiter.size() + " compte(s) actif(s) ouvert(s) hors de l'agence du client",
                    "Un compte doit être ouvert dans l'agence du client, celle des trois premiers chiffres de son "
                            + "numéro de membre. La régularisation se fait dans SAF : digi lit la base, il n'y écrit pas.");
            feuilleDetail(wb, st, "Tout le stock", lignes,
                    lignes.size() + " compte(s) retenu(s) par le filtre",
                    "Stock complet : " + totalStock + " ligne(s) ouvertes, comptes fermés et transférés compris.");
            feuilleSynthese(wb, st, "Par agence de l'agent", "Agence de l'agent", parAgenceAgent,
                    "L'agence de l'usager qui a ouvert le compte (trois derniers chiffres de son code) ; « ? » quand "
                            + "elle est inconnue.");
            feuilleSynthese(wb, st, "Par usager", "Usager SAF", parUsager,
                    "L'usager qui a ouvert le compte dans SAF. C'est ici que se voit une habitude.");
            wb.write(out);
            return out.toByteArray();
        }
    }

    private static void feuilleDetail(Workbook wb, Styles st, String nom, List<LigneDto> lignes,
                                      String titre, String sous) {
        Sheet f = wb.createSheet(nom);
        int r = titre(f, st, titre, sous);
        String[] entetes = {"Compte", "Type", "Intitulé", "Client", "N° membre", "Agence client",
                "Agence fiche client", "Agence du compte", "Point de service", "Ouvert par (code)",
                "Ouvert par (nom)", "Agence agent", "Situation", "Ouvert le", "État", "Solde (GNF)",
                "Détecté le", "À traiter", "Prise en charge par", "Depuis (jours)", "Commentaire",
                "Fermeture", "Fermé le"};
        r = entetes(f, st, r, entetes);
        for (LigneDto l : lignes) {
            Row row = f.createRow(r++);
            int c = 0;
            cel(row, c++, l.getNumCuenta(), null);
            cel(row, c++, l.getTypeCompte(), null);
            cel(row, c++, l.getIntitule(), null);
            cel(row, c++, l.getNomCliente(), null);
            cel(row, c++, l.getCodCliente(), null);
            cel(row, c++, l.getAgenceClient(), null);
            cel(row, c++, l.getAgenceClientFiche(), null);
            cel(row, c++, l.getAgenceCompte(), null);
            cel(row, c++, l.getDesAgenceCompte(), null);
            cel(row, c++, l.getCreePar(), null);
            cel(row, c++, l.getNomCreePar(), null);
            cel(row, c++, l.getAgenceAgent() == null ? "?" : l.getAgenceAgent(), null);
            cel(row, c++, l.getSituationLibelle(), st.alerte);
            cel(row, c++, jour(l.getDateOuverture()), null);
            cel(row, c++, l.getEtat(), null);
            montant(row, c++, l.getSolde(), st.montant);
            cel(row, c++, heure(l.getDetecteAt()), null);
            cel(row, c++, l.isATraiter() ? "Oui" : "Non", null);
            cel(row, c++, l.getTraitePar(), null);
            nombre(row, c++, l.getJoursDepuisPriseEnCharge());
            cel(row, c++, l.getCommentaire(), null);
            cel(row, c++, l.getFermetureMotif(), null);
            cel(row, c, heure(l.getCorrigeAt()), null);
        }
        ExcelLargeurs.ajuster(f, entetes.length);
    }

    private static void feuilleSynthese(Workbook wb, Styles st, String nom, String colonne,
                                        List<CompteurDto> lignes, String sous) {
        Sheet f = wb.createSheet(nom);
        int r = titre(f, st, nom, sous);
        String[] entetes = {colonne, "Comptes", "dont actifs", "À traiter", "Solde (GNF)"};
        r = entetes(f, st, r, entetes);
        for (CompteurDto c : lignes) {
            Row row = f.createRow(r++);
            cel(row, 0, c.getLibelle(), null);
            nombre(row, 1, c.getNb());
            nombre(row, 2, c.getNbActifs());
            nombre(row, 3, c.getNbATraiter());
            montant(row, 4, c.getSolde(), st.montant);
        }
        ExcelLargeurs.ajuster(f, entetes.length);
    }

    private static int titre(Sheet f, Styles st, String titre, String sous) {
        cel(f.createRow(0), 0, titre, st.titre);
        cel(f.createRow(1), 0, sous, null);
        return 3;
    }

    private static int entetes(Sheet f, Styles st, int r, String[] noms) {
        Row row = f.createRow(r);
        for (int i = 0; i < noms.length; i++) {
            cel(row, i, noms[i], st.entete);
        }
        return r + 1;
    }

    private static void cel(Row row, int col, String v, CellStyle style) {
        Cell c = row.createCell(col);
        c.setCellValue(v == null ? "" : v);
        if (style != null) {
            c.setCellStyle(style);
        }
    }

    private static void nombre(Row row, int col, Number v) {
        Cell c = row.createCell(col);
        if (v != null) {
            c.setCellValue(v.doubleValue());
        }
    }

    private static void montant(Row row, int col, BigDecimal v, CellStyle style) {
        Cell c = row.createCell(col);
        if (v != null) {
            c.setCellValue(v.doubleValue());
        }
        c.setCellStyle(style);
    }

    private static String jour(LocalDate d) {
        return d == null ? "" : d.format(FMT_JOUR);
    }

    private static String heure(OffsetDateTime d) {
        return d == null ? "" : d.format(FMT_HEURE);
    }

    private static final class Styles {
        final CellStyle titre, entete, montant, alerte;

        Styles(Workbook wb) {
            Font gras = wb.createFont();
            gras.setBold(true);
            Font grand = wb.createFont();
            grand.setBold(true);
            grand.setFontHeightInPoints((short) 13);
            titre = wb.createCellStyle();
            titre.setFont(grand);
            entete = wb.createCellStyle();
            entete.setFont(gras);
            entete.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
            entete.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            entete.setBorderBottom(BorderStyle.THIN);
            montant = wb.createCellStyle();
            montant.setDataFormat(wb.createDataFormat().getFormat("#,##0"));
            Font rouge = wb.createFont();
            rouge.setBold(true);
            rouge.setColor(IndexedColors.DARK_RED.getIndex());
            alerte = wb.createCellStyle();
            alerte.setFont(rouge);
        }
    }
}
