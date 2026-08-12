package io.digiservices.ecreditservice.repository.impl;

import io.digiservices.ecreditservice.dto.PieceJointeDto;
import io.digiservices.ecreditservice.repository.DemandePieceJointeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
@Slf4j
public class DemandePieceJointeRepositoryImpl implements DemandePieceJointeRepository {

    private static final String SELECT_BY_DEMANDE = """
            SELECT * FROM demande_piece_jointe
            WHERE demandeindividuel_id = :demandeId
            ORDER BY created_at
            """;

    private static final String SELECT_BY_ID = """
            SELECT * FROM demande_piece_jointe WHERE piece_jointe_id = :pieceJointeId
            """;

    private static final String INSERT_PIECE = """
            INSERT INTO demande_piece_jointe (demandeindividuel_id, type_piece, nom_fichier, url_fichier, ajoute_par)
            VALUES (:demandeId, :typePiece, :nomFichier, :urlFichier, :ajoutePar)
            RETURNING *
            """;

    private static final String DELETE_PIECE = """
            DELETE FROM demande_piece_jointe WHERE piece_jointe_id = :pieceJointeId
            """;

    private final JdbcClient jdbcClient;

    @Override
    public List<PieceJointeDto> findByDemandeId(Long demandeId) {
        return jdbcClient.sql(SELECT_BY_DEMANDE)
                .param("demandeId", demandeId)
                .query((rs, rowNum) -> mapRow(rs))
                .list();
    }

    @Override
    public Optional<PieceJointeDto> findById(Long pieceJointeId) {
        return jdbcClient.sql(SELECT_BY_ID)
                .param("pieceJointeId", pieceJointeId)
                .query((rs, rowNum) -> mapRow(rs))
                .optional();
    }

    @Override
    public PieceJointeDto insert(PieceJointeDto piece) {
        return jdbcClient.sql(INSERT_PIECE)
                .param("demandeId", piece.getDemandeindividuelId())
                .param("typePiece", piece.getTypePiece())
                .param("nomFichier", piece.getNomFichier())
                .param("urlFichier", piece.getUrlFichier())
                .param("ajoutePar", piece.getAjoutePar())
                .query((rs, rowNum) -> mapRow(rs))
                .single();
    }

    @Override
    public void delete(Long pieceJointeId) {
        jdbcClient.sql(DELETE_PIECE)
                .param("pieceJointeId", pieceJointeId)
                .update();
    }

    private PieceJointeDto mapRow(ResultSet rs) throws SQLException {
        return PieceJointeDto.builder()
                .pieceJointeId(rs.getLong("piece_jointe_id"))
                .demandeindividuelId(rs.getLong("demandeindividuel_id"))
                .typePiece(rs.getString("type_piece"))
                .nomFichier(rs.getString("nom_fichier"))
                .urlFichier(rs.getString("url_fichier"))
                .ajoutePar(rs.getString("ajoute_par"))
                .createdAt(rs.getTimestamp("created_at") != null ? rs.getTimestamp("created_at").toLocalDateTime() : null)
                .build();
    }
}
