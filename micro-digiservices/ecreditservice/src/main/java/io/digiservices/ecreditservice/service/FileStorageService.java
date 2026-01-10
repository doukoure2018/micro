package io.digiservices.ecreditservice.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.*;

@Service
@Slf4j
public class FileStorageService {

    @Value("${file.upload-dir:C:/Users/DELL/IdeaProjects/micro/uploads}")
    private String uploadDir;

    @Value("${file.base-url:http://localhost:8087/ecredit/files}")
    private String baseUrl;

    private Path fileStorageLocation;

    @PostConstruct
    public void init() {
        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.fileStorageLocation);
            log.info("Répertoire de stockage créé: {}", this.fileStorageLocation);
        } catch (IOException e) {
            throw new RuntimeException("Impossible de créer le répertoire de stockage", e);
        }
    }

    /**
     * Obtenir l'URL de base pour les fichiers
     * Utilise la config si définie, sinon génère dynamiquement
     */
    private String getBaseUrl() {
        if (baseUrl != null && !baseUrl.isEmpty()) {
            return baseUrl;
        }

        // Générer dynamiquement depuis la requête courante
        try {
            return ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/ecredit/files")
                    .toUriString();
        } catch (Exception e) {
            // Fallback si pas de contexte de requête
            return "http://localhost:8087/ecredit/files";
        }
    }

    public String storeFile(MultipartFile file) {
        String originalFileName = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));

        if (originalFileName.contains("..")) {
            throw new RuntimeException("Nom de fichier invalide: " + originalFileName);
        }

        String fileExtension = getFileExtension(originalFileName);
        String uniqueFileName = UUID.randomUUID().toString() + "." + fileExtension;

        try {
            Path targetLocation = this.fileStorageLocation.resolve(uniqueFileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            log.info("Fichier stocké: {}", uniqueFileName);

            return baseUrl + "/" + uniqueFileName;
        } catch (IOException e) {
            throw new RuntimeException("Erreur lors du stockage du fichier: " + originalFileName, e);
        }
    }

    public List<Map<String, Object>> storeFiles(MultipartFile[] files) {
        List<Map<String, Object>> uploadedFiles = new ArrayList<>();

        for (MultipartFile file : files) {
            String url = storeFile(file);
            Map<String, Object> fileInfo = new HashMap<>();
            fileInfo.put("url", url);
            fileInfo.put("fileName", file.getOriginalFilename());
            fileInfo.put("fileSize", file.getSize());
            fileInfo.put("contentType", file.getContentType());
            uploadedFiles.add(fileInfo);
        }

        return uploadedFiles;
    }

    /**
     * Supprimer un fichier du répertoire uploads
     * @param fileUrl L'URL complète du fichier (ex: http://localhost:8087/ecredit/files/uuid.pdf)
     * @return true si le fichier a été supprimé, false sinon
     */
    public boolean deleteFile(String fileUrl) {
        try {
            // Extraire le nom du fichier depuis l'URL
            String fileName = extractFileNameFromUrl(fileUrl);

            if (fileName == null || fileName.isEmpty()) {
                log.warn("Impossible d'extraire le nom du fichier depuis l'URL: {}", fileUrl);
                return false;
            }

            Path filePath = this.fileStorageLocation.resolve(fileName).normalize();

            // Vérifier que le fichier est bien dans le répertoire uploads (sécurité)
            if (!filePath.startsWith(this.fileStorageLocation)) {
                log.error("Tentative de suppression d'un fichier hors du répertoire uploads: {}", filePath);
                return false;
            }

            if (Files.exists(filePath)) {
                Files.delete(filePath);
                log.info("Fichier supprimé: {}", fileName);
                return true;
            } else {
                log.warn("Fichier non trouvé pour suppression: {}", fileName);
                return false;
            }
        } catch (IOException e) {
            log.error("Erreur lors de la suppression du fichier: {}", e.getMessage());
            return false;
        }
    }

    /**
     * Supprimer plusieurs fichiers
     * @param fileUrls Liste des URLs des fichiers à supprimer
     * @return Nombre de fichiers supprimés avec succès
     */
    public int deleteFiles(List<String> fileUrls) {
        int deletedCount = 0;
        for (String url : fileUrls) {
            if (deleteFile(url)) {
                deletedCount++;
            }
        }
        return deletedCount;
    }

    /**
     * Extraire le nom du fichier depuis l'URL
     */
    private String extractFileNameFromUrl(String fileUrl) {
        if (fileUrl == null || fileUrl.isEmpty()) {
            return null;
        }

        // Si l'URL contient le baseUrl, extraire la partie après
        if (fileUrl.contains("/ecredit/files/")) {
            int index = fileUrl.lastIndexOf("/ecredit/files/");
            return fileUrl.substring(index + "/ecredit/files/".length());
        }

        // Sinon, prendre la dernière partie de l'URL
        int lastSlashIndex = fileUrl.lastIndexOf("/");
        if (lastSlashIndex != -1 && lastSlashIndex < fileUrl.length() - 1) {
            return fileUrl.substring(lastSlashIndex + 1);
        }

        return null;
    }

    public Path loadFile(String fileName) {
        return this.fileStorageLocation.resolve(fileName).normalize();
    }

    private String getFileExtension(String fileName) {
        if (fileName == null || fileName.lastIndexOf(".") == -1) {
            return "";
        }
        return fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();
    }
}