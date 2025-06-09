package io.digiservices.ecreditservice.repository.impl;

import io.digiservices.ecreditservice.dto.Selection;
import io.digiservices.ecreditservice.exception.ApiException;
import io.digiservices.ecreditservice.repository.SelectionRepository;
import io.digiservices.ecreditservice.utils.FileStorageConfig;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Map;
import java.util.Random;
import static io.digiservices.ecreditservice.query.SelectionQuery.*;
import static org.springframework.web.servlet.support.ServletUriComponentsBuilder.fromCurrentContextPath;

@Service
@RequiredArgsConstructor
@Slf4j
public class SelectionRepositoryImpl implements SelectionRepository {
    private final JdbcClient jdbcClient;


    @Override
    public List<Selection> addSelection(Long userId, Long demandeindividuel_id, MultipartFile file) {
        try {
            if (countUserById(userId) <= 0) {
                throw new ApiException("No user found with ID: " + userId);
            }

            if (countDemandeIndividuelById(demandeindividuel_id) <= 0) {
                throw new ApiException("No demande individuel found with ID: " + demandeindividuel_id);
            }

            String randomString = generateUniqueRandomString();
            String doc = setSelectionDocUrl(randomString, file); // Pass file for extension detection

            jdbcClient.sql(INSERT_SELECTION_QUERY)
                    .params(Map.of(
                            "doc", doc,
                            "userId", userId,
                            "demandeindividuel_id", demandeindividuel_id
                    ))
                    .update();

            saveImage(randomString, file); // Renamed method

            return jdbcClient.sql(SELECT_ALL_SELECTION_BY_ID_QUERY)
                    .param("demandeindividuel_id", demandeindividuel_id)
                    .query(Selection.class)
                    .list();

        } catch (EmptyResultDataAccessException exception) {
            log.error(exception.getMessage());
            throw new ApiException("Failed to retrieve the created selection");
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new ApiException("An error occurred while creating the selection: " + e.getMessage());
        }
    }

    @Override
    public List<Selection> getAllImages(Long demandeindividuel_id) {
        try {
            return jdbcClient.sql(SELECT_ALL_SELECTION_BY_ID_QUERY)
                    .param("demandeindividuel_id", demandeindividuel_id)
                    .query(Selection.class)
                    .list();
        } catch (EmptyResultDataAccessException exception) {
            log.error(exception.getMessage());
            throw new ApiException("Failed to retrieve the created selection");
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new ApiException("An error occurred while creating the selection: " + e.getMessage());
        }
    }

    @Override
    public void deleteDocument(Long selection_id) {
        try {
            // First, get the document info before deleting from database
            Selection selection = jdbcClient.sql(SELECT_SELECTION_BY_ID_QUERY)
                    .param("selection_id", selection_id)
                    .query(Selection.class)
                    .optional()
                    .orElseThrow(() -> new ApiException("Document not found with ID: " + selection_id));

            log.info("🗑️ Deleting document with ID: {} and file: {}", selection_id, selection.getDoc());

            // Delete the physical file first
            deletePhysicalFile(selection.getDoc());

            // Then delete from database
            int deletedRows = jdbcClient.sql(DELETE_SELECTION_QUERY)
                    .param("selection_id", selection_id)
                    .update();

            if (deletedRows == 0) {
                throw new ApiException("No document found to delete with ID: " + selection_id);
            }

            log.info("✅ Successfully deleted document and file for ID: {}", selection_id);

        } catch (EmptyResultDataAccessException exception) {
            log.error("Document not found: {}", exception.getMessage());
            throw new ApiException("Document not found with ID: " + selection_id);
        } catch (Exception e) {
            log.error("Error deleting document: {}", e.getMessage(), e);
            throw new ApiException("An error occurred while deleting the document: " + e.getMessage());
        }
    }


    /**
     * Deletes the physical file from the file system
     */
    private void deletePhysicalFile(String docUrl) {
        try {
            if (docUrl == null || docUrl.trim().isEmpty()) {
                log.warn("⚠️ Document URL is empty, skipping file deletion");
                return;
            }

            // Extract filename from URL
            String filename = extractFilenameFromUrl(docUrl);
            if (filename == null) {
                log.warn("⚠️ Could not extract filename from URL: {}", docUrl);
                return;
            }

            // Construct full file path using your existing FILE_STORAGE_LOCATION
            Path filePath = FILE_STORAGE_LOCATION.resolve(filename);

            log.info("🔍 Attempting to delete file: {}", filePath.toAbsolutePath());

            // Check if file exists
            if (!Files.exists(filePath)) {
                log.warn("⚠️ File does not exist: {}", filePath.toAbsolutePath());
                return;
            }

            // Delete the file
            Files.delete(filePath);
            log.info("✅ Successfully deleted physical file: {}", filePath.toAbsolutePath());

        } catch (IOException e) {
            log.error("❌ Failed to delete physical file for URL {}: {}", docUrl, e.getMessage(), e);
            // Don't throw exception here - we still want to delete the database record
            // even if file deletion fails
        } catch (Exception e) {
            log.error("❌ Unexpected error deleting physical file for URL {}: {}", docUrl, e.getMessage(), e);
        }
    }

