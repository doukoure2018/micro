package io.digiservices.ecreditservice.resource;

import io.digiservices.ecreditservice.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.file.Path;

@RestController
@RequiredArgsConstructor
@RequestMapping("/ecredit/files")
@Slf4j
public class FileDownloadResource {

    private final FileStorageService fileStorageService;

    @GetMapping("/{fileName:.+}")
    public ResponseEntity<Resource> downloadFile(@PathVariable(name = "fileName") String fileName) {
        try {
            Path filePath = fileStorageService.loadFile(fileName);
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                String contentType = getContentType(fileName);

                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                log.error("Fichier non trouvé: {}", fileName);
                return ResponseEntity.notFound().build();
            }
        } catch (IOException e) {
            log.error("Erreur lors du téléchargement: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    private String getContentType(String fileName) {
        String extension = fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();

        return switch (extension) {
            case "pdf" -> "application/pdf";
            case "jpg", "jpeg" -> "image/jpeg";
            case "png" -> "image/png";
            case "gif" -> "image/gif";
            case "doc" -> "application/msword";
            case "docx" -> "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
            default -> "application/octet-stream";
        };
    }
}