package io.digiservices.ecreditservice.resource;

import io.digiservices.clients.UserClient;
import io.digiservices.ecreditservice.domain.Response;
import io.digiservices.ecreditservice.dto.AnalyseChargesFonctionnaireDto;
import io.digiservices.ecreditservice.dto.PieceJointeDto;
import io.digiservices.ecreditservice.exception.ApiException;
import io.digiservices.ecreditservice.repository.DemandePieceJointeRepository;
import io.digiservices.ecreditservice.service.AnalyseChargesFonctionnaireService;
import io.digiservices.ecreditservice.service.FileStorageService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

import static io.digiservices.ecreditservice.utils.RequestUtils.getResponse;
import static org.springframework.http.HttpStatus.OK;

/**
 * Analyse charges & quotité du crédit fonctionnaire — remplace le bilan/flux
 * commerçant pour la nature client Fonctionnaire.
 */
@RestController
@AllArgsConstructor
@RequestMapping("/ecredit/fonctionnaire")
@Slf4j
public class AnalyseChargesFonctionnaireResource {

    private final AnalyseChargesFonctionnaireService analyseChargesService;
    private final DemandePieceJointeRepository pieceJointeRepository;
    private final FileStorageService fileStorageService;
    private final UserClient userClient;

    @GetMapping("/analyse-charges/{demandeId}")
    public ResponseEntity<Response> getAnalyseCharges(
            @PathVariable Long demandeId,
            HttpServletRequest httpRequest) {
        Map<String, Object> data = new HashMap<>();
        data.put("analyseCharges", analyseChargesService.getByDemandeId(demandeId).orElse(null));
        return ResponseEntity.ok(
                getResponse(httpRequest, data, "Analyse des charges récupérée", OK));
    }

    @PutMapping("/analyse-charges/{demandeId}")
    public ResponseEntity<Response> enregistrerAnalyseCharges(
            @PathVariable Long demandeId,
            @RequestBody AnalyseChargesFonctionnaireDto dto,
            Authentication authentication,
            HttpServletRequest httpRequest) {
        var user = userClient.getUserByUuid(authentication.getName());
        String analysePar = user.getFirstName() + " " + user.getLastName();
        var result = analyseChargesService.enregistrer(demandeId, dto, analysePar);
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("analyseCharges", result),
                        "Analyse des charges enregistrée", OK));
    }

    // ==================== PIECES JOINTES (bulletin de salaire, attestation de service) ====================

    @GetMapping("/pieces/{demandeId}")
    public ResponseEntity<Response> getPieces(
            @PathVariable Long demandeId,
            HttpServletRequest httpRequest) {
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("pieces", pieceJointeRepository.findByDemandeId(demandeId)),
                        "Pièces jointes récupérées", OK));
    }

    @PostMapping(value = "/pieces/{demandeId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Response> uploadPiece(
            @PathVariable Long demandeId,
            @RequestParam("typePiece") String typePiece,
            @RequestParam("file") MultipartFile file,
            Authentication authentication,
            HttpServletRequest httpRequest) {
        var user = userClient.getUserByUuid(authentication.getName());
        String fileUrl = fileStorageService.storeFile(file);
        var piece = pieceJointeRepository.insert(PieceJointeDto.builder()
                .demandeindividuelId(demandeId)
                .typePiece(typePiece)
                .nomFichier(file.getOriginalFilename())
                .urlFichier(fileUrl)
                .ajoutePar(user.getFirstName() + " " + user.getLastName())
                .build());
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("piece", piece),
                        "Pièce jointe enregistrée", OK));
    }

    @DeleteMapping("/pieces/{pieceJointeId}")
    public ResponseEntity<Response> deletePiece(
            @PathVariable Long pieceJointeId,
            HttpServletRequest httpRequest) {
        var piece = pieceJointeRepository.findById(pieceJointeId)
                .orElseThrow(() -> new ApiException("Pièce jointe non trouvée"));
        pieceJointeRepository.delete(pieceJointeId);
        try {
            fileStorageService.deleteFile(piece.getUrlFichier());
        } catch (Exception e) {
            log.warn("Fichier de la pièce {} introuvable ou non supprimé: {}", pieceJointeId, e.getMessage());
        }
        return ResponseEntity.ok(
                getResponse(httpRequest, Map.of("message", "Pièce supprimée"),
                        "Pièce jointe supprimée", OK));
    }
}
