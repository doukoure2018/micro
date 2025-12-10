package io.digiservices.ecreditservice.resource;

import io.digiservices.ecreditservice.domain.Response;
import io.digiservices.ecreditservice.service.FileStorageService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

import static io.digiservices.ecreditservice.utils.RequestUtils.getResponse;
import static org.springframework.http.HttpStatus.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/ecredit")
@Slf4j
public class FileUploadResource {

    private final FileStorageService fileStorageService;

    @PostMapping("/upload")
    public ResponseEntity<Response> uploadFile(
            @RequestParam("file") MultipartFile file,
            HttpServletRequest request) {
        log.info("Upload de fichier: {}", file.getOriginalFilename());

        try {
            String fileUrl = fileStorageService.storeFile(file);
            return ResponseEntity.ok(getResponse(request, Map.of(
                    "url", fileUrl,
                    "fileName", file.getOriginalFilename(),
                    "fileSize", file.getSize(),
                    "contentType", file.getContentType()
            ), "Fichier uploadé avec succès", OK));
        } catch (Exception e) {
            log.error("Erreur lors de l'upload: {}", e.getMessage());
            return ResponseEntity.status(INTERNAL_SERVER_ERROR)
                    .body(getResponse(request, Map.of(), "Erreur lors de l'upload: " + e.getMessage(), INTERNAL_SERVER_ERROR));
        }
    }

    @PostMapping("/upload/multiple")
    public ResponseEntity<Response> uploadMultipleFiles(
            @RequestParam("files") MultipartFile[] files,
            HttpServletRequest request) {
        log.info("Upload de {} fichiers", files.length);

        try {
            var uploadedFiles = fileStorageService.storeFiles(files);
            return ResponseEntity.ok(getResponse(request, Map.of(
                    "files", uploadedFiles,
                    "count", uploadedFiles.size()
            ), "Fichiers uploadés avec succès", OK));
        } catch (Exception e) {
            log.error("Erreur lors de l'upload multiple: {}", e.getMessage());
            return ResponseEntity.status(INTERNAL_SERVER_ERROR)
                    .body(getResponse(request, Map.of(), "Erreur lors de l'upload: " + e.getMessage(), INTERNAL_SERVER_ERROR));
        }
    }

    @DeleteMapping("/files/{fileName}")
    public ResponseEntity<Response> deleteFile(
            @PathVariable(name = "fileName") String fileName,
            HttpServletRequest request) {
        log.info("Suppression du fichier: {}", fileName);

        boolean deleted = fileStorageService.deleteFile(fileStorageService.loadFile(fileName).toString());

        if (deleted) {
            return ResponseEntity.ok(getResponse(request, Map.of(), "Fichier supprimé avec succès", OK));
        } else {
            return ResponseEntity.status(NOT_FOUND)
                    .body(getResponse(request, Map.of(), "Fichier non trouvé", NOT_FOUND));
        }
    }
}
