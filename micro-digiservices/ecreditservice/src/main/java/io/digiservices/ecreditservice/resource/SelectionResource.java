package io.digiservices.ecreditservice.resource;

import io.digiservices.ecreditservice.domain.Response;
import io.digiservices.ecreditservice.service.DemandeIndService;
import io.digiservices.ecreditservice.service.SelectionService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Map;

import static io.digiservices.ecreditservice.utils.RequestUtils.getResponse;
import static java.time.LocalTime.now;
import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.OK;
import static org.springframework.http.ResponseEntity.created;
import static org.springframework.util.MimeTypeUtils.IMAGE_PNG_VALUE;

@RestController
@AllArgsConstructor
@RequestMapping("/ecredit")
public class SelectionResource {

    private final SelectionService selectionService;
    private final DemandeIndService demandeIndService;

    @PostMapping(value = "/image/{userId}/{demandeindividuel_id}",consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Response> addSelectionInd(@NotNull Authentication authentication,
                                                    @PathVariable(name = "userId") Long userId,
                                                    @PathVariable(name = "demandeindividuel_id") Long demandeindividuel_id,
                                                    @RequestParam("image") MultipartFile image, HttpServletRequest request) {

        return created(getUri()).body(getResponse(request,Map.of("documents", selectionService.addSelection(userId,demandeindividuel_id,image),"demandeIndividuel",demandeIndService.getDetailDemandeIndividuel(demandeindividuel_id)), "Fiche de Selection Importée avec Success", CREATED));
    }

    @GetMapping(value = "/images/{demandeindividuel_id}")
    public ResponseEntity<Response> getAllImages(@NotNull Authentication authentication,
                                                    @PathVariable(name = "demandeindividuel_id") Long demandeindividuel_id,HttpServletRequest request) {
        return created(getUri()).body(getResponse(request,Map.of("documents", selectionService.getAllImages(demandeindividuel_id),"demandeIndividuel",demandeIndService.getDetailDemandeIndividuel(demandeindividuel_id)), "Liste des fiches de selection", CREATED));
    }

    @GetMapping(value = "/docs/{fileName}", produces = IMAGE_PNG_VALUE)
    public byte[] getProfileImage(@PathVariable("fileName") String fileName) throws Exception {
        return Files.readAllBytes(Paths.get(System.getProperty("user.home") + "/IdeaProjects/micro-digiservices/ecreditservice/src/main/resources/docs/" + fileName));
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
