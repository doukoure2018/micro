package io.digiservices.ecreditservice.utils;

import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.fail;

/**
 * Garde-fou contre un piege qui a casse quatre exports a la fois.
 *
 * <p>{@code Sheet.autoSizeColumn} demande a AWT la largeur reelle du texte, donc une police. Les
 * images de production n'embarquent ni police ni fontconfig, et l'appel y echoue par
 * {@code NoClassDefFoundError: Could not initialize class sun.awt.X11FontManager} : tout l'export
 * part en erreur, sans que rien ne le laisse prevoir en local, ou les polices existent.</p>
 *
 * <p>Le 31/10/2026, l'export des comptes mal adosses est tombe pour cette raison, et la mesure a
 * montre que les exports du portefeuille a risque, des journaux d'audit et du reseau etaient
 * casses de la meme facon depuis leur mise en service, sans que personne ne les ait essayes.
 * Le piege etait meme deja connu : un commentaire de l'export des salaires en avertissait.</p>
 *
 * <p>Ce test interdit donc l'appel dans tout le code de production du module.</p>
 */
class ExcelLargeursTest {

    @Test
    @DisplayName("aucun code de production n'appelle autoSizeColumn")
    void aucunAppelAAutoSizeColumn() throws IOException {
        Path racine = Path.of("src", "main", "java");
        if (!Files.isDirectory(racine)) {
            return;   // le test tourne depuis un autre repertoire de travail
        }
        List<String> fautes = new ArrayList<>();
        try (Stream<Path> fichiers = Files.walk(racine)) {
            for (Path f : fichiers.filter(p -> p.toString().endsWith(".java")).toList()) {
                int n = 0;
                for (String ligne : Files.readAllLines(f)) {
                    n++;
                    String nu = ligne.trim();
                    if (nu.startsWith("//") || nu.startsWith("*") || nu.startsWith("/*")) {
                        continue;   // un commentaire peut nommer le piege sans le commettre
                    }
                    if (ligne.contains("autoSizeColumn")) {
                        fautes.add(f.getFileName() + ":" + n + " — " + nu);
                    }
                }
            }
        }
        if (!fautes.isEmpty()) {
            fail("autoSizeColumn echoue en production (aucune police dans l'image) ; "
                    + "utiliser ExcelLargeurs.ajuster :\n  - " + String.join("\n  - ", fautes));
        }
    }

    @Test
    @DisplayName("la largeur suit le contenu, sans jamais mesurer de police")
    void laLargeurSuitLeContenu() throws IOException {
        try (Workbook wb = new XSSFWorkbook()) {
            Sheet f = wb.createSheet("Essai");
            Row titre = f.createRow(0);
            titre.createCell(0).setCellValue("Un titre tres long qui ne doit pas imposer sa largeur a la colonne");
            Row entetes = f.createRow(1);
            entetes.createCell(0).setCellValue("Agence");
            entetes.createCell(1).setCellValue("Solde");
            Row donnees = f.createRow(2);
            donnees.createCell(0).setCellValue("KOUROUSSA");
            donnees.createCell(1).setCellValue(4_440_000_000D);

            ExcelLargeurs.ajuster(f, 2);

            // 10 caracteres (KOUROUSSA, 9, sous le plancher de 10) + 3 de marge
            assertEquals(13 * 256, f.getColumnWidth(0),
                    "le titre, seule cellule de sa ligne, est une banniere et doit etre ignore");
            assertEquals(17 * 256, f.getColumnWidth(1), "un nombre vaut 14 caracteres + marge");
        }
    }

    @Test
    @DisplayName("le classeur des comptes mal adosses se construit vraiment")
    void leClasseurSeConstruit() throws IOException {
        var ligne = io.digiservices.ecreditservice.dto.CompteMalAdosseDtos.LigneDto.builder()
                .id(1L).codAgencia("323").desAgencia("KOUROUSSA").numCredito(548546L)
                .codCliente("00123456789").nomCliente("GROUPE CAS JOUGNA")
                .monCredito(new java.math.BigDecimal("8000000"))
                .monSaldo(new java.math.BigDecimal("4500000"))
                .indEstado("D").etat("En cours")
                .idCuenta("3230140000123").typeCompte("014")
                .famille("COMPTE_AUTRE_CLIENT").familleLibelle("Compte d'un autre client")
                .compteClient("00987654321").saisiPar("MLSIDIBE").agentCredit("ALPHA YAYA")
                .aTraiter(true)
                .build();
        var compteur = io.digiservices.ecreditservice.dto.CompteMalAdosseDtos.CompteurDto.builder()
                .cle("COMPTE_AUTRE_CLIENT").libelle("Compte d'un autre client")
                .nb(6).nbVivants(4).nbATraiter(4).encours(new java.math.BigDecimal("12803835"))
                .build();

        byte[] classeur = CompteMalAdosseExcelUtils.classeur(
                List.of(ligne), List.of(compteur), List.of(compteur), List.of(compteur), 14221);

        assertTrue(classeur.length > 4000, "le classeur doit contenir quelque chose");
        try (Workbook relu = new XSSFWorkbook(new java.io.ByteArrayInputStream(classeur))) {
            assertEquals(4, relu.getNumberOfSheets(), "detail + trois synthèses");
            assertEquals("Anomalies", relu.getSheetAt(0).getSheetName());
            assertTrue(relu.getSheetAt(0).getRow(4).getCell(2).getNumericCellValue() == 548546D,
                    "la ligne de detail doit porter le numero du credit");
        }
    }

    @Test
    @DisplayName("la largeur est plafonnee, et une feuille vide ne casse rien")
    void plafondEtFeuilleVide() throws IOException {
        try (Workbook wb = new XSSFWorkbook()) {
            Sheet f = wb.createSheet("Longue");
            Row entetes = f.createRow(0);
            entetes.createCell(0).setCellValue("x");
            entetes.createCell(1).setCellValue("y");

            Row longue = f.createRow(1);
            longue.createCell(0).setCellValue("z".repeat(200));
            longue.createCell(1).setCellValue("deux cellules : c'est une ligne de donnees");
            ExcelLargeurs.ajuster(f, 2);
            assertEquals(60 * 256, f.getColumnWidth(0), "la largeur doit etre plafonnee a 60 caracteres");

            Sheet vide = wb.createSheet("Vide");
            ExcelLargeurs.ajuster(vide, 3);
            assertTrue(vide.getColumnWidth(0) > 0, "une feuille vide garde une largeur par defaut");
        }
    }
}
