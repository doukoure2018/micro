package io.digiservices.bcrgservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * Piece d'identite (balise Piece du modele BCRG).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PieceDto {
    private String idInterneClt;   // COD_CLIENTE
    private String typPiece;       // type de piece BCRG (mappe depuis COD_TIPO_ID)
    private String numPiece;       // NUM_ID
    private LocalDate finValPiece; // FEC_VENCIM
}