    /**
     * Extracts filename from document URL
     */
    private String extractFilenameFromUrl(String docUrl) {
        try {
            // Handle your URL format: http://172.30.144.1:8087/ecredit/docs/filename.ext
            if (docUrl.contains("/ecredit/docs/")) {
                return docUrl.substring(docUrl.lastIndexOf('/') + 1);
            } else if (docUrl.contains("/docs/")) {
                return docUrl.substring(docUrl.lastIndexOf('/') + 1);
            } else {
                log.warn("⚠️ Unrecognized URL format: {}", docUrl);
                return null;
            }
        } catch (Exception e) {
            log.error("❌ Error extracting filename from URL {}: {}", docUrl, e.getMessage());
            return null;
        }
    }

    private Integer countUserById(Long userId){
        return jdbcClient.sql(COUNT_USER_BY_ID_QUERY).param("userId",userId).query(Integer.class).single();
    }


    private Integer countDemandeIndividuelById(Long demandeindividuel_id){
        return jdbcClient.sql(COUNT_DEMANDE_INDIVIDUEL_BY_ID_QUERY).param("demandeindividuel_id",demandeindividuel_id).query(Integer.class).single();
    }



    private void saveImage(String saveImageUrl, MultipartFile file) {
        try {
            log.info("🔍 TARGET SAVE LOCATION: {}", FILE_STORAGE_LOCATION.toAbsolutePath());
            log.info("📄 File type: {}", file.getContentType());
            log.info("📄 Original filename: {}", file.getOriginalFilename());

            // Validate file type
            if (!isValidFileType(file)) {
                throw new ApiException("Unsupported file type: " + file.getContentType());
            }

            // Ensure directory exists
            if (!Files.exists(FILE_STORAGE_LOCATION)) {
                Files.createDirectories(FILE_STORAGE_LOCATION);
                log.info("✅ Created directories: {}", FILE_STORAGE_LOCATION);
            }

            // Get the correct file extension
            String fileExtension = getFileExtension(file);
            Path targetLocation = FILE_STORAGE_LOCATION.resolve(saveImageUrl + fileExtension);

            log.info("🎯 SAVING FILE TO: {}", targetLocation.toAbsolutePath());

            // Save with REPLACE_EXISTING
            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, targetLocation, StandardCopyOption.REPLACE_EXISTING);
            }

            // Verify the file was saved
            if (Files.exists(targetLocation)) {
                long fileSize = Files.size(targetLocation);
                log.info("✅ FILE SAVED SUCCESSFULLY TO: {}", targetLocation.toAbsolutePath());
                log.info("   📊 File size: {} bytes", fileSize);
            } else {
                throw new ApiException("File verification failed");
            }

        } catch (IOException exception) {
            log.error("❌ Failed to save file: {}", exception.getMessage(), exception);
            throw new ApiException("Failed to save file: " + exception.getMessage());
        }
    }

    private boolean isValidFileType(MultipartFile file) {
        String[] allowedTypes = {
                "image/jpeg", "image/jpg", "image/png", "image/gif",
                "application/pdf",
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        };

        String contentType = file.getContentType();
        if (contentType != null) {
            for (String allowedType : allowedTypes) {
                if (contentType.equals(allowedType)) {
                    return true;
                }
            }
        }
        return false;
    }

    private String setSelectionDocUrl(String randomString, MultipartFile file) {
        String fileExtension = getFileExtension(file);
        String url = fromCurrentContextPath().path("/ecredit/docs/" + randomString + fileExtension).toUriString();
        log.info("🔗 Generated file URL: {}", url);
        return url;
    }

    private static final Path FILE_STORAGE_LOCATION = FileStorageConfig.FILE_STORAGE_LOCATION;

    private String getFileExtension(MultipartFile file) {
        String originalFilename = file.getOriginalFilename();
        if (originalFilename != null && originalFilename.contains(".")) {
            return originalFilename.substring(originalFilename.lastIndexOf("."));
        }

        // Fallback based on content type
        String contentType = file.getContentType();
        if (contentType != null) {
            return switch (contentType) {
                case "image/png" -> ".png";
                case "image/jpeg", "image/jpg" -> ".jpg";
                case "image/gif" -> ".gif";
                case "application/pdf" -> ".pdf";
                case "application/msword" -> ".doc";
                case "application/vnd.openxmlformats-officedocument.wordprocessingml.document" -> ".docx";
                default -> ".png"; // Default fallback
            };
        }

        return ".png"; // Final fallback
    }


    private String generateUniqueRandomString()
    {
        String randomString;
        Path targetPath;
        do {
            randomString = generateRandomString();
            targetPath = FILE_STORAGE_LOCATION.resolve(randomString + ".png");
        } while (Files.exists(targetPath));

        return randomString;
    }

    private String generateRandomString()
    {
        int length = 10;
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        StringBuilder randomString = new StringBuilder(length);
        Random random = new Random();

        for (int i = 0; i < length; i++) {
            randomString.append(characters.charAt(random.nextInt(characters.length())));
        }

        return randomString.toString();
    }
}
