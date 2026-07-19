package io.digiservices.userservice.service.impl;

import io.digiservices.userservice.dto.ReseauImportReport;
import io.digiservices.userservice.dto.ReseauPointVenteDto;
import io.digiservices.userservice.exception.ApiException;
import io.digiservices.userservice.repository.ReseauPointVenteRepository;
import io.digiservices.userservice.service.ReseauService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReseauServiceImpl implements ReseauService {

    private final ReseauPointVenteRepository repository;

    private static final Set<String> TYPES_AUTORISES = Set.of("ABT", "PS", "KIOSQUE", "GUICHET", "PART");
    private static final String[] EXPORT_HEADERS =
            {"DELEGATION", "AGENCE", "PS", "NOMS", "CONTACT", "TYPE", "LONGITUDE", "LATITUDE", "LOCALISATION"};

    @Override
    public ReseauImportReport importExcel(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ApiException("Fichier Excel manquant ou vide");
        }
        List<String> erreurs = new ArrayList<>();
        List<ReseauPointVenteDto> aInserer = new ArrayList<>();
        int totalLignes = 0;

        try (InputStream in = file.getInputStream(); Workbook wb = WorkbookFactory.create(in)) {
            Sheet sheet = wb.getSheetAt(0);
            DataFormatter fmt = new DataFormatter(Locale.ROOT);

            Row header = sheet.getRow(sheet.getFirstRowNum());
            if (header == null) throw new ApiException("Feuille Excel vide (aucune entete)");
            Map<String, Integer> cols = mapHeaders(header, fmt);

            for (String req : new String[]{"DELEGATION", "AGENCE", "NOMS", "TYPE", "LONGITUDE", "LATITUDE"}) {
                if (!cols.containsKey(req)) {
                    throw new ApiException("Colonne obligatoire absente du fichier : " + req);
                }
            }

            for (int r = header.getRowNum() + 1; r <= sheet.getLastRowNum(); r++) {
                Row row = sheet.getRow(r);
                if (row == null || estLigneVide(row, fmt)) continue;
                totalLignes++;
                int noLigne = r + 1; // 1-based pour l'utilisateur

                String delegation = up(str(row, cols.get("DELEGATION"), fmt));
                String agence = str(row, cols.get("AGENCE"), fmt);
                String pointVente = str(row, cols.get("PS"), fmt);
                String nom = str(row, cols.get("NOMS"), fmt);
                String contact = str(row, cols.get("CONTACT"), fmt);
                String type = up(str(row, cols.get("TYPE"), fmt));
                // Correction de la permutation : la colonne LONGITUDE contient la latitude,
                // la colonne LATITUDE contient la longitude.
                Double latitude = num(row, cols.get("LONGITUDE"), fmt);
                Double longitude = num(row, cols.get("LATITUDE"), fmt);

                if (delegation == null || agence == null || nom == null) {
                    erreurs.add("Ligne " + noLigne + " : delegation/agence/nom manquant");
                    continue;
                }
                if (type == null || !TYPES_AUTORISES.contains(type)) {
                    erreurs.add("Ligne " + noLigne + " : type invalide (" + type + ")");
                    continue;
                }
                if (latitude == null || longitude == null) {
                    erreurs.add("Ligne " + noLigne + " : coordonnees manquantes/illisibles");
                    continue;
                }

                aInserer.add(ReseauPointVenteDto.builder()
                        .delegation(delegation).agence(agence).pointVente(pointVente)
                        .nom(nom).contact(contact).type(type)
                        .latitude(latitude).longitude(longitude)
                        .build());
            }
        } catch (ApiException e) {
            throw e;
        } catch (Exception e) {
            log.error("Erreur lecture Excel reseau : {}", e.getMessage(), e);
            throw new ApiException("Fichier Excel illisible : " + e.getMessage());
        }

        // Remplacement complet (le fichier = source de verite)
        repository.deleteAll();
        for (ReseauPointVenteDto p : aInserer) {
            repository.insert(p);
        }
        log.info("Import reseau : {} lignes lues, {} importees, {} ignorees",
                totalLignes, aInserer.size(), erreurs.size());

        return ReseauImportReport.builder()
                .totalLignes(totalLignes)
                .importes(aInserer.size())
                .ignorees(erreurs.size())
                .erreurs(erreurs)
                .build();
    }

    @Override
    public byte[] exportExcel() {
        List<ReseauPointVenteDto> points = repository.findAll(null, null);
        try (XSSFWorkbook wb = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = wb.createSheet("Reseau");

            CellStyle headerStyle = wb.createCellStyle();
            Font bold = wb.createFont();
            bold.setBold(true);
            headerStyle.setFont(bold);

            Row header = sheet.createRow(0);
            for (int i = 0; i < EXPORT_HEADERS.length; i++) {
                Cell c = header.createCell(i);
                c.setCellValue(EXPORT_HEADERS[i]);
                c.setCellStyle(headerStyle);
            }

            int r = 1;
            for (ReseauPointVenteDto p : points) {
                Row row = sheet.createRow(r++);
                row.createCell(0).setCellValue(nz(p.getDelegation()));
                row.createCell(1).setCellValue(nz(p.getAgence()));
                row.createCell(2).setCellValue(nz(p.getPointVente()));
                row.createCell(3).setCellValue(nz(p.getNom()));
                row.createCell(4).setCellValue(nz(p.getContact()));
                row.createCell(5).setCellValue(nz(p.getType()));
                // On re-applique la convention d'origine de l'Excel : colonne LONGITUDE = latitude,
                // colonne LATITUDE = longitude, LOCALISATION = "latitude, longitude".
                if (p.getLatitude() != null) row.createCell(6).setCellValue(p.getLatitude());
                if (p.getLongitude() != null) row.createCell(7).setCellValue(p.getLongitude());
                if (p.getLatitude() != null && p.getLongitude() != null) {
                    row.createCell(8).setCellValue(p.getLatitude() + ", " + p.getLongitude());
                }
            }
            for (int i = 0; i < EXPORT_HEADERS.length; i++) sheet.autoSizeColumn(i);

            wb.write(out);
            return out.toByteArray();
        } catch (Exception e) {
            log.error("Erreur export Excel reseau : {}", e.getMessage(), e);
            throw new ApiException("Impossible de generer le fichier Excel : " + e.getMessage());
        }
    }

    @Override
    public List<ReseauPointVenteDto> getPoints(String delegation, String type) {
        return repository.findAll(blankToNull(delegation), blankToNull(up(type)));
    }

    // ── Helpers ────────────────────────────────────────────────────────────────

    private Map<String, Integer> mapHeaders(Row header, DataFormatter fmt) {
        Map<String, Integer> cols = new HashMap<>();
        for (int c = header.getFirstCellNum(); c < header.getLastCellNum(); c++) {
            Cell cell = header.getCell(c);
            if (cell == null) continue;
            String key = fmt.formatCellValue(cell).trim().toUpperCase(Locale.ROOT);
            if (!key.isEmpty()) cols.putIfAbsent(key, c);
        }
        return cols;
    }

    private boolean estLigneVide(Row row, DataFormatter fmt) {
        for (int c = row.getFirstCellNum(); c < row.getLastCellNum(); c++) {
            Cell cell = row.getCell(c);
            if (cell != null && !fmt.formatCellValue(cell).trim().isEmpty()) return false;
        }
        return true;
    }

    private String str(Row row, Integer idx, DataFormatter fmt) {
        if (idx == null) return null;
        Cell c = row.getCell(idx);
        if (c == null) return null;
        String v = fmt.formatCellValue(c).trim();
        return v.isEmpty() ? null : v;
    }

    private Double num(Row row, Integer idx, DataFormatter fmt) {
        if (idx == null) return null;
        Cell c = row.getCell(idx);
        if (c == null) return null;
        if (c.getCellType() == CellType.NUMERIC) return c.getNumericCellValue();
        String s = fmt.formatCellValue(c).trim().replace(",", ".");
        if (s.isEmpty()) return null;
        try {
            return Double.parseDouble(s);
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private String up(String s) {
        return s == null ? null : s.trim().toUpperCase(Locale.ROOT);
    }

    private String nz(String s) {
        return s == null ? "" : s;
    }

    private String blankToNull(String s) {
        return (s == null || s.isBlank()) ? null : s.trim();
    }
}
