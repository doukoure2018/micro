package io.digiservices.bcrgservice.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Pièce d'identité (feuille Piece du classeur PP) : TypPiece transcodé au
 * référentiel BCRG 01..09 ; date/lieu/pays d'émission non portés par le SI → ND.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PieceDto {
    @JsonProperty("IdInterneClt") private String idInterneClt;
    @JsonProperty("TypPiece")     private String typPiece;     // 01..09
    @JsonProperty("NumPiece")     private String numPiece;
    @JsonProperty("DatEmiPiece")  private String datEmiPiece;  // non porté → ND
    @JsonProperty("LieuEmiPiece") private String lieuEmiPiece; // non porté → ND
    @JsonProperty("PaysEmiPiece") private String paysEmiPiece; // non porté → ND
    @JsonProperty("FinValPiece")  private String finValPiece;  // FEC_VENCIM (JJMMAAAA)
}
