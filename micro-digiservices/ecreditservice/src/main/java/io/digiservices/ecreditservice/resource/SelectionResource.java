package io.digiservices.ecreditservice.resource;

import io.digiservices.clients.UserClient;
import io.digiservices.clients.domain.User;
import io.digiservices.ecreditservice.domain.Response;
import io.digiservices.ecreditservice.dto.Selection;
import io.digiservices.ecreditservice.service.DemandeIndService;
import io.digiservices.ecreditservice.service.SelectionService;
import io.digiservices.ecreditservice.utils.FileStorageConfig;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.http.conn.DnsResolver;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;


import static io.digiservices.ecreditservice.utils.RequestUtils.getResponse;
import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.ResponseEntity.created;

@RestController
@AllArgsConstructor
@RequestMapping("/ecredit")
@Slf4j
public class SelectionResource {


    private final SelectionService selectionService;
    private final DemandeIndService demandeIndService;
    private final UserClient userClient;

    @PostMapping(value = "/image/{demandeindividuelId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Response> addSelectionInd(@NotNull Authentication authentication,
                                                    @PathVariable(name = "demandeindividuelId") Long demandeindividuelId,
                                                    @RequestParam("image") MultipartFile image,
                                                    HttpServletRequest request) {

        // Add debugging logs
        log.info("🔥 CONTROLLER DEBUG:");
        log.info("   📤 Received file: {}", image.getOriginalFilename());
        log.info("   📊 File size: {} bytes", image.getSize());
        log.info("   📋 Content type: {}", image.getContentType());
        log.info("   👤 User ID: {}", userClient.getUserByUuid(authentication.getName()).getUserId());
        log.info("   📄 Demande ID: {}", demandeindividuelId);

        try {
            List<Selection> result = selectionService.addSelection(userClient.getUserByUuid(authentication.getName()).getUserId(), demandeindividuelId, image);

            // Log the result
            log.info("✅ Controller: Service returned {} selections", result.size());
            if (!result.isEmpty()) {
                log.info("   🔗 First selection doc URL: {}", result.get(0).getDoc());
            }

            return created(getUri()).body(getResponse(request,
                    Map.of("documents", result, "demandeIndividuel", demandeIndService.getDetailDemandeIndividuel(demandeindividuelId)),
                    "Fiche de Selection Importée avec Success", CREATED));

        } catch (Exception e) {
            log.error("❌ Controller error: {}", e.getMessage(), e);
            throw e;
        }
    }

    @GetMapping(value = "/images/{demandeindividuelId}")
    public ResponseEntity<Response> getAllImages(@NotNull Authentication authentication,
                                                    @PathVariable(name = "demandeindividuelId") Long demandeindividuelId,HttpServletRequest request)
    {
        User user = userClient.getUserByUuid(authentication.getName());
        return created(getUri()).body(getResponse(request,Map.of("documents", selectionService.getAllImages(demandeindividuelId),"demandeIndividuel",demandeIndService.getDetailDemandeIndividuel(demandeindividuelId),"user",user), "Liste des fiches de selection", CREATED));
    }

    @GetMapping(value = "/docs/{fileName}")
    public ResponseEntity<byte[]> getProfileImage(@PathVariable("fileName") String fileName) {
        try {
            // Construct path
            Path filePath = Paths.get(
                    System.getProperty("user.dir"),
                    "micro-digiservices", "ecreditservice", "src", "main", "resources", "docs",
                    fileName
            );

            log.info("🔍 Attempting to read file: {}", filePath.toAbsolutePath());

            // Security check
            Path normalizedPath = filePath.normalize();
            Path expectedParent = Paths.get(
                    System.getProperty("user.dir"),
                    "micro-digiservices", "ecreditservice", "src", "main", "resources", "docs"
            ).normalize();

            if (!normalizedPath.startsWith(expectedParent)) {
                log.error("🚨 Security violation: Attempted to access file outside docs directory");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            // Check if file exists
            if (!Files.exists(normalizedPath)) {
                log.error("❌ File not found: {}", normalizedPath.toAbsolutePath());
                return ResponseEntity.notFound().build();
            }

            // Read file bytes
            byte[] fileBytes = Files.readAllBytes(normalizedPath);
            log.info("✅ Successfully read file: {} ({} bytes)", fileName, fileBytes.length);

            // Determine content type
            String contentType = getContentTypeByFileName(fileName);

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .contentLength(fileBytes.length)
                    .header("Content-Disposition", "inline; filename=\"" + fileName + "\"")
                    .body(fileBytes);

        } catch (IOException exception) {
            log.error("❌ Error reading file {}: {}", fileName, exception.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    private String getContentTypeByFileName(String fileName) {
        String extension = "";
        if (fileName.contains(".")) {
            extension = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();
        }

        return switch (extension) {
            case "png" -> MediaType.IMAGE_PNG_VALUE;
            case "jpg", "jpeg" -> MediaType.IMAGE_JPEG_VALUE;
            case "gif" -> MediaType.IMAGE_GIF_VALUE;
            case "bmp" -> "image/bmp";
            case "webp" -> "image/webp";
            case "pdf" -> MediaType.APPLICATION_PDF_VALUE;
            case "doc" -> "application/msword";
            case "docx" -> "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
            default -> MediaType.APPLICATION_OCTET_STREAM_VALUE;
        };
    }

    /**
     * Helper method to determine content type based on file extension
     */
    private String getContentType(String fileName) {
        String extension = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();

        return switch (extension) {
            case "png" -> MediaType.IMAGE_PNG_VALUE;
            case "jpg", "jpeg" -> MediaType.IMAGE_JPEG_VALUE;
            case "gif" -> MediaType.IMAGE_GIF_VALUE;
            case "bmp" -> "image/bmp";
            case "webp" -> "image/webp";
            case "pdf" -> MediaType.APPLICATION_PDF_VALUE;
            default -> MediaType.APPLICATION_OCTET_STREAM_VALUE;
        };
    }

    @DeleteMapping("/{selection_id}/{demandeindividuel_id}/delecteDocument")
    public ResponseEntity<Response> acteDocument(Authentication authentication,
                                                     @PathVariable(name = "selection_id") Long selection_id,
                                                     @PathVariable("demandeindividuel_id") Long demandeindividuel_id, HttpServletRequest request) {
        selectionService.deleteDocument(selection_id);
        return created(getUri()).body(getResponse(request,Map.of("documents", selectionService.getAllImages(demandeindividuel_id)), "Liste des fiches de selection", CREATED));
    }


    private URI getUri() {
        return URI.create("/image/selection_id");
    }
}
