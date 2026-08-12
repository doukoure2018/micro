package io.digiservices.ecreditservice.service;

import io.digiservices.ecreditservice.dto.PieceJointeDto;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface DemandePieceJointeService {

    List<PieceJointeDto> getByDemandeId(Long demandeId);

    PieceJointeDto upload(Long demandeId, String typePiece, MultipartFile file, String ajoutePar);

    void delete(Long pieceJointeId);
}
