package io.digiservices.ecreditservice.utils;

import io.digiservices.ecreditservice.exception.ApiException;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

/**
 * Lecture et normalisation des fichiers de numéros de téléphone
 * (répertoires SMS et campagnes) : Excel via POI, sinon CSV/texte.
 */
@Slf4j
public final class SmsFichierUtils {

    private SmsFichierUtils() {
    }

    /** Lit la première colonne de chaque ligne (xlsx/xls via POI, sinon texte/CSV). */
    public static List<String> lireLignes(MultipartFile fichier) {
        String nomFichier = fichier.getOriginalFilename() != null ? fichier.getOriginalFilename().toLowerCase() : "";
        List<String> lignes = new ArrayList<>();
        try {
            if (nomFichier.endsWith(".xlsx") || nomFichier.endsWith(".xls")) {
                DataFormatter formatter = new DataFormatter();
                try (Workbook workbook = WorkbookFactory.create(fichier.getInputStream())) {
                    Sheet sheet = workbook.getSheetAt(0);
                    for (Row row : sheet) {
                        Cell cell = row.getCell(0);
                        if (cell != null) {
                            lignes.add(formatter.formatCellValue(cell));
                        }
                    }
                }
            } else {
                try (BufferedReader reader = new BufferedReader(
                        new InputStreamReader(fichier.getInputStream(), StandardCharsets.UTF_8))) {
                    String ligne;
                    while ((ligne = reader.readLine()) != null) {
                        int sep = ligne.indexOf(';') >= 0 ? ligne.indexOf(';') : ligne.indexOf(',');
                        lignes.add(sep >= 0 ? ligne.substring(0, sep) : ligne);
                    }
                }
            }
        } catch (Exception e) {
            log.error("[SMS] Erreur lecture fichier '{}': {}", nomFichier, e.getMessage());
            throw new ApiException("Impossible de lire le fichier : " + e.getMessage());
        }
        return lignes;
    }

    /**
     * Normalise vers le format local guinéen à 9 chiffres (6XXXXXXXX) — celui attendu
     * par le hub Sayele. Accepte : 6XXXXXXXX, 224 6XXXXXXXX, +224 6XXXXXXXX,
     * avec espaces/tirets/points. Retourne null si invalide.
     */
    public static String normaliserNumero(String brut) {
        String chiffres = brut.replaceAll("[^0-9]", "");
        if (chiffres.startsWith("00224")) {
            chiffres = chiffres.substring(5);
        } else if (chiffres.startsWith("224") && chiffres.length() == 12) {
            chiffres = chiffres.substring(3);
        }
        if (chiffres.length() == 9 && (chiffres.startsWith("6") || chiffres.startsWith("7"))) {
            return chiffres;
        }
        return null;
    }
}
