package io.digiservices.ecreditservice.service.impl;

import io.digiservices.ecreditservice.dto.PieceJointeDto;
import io.digiservices.ecreditservice.exception.ApiException;
import io.digiservices.ecreditservice.repository.DemandePieceJointeRepository;
import io.digiservices.ecreditservice.service.DemandePieceJointeService;
import io.digiservices.ecreditservice.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * Gestion des pièces jointes d'une demande (V121) : appariement fichier stocké + ligne en base.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class DemandePieceJointeServiceImpl implements DemandePieceJointeService {

    private final DemandePieceJointeRepository pieceJointeRepository;
    private final FileStorageService fileStorageService;

    @Override
    public List<PieceJointeDto> getByDemandeId(Long demandeId) {
        return pieceJointeRepository.findByDemandeId(demandeId);
    }

    @Override
    @Transactional
    public PieceJointeDto upload(Long demandeId, String typePiece, MultipartFile file, String ajoutePar) {
        String fileUrl = fileStorageService.storeFile(file);
        try {
            return pieceJointeRepository.insert(PieceJointeDto.builder()
                    .demandeindividuelId(demandeId)
                    .typePiece(typePiece)
                    .nomFichier(file.getOriginalFilename())
                    .urlFichier(fileUrl)
                    .ajoutePar(ajoutePar)
                    .build());
        } catch (Exception e) {
            // Pas de ligne en base : on ne laisse pas de fichier orphelin sous ./uploads/
            try {
                fileStorageService.deleteFile(fileUrl);
            } catch (Exception cleanupError) {
                log.warn("Fichier orphelin non supprimé après échec d'insertion ({}): {}", fileUrl, cleanupError.getMessage());
            }
            log.error("Échec de l'enregistrement de la pièce jointe (demande {}): {}", demandeId, e.getMessage(), e);
            throw new ApiException("Erreur lors de l'enregistrement de la pièce jointe");
        }
    }

    @Override
    @Transactional
    public void delete(Long pieceJointeId) {
        PieceJointeDto piece = pieceJointeRepository.findById(pieceJointeId)
                .orElseThrow(() -> new ApiException("Pièce jointe non trouvée"));
        pieceJointeRepository.delete(pieceJointeId);
        try {
            fileStorageService.deleteFile(piece.getUrlFichier());
        } catch (Exception e) {
            log.warn("Fichier de la pièce {} introuvable ou non supprimé: {}", pieceJointeId, e.getMessage());
        }
    }
}
