package io.digiservices.ecreditservice.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Pièce jointe d'une demande individuelle (V121).
 * Types utilisés par le crédit fonctionnaire : BULLETIN_SALAIRE, ATTESTATION_SERVICE, AUTRE.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class PieceJointeDto {
    private Long pieceJointeId;
    private Long demandeindividuelId;
    private String typePiece;
    private String nomFichier;
    private String urlFichier;
    private String ajoutePar;
    private LocalDateTime createdAt;
}
