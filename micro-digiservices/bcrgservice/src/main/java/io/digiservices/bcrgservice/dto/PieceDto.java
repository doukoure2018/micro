package io.digiservices.bcrgservice.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Pièce d'identité (feuille Piece du classeur PP) : TypPiece transcodé au
 * référentiel BCRG 01..09 ; émission non portée par le SI — v1.6 : date et pays
 * (champs typés) → null, lieu (texte libre) → ND.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PieceDto {
    @JsonProperty("IdInterneClt") private String idInterneClt;
    @JsonProperty("TypPiece")     private String typPiece;     // 01..09
    @JsonProperty("NumPiece")     private String numPiece;
    @JsonProperty("DatEmiPiece")  private String datEmiPiece;  // non porté → null (champ date)
    @JsonProperty("LieuEmiPiece") private String lieuEmiPiece; // non porté → ND (texte libre)
    @JsonProperty("PaysEmiPiece") private String paysEmiPiece; // non porté → null (référentiel pays)
    @JsonProperty("FinValPiece")  private String finValPiece;  // FEC_VENCIM (JJMMAAAA)
}
