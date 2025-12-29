package io.digiservices.ecreditservice.service.impl;

import io.digiservices.ecreditservice.dto.*;
import io.digiservices.ecreditservice.exception.ApiException;
import io.digiservices.ecreditservice.repository.SalaireRepository;
import io.digiservices.ecreditservice.service.SalaireService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class SalaireServiceImpl implements SalaireService {

    private final SalaireRepository salaireRepository;

    // ==================== INFO PERSONNEL ====================

    @Override
    @Transactional
    public ImportResultDto importInfoPersonnelFromExcel(MultipartFile file) {
        log.info("Début de l'import du fichier info_personnel: {}", file.getOriginalFilename());
        
        List<String> erreurs = new ArrayList<>();
        List<ImportResultDto.ValidationErrorDto> erreursValidation = new ArrayList<>();
        List<InfoPersonnelDto> personnels = new ArrayList<>();
        int totalLignes = 0;

        try (InputStream is = file.getInputStream()) {
            Workbook workbook = createWorkbook(file, is);
            Sheet sheet = workbook.getSheetAt(0);

            // Ignorer la première ligne (en-tête)
            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) continue;
                totalLignes++;

                try {
                    String matricule = getCellValueAsString(row.getCell(0));
                    String nom = getCellValueAsString(row.getCell(1));
                    String prenom = getCellValueAsString(row.getCell(2));

                    // Validation
                    if (matricule == null || matricule.trim().isEmpty()) {
                        erreursValidation.add(ImportResultDto.ValidationErrorDto.builder()
                                .ligne(i + 1)
                                .champ("Matricule")
                                .valeur(matricule)
                                .message("Le matricule est obligatoire")
                                .build());
                        continue;
                    }

                    if (nom == null || nom.trim().isEmpty()) {
                        erreursValidation.add(ImportResultDto.ValidationErrorDto.builder()
                                .ligne(i + 1)
                                .champ("Nom")
                                .valeur(nom)
                                .message("Le nom est obligatoire")
                                .build());
                        continue;
                    }

                    InfoPersonnelDto personnel = InfoPersonnelDto.builder()
                            .matricule(matricule.trim())
                            .nom(nom.trim())
                            .prenom(prenom != null ? prenom.trim() : "")
                            .build();
                    personnels.add(personnel);

                } catch (Exception e) {
                    erreursValidation.add(ImportResultDto.ValidationErrorDto.builder()
                            .ligne(i + 1)
                            .champ("Ligne")
                            .valeur("")
                            .message("Erreur de lecture: " + e.getMessage())
                            .build());
                }
            }

            workbook.close();

        } catch (IOException e) {
            log.error("Erreur lors de la lecture du fichier Excel", e);
            throw new ApiException("Erreur lors de la lecture du fichier Excel: " + e.getMessage());
        }

        // Insertion en base
        int lignesImportees = salaireRepository.saveAllInfoPersonnel(personnels);

        log.info("Import terminé: {} lignes traitées, {} insérées, {} erreurs", 
                totalLignes, lignesImportees, erreursValidation.size());

        return ImportResultDto.builder()
                .success(erreursValidation.isEmpty())
                .totalLignes(totalLignes)
                .lignesImportees(lignesImportees)
                .lignesEnErreur(erreursValidation.size())
                .erreurs(erreurs)
                .erreursValidation(erreursValidation)
                .build();
    }

    @Override
    public List<InfoPersonnelDto> getAllInfoPersonnel() {
        return salaireRepository.findAllInfoPersonnel();
    }
    @Override
    public List<InfoPersonnelDto> getActiveInfoPersonnel() {
        return salaireRepository.findActiveInfoPersonnel();
    }

    @Override
    @Transactional
    public int updateInfoPersonnelStatutByMatricule(String matricule, String statut) {
        if (matricule == null || statut == null) {
            throw new ApiException("Matricule et statut sont obligatoires");
        }

        String normalizedStatut = statut.toUpperCase();
        if (!normalizedStatut.equals("ACTIVE") && !normalizedStatut.equals("INACTIVE")) {
            throw new ApiException("Statut invalide. Valeurs acceptées: ACTIVE, INACTIVE");
        }

        log.info("Mise à jour statut personnel matricule {}: {}", matricule, normalizedStatut);
        return salaireRepository.updateInfoPersonnelStatutByMatricule(matricule, normalizedStatut);
    }

    @Override
    @Transactional
    public int updateInfoPersonnelStatut(Long id, String statut) {
        if (id == null || statut == null) {
            throw new ApiException("ID et statut sont obligatoires");
        }

        String normalizedStatut = statut.toUpperCase();
        if (!normalizedStatut.equals("ACTIVE") && !normalizedStatut.equals("INACTIVE")) {
            throw new ApiException("Statut invalide. Valeurs acceptées: ACTIVE, INACTIVE");
        }

        log.info("Mise à jour statut personnel ID {}: {}", id, normalizedStatut);
        return salaireRepository.updateInfoPersonnelStatut(id, normalizedStatut);
    }


    @Override
    public Map<String, Long> countInfoPersonnelByStatut() {
        return salaireRepository.countInfoPersonnelByStatut();
    }

    @Override
    public List<InfoPersonnelDto> getInfoPersonnelByStatut(String statut) {
        if (statut == null || statut.trim().isEmpty()) {
            return salaireRepository.findAllInfoPersonnel();
        }
        return salaireRepository.findInfoPersonnelByStatut(statut.toUpperCase());
    }

    @Override
    public Optional<InfoPersonnelDto> getInfoPersonnelByMatricule(String matricule) {
        return salaireRepository.findInfoPersonnelByMatricule(matricule);
    }

    @Override
    public Optional<InfoPersonnelDto> getInfoPersonnelById(Long id) {
        return salaireRepository.findInfoPersonnelById(id);
    }

    @Override
    public long countInfoPersonnel() {
        return salaireRepository.countInfoPersonnel();
    }

    @Override
    @Transactional
    public int updateNumeroCompte(String matricule, String numeroCompte) {
        log.info("Mise à jour du numéro de compte pour matricule: {}", matricule);
        if (!salaireRepository.existsMatricule(matricule)) {
            throw new ApiException("Matricule non trouvé: " + matricule);
        }
        return salaireRepository.updateNumeroCompte(matricule, numeroCompte);
    }

    @Override
    public Optional<InfoPersonnelDto> checkNumeroCompte(String matricule) {
        log.info("Vérification du numéro de compte pour matricule: {}", matricule);
        return salaireRepository.checkNumeroCompte(matricule);
    }

    // ==================== AVANCE SALAIRE ====================

    @Override
    @Transactional
    public ImportResultDto importAvanceSalaireFromExcel(MultipartFile file) {
        log.info("Début de l'import du fichier avance_salaire: {}", file.getOriginalFilename());

        List<String> erreurs = new ArrayList<>();
        List<ImportResultDto.ValidationErrorDto> erreursValidation = new ArrayList<>();
        List<AvanceSalaireDto> avances = new ArrayList<>();
        int totalLignes = 0;

        try (InputStream is = file.getInputStream()) {
            Workbook workbook = createWorkbook(file, is);
            Sheet sheet = workbook.getSheetAt(0);

            // Ignorer la première ligne (en-tête)
            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) continue;
                totalLignes++;

                try {
                    String matricule = getCellValueAsString(row.getCell(0));
                    BigDecimal netAmount = getCellValueAsBigDecimal(row.getCell(1));

                    // Validation matricule
                    if (matricule == null || matricule.trim().isEmpty()) {
                        erreursValidation.add(ImportResultDto.ValidationErrorDto.builder()
                                .ligne(i + 1)
                                .champ("Matricule")
                                .valeur(matricule)
                                .message("Le matricule est obligatoire")
                                .build());
                        continue;
                    }

                    // Validation montant
                    if (netAmount == null || netAmount.compareTo(BigDecimal.ZERO) <= 0) {
                        erreursValidation.add(ImportResultDto.ValidationErrorDto.builder()
                                .ligne(i + 1)
                                .champ("NET A PAYER")
                                .valeur(netAmount != null ? netAmount.toString() : "null")
                                .message("Le montant net doit être positif")
                                .build());
                        continue;
                    }

                    // Vérifier que le matricule existe dans info_personnel
                    if (!salaireRepository.existsMatricule(matricule.trim())) {
                        erreursValidation.add(ImportResultDto.ValidationErrorDto.builder()
                                .ligne(i + 1)
                                .champ("Matricule")
                                .valeur(matricule)
                                .message("Matricule non trouvé dans info_personnel")
                                .build());
                        continue;
                    }

                    AvanceSalaireDto avance = AvanceSalaireDto.builder()
                            .matricule(matricule.trim())
                            .netAmount(netAmount)
                            .build();
                    avances.add(avance);

                } catch (Exception e) {
                    erreursValidation.add(ImportResultDto.ValidationErrorDto.builder()
                            .ligne(i + 1)
                            .champ("Ligne")
                            .valeur("")
                            .message("Erreur de lecture: " + e.getMessage())
                            .build());
                }
            }

            workbook.close();

        } catch (IOException e) {
            log.error("Erreur lors de la lecture du fichier Excel", e);
            throw new ApiException("Erreur lors de la lecture du fichier Excel: " + e.getMessage());
        }

        // Insertion en base avec INSERT/UPDATE séparé
        int lignesImportees = salaireRepository.saveAllAvanceSalaire(avances);

        log.info("Import avance_salaire terminé: {} lignes traitées, {} insérées/mises à jour, {} erreurs",
                totalLignes, lignesImportees, erreursValidation.size());

        // ✅ ACTIVER automatiquement les demandes de salaire après un import réussi
        if (lignesImportees > 0) {
            try {
                salaireRepository.enableAuthorizeSalaire(null); // null = activation automatique par le système
                log.info("✅ Autorisation des demandes de salaire ACTIVÉE automatiquement après import de {} enregistrements", lignesImportees);
            } catch (Exception e) {
                log.warn("⚠️ Impossible d'activer automatiquement les demandes de salaire: {}", e.getMessage());
                // On ne fait pas échouer l'import pour ça
            }
        }

        return ImportResultDto.builder()
                .success(lignesImportees > 0)
                .totalLignes(totalLignes)
                .lignesImportees(lignesImportees)
                .lignesEnErreur(erreursValidation.size())
                .erreurs(erreurs)
                .erreursValidation(erreursValidation)
                .build();
    }
    @Override
    public List<AvanceSalaireDto> getAllAvanceSalaire() {
        return salaireRepository.findAllAvanceSalaire();
    }

    @Override
    public List<AvanceSalaireDto> getAvanceSalaireByUser(Long idUser) {
        return salaireRepository.findAvanceSalaireByUser(idUser);
    }

    @Override
    public Optional<AvanceSalaireDto> getAvanceSalaireById(Long id) {
        return salaireRepository.findAvanceSalaireById(id);
    }

    @Override
    public List<AvanceSalaireDto> getAvanceSalaireByStatut(String statut) {
        return salaireRepository.findAvanceSalaireByStatut(statut);
    }

    @Override
    @Transactional
    public void updateAvanceSalaireStatut(Long id, String statut) {
        salaireRepository.updateAvanceSalaireStatut(id, statut);
    }

    @Override
    @Transactional
    public int deleteAvanceSalaireByUser(Long idUser) {
        return salaireRepository.deleteAvanceSalaireByUser(idUser);
    }

    @Override
    @Transactional
    public int truncateAvanceSalaire() {
        log.info("Vidage de la table avance_salaire (reset mensuel)");

        int deleted = salaireRepository.truncateAvanceSalaire();

        // ✅ DÉSACTIVER automatiquement les demandes de salaire après reset
        try {
            salaireRepository.disableAuthorizeSalaire(null); // null = désactivation automatique par le système
            log.info("❌ Autorisation des demandes de salaire DÉSACTIVÉE automatiquement après reset ({} enregistrements supprimés)", deleted);
        } catch (Exception e) {
            log.warn("⚠️ Impossible de désactiver automatiquement les demandes de salaire: {}", e.getMessage());
            // On ne fait pas échouer le truncate pour ça
        }

        return deleted;
    }

    // ==================== DEMANDE SALARY ====================

    @Override
    @Transactional
    public DemandeSalaryDto createDemandeSalary(Long idUser, String matricule, BigDecimal amount, String numeroCompte) {
        log.info("Création demande salaire - userId: {}, matricule: {}, amount: {}", idUser, matricule, amount);

        // ✅ SÉCURITÉ: Vérifier que le matricule appartient à l'utilisateur
        if (!verifyUserMatricule(idUser, matricule)) {
            throw new ApiException("Vous ne pouvez faire une demande que pour votre propre matricule.");
        }

        // Vérifier que le matricule existe dans info_personnel
        if (!salaireRepository.existsMatricule(matricule)) {
            throw new ApiException("Matricule non trouvé dans la base du personnel.");
        }

        // Récupérer la limite d'avance (50% du salaire)
        Optional<BigDecimal> limiteOpt = salaireRepository.getNetAmountLimitByMatricule(matricule);
        if (limiteOpt.isEmpty()) {
            throw new ApiException("Aucune donnée de salaire trouvée pour ce matricule. Contactez le service RH.");
        }

        BigDecimal limite = limiteOpt.get();

        // Calculer le total des demandes actives (ENCOURS, VALIDER, CONFIRMER)
        BigDecimal totalActif = salaireRepository.getTotalDemandesActives(idUser);

        // Vérifier que le montant demandé ne dépasse pas la limite
        BigDecimal disponible = limite.subtract(totalActif);
        if (amount.compareTo(disponible) > 0) {
            throw new ApiException(String.format(
                    "Montant demandé (%.0f) dépasse le disponible (%.0f). Limite: %.0f, Déjà utilisé: %.0f",
                    amount, disponible, limite, totalActif
            ));
        }

        // Créer la demande
        Long demandeId = salaireRepository.saveDemandeSalary(idUser, matricule, amount, numeroCompte);

        return salaireRepository.findDemandeSalaryById(demandeId)
                .orElseThrow(() -> new ApiException("Erreur lors de la création de la demande"));
    }

    @Override
    public List<DemandeSalaryDto> getAllDemandeSalary() {
        return salaireRepository.findAllDemandeSalary();
    }

    @Override
    public List<DemandeSalaryDto> getDemandeSalaryByUser(Long idUser) {
        return salaireRepository.findDemandeSalaryByUser(idUser);
    }

    @Override
    public Optional<DemandeSalaryDto> getDemandeSalaryById(Long id) {
        return salaireRepository.findDemandeSalaryById(id);
    }

    @Override
    public List<DemandeSalaryDto> getDemandeSalaryByStatut(String statut) {
        return salaireRepository.findDemandeSalaryByStatut(statut);
    }

    @Override
    @Transactional
    public int annulerDemandeSalary(Long id) {
        log.info("Annulation de la demande de salaire: {}", id);
        // Vérifier que la demande existe et est en cours
        DemandeSalaryDto demande = salaireRepository.findDemandeSalaryById(id)
                .orElseThrow(() -> new ApiException("Demande non trouvée: " + id));
        
        if (!"ENCOURS".equals(demande.getStatut())) {
            throw new ApiException("Seules les demandes en cours peuvent être annulées. Statut actuel: " + demande.getStatut());
        }
        
        return salaireRepository.updateDemandeSalaryStatut(id, "ANNULLER");
    }

    @Override
    @Transactional
    public int rejeterDemandeSalary(Long id) {
        log.info("Rejet de la demande de salaire: {}", id);
        // Vérifier que la demande existe et est en cours
        DemandeSalaryDto demande = salaireRepository.findDemandeSalaryById(id)
                .orElseThrow(() -> new ApiException("Demande non trouvée: " + id));
        
        if (!"ENCOURS".equals(demande.getStatut())) {
            throw new ApiException("Seules les demandes en cours peuvent être rejetées. Statut actuel: " + demande.getStatut());
        }
        
        return salaireRepository.updateDemandeSalaryStatut(id, "REJET");
    }

    @Override
    @Transactional
    public int validerDemandeSalary(Long id) {
        log.info("Validation de la demande de salaire: {}", id);
        // Vérifier que la demande existe et est en cours
        DemandeSalaryDto demande = salaireRepository.findDemandeSalaryById(id)
                .orElseThrow(() -> new ApiException("Demande non trouvée: " + id));
        
        if (!"ENCOURS".equals(demande.getStatut())) {
            throw new ApiException("Seules les demandes en cours peuvent être validées. Statut actuel: " + demande.getStatut());
        }
        
        return salaireRepository.updateDemandeSalaryStatut(id, "VALIDER");
    }

    @Override
    @Transactional
    public int confirmerDemandeSalary(Long id) {
        log.info("Confirmation de la demande de salaire: {}", id);
        // Vérifier que la demande existe et est validée
        DemandeSalaryDto demande = salaireRepository.findDemandeSalaryById(id)
                .orElseThrow(() -> new ApiException("Demande non trouvée: " + id));
        
        if (!"VALIDER".equals(demande.getStatut())) {
            throw new ApiException("Seules les demandes validées peuvent être confirmées. Statut actuel: " + demande.getStatut());
        }
        
        return salaireRepository.updateDemandeSalaryStatut(id, "CONFIRMER");
    }

    @Override
    public Optional<AvanceSalaireDto> getAvanceSalaireByMatricule(String matricule) {
        return salaireRepository.findAvanceSalaireByMatricule(matricule);
    }

    @Override
    public Optional<AvanceSalaireDto> getMyAvanceSalaire(Long userId) {
        // Récupérer le matricule de l'utilisateur
        Optional<String> matriculeOpt = salaireRepository.getUserMatricule(userId);

        if (matriculeOpt.isEmpty() || matriculeOpt.get() == null) {
            log.warn("L'utilisateur {} n'a pas de matricule défini", userId);
            return Optional.empty();
        }

        String matricule = matriculeOpt.get();
        return salaireRepository.findAvanceSalaireByMatriculeAndUser(matricule, userId);
    }

    @Override
    public boolean verifyUserMatricule(Long userId, String matricule) {
        return salaireRepository.checkMatriculeBelongsToUser(userId, matricule);
    }

    @Override
    @Transactional
    public int validerMultipleDemandeSalary(List<Long> ids) {
        log.info("Validation massive de {} demandes", ids.size());
        int count = 0;
        for (Long id : ids) {
            try {
                int updated = salaireRepository.updateDemandeSalaryStatut(id, "VALIDER");
                if (updated > 0) {
                    count++;
                }
            } catch (Exception e) {
                log.warn("Erreur validation demande {}: {}", id, e.getMessage());
            }
        }
        log.info("Validation massive terminée: {}/{} demandes validées", count, ids.size());
        return count;
    }

    @Override
    @Transactional
    public int confirmerMultipleDemandeSalary(List<Long> ids) {
        log.info("Confirmation massive de {} demandes", ids.size());
        int count = 0;
        for (Long id : ids) {
            try {
                int updated = salaireRepository.updateDemandeSalaryStatut(id, "CONFIRMER");
                if (updated > 0) {
                    count++;
                }
            } catch (Exception e) {
                log.warn("Erreur confirmation demande {}: {}", id, e.getMessage());
            }
        }
        log.info("Confirmation massive terminée: {}/{} demandes confirmées", count, ids.size());
        return count;
    }

    @Override
    public List<DemandeSalaryDto> getDemandesByIds(List<Long> ids) {
        return salaireRepository.findDemandesByIds(ids);
    }

    @Override
    public byte[] exportDemandesConfirmeesToExcel(List<Long> ids) throws Exception {
        List<DemandeSalaryDto> demandes;

        if (ids != null && !ids.isEmpty()) {
            demandes = salaireRepository.findDemandesByIds(ids);
        } else {
            demandes = salaireRepository.findDemandeSalaryByStatut("CONFIRMER");
        }

        log.info("Export Excel de {} demandes confirmées", demandes.size());

        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Demandes Avances Salaire");

            // Style pour l'en-tête
            CellStyle headerStyle = workbook.createCellStyle();
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerFont.setFontHeightInPoints((short) 12);
            headerStyle.setFont(headerFont);
            headerStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            headerStyle.setBorderBottom(BorderStyle.THIN);
            headerStyle.setBorderTop(BorderStyle.THIN);
            headerStyle.setBorderLeft(BorderStyle.THIN);
            headerStyle.setBorderRight(BorderStyle.THIN);
            headerStyle.setAlignment(HorizontalAlignment.CENTER);

            // Style pour les montants
            CellStyle moneyStyle = workbook.createCellStyle();
            DataFormat format = workbook.createDataFormat();
            moneyStyle.setDataFormat(format.getFormat("#,##0"));
            moneyStyle.setBorderBottom(BorderStyle.THIN);
            moneyStyle.setBorderTop(BorderStyle.THIN);
            moneyStyle.setBorderLeft(BorderStyle.THIN);
            moneyStyle.setBorderRight(BorderStyle.THIN);

            // Style pour les cellules normales
            CellStyle cellStyle = workbook.createCellStyle();
            cellStyle.setBorderBottom(BorderStyle.THIN);
            cellStyle.setBorderTop(BorderStyle.THIN);
            cellStyle.setBorderLeft(BorderStyle.THIN);
            cellStyle.setBorderRight(BorderStyle.THIN);

            // Créer l'en-tête
            Row headerRow = sheet.createRow(0);
            String[] columns = {"N°", "Matricule", "Nom", "Prénom", "N° Compte", "Téléphone", "Montant (GNF)", "Date"};
            for (int i = 0; i < columns.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(columns[i]);
                cell.setCellStyle(headerStyle);
            }

            // Remplir les données
            DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
            int rowNum = 1;
            for (DemandeSalaryDto demande : demandes) {
                Row row = sheet.createRow(rowNum);

                Cell cell0 = row.createCell(0);
                cell0.setCellValue(rowNum);
                cell0.setCellStyle(cellStyle);

                Cell cell1 = row.createCell(1);
                cell1.setCellValue(demande.getMatricule() != null ? demande.getMatricule() : "");
                cell1.setCellStyle(cellStyle);

                Cell cell2 = row.createCell(2);
                cell2.setCellValue(demande.getNomPersonnel() != null ? demande.getNomPersonnel() : "");
                cell2.setCellStyle(cellStyle);

                Cell cell3 = row.createCell(3);
                cell3.setCellValue(demande.getPrenomPersonnel() != null ? demande.getPrenomPersonnel() : "");
                cell3.setCellStyle(cellStyle);

                Cell cell4 = row.createCell(4);
                cell4.setCellValue(demande.getNumeroCompte() != null ? demande.getNumeroCompte() : "");
                cell4.setCellStyle(cellStyle);

                Cell cell5 = row.createCell(5);
                cell5.setCellValue(demande.getPhone() != null ? demande.getPhone() : "");
                cell5.setCellStyle(cellStyle);

                Cell cell6 = row.createCell(6);
                if (demande.getAmount() != null) {
                    cell6.setCellValue(demande.getAmount().doubleValue());
                }
                cell6.setCellStyle(moneyStyle);

                Cell cell7 = row.createCell(7);
                cell7.setCellValue(demande.getCreatedAt() != null ? demande.getCreatedAt().format(dateFormatter) : "");
                cell7.setCellStyle(cellStyle);

                rowNum++;
            }

            // Ajouter une ligne de total
            Row totalRow = sheet.createRow(rowNum + 1);
            Cell totalLabelCell = totalRow.createCell(5);
            totalLabelCell.setCellValue("TOTAL:");
            CellStyle totalLabelStyle = workbook.createCellStyle();
            Font boldFont = workbook.createFont();
            boldFont.setBold(true);
            totalLabelStyle.setFont(boldFont);
            totalLabelCell.setCellStyle(totalLabelStyle);

            Cell totalValueCell = totalRow.createCell(6);
            double total = demandes.stream()
                    .filter(d -> d.getAmount() != null)
                    .mapToDouble(d -> d.getAmount().doubleValue())
                    .sum();
            totalValueCell.setCellValue(total);
            CellStyle totalStyle = workbook.createCellStyle();
            totalStyle.setFont(boldFont);
            totalStyle.setDataFormat(format.getFormat("#,##0"));
            totalValueCell.setCellStyle(totalStyle);

            // Ajuster la largeur des colonnes
            for (int i = 0; i < columns.length; i++) {
                sheet.autoSizeColumn(i);
            }

            // Écrire dans ByteArrayOutputStream
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);
            return outputStream.toByteArray();
        }
    }

    @Override
    public AuthorizeSalaireDto getAuthorizeSalaire() {
        return salaireRepository.getAuthorizeSalaire()
                .orElse(AuthorizeSalaireDto.builder()
                        .id(1L)
                        .isAuthorized(false)
                        .message("Les demandes d'avance sur salaire ne sont pas disponibles pour le moment.")
                        .build());
    }

    @Override
    public boolean isDemandeAuthorized() {
        return salaireRepository.getAuthorizeSalaire()
                .map(AuthorizeSalaireDto::getIsAuthorized)
                .orElse(false);
    }


    @Override
    @Transactional
    public int updateAuthorizeSalaire(Boolean isAuthorized, String message, Long authorizedBy) {
        log.info("Mise à jour autorisation demandes salaire: {} par user {}", isAuthorized, authorizedBy);
        return salaireRepository.updateAuthorizeSalaire(isAuthorized, message, authorizedBy);
    }

    @Override
    @Transactional
    public int enableAuthorizeSalaire(Long authorizedBy) {
        log.info("Activation des demandes de salaire par user {}", authorizedBy);
        return salaireRepository.enableAuthorizeSalaire(authorizedBy);
    }

    @Override
    @Transactional
    public int disableAuthorizeSalaire(Long authorizedBy) {
        log.info("Désactivation des demandes de salaire par user {}", authorizedBy);
        return salaireRepository.disableAuthorizeSalaire(authorizedBy);
    }


    // ==================== MÉTHODES UTILITAIRES ====================

    private Workbook createWorkbook(MultipartFile file, InputStream is) throws IOException {
        String filename = file.getOriginalFilename();
        if (filename != null && filename.toLowerCase().endsWith(".xlsx")) {
            return new XSSFWorkbook(is);
        } else if (filename != null && filename.toLowerCase().endsWith(".xls")) {
            return new HSSFWorkbook(is);
        }
        throw new ApiException("Format de fichier non supporté. Utilisez .xlsx ou .xls");
    }

    private String getCellValueAsString(Cell cell) {
        if (cell == null) return null;
        
        return switch (cell.getCellType()) {
            case STRING -> cell.getStringCellValue();
            case NUMERIC -> {
                // Traiter les nombres comme des matricules (sans décimales)
                double value = cell.getNumericCellValue();
                if (value == Math.floor(value)) {
                    yield String.valueOf((long) value);
                }
                yield String.valueOf(value);
            }
            case BOOLEAN -> String.valueOf(cell.getBooleanCellValue());
            case FORMULA -> {
                try {
                    yield cell.getStringCellValue();
                } catch (Exception e) {
                    yield String.valueOf(cell.getNumericCellValue());
                }
            }
            default -> null;
        };
    }

    private BigDecimal getCellValueAsBigDecimal(Cell cell) {
        if (cell == null) return null;
        
        return switch (cell.getCellType()) {
            case NUMERIC -> BigDecimal.valueOf(cell.getNumericCellValue());
            case STRING -> {
                try {
                    // Nettoyer la chaîne (enlever espaces, remplacer virgules)
                    String value = cell.getStringCellValue()
                            .replaceAll("\\s+", "")
                            .replace(",", ".");
                    yield new BigDecimal(value);
                } catch (NumberFormatException e) {
                    yield null;
                }
            }
            case FORMULA -> {
                try {
                    yield BigDecimal.valueOf(cell.getNumericCellValue());
                } catch (Exception e) {
                    yield null;
                }
            }
            default -> null;
        };
    }
}
