package io.digiservices.ecreditservice.utils;

import io.digiservices.ecreditservice.dto.PhotoEcartDtos.ExplicationRecue;
import io.digiservices.ecreditservice.dto.PhotoEcartDtos.PointExcluDto;
import io.digiservices.ecreditservice.dto.PhotoEcartDtos.PointJour;
import io.digiservices.ecreditservice.dto.PhotoEcartDtos.VariationCompteDto;
import io.digiservices.ecreditservice.dto.PhotoEcartDtos.VariationCoupleDto;
import io.digiservices.ecreditservice.dto.PhotoEcartDtos.VariationsDto;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.io.ByteArrayInputStream;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/** Le classeur des variations s'ouvre, porte ses trois feuilles et ses chiffres au bon endroit. */
class VariationEcartsExcelUtilsTest {

    private static PointJour photo(LocalDate jour) {
        return new PointJour(jour, "COMPTES", new BigDecimal("8826182619.88"), null, null, 2357, 1163, 1194, 185, 185, true, null);
    }

    @Test
    @DisplayName("trois feuilles, un couple avec son resume d'operations, un couple sans")
    void classeurComplet() throws Exception {
        VariationCoupleDto avec = new VariationCoupleDto("704", "CAISSE DE SINKO", "SINKO", "GUINEE FORESTIERE",
                "24100000002", "CC011", new BigDecimal("31589739.70"), new BigDecimal("-152155260.30"),
                new BigDecimal("-183745000"), new BigDecimal("119573361.33"), new BigDecimal("-303318361.33"),
                "Écart", "Écart", "Écart aggravé", "Les deux côtés", "l'écart se creuse", 12L, "A_INSTRUIRE",
                new ExplicationRecue(LocalDate.of(2026, 11, 25), LocalDate.of(2026, 11, 26), 40, 3,
                        new BigDecimal("-9195000"), 3, new BigDecimal("-9195000"), 0, BigDecimal.ZERO,
                        "3 × FRAIS DE TENUE DE COMPTE (9 195 000,00)"));
        VariationCoupleDto sans = new VariationCoupleDto("208", "CAISSE DE SINTA", "TELIMELE", "BASSE GUINEE",
                "24100000002", "CC011", new BigDecimal("11572395"), new BigDecimal("-12764105"), new BigDecimal("-24336500"),
                new BigDecimal("-25111659.82"), new BigDecimal("775159.82"), "Écart", "Écart", "Écart aggravé",
                "Les deux côtés", "l'écart se creuse", null, null, null);
        VariationCompteDto compte = new VariationCompteDto("24100000002", "CC011", 2, new BigDecimal("-208081500"),
                new BigDecimal("208081500"), "Les deux côtés", 0, 2, 0, 0, 0, 0, 0);
        VariationsDto v = new VariationsDto(photo(LocalDate.of(2026, 11, 26)), photo(LocalDate.of(2026, 11, 25)),
                new BigDecimal("1000"), 185, List.of(new PointExcluDto("951", "SIEGE", true, false)), 2,
                new BigDecimal("208081500"), BigDecimal.ZERO, new BigDecimal("1.0000"), List.of(compte), List.of(avec, sans));

        byte[] octets = VariationEcartsExcelUtils.classeur("COMPTES", v);
        assertTrue(octets.length > 2000);
        assertEquals("Variations_ecarts_COMPTES_2026-11-25_2026-11-26.xlsx", VariationEcartsExcelUtils.nomFichier("COMPTES", v));
        try (Workbook wb = new XSSFWorkbook(new ByteArrayInputStream(octets))) {
            assertEquals(3, wb.getNumberOfSheets());
            Sheet comptes = wb.getSheet("Par compte");
            assertEquals("24100000002", comptes.getRow(5).getCell(0).getStringCellValue());
            assertEquals(-208081500d, comptes.getRow(5).getCell(3).getNumericCellValue(), 0.001);
            Sheet couples = wb.getSheet("Par point de service");
            assertEquals("CAISSE DE SINKO", couples.getRow(1).getCell(2).getStringCellValue());
            assertEquals("À instruire (fiche 12)", couples.getRow(1).getCell(16).getStringCellValue());
            assertEquals(3d, couples.getRow(1).getCell(18).getNumericCellValue(), 0.001);
            assertEquals("non lu", couples.getRow(2).getCell(17).getStringCellValue());
            assertEquals("951", wb.getSheet("Points exclus").getRow(2).getCell(0).getStringCellValue());
        }
    }

    @Test
    @DisplayName("sans reference, le classeur dit qu'il n'y a rien a comparer et ne tombe pas")
    void sansReference() throws Exception {
        VariationsDto v = new VariationsDto(photo(LocalDate.of(2026, 11, 26)), null, new BigDecimal("1000"), 0,
                List.of(), 0, null, null, null, List.of(), List.of());
        byte[] octets = VariationEcartsExcelUtils.classeur("DAT", v);
        try (Workbook wb = new XSSFWorkbook(new ByteArrayInputStream(octets))) {
            assertEquals(2, wb.getNumberOfSheets());
            assertTrue(wb.getSheet("Par compte").getRow(1).getCell(0).getStringCellValue().contains("rien à comparer"));
        }
        assertEquals("Variations_ecarts_DAT_2026-11-26.xlsx", VariationEcartsExcelUtils.nomFichier("DAT", v));
    }
}
