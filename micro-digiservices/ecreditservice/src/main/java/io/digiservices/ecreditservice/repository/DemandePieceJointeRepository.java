package io.digiservices.ecreditservice.repository;

import io.digiservices.ecreditservice.dto.PieceJointeDto;

import java.util.List;
import java.util.Optional;

public interface DemandePieceJointeRepository {

    List<PieceJointeDto> findByDemandeId(Long demandeId);

    Optional<PieceJointeDto> findById(Long pieceJointeId);

    PieceJointeDto insert(PieceJointeDto piece);

    void delete(Long pieceJointeId);
}
